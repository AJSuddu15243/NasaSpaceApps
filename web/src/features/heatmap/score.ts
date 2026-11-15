/**
 * Weighted suitability PREVIEW, mirroring engine/src/score.rs (ENG-6) and the greedy top-N design in
 * .agent/GREEDY.md (steps 3–4: k×k window, all cells valid, 2 km exclusion, index tie-break).
 * shortcut: browser-side copy of the engine formula on long-term average layers (sun_avg, earth_avg);
 * replace with the Rust/WASM grid_scores + top_areas once ENG-7/ENG-9 land. Any change here must match score.rs.
 *
 * One addition not yet in the engine: an optional "ice access" factor (distance to the nearest permanently
 * shadowed cell), labelled as a UI preview factor. With its weight at 0 the result equals score.rs exactly.
 */
import type { Grid } from './grid';
import { cellLatLon } from './grid';

export const DEPTH_REF_M = 50;
export const ROCK_REF = 1;
export const ICE_REF_KM = 5;
export const BASE_M = 400;
export const EXCLUSION_M = 2000;

export interface PreviewWeights { sun: number; earth: number; slope: number; crater: number; rock: number; thermal: number; ice: number }
export interface FactorLayers { sun_frac: ArrayLike<number>; earth_frac: ArrayLike<number>; slope_deg: ArrayLike<number>; crater_depth_m: ArrayLike<number>; rock: ArrayLike<number>; cold_frac: ArrayLike<number>; ice_km?: ArrayLike<number> }
export type FactorKey = 'sun' | 'earth' | 'slope' | 'crater' | 'rock' | 'thermal' | 'ice';
const ORDER: FactorKey[] = ['sun', 'earth', 'slope', 'crater', 'rock', 'thermal', 'ice'];
const unit = (x: number) => Math.min(1, Math.max(0, x));

/** Normalised factors of one cell in score.rs order (+ ice); NaN = no data. */
export function factorsAt(l: FactorLayers, c: number, slopeLimit: number): Record<FactorKey, number> {
  const slope = l.slope_deg[c];
  return {
    sun: unit(l.sun_frac[c]), earth: unit(l.earth_frac[c]), slope: unit(1 - slope / slopeLimit),
    crater: 1 - unit(l.crater_depth_m[c] / DEPTH_REF_M), rock: 1 - unit(l.rock[c] / ROCK_REF), thermal: 1 - unit(l.cold_frac[c]),
    ice: l.ice_km ? 1 - unit(l.ice_km[c] / ICE_REF_KM) : NaN,
  };
}
// Note: Math.min/max propagate NaN like f64::clamp does in Rust, so NaN layers stay NaN.

/** score = Σ wᵢ·fᵢ / Σ wᵢ in [0, 1]; NaN where excluded (score.rs semantics). Throws on bad inputs. */
export function scoreCells(l: FactorLayers, w: PreviewWeights, slopeLimit: number): Float32Array {
  const n = l.slope_deg.length;
  const all = [l.sun_frac, l.earth_frac, l.crater_depth_m, l.rock, l.cold_frac, ...(l.ice_km ? [l.ice_km] : [])];
  if (all.some(a => a.length !== n)) throw new Error('factor layers differ in length');
  const ws = ORDER.map(k => w[k]);
  if (ws.some(x => !Number.isFinite(x) || x < 0)) throw new Error('weights must be finite and >= 0');
  const sum = ws.reduce((a, b) => a + b, 0);
  if (sum <= 0) throw new Error('at least one weight must be > 0');
  if (!(Number.isFinite(slopeLimit) && slopeLimit > 0)) throw new Error('slope_limit_deg must be finite and > 0');
  const out = new Float32Array(n);
  for (let c = 0; c < n; c++) {
    const slope = l.slope_deg[c];
    if (Number.isNaN(slope) || slope > slopeLimit) { out[c] = NaN; continue; }
    const f = factorsAt(l, c, slopeLimit);
    let acc = 0; let bad = false;
    for (let i = 0; i < ORDER.length; i++) {
      if (ws[i] > 0) { const v = f[ORDER[i]]; if (Number.isNaN(v)) { bad = true; break; } acc += ws[i] * v; }
    }
    out[c] = bad ? NaN : acc / sum;
  }
  return out;
}

