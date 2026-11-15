// Engine boundary for the UI (ENG-9). UI code consumes only this file, never scene lighting or browser ephemeris.
// Synchronous on purpose: ResultsPanel calls site_metrics during render, so the main thread holds one WASM
// instance (initialised at import below); the worker pool (pool.ts) is for heavy grid work.
import * as wasm from './pkg/lunar_engine.js';
import { compileEngine } from './pool';
import * as mock from './mock';
import { MOCK_PARAMS, UnavailableScenario } from './mock';
import type { Area, Params, Metrics, Weights } from '../contracts/engine-api';
import type { GridHeader } from '../contracts/grid';
import type { SiteMask } from '../contracts/site-mask';
import type { DemoData } from '../shell/data';
import { parseMetrics } from '../shell/validation';

export { MOCK_PARAMS, UnavailableScenario };
type Ephem = DemoData['table'];

/** Validity extras (engine site_extras; not in the Metrics contract yet, decision 3). */
export interface Extras {
  pct_sun_and_earth: number;
  survives_night: boolean;
  sun_el_at_start_deg: number;
  earth_visible_at_start: boolean;
}

let ready = false;
/** Instantiate the main-thread engine from wasm bytes or a compiled Module (tests pass the bytes read from pkg/). */
export function initEngine(module: BufferSource | WebAssembly.Module): void {
  wasm.initSync({ module });
  ready = true;
}
// Top-level await keeps every export synchronous. Off the browser (vitest/node) the fetch fails and the
// engine stays uninitialised until initEngine is called; demo sites still run on the mock.
if ('document' in globalThis) await compileEngine().then(initEngine, (e: unknown) => console.warn('engine wasm failed to load', e));

// demo-* sites (synthetic masks, labelled "mock" in the UI) stay on fixtures; real masks (INT-1) run the WASM engine.
const isMock = (mask: SiteMask) => mask.id.startsWith('demo-');

function hoursSinceT0(ephem: Ephem, t_start: string): number {
  if (!ready) throw new UnavailableScenario('The simulation engine has not loaded.');
  const h = (Date.parse(t_start) - Date.parse(ephem.header.t0_iso)) / 3_600_000;
  if (!Number.isFinite(h)) throw new UnavailableScenario('The start time is not a valid date.');
  return h;
}

function args(mask: SiteMask, ephem: Ephem, t_start: string, hours: number) {
  const h = hoursSinceT0(ephem, t_start);
  const geom = { lat_deg: mask.lat, lon_deg: mask.lon, elev_m: mask.elev_m, slope_deg: mask.slope_deg, aspect_deg: mask.aspect_deg };
  return [geom, Float32Array.from(mask.mask_deg), ephem.rows, h, hours] as const;
}

/** Solar, thermal and DTE metrics over [t_start, t_start + hours) for one site. Throws UnavailableScenario when out of range. */
export function site_metrics(mask: SiteMask, ephem: Ephem, t_start: string, hours: number, params: Params): Metrics {
  if (isMock(mask)) return mock.site_metrics(mask, ephem, t_start, hours, params);
  return parseMetrics(call(() => wasm.site_metrics(...args(mask, ephem, t_start, hours), params)), hours);
}

export function siteExtras(mask: SiteMask, ephem: Ephem, t_start: string, hours: number, params: Params): Extras {
  return call(() => wasm.site_extras(...args(mask, ephem, t_start, hours), params) as Extras);
}

/** 6 floats per step: sun_az, sun_el, sun_lit (0..1), earth_az, earth_el, earth_visible (0/1); degrees. */
export function siteTrack(mask: SiteMask, ephem: Ephem, t_start: string, hours: number, params: Params): Float32Array {
  return call(() => wasm.site_track(...args(mask, ephem, t_start, hours), params));
}

