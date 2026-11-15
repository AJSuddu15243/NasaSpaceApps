// Baked engine heatmap (plan steps 8-10): staleness guard, quantisation, and the engine → PreviewArea adapter.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { GRID_PARAMS, initEngine, outputHash, scoresFromFracs } from '../../engine';
import * as wasm from '../../engine/pkg/lunar_engine.js';
import { engineResult } from '../mission/useMissionData';
import { bakedFile, decodeFracs, encodeFracs, loadBakedFracs, type BakedIndex } from './baked';
import { parseGrid } from './grid';
import { gridFactors } from './score';

const file = (p: string) => readFileSync(new URL(`../../../public/data/${p}`, import.meta.url));
const wasmBytes = readFileSync(new URL('../../engine/pkg/lunar_engine_bg.wasm', import.meta.url));
const index = JSON.parse(file('baked/index.json').toString('utf8')) as BakedIndex;
const START = '2027-01-15T00:00:00.000Z';
const bin = file('grid/haworth.bin');
const grid = parseGrid(JSON.parse(file('grid/haworth.json').toString('utf8')), bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength), 'haworth');
const n = grid.header.nx * grid.header.ny;
const stored = new Uint8Array(file(`baked/${bakedFile('haworth', START)}`));

beforeAll(() => initEngine(wasmBytes));

describe('baked engine heatmap', () => {
  it('was baked with the shipped wasm (re-run `pnpm bake` after a wasm rebuild)', () => {
    expect(index.wasm_sha256).toBe(createHash('sha256').update(wasmBytes).digest('hex'));
  });

  it('matches live grid_fracs within the stored precision, and its hash', () => {
    expect(outputHash(stored)).toBe(index.files[bakedFile('haworth', START)]);
    let t = performance.now();
    const baked = decodeFracs(stored, n);
    const decodeMs = performance.now() - t;
    t = performance.now();
    const ephem = file('ephem.bin');
    const rows = new Float32Array(ephem.buffer.slice(ephem.byteOffset, ephem.byteOffset + ephem.byteLength));
    const live = wasm.grid_fracs(grid.bytes!, grid.header, rows, (Date.parse(START) - Date.parse('2026-01-01T00:00:00Z')) / 3.6e6, index.hours, GRID_PARAMS);
    console.info(`haworth 336 h: decode baked ${decodeMs.toFixed(1)} ms, live grid_fracs ${(performance.now() - t).toFixed(0)} ms`);
    expect(index.params).toEqual({ battery_h: GRID_PARAMS.battery_h, survival_temp_k: GRID_PARAMS.survival_temp_k, antenna_margin_deg: GRID_PARAMS.antenna_margin_deg, step_hours: GRID_PARAMS.step_hours });
    for (let i = 0; i < live.length; i++) {
      if (Number.isNaN(live[i])) expect(baked[i]).toBeNaN();
      else expect(Math.abs(baked[i] - live[i])).toBeLessThanOrEqual(i % 4 === 3 ? 0 : 0.5 / 254 + 1e-6);
    }
  });

  it('round-trips the NaN sentinels and the 0/1 ends', () => {
    const fracs = Float32Array.from([0, 1, NaN, 12, NaN, 0.5, 1, NaN]);
    const back = decodeFracs(encodeFracs(fracs), 2);
    expect(Array.from(back)).toEqual([0, 1, NaN, 12, NaN, 127 / 254, 1, NaN]);
    expect(() => encodeFracs(Float32Array.from([1.5, 0, 0, 0]))).toThrow();
  });

  it('loads only baked windows with matching params', async () => {
    const request = (async (url: string) => {
      const path = url.replace('/data/', '');
      try { return new Response(file(path)); } catch { return new Response(null, { status: 404 }); }
    }) as typeof fetch;
    expect(await loadBakedFracs('haworth', START, 336, n, index.params, request)).toEqual(decodeFracs(stored, n));
    expect(await loadBakedFracs('haworth', '2027-01-15T12:00:00Z', 336, n, index.params, request)).toBeNull();
    expect(await loadBakedFracs('haworth', START, 24, n, index.params, request)).toBeNull();
    expect(await loadBakedFracs('haworth', START, 336, n, { ...index.params, survival_temp_k: 200 }, request)).toBeNull();
  });

  it('maps engine areas to the PreviewArea shape', () => {
    const weights = { sun: 35, earth: 25, slope: 20, crater: 10, rock: 0, thermal: 10 };
    const fracs = decodeFracs(stored, n);
    const r = engineResult(grid, gridFactors(grid), fracs, weights, 10, 'baked');
    expect(r.source).toBe('baked');
    expect(r.scores).toEqual(scoresFromFracs(grid.bytes!, grid.header, fracs, weights, { ...GRID_PARAMS, slope_limit_deg: 10 }));
    expect(r.factors.sun_frac[0]).toBe(fracs[0]);
    expect(r.areas.length).toBeGreaterThan(0);
    for (const a of r.areas) {
      expect(a.index).toBe(a.row * grid.header.nx + a.col);
      expect(a.x_m).toBeCloseTo(grid.header.x0 + a.col * grid.header.cell_m, 3);
      expect(Number.isFinite(r.scores[a.index])).toBe(true);
      for (const v of Object.values(a.factors)) expect(typeof v).toBe('number');
      expect(a.factors.ice).toBeGreaterThanOrEqual(0);
    }
  });
});
