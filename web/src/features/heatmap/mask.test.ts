import { readFileSync } from 'node:fs';
import { beforeAll, expect, it } from 'vitest';
import { GRID_PARAMS, gridFracs, initEngine, site_metrics } from '../../engine';
import { earthShare, trackFor } from '../../engine/track';
import type { EphemHeader } from '../../contracts/ephem';
import { cellLatLon, horizonAt, maskAt, parseGrid, siteMaskFor } from './grid';

const data = (p: string) => new URL(`../../../public/data/${p}`, import.meta.url);
const buf = (p: string) => { const b = readFileSync(data(p)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
const table = { header: JSON.parse(readFileSync(data('ephem.json'), 'utf8')) as EphemHeader, rows: new Float32Array(buf('ephem.bin')) };
const grid = parseGrid(JSON.parse(readFileSync(data('grid/connecting-ridge.json'), 'utf8')), buf('grid/connecting-ridge.bin'), 'connecting-ridge');
beforeAll(() => initEngine(readFileSync(new URL('../../engine/pkg/lunar_engine_bg.wasm', import.meta.url))));

it('interpolates the horizon between bin centres and wraps at north', () => {
  expect(horizonAt([0, 4, 8, 2], 45)).toBe(2);
  expect(horizonAt([0, 4, 8, 2], 315)).toBe(1);
  expect(horizonAt([0, 4, 8, 2], -90)).toBe(2);
});

it('decodes the cell mask so site_metrics matches grid_fracs for that cell', () => {
  const i = 62 * 125 + 70;
  const { lat, lon } = cellLatLon(grid.header, i);
  const mask = maskAt(grid, lat + 1e-5, lon)!;
  expect(mask.id).toBe(`connecting-ridge#${i}`);
  expect(mask.mask_deg).toHaveLength(64);
  const start = '2027-01-15T00:00:00.000Z'; const hours = 48;
  const fracs = gridFracs(grid.bytes!, grid.header, table, start, hours, GRID_PARAMS);
  const m = site_metrics(mask, table, start, hours, GRID_PARAMS);
  expect(m.pct_lit / 100).toBeCloseTo(fracs[i * 4], 5);
  expect(m.pct_earth_visible / 100).toBeCloseTo(fracs[i * 4 + 1], 5);
  expect(earthShare(trackFor(mask, table, start, hours, GRID_PARAMS))).toBeCloseTo(fracs[i * 4 + 1], 5);
});

it('returns null outside the grid and keeps demo-* on the old path', () => {
  expect(maskAt(grid, -85, 0)).toBeNull();
  const inside = cellLatLon(grid.header, 100);
  expect(siteMaskFor({ id: 'demo-ridge-a', ...inside }, undefined, { 'connecting-ridge': grid })).toBeNull();
  expect(siteMaskFor({ id: 'custom:x', ...inside }, undefined, { 'connecting-ridge': grid })?.id).toBe('connecting-ridge#100');
});