/** 16-hex determinism hash (engine tag + bytes). A Float32Array is hashed canonically (one NaN, -0 as +0). */
export function outputHash(data: ArrayBufferView): string {
  if (!ready) throw new UnavailableScenario('The simulation engine has not loaded.');
  if (data instanceof Float32Array) return wasm.output_hash_f32(data);
  return wasm.output_hash(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
}

// --- Grid scoring + greedy (ENG-6/7). Heavy: gridFracs simulates every cell (~0.75 s WASM in node for 125 x 125 x 336 h),
// so run it once per time window (worker pool for the UI); weight sliders only call scoresFromFracs (< 1 ms). ---

/** Floats per cell in a gridFracs array: sun_frac, earth_frac, cold_frac, longest_dark_h. */
export const FRACS_PER_CELL = 4;

/** Heatmap default: battery gate OFF (battery_h 0). On the 3 real grids over 14 days from 2026-01-02, a 48 h gate
 * leaves only 0.9-15% of cells valid, which blanks the heatmap; site cards still flag survives_night. */
export const GRID_PARAMS: Params = { battery_h: 0, survival_temp_k: 233, antenna_margin_deg: 2, slope_limit_deg: 10, step_hours: 1 };

/** Window means of the normalised factors (0..1, higher = better); null where a factor has no data or the window leaves the grid. */
export interface Factors {
  sun: number | null;
  earth: number | null;
  slope: number | null;
  crater: number | null;
  rock: number | null;
  thermal: number | null;
}

/** Best window near a site vs the site's own window, on the same 64-bin grid data. Metres are stereo. */
export interface Nearby {
  x_m: number;
  y_m: number;
  lat: number;
  lon: number;
  /** From the centre of the site's grid cell. */
  dist_m: number;
  score: number;
  /** null when the site's own window is invalid (site_valid false). */
  site_score: number | null;
  site_valid: boolean;
  /** Best minus site per factor, e.g. sun 0.18 = +18 points of sunlit time. */
  delta: Factors;
}

/** Per-cell time simulation from the grid's mask layer: FRACS_PER_CELL floats per cell. */
export function gridFracs(grid: Uint8Array, header: GridHeader, ephem: Ephem, t_start: string, hours: number, params: Params): Float32Array {
  return call(() => wasm.grid_fracs(grid, header, ephem.rows, hoursSinceT0(ephem, t_start), hours, params));
}

/** Scores (row-major, NaN = excluded) from a gridFracs array: cheap, call on every weight change. */
export function scoresFromFracs(grid: Uint8Array, header: GridHeader, fracs: Float32Array, weights: Weights, params: Params): Float32Array {
  return call(() => wasm.scores_from_fracs(grid, header, fracs, weights, params));
}

/** gridFracs + scoresFromFracs in one call. */
export function gridScores(grid: Uint8Array, header: GridHeader, ephem: Ephem, t_start: string, hours: number, weights: Weights, params: Params): Float32Array {
  return call(() => wasm.grid_scores(grid, header, ephem.rows, hoursSinceT0(ephem, t_start), hours, weights, params));
}

/** 1 per permanently shadowed cell (time-independent, once per region). */
export function psrFlags(grid: Uint8Array, header: GridHeader): Uint8Array {
  return call(() => wasm.psr_flags(grid, header));
}

/** Window side in cells for a base footprint: smallest odd k >= base_m / cell_m (400 m at 160 m cells gives 3). */
export function windowCells(base_m: number, cell_m: number): number {
  return call(() => wasm.window_cells(base_m, cell_m));
}

/** Greedy top-n landing areas, best first; [] means no landable area. */
export function topAreas(scores: Float32Array, header: GridHeader, window_cells: number, exclusion_m: number, n: number): Area[] {
  return call(() => wasm.top_areas(scores, header, window_cells, exclusion_m, n) as Area[]);
}

/** Best window within radius_m of stereo (x_m, y_m); null when none is valid. */
export function nearbyBetter(grid: Uint8Array, header: GridHeader, fracs: Float32Array, weights: Weights, params: Params,
  window_cells: number, x_m: number, y_m: number, radius_m: number): Nearby | null {
  return call(() => wasm.nearby_better(grid, header, fracs, weights, params, window_cells, x_m, y_m, radius_m) as Nearby | null);
}

/** Why an area ranked: factor means over the window centred on the cell containing (x_m, y_m). */
export function windowFactors(grid: Uint8Array, header: GridHeader, fracs: Float32Array, params: Params,
  window_cells: number, x_m: number, y_m: number): Factors {
  return call(() => wasm.window_factors(grid, header, fracs, params, window_cells, x_m, y_m) as Factors);
}

// Engine input errors (window past the table, bad step) come back as JsError: show them as an unavailable scenario.
function call<T>(f: () => T): T {
  if (!ready) throw new UnavailableScenario('The simulation engine has not loaded.');
  try {
    return f();
  } catch (e) {
    if (e instanceof UnavailableScenario) throw e;
    throw new UnavailableScenario(`The engine cannot compute this scenario: ${e instanceof Error ? e.message : String(e)}`);
  }
}
