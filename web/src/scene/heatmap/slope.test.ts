import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { decodeSlope, slopeAt, slopeTexture, slopeUv } from './slope';
import { decodeTile } from '../tileLoader';
function binary(path: string) { const b = readFileSync(path); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer; }
const base = 'public/data/';
const region = 'malapert-massif';
const header = JSON.parse(readFileSync(`${base}grid/${region}.json`, 'utf8'));
const bytes = binary(`${base}grid/${region}.bin`);
test('real slope data decodes by layer offsets and round trips through GPU packing', () => {
  const grid = decodeSlope(header, bytes, region);
  expect(grid.values.length).toBe(125 * 125);
  const texture = slopeTexture(grid);
  const packed = texture.image.data!;
  for (const i of [0, 124, 125, 15624]) {
    expect((packed[i * 4] * 256 + packed[i * 4 + 1]) / 65535 * 90).toBeCloseTo(grid.values[i], 2);
  }
  expect(slopeAt(grid, header.x0, header.y0)).toBe(grid.values[0]);
  expect(slopeAt(grid, header.x0 - 160, header.y0)).toBeNull();
  texture.dispose();
});
test('slope texture aligns with the real tile pixel centres', () => {
  const grid = decodeSlope(header, bytes, region);
  const tile = decodeTile(JSON.parse(readFileSync(`${base}tiles/${region}_80m.json`, 'utf8')), binary(`${base}tiles/${region}_80m.bin`));
  const uv = slopeUv(tile, grid);
  expect(uv[0]).toBeCloseTo(0.002, 6);
  expect(uv[1]).toBeCloseTo(0.002, 6);
  expect(uv[2]).toBeCloseTo(0.996, 6);
});
test('rejects mismatched region, units, truncated data, and NaN', () => {
  expect(() => decodeSlope(header, bytes, 'wrong-region')).toThrow();
  expect(() => decodeSlope(header, bytes.slice(0, 3), region)).toThrow();
  const bad = bytes.slice(0); new DataView(bad).setFloat32(0, NaN, true);
  expect(() => decodeSlope(header, bad, region)).toThrow();
  const units = structuredClone(header); units.layer_info.slope_deg.units = 'm';
  expect(() => decodeSlope(units, bytes, region)).toThrow();
});
