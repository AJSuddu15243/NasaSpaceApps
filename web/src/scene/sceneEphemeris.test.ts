import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { coveredSample, decodeSceneEphemeris } from './sceneEphemeris';
import { bodyDirection } from './coordinates';
const header = JSON.parse(readFileSync('public/data/mock/ephem.json', 'utf8'));
const file = readFileSync('public/data/mock/ephem.bin');
const bytes = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
const referenceHeader = JSON.parse(readFileSync('public/data/ephem.json', 'utf8'));
const referenceFile = readFileSync('public/data/ephem.bin');
const referenceBytes = referenceFile.buffer.slice(referenceFile.byteOffset, referenceFile.byteOffset + referenceFile.byteLength) as ArrayBuffer;
test('scene ephemeris refuses dates outside the table instead of clamping', () => {
  const table = decodeSceneEphemeris(header, bytes);
  expect(coveredSample(table, header.t0_iso)).not.toBeNull();
  expect(coveredSample(table, '2027-01-01T00:00:00Z')).toBeNull();
  expect(coveredSample(table, 'invalid')).toBeNull();
});
test('Sun direction moves with changing ephemeris rows in the terrain frame', () => {
  // The shipped demo table is constant; use two explicit fixture rows to test motion.
  const table = { header: { ...header, n: 2 }, rows: new Float32Array([0, 0, 150000000, 0, 0, 384400, 0, 90, 150000000, 0, 0, 384400]) };
  const a = coveredSample(table, header.t0_iso)!;
  const b = coveredSample(table, new Date(Date.parse(header.t0_iso) + 3600000).toISOString())!;
  const first = bodyDirection(a.sunLat, a.sunLon), next = bodyDirection(b.sunLat, b.sunLon);
  expect(Math.hypot(...first)).toBeCloseTo(1, 10);
  expect(first).not.toEqual(next);
  expect(bodyDirection(0, 90)[0]).toBeCloseTo(1, 10);
});
test('ephemeris rejects truncated bytes and nonfinite values', () => {
  expect(() => decodeSceneEphemeris(header, bytes.slice(0, 8))).toThrow();
  const bad = bytes.slice(0); new DataView(bad).setFloat32(0, NaN, true);
  expect(() => decodeSceneEphemeris(header, bad)).toThrow();
});
test('packaged Horizons reference covers 2026–2030 and changes the Sun direction', () => {
  const table = decodeSceneEphemeris(referenceHeader, referenceBytes);
  expect(table.header.n).toBe(43824);
  const first = coveredSample(table, '2026-11-14T12:00:00.000Z')!;
  const later = coveredSample(table, '2026-11-28T12:00:00.000Z')!;
  expect(first).not.toBeNull();
  expect(later).not.toBeNull();
  expect(bodyDirection(first.sunLat, first.sunLon)).not.toEqual(bodyDirection(later.sunLat, later.sunLon));
  expect(coveredSample(table, '2031-01-01T00:00:00.000Z')).toBeNull();
});
