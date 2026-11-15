// ENG-8/9 parity: the facade on the real WASM build (node initSync) over the golden inputs of engine/tests/golden.rs.
// The WASM hashes are the cross-machine determinism reference (DECISIONS: goldens come from the WASM build).
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  initEngine, outputHash, site_metrics, siteExtras, siteTrack, UnavailableScenario, MOCK_PARAMS,
  GRID_PARAMS, FRACS_PER_CELL, gridFracs, scoresFromFracs, gridScores, psrFlags, windowCells, topAreas, nearbyBetter, windowFactors,
} from './index';
import * as wasm from './pkg/lunar_engine.js';
import type { Params } from '../contracts/engine-api';
import type { SiteMask } from '../contracts/site-mask';
import type { EphemHeader } from '../contracts/ephem';
import type { GridHeader } from '../contracts/grid';

const data = (p: string) => new URL(`../../public/data/${p}`, import.meta.url);
const header = JSON.parse(readFileSync(data('ephem.json'), 'utf8')) as EphemHeader;
const bin = readFileSync(data('ephem.bin'));
// Real Horizons table (43,824 rows) built directly: shell parseEphem still caps n at 8761 (INT-1 follow-up).
const table = { header, rows: new Float32Array(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)) };
const mask = (id: string) => JSON.parse(readFileSync(data(`masks/${id}.json`), 'utf8')) as SiteMask;
const PARAMS: Params = { battery_h: 48, survival_temp_k: 233, antenna_margin_deg: 2, slope_limit_deg: 10, step_hours: 1 };
const T_START = '2026-01-02T12:00:00Z'; // golden.rs T_START_H = 36 h after t0
const HOURS = 336;
// WASM goldens (re-baseline: paste the logged hash and say why in the PR). serde_json parses with float_roundtrip,
// so metrics_hash sees the exact f64s site_metrics returned. Native builds can still differ from WASM in the last
// ulp of trig-derived means (std trig per platform), which is why the determinism reference is the WASM build.
// 518a3b5112c41e1f -> a9b0d0b052c007c6: float_roundtrip parse (the old hash saw values 1 ulp off).
const GOLDEN_METRICS = 'a9b0d0b052c007c6';
const GOLDEN_TRACKS = 'd9a03fb45a7268e5';
// haworth scores at T_START over 24 h with GRID_PARAMS (outputHash is canonical for NaN = excluded cells).
const GOLDEN_GRID_SCORES = 'c79b76023adf2c25';
const GOLDEN_HAWORTH_PSR = 33; // 34 before the PSR threshold used the table's max |sun_lat| 1.588 deg
const GOLDEN_HAWORTH_EXTRAS = { pct_sun_and_earth: 4.166666666666667, survives_night: false, sun_el_at_start_deg: 3.900215572312648, earth_visible_at_start: true };

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
    // WASM values over the golden window (longest dark > 48 h battery, so survives_night is false).
    expect(siteExtras(m, table, T_START, HOURS, PARAMS)).toEqual(GOLDEN_HAWORTH_EXTRAS);
  });

  it('reports out-of-range windows as UnavailableScenario', () => {
    expect(() => site_metrics(mask('haworth'), table, '2031-01-01T00:00:00Z', HOURS, PARAMS)).toThrow(UnavailableScenario);
    expect(() => site_metrics(mask('haworth'), table, 'not a date', HOURS, PARAMS)).toThrow(UnavailableScenario);
  });

  it('keeps demo-* sites on the mock fixtures', () => {
    const demo = { ...mask('haworth'), id: 'demo-ridge-a' };
    expect(() => site_metrics(demo, table, T_START, HOURS, MOCK_PARAMS)).toThrow('No computed results');
  });

  it('runs 5 site_metrics calls inside the slider budget', () => {
    const sites = ['haworth', 'connecting-ridge', 'malapert-massif', 'haworth', 'connecting-ridge'].map(mask);
    const t0 = performance.now();
    for (const m of sites) site_metrics(m, table, T_START, HOURS, PARAMS);
    const ms = performance.now() - t0;
    console.info(`5 x site_metrics (336 h, 1 h step): ${ms.toFixed(1)} ms`);
    expect(ms).toBeLessThan(100); // measured ~1.4 ms; 100 ms leaves room for slow CI runners
  });

  it('scores the real haworth grid through the grid wrappers', () => {
    const gh = JSON.parse(readFileSync(data('grid/haworth.json'), 'utf8')) as GridHeader;
    const grid = new Uint8Array(readFileSync(data('grid/haworth.bin')));
    const W = { sun: 0.35, earth: 0.25, slope: 0.2, crater: 0.1, rock: 0, thermal: 0.1 };
    const cells = gh.nx * gh.ny;
    const fracs = gridFracs(grid, gh, table, T_START, 24, GRID_PARAMS);
    const scores = scoresFromFracs(grid, gh, fracs, W, GRID_PARAMS);
    expect([fracs.length, scores.length]).toEqual([cells * FRACS_PER_CELL, cells]);
    expect(gridScores(grid, gh, table, T_START, 24, W, GRID_PARAMS)).toEqual(scores);
    const k = windowCells(400, gh.cell_m);
    expect(k).toBe(3);
    const areas = topAreas(scores, gh, k, 2000, 3);
    expect(areas.length).toBeGreaterThan(0);
    for (const a of areas) expect(a.lon >= -180 && a.lon < 180).toBe(true);
    const near = nearbyBetter(grid, gh, fracs, W, GRID_PARAMS, k, areas[0].x_m + 500, areas[0].y_m, 3000);
    expect(near).not.toBeNull();
    expect(typeof near!.site_valid).toBe('boolean');
    // The corner window leaves the grid: every factor comes back as JSON null, not NaN.
    expect(windowFactors(grid, gh, fracs, GRID_PARAMS, k, gh.x0, gh.y0)).toEqual(
      { sun: null, earth: null, slope: null, crater: null, rock: null, thermal: null });
    const psr = psrFlags(grid, gh);
    expect(psr.length).toBe(cells);
    const hashes = { scores: outputHash(scores), psr: psr.reduce((n, x) => n + x, 0) };
    console.info('wasm grid golden', hashes);
    expect(hashes).toEqual({ scores: GOLDEN_GRID_SCORES, psr: GOLDEN_HAWORTH_PSR });
  });
});
