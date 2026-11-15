import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { specimenGeometry, specimenScalarGeometry, gridBounds, probeIndex, coveringRegion } from './specimen';
import { parseGrid } from './grid';
import { decodeTile } from '../../scene/tileLoader';
const asset = (path: string) => readFileSync(new URL(`../../../public/data/${path}`, import.meta.url));
const json = (path: string) => JSON.parse(asset(path).toString());
const bytes = (path: string) => Uint8Array.from(asset(path)).buffer;
const tile = decodeTile(json('tiles/connecting-ridge_80m.json'), bytes('tiles/connecting-ridge_80m.bin'));
const grid = parseGrid(json('grid/connecting-ridge.json'), bytes('grid/connecting-ridge.bin'), tile.id);

describe('specimen registration attacks', () => {
  it('does not stretch coarse cell centres onto the fine terrain edges', () => {
    const [left, right, bottom, top] = gridBounds(grid, tile);
    expect(left).toBeGreaterThan(-1); expect(right).toBeLessThan(1);
    expect(bottom).toBeGreaterThan(-1); expect(top).toBeLessThan(1);
    expect(probeIndex(grid, tile, 0, 0)).toBe(0);
    expect(probeIndex(grid, tile, 1, 1)).toBe(grid.header.nx * grid.header.ny - 1);
  });
  it('does not light the underside instead of the measured terrain', () => {
    const geometry = specimenGeometry(tile, 0.3);
    const normals = geometry.getAttribute('normal');
    for (let i = 0; i < normals.count; i++) expect(normals.getY(i)).toBeGreaterThan(0);
    expect(geometry.getAttribute('elevationM').getX(187)).toBe(tile.elevationM[187]);
    geometry.dispose();
  });
  it('uses one aligned coarse mesh for every scalar layer', () => {
    const heights = Array.from(tile.elevationM);
    const lo = Math.min(...heights), hi = Math.max(...heights);
    const geometry = specimenScalarGeometry(grid, tile, 0.3, lo, hi);
    const uv = geometry.getAttribute('uv'), position = geometry.getAttribute('position');
    expect(position.count).toBe(grid.header.nx * grid.header.ny);
    expect(position.count).toBeLessThan(tile.columns * tile.rows);
    expect(uv.getX(0)).toBeCloseTo((grid.header.x0 - tile.x0M) / ((tile.columns - 1) * tile.cellM));
    expect(position.getZ(0)).toBeCloseTo(1 - 2 * uv.getY(0));
    expect(position.getY(0)).toBeGreaterThanOrEqual(0);
    // Scalar layers carry real heights so their 100 m contours match the terrain layers' contours.
    const elevation = geometry.getAttribute('elevationM');
    expect(elevation.count).toBe(position.count);
    for (let i = 0; i < elevation.count; i += 97) {
      expect(elevation.getX(i)).toBeGreaterThanOrEqual(lo - 1e-3); expect(elevation.getX(i)).toBeLessThanOrEqual(hi + 1e-3);
      expect(position.getY(i)).toBeCloseTo((elevation.getX(i) - lo) / (hi - lo) * 0.3, 4);
    }
    geometry.dispose();
  });
  it('finds coverage by coordinate without changing the selected custom point', () => {
    const grids = { 'connecting-ridge': grid };
    expect(coveringRegion(grids, { lat: -89.5, lon: -140 })).toBe('connecting-ridge');
    expect(coveringRegion(grids, { lat: 20, lon: 30 })).toBeUndefined();
  });
});

// Gap tests: a centred-only check misses north/south reversal and out-of-bounds coercion.
it('keeps projected north distinct from south and rejects invalid probes', () => {
  expect(probeIndex(grid, tile, 0, 1)).toBe((grid.header.ny - 1) * grid.header.nx);
  expect(probeIndex(grid, tile, 1, 0)).toBe(grid.header.nx - 1);
  expect(probeIndex(grid, tile, NaN, 0)).toBeNull();
  expect(probeIndex(grid, tile, -0.1, 0)).toBeNull();
});
