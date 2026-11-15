// ENG-8/9 parity: the facade on the real WASM build (node initSync) over the golden inputs of engine/tests/golden.rs.
// The WASM hashes are the cross-machine determinism reference (DECISIONS: goldens come from the WASM build).
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { initEngine, outputHash, site_metrics, siteExtras, siteTrack, UnavailableScenario, MOCK_PARAMS } from './index';
import * as wasm from './pkg/lunar_engine.js';
import type { Params } from '../contracts/engine-api';
import type { SiteMask } from '../contracts/site-mask';
import type { EphemHeader } from '../contracts/ephem';

const data = (p: string) => new URL(`../../public/data/${p}`, import.meta.url);
const header = JSON.parse(readFileSync(data('ephem.json'), 'utf8')) as EphemHeader;
const bin = readFileSync(data('ephem.bin'));
// Real Horizons table (43,824 rows) built directly: shell parseEphem still caps n at 8761 (INT-1 follow-up).
const table = { header, rows: new Float32Array(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)) };
const mask = (id: string) => JSON.parse(readFileSync(data(`masks/${id}.json`), 'utf8')) as SiteMask;
const PARAMS: Params = { battery_h: 48, survival_temp_k: 233, antenna_margin_deg: 2, slope_limit_deg: 10, step_hours: 1 };
const T_START = '2026-01-02T12:00:00Z'; // golden.rs T_START_H = 36 h after t0
const HOURS = 336;
// WASM goldens (re-baseline: paste the logged hash and say why in the PR). Checked 2026-11-14 against a native
// aarch64-apple-darwin build: the f32 tracks hash is identical; the f64 metrics differ in the last ulp of a few
// trig-derived means (platform libm), which is why the determinism reference is the WASM build, not native.
const GOLDEN_METRICS = '518a3b5112c41e1f';
const GOLDEN_TRACKS = 'd9a03fb45a7268e5';

beforeAll(() => initEngine(readFileSync(new URL('./pkg/lunar_engine_bg.wasm', import.meta.url))));

describe('engine facade on WASM', () => {
  it('reproduces the golden hashes for haworth + connecting-ridge', () => {
    const sites = ['haworth', 'connecting-ridge'].map(mask);
    const metrics = sites.map((m) => site_metrics(m, table, T_START, HOURS, PARAMS));
    const tracks = sites.map((m) => siteTrack(m, table, T_START, HOURS, PARAMS));
    expect(tracks.map((t) => t.length)).toEqual([HOURS * 6, HOURS * 6]);
    const all = new Float32Array(tracks[0].length * 2);
    all.set(tracks[0]);
    all.set(tracks[1], tracks[0].length);
    const hashes = { metrics: wasm.metrics_hash(metrics), tracks: outputHash(all) };
    console.info('wasm golden hashes', hashes, metrics.map((m) => m.pct_lit));
    expect(hashes).toEqual({ metrics: GOLDEN_METRICS, tracks: GOLDEN_TRACKS });
    expect(outputHash(all)).toBe(hashes.tracks); // rerun is identical
  });

  it('converts ISO start to hours since ephem t0', () => {
    const m = mask('haworth');
    const geom = { lat_deg: m.lat, lon_deg: m.lon, elev_m: m.elev_m, slope_deg: m.slope_deg, aspect_deg: m.aspect_deg };
    const at = (iso: string, h: number) =>
      expect(siteTrack(m, table, iso, 24, PARAMS)).toEqual(wasm.site_track(geom, Float32Array.from(m.mask_deg), table.rows, h, 24, PARAMS));
    at(header.t0_iso, 0);
    at('2026-01-15T00:00:00Z', 336);
    const extras = siteExtras(m, table, T_START, HOURS, PARAMS);
    expect(typeof extras.survives_night).toBe('boolean');
  });

  it('reports out-of-range windows as UnavailableScenario', () => {
    expect(() => site_metrics(mask('haworth'), table, '2031-01-01T00:00:00Z', HOURS, PARAMS)).toThrow(UnavailableScenario);
    expect(() => site_metrics(mask('haworth'), table, 'not a date', HOURS, PARAMS)).toThrow(UnavailableScenario);
  });

  it('keeps demo-* sites on the mock fixtures', () => {
    const demo = { ...mask('haworth'), id: 'demo-ridge-a' };
    expect(() => site_metrics(demo, table, T_START, HOURS, MOCK_PARAMS)).toThrow('No computed results');
  });

  it('logs the time for 5 site_metrics calls', () => {
    const sites = ['haworth', 'connecting-ridge', 'malapert-massif', 'haworth', 'connecting-ridge'].map(mask);
    const t0 = performance.now();
    for (const m of sites) site_metrics(m, table, T_START, HOURS, PARAMS);
    console.info(`5 x site_metrics (336 h, 1 h step): ${(performance.now() - t0).toFixed(1)} ms`);
  });
});
