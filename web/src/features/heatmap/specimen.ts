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

/** A shared 160 m surface for the scalar layers, sampled from the 80 m relief at each science-cell centre. */
export function specimenScalarGeometry(grid: Grid, tile: SouthPoleTile, relief: number, lo: number, hi: number): BufferGeometry {
  const { nx, ny, x0, y0, cell_m } = grid.header;
  const pos = new Float32Array(nx * ny * 3), uv = new Float32Array(nx * ny * 2), elev = new Float32Array(nx * ny);
  const width = (tile.columns - 1) * tile.cellM, height = (tile.rows - 1) * tile.cellM;
  for (let row = 0; row < ny; row++) for (let col = 0; col < nx; col++) {
    const i = row * nx + col;
    const fx = (x0 + col * cell_m - tile.x0M) / tile.cellM;
    const fy = (y0 + row * cell_m - tile.y0M) / tile.cellM;
    const x = Math.max(0, Math.min(tile.columns - 1, fx));
    const y = Math.max(0, Math.min(tile.rows - 1, fy));
    const c = Math.min(tile.columns - 2, Math.floor(x)), r = Math.min(tile.rows - 2, Math.floor(y));
    const tx = x - c, ty = y - r, a = r * tile.columns + c;
    const low = tile.elevationM[a] * (1 - tx) + tile.elevationM[a + 1] * tx;
    const high = tile.elevationM[a + tile.columns] * (1 - tx) + tile.elevationM[a + tile.columns + 1] * tx;
    const elevation = low * (1 - ty) + high * ty;
    elev[i] = elevation;
    pos.set([(x0 + col * cell_m - tile.x0M) / width * 2 - 1, (elevation - lo) / Math.max(1, hi - lo) * relief, -((y0 + row * cell_m - tile.y0M) / height * 2 - 1)], i * 3);
    uv.set([(x0 + col * cell_m - tile.x0M) / width, (y0 + row * cell_m - tile.y0M) / height], i * 2);
  }
  const indices = new Uint32Array((nx - 1) * (ny - 1) * 6);
  let k = 0;
  for (let r = 0; r < ny - 1; r++) for (let c = 0; c < nx - 1; c++) {
    const a = r * nx + c, b = a + nx;
    indices.set([a, a + 1, b, a + 1, b + 1, b], k); k += 6;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(pos, 3));
  geometry.setAttribute('uv', new BufferAttribute(uv, 2));
  geometry.setAttribute('elevationM', new BufferAttribute(elev, 1)); // drives the 100 m contours
  geometry.setIndex(new BufferAttribute(indices, 1));
  return geometry;
}