/** Chamfer distance (km) from every cell to the nearest cell with psr ≥ threshold; Infinity if none. */
export function distanceToPsr(psr: Float32Array, nx: number, ny: number, cellM: number, threshold = 0.5): Float32Array {
  const d = new Float32Array(nx * ny).fill(Infinity);
  for (let i = 0; i < d.length; i++) if (psr[i] >= threshold) d[i] = 0;
  const a = cellM / 1000; const b = a * Math.SQRT2;
  const relax = (i: number, j: number, cost: number) => { if (d[j] + cost < d[i]) d[i] = d[j] + cost; };
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
    const i = y * nx + x;
    if (x > 0) relax(i, i - 1, a);
    if (y > 0) { relax(i, i - nx, a); if (x > 0) relax(i, i - nx - 1, b); if (x < nx - 1) relax(i, i - nx + 1, b); }
  }
  for (let y = ny - 1; y >= 0; y--) for (let x = nx - 1; x >= 0; x--) {
    const i = y * nx + x;
    if (x < nx - 1) relax(i, i + 1, a);
    if (y < ny - 1) { relax(i, i + nx, a); if (x < nx - 1) relax(i, i + nx + 1, b); if (x > 0) relax(i, i + nx - 1, b); }
  }
  return d;
}

/** Factor layers for a real grid. thermal has no data yet (engine ENG-5), so cold_frac is NaN. */
export function gridFactors(grid: Grid): FactorLayers & { ice_km: Float32Array } {
  const { nx, ny, cell_m } = grid.header;
  const n = nx * ny; const nan = new Float32Array(n).fill(NaN);
  const L = grid.layers;
  const psr = L.psr ?? nan;
  const ice = distanceToPsr(psr, nx, ny, cell_m);
  return { sun_frac: L.sun_avg ?? nan, earth_frac: L.earth_avg ?? nan, slope_deg: L.slope_deg ?? nan, crater_depth_m: L.crater_depth_m ?? nan, rock: L.rock ?? nan, cold_frac: nan, ice_km: ice };
}

export interface PreviewArea { index: number; col: number; row: number; x_m: number; y_m: number; lat: number; lon: number; score: number; radius_m: number; factors: Record<FactorKey, number>; iceKm: number }

/** Greedy top-N over k×k window means (GREEDY.md steps 3–4). Empty array = no landable area. */
export function topAreas(grid: Grid, scores: Float32Array, factors: FactorLayers & { ice_km: Float32Array }, slopeLimit: number, n = 3, baseM = BASE_M, exclusionM = EXCLUSION_M): PreviewArea[] {
  const { nx, ny, cell_m, x0, y0 } = grid.header;
  const k = Math.max(1, Math.ceil(baseM / cell_m));
  const half = Math.floor(k / 2);
  const cands: { i: number; s: number }[] = [];
  for (let row = half; row < ny - (k - 1 - half); row++) for (let col = half; col < nx - (k - 1 - half); col++) {
    let acc = 0; let ok = true;
    for (let dy = -half; dy < k - half && ok; dy++) for (let dx = -half; dx < k - half; dx++) {
      const v = scores[(row + dy) * nx + col + dx];
      if (!Number.isFinite(v)) { ok = false; break; }
      acc += v;
    }
    if (ok) cands.push({ i: row * nx + col, s: acc / (k * k) });
  }
  cands.sort((a, b) => b.s - a.s || a.i - b.i);
  const picked: PreviewArea[] = [];
  for (const c of cands) {
    if (picked.length >= n) break;
    const col = c.i % nx; const row = Math.floor(c.i / nx);
    const x = x0 + col * cell_m; const y = y0 + row * cell_m;
    if (picked.some(p => Math.hypot(p.x_m - x, p.y_m - y) < exclusionM)) continue;
    const { lat, lon } = cellLatLon(grid.header, c.i);
    picked.push({ index: c.i, col, row, x_m: x, y_m: y, lat, lon, score: c.s, radius_m: exclusionM, factors: factorsAt(factors, c.i, slopeLimit), iceKm: factors.ice_km[c.i] });
  }
  return picked;
}
