import { BufferAttribute, BufferGeometry } from 'three';
import type { Grid, GridRegion } from './grid';
import type { SouthPoleTile } from '../../scene/types';
import { projectedPoint } from '../../scene/coordinates';

/** All display coordinates share the fine tile's measured extent; coarse centres stay inset. */
export function gridBounds(grid: Grid, tile: SouthPoleTile): [number, number, number, number] {
  const h = grid.header;
  const sx = (tile.columns - 1) * tile.cellM, sy = (tile.rows - 1) * tile.cellM;
  return [(h.x0 - tile.x0M) / sx * 2 - 1, (h.x0 + (h.nx - 1) * h.cell_m - tile.x0M) / sx * 2 - 1,
    (h.y0 - tile.y0M) / sy * 2 - 1, (h.y0 + (h.ny - 1) * h.cell_m - tile.y0M) / sy * 2 - 1];
}
export function probeIndex(grid: Grid, tile: SouthPoleTile, u: number, v: number): number | null {
  if (![u, v].every(Number.isFinite) || u < 0 || v < 0 || u > 1 || v > 1) return null;
  const h = grid.header;
  const col = Math.floor((tile.x0M + u * (tile.columns - 1) * tile.cellM - h.x0 + h.cell_m / 2) / h.cell_m);
  const row = Math.floor((tile.y0M + v * (tile.rows - 1) * tile.cellM - h.y0 + h.cell_m / 2) / h.cell_m);
  return col >= 0 && col < h.nx && row >= 0 && row < h.ny ? row * h.nx + col : null;
}
export function coveringRegion(grids: Partial<Record<GridRegion, Grid>>, point?: { lat: number; lon: number }): GridRegion | undefined {
  const p = point && projectedPoint(point.lat, point.lon);
  if (!p) return;
  return (Object.keys(grids) as GridRegion[]).find(id => {
    const h = grids[id]!.header;
    return p.x >= h.x0 - h.cell_m / 2 && p.x <= h.x0 + (h.nx - 0.5) * h.cell_m
      && p.y >= h.y0 - h.cell_m / 2 && p.y <= h.y0 + (h.ny - 0.5) * h.cell_m;
  });
}
export function specimenGeometry(tile: SouthPoleTile, relief: number): BufferGeometry {
  const { columns: nx, rows: ny } = tile;
  let lo = Infinity, hi = -Infinity;
  for (const h of Array.from(tile.elevationM)) { lo = Math.min(lo, h); hi = Math.max(hi, h); }
  const pos = new Float32Array(nx * ny * 3), uv = new Float32Array(nx * ny * 2);
  for (let i = 0; i < nx * ny; i++) {
    const u = i % nx / (nx - 1), v = Math.floor(i / nx) / (ny - 1);
    pos.set([(u - 0.5) * 2, (tile.elevationM[i] - lo) / Math.max(1, hi - lo) * relief, -(v - 0.5) * 2], i * 3);
    uv.set([u, v], i * 2);
  }
  const indices = new Uint32Array((nx - 1) * (ny - 1) * 6);
  let k = 0;
  for (let r = 0; r < ny - 1; r++) for (let c = 0; c < nx - 1; c++) {
    const a = r * nx + c, b = a + nx;
    indices.set([a, a + 1, b, a + 1, b + 1, b], k); k += 6;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setAttribute('uv', new BufferAttribute(uv, 2));
  g.setAttribute('elevationM', new BufferAttribute(Float32Array.from(tile.elevationM), 1));
  g.setIndex(new BufferAttribute(indices, 1)); g.computeVertexNormals();
  return g;
}
