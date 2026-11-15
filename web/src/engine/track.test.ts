import { readFileSync } from 'node:fs';
import { beforeAll, expect, it } from 'vitest';
import { initEngine, site_metrics } from './index';
import { earthShare, litShare, splitTrack, trackFor } from './track';
import type { EphemHeader } from '../contracts/ephem';
import type { SiteMask } from '../contracts/site-mask';

const data = (p: string) => new URL(`../../public/data/${p}`, import.meta.url);
const bin = readFileSync(data('ephem.bin'));
const table = { header: JSON.parse(readFileSync(data('ephem.json'), 'utf8')) as EphemHeader, rows: new Float32Array(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)) };
const PARAMS = { battery_h: 48, survival_temp_k: 233, antenna_margin_deg: 2, slope_limit_deg: 10, step_hours: 1 };
beforeAll(() => initEngine(readFileSync(new URL('./pkg/lunar_engine_bg.wasm', import.meta.url))));

it('splits the 6-column track', () => {
  const t = splitTrack(Float32Array.from([1, 2, 0.5, 4, 5, 1, 7, 8, 0, 10, 11, 0]));
  expect(t.hours).toBe(2); expect([...t.sunEl]).toEqual([2, 8]); expect([...t.earthVis]).toEqual([1, 0]);
  expect(litShare(t)).toBe(0.5); expect(earthShare(t)).toBe(0.5);
});

it('track shares agree with site_metrics for the demo window, and repeat calls hit the cache', () => {
  const mask = JSON.parse(readFileSync(data('masks/connecting-ridge.json'), 'utf8')) as SiteMask;
  const start = '2027-01-15T00:00:00.000Z';
  const t = trackFor(mask, table, start, 336, PARAMS);
  const m = site_metrics(mask, table, start, 336, PARAMS);
  expect(earthShare(t) * 100).toBeCloseTo(m.pct_earth_visible, 6);
  expect(Math.abs(litShare(t) * 100 - m.pct_lit)).toBeLessThan(2); // pct_lit weights partial disks; litShare counts any limb
  expect(trackFor(mask, table, start, 336, PARAMS)).toBe(t);
});
