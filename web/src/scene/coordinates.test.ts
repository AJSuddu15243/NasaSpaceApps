import { expect, test } from 'vitest';
import { bodyDirection, geographicPoint, projectedPoint, tileFrame } from './coordinates';
import { createLocalTerrain } from './localTerrain';
import { createMockSouthPoleTile } from './mockTerrain';

test('polar grid orientation and round trip match the pipeline convention', () => {
  const p = projectedPoint(-89, 90)!;
  expect(p.x).toBeGreaterThan(30000);
  expect(p.y).toBeCloseTo(0, 6);
  expect(geographicPoint(p.x, p.y).lat).toBeCloseTo(-89, 8);
  expect(geographicPoint(p.x, p.y).lon).toBeCloseTo(90, 8);
  expect(bodyDirection(0, 0)).toEqual([0, 0, 1]);
  expect(bodyDirection(-90, 0)[1]).toBe(-1);
});

test('local terrain retains elevations and outward normals', () => {
  const tile = createMockSouthPoleTile();
  const geometry = createLocalTerrain(tile);
  expect(geometry.getAttribute('elevationM').count).toBe(tile.elevationM.length);
  const normal = geometry.getAttribute('normal');
  const up = tileFrame(tile).normal;
  expect(normal.getX(0) * up.x + normal.getY(0) * up.y + normal.getZ(0) * up.z).toBeGreaterThan(0);
  geometry.dispose();
});

test('vertical exaggeration changes display geometry while retaining source heights', () => {
  const tile = createMockSouthPoleTile();
  const a = createLocalTerrain(tile, 1), b = createLocalTerrain(tile, 2);
  expect(a.getAttribute('elevationM').array).toEqual(b.getAttribute('elevationM').array);
  expect(a.getAttribute('position').array).not.toEqual(b.getAttribute('position').array);
  expect(() => createLocalTerrain(tile, 8)).toThrow();
  a.dispose(); b.dispose();
});
