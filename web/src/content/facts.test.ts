import { readFileSync } from 'node:fs';
import { beforeAll, expect, it } from 'vitest';
import { gridFracs, GRID_PARAMS, initEngine, site_metrics } from '../engine/index';
import { parseGrid } from '../features/heatmap/grid';
import type { EphemHeader } from '../contracts/ephem';
import type { SiteMask } from '../contracts/site-mask';
import { DARK_RANGE, FACTS, SUN_PEAK_RANGE } from './facts';
import { earthMoonComparison, explainers } from './explainers';
import glossary from './glossary.json';

const data = (p: string) => new URL(`../../public/data/${p}`, import.meta.url);
const buf = (p: string) => { const b = readFileSync(data(p)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
const table = { header: JSON.parse(readFileSync(data('ephem.json'), 'utf8')) as EphemHeader, rows: new Float32Array(buf('ephem.bin')) };
const PARAMS = { battery_h: 48, survival_temp_k: 233, antenna_margin_deg: 2, slope_limit_deg: 10, step_hours: 1 };
beforeAll(() => initEngine(readFileSync(new URL('../engine/pkg/lunar_engine_bg.wasm', import.meta.url))));

it('ephemeris extremes match the shipped Horizons table', () => {
  const max = (col: number) => { let m = 0; for (let i = col; i < table.rows.length; i += 6) m = Math.max(m, Math.abs(table.rows[i])); return Number(m.toFixed(2)); };
  expect(table.header.t0_iso.slice(0, 4)).toBe('2026');
  expect(max(0)).toBe(FACTS.subSolarLatDeg);
  expect(max(3)).toBe(FACTS.earthLatDeg);
  expect(max(4)).toBe(FACTS.earthLonDeg);
});

it('per-site peak Sun and longest dark match the engine over the whole table', () => {
  for (const [id, fact] of Object.entries(FACTS.sites)) {
    const mask = JSON.parse(readFileSync(data(`masks/${id}.json`), 'utf8')) as SiteMask;
    const m = site_metrics(mask, table, table.header.t0_iso, table.header.n, PARAMS);
    expect(Number(m.max_sun_el_deg.toFixed(2)), id).toBe(fact.maxSunElDeg);
    expect(m.longest_dark_h, id).toBe(fact.longestDarkH);
  }
});

it('two Connecting ridge cells ~1 km apart go from always lit to never lit in the default window', () => {
  const g = parseGrid(JSON.parse(readFileSync(data('grid/connecting-ridge.json'), 'utf8')), buf('grid/connecting-ridge.bin'), 'connecting-ridge');
  const f = gridFracs(g.bytes!, g.header, table, '2027-01-15T00:00:00.000Z', 336, GRID_PARAMS);
  const step = FACTS.nearbyContrast.metres / g.header.cell_m;
  const { nx, ny } = g.header; let best = 0;
  for (let r = 0; r < ny; r++) for (let c = 0; c + step < nx; c++) {
    const d = Math.abs(f[(r * nx + c) * 4] - f[(r * nx + c + step) * 4]);
    if (Number.isFinite(d)) best = Math.max(best, d);
  }
  expect(Math.round(best * 100)).toBe(FACTS.nearbyContrast.sunPoints);
});

it('the copy quotes the pinned numbers', () => {
  const copy = JSON.stringify([explainers, earthMoonComparison]);
  for (const s of [SUN_PEAK_RANGE, DARK_RANGE, `${FACTS.subSolarLatDeg}°`, `${FACTS.earthLatDeg}°`, `${FACTS.earthLonDeg}°`, `${FACTS.nearbyContrast.metres} m`]) expect(copy).toContain(s);
  const terms = Object.fromEntries(glossary.terms.map(t => [t.id, t.long]));
  expect(terms['sub-solar']).toContain(`±${FACTS.subSolarLatDeg}°`);
  expect(terms['sub-earth']).toContain(`±${FACTS.earthLatDeg}° latitude and ±${FACTS.earthLonDeg}° longitude`);
  expect(terms['solar-elevation']).toContain(SUN_PEAK_RANGE);
});
