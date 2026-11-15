// Engine boundary for the UI (ENG-9). UI code consumes only this file, never scene lighting or browser ephemeris.
// Synchronous on purpose: ResultsPanel calls site_metrics during render, so the main thread holds one WASM
// instance (initialised at import below); the worker pool (pool.ts) is for heavy grid work.
import * as wasm from './pkg/lunar_engine.js';
import { compileEngine } from './pool';
import * as mock from './mock';
import { MOCK_PARAMS, UnavailableScenario } from './mock';
import type { Params, Metrics } from '../contracts/engine-api';
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

// shortcut: demo-* sites (mock masks + constant mock ephem) stay on the synthetic fixtures; switch per site
// to real masks/ephem when INT-1 (#48) loads web/public/data/masks + ephem.bin instead of mock/.
const isMock = (mask: SiteMask) => mask.id.startsWith('demo-');

function args(mask: SiteMask, ephem: Ephem, t_start: string, hours: number) {
  if (!ready) throw new UnavailableScenario('The simulation engine has not loaded.');
  const h = (Date.parse(t_start) - Date.parse(ephem.header.t0_iso)) / 3_600_000; // hours since ephem t0
  if (!Number.isFinite(h)) throw new UnavailableScenario('The start time is not a valid date.');
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

/** 16-hex determinism hash (engine tag + bytes), e.g. of a Float32Array of results. */
export function outputHash(data: ArrayBufferView): string {
  if (!ready) throw new UnavailableScenario('The simulation engine has not loaded.');
  return wasm.output_hash(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
}

// Engine input errors (window past the table, bad step) come back as JsError: show them as an unavailable scenario.
function call<T>(f: () => T): T {
  try {
    return f();
  } catch (e) {
    if (e instanceof UnavailableScenario) throw e;
    throw new UnavailableScenario(`The engine cannot compute this scenario: ${e instanceof Error ? e.message : String(e)}`);
  }
}
