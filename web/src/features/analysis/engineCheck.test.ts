import { readFileSync } from 'node:fs';
import { beforeAll, expect, it } from 'vitest';
import { initEngine } from '../../engine';
import type { EphemHeader } from '../../contracts/ephem';
import { parseReference } from './data';
import { engineVsHorizons } from './engineCheck';

const data = (p: string) => new URL(`../../../public/data/${p}`, import.meta.url);
const bin = readFileSync(data('ephem.bin'));
const table = { header: JSON.parse(readFileSync(data('ephem.json'), 'utf8')) as EphemHeader, rows: new Float32Array(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)) };
const PARAMS = { battery_h: 48, survival_temp_k: 233, antenna_margin_deg: 2, slope_limit_deg: 10, step_hours: 1 };
beforeAll(() => initEngine(readFileSync(new URL('../../engine/pkg/lunar_engine_bg.wasm', import.meta.url))));

it('engine site_track matches the JPL Horizons reference within 0.01°', () => {
  const ref = parseReference(JSON.parse(readFileSync(data('validation/connecting-ridge.json'), 'utf8')), 'connecting-ridge');
  const r = engineVsHorizons(ref, table, PARAMS)!;
  expect(r.n).toBe(ref.samples.length / 12);
  expect(r.worst).toBeLessThan(0.01);
  expect(engineVsHorizons(ref, { ...table, header: { ...table.header, t0_iso: '2029-12-01T00:00:00Z' } }, PARAMS)).toBeNull();
});
