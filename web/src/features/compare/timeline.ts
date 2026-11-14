import type { Metrics } from '../../contracts/engine-api';
import type { MissionWeights } from '../../shell/scenario';

/** Hourly visibility states for the mission timeline bar. */
export const TL_DARK = 0;
export const TL_SUN = 1;
export const TL_EARTH = 2;
export const TL_BOTH = 3;

interface EphemTable {
  header: { t0_iso: string; step_hours: number; n: number };
  rows: Float32Array;
}

const rad = (deg: number) => (deg * Math.PI) / 180;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Great-circle distance in degrees between two selenographic points. */
export function angularDistanceDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const cosC = Math.sin(rad(lat1)) * Math.sin(rad(lat2))
    + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lon2 - lon1));
  return (Math.acos(clamp(cosC, -1, 1)) * 180) / Math.PI;
}

/**
 * Approximate elevation of a body above the local horizon in degrees.
 * The sub-solar / sub-Earth point is where the body sits at the zenith, so the
 * body's elevation equals 90° minus the angular distance to that point.
 * shortcut: point-body geometry only — no lunar parallax, libration, or terrain
 * horizon; horizonDeg accounts for mean terrain blockage when a mask exists.
 */
export function bodyElevationDeg(siteLat: number, siteLon: number, bodyLat: number, bodyLon: number, horizonDeg = 0): number {
  return 90 - angularDistanceDeg(siteLat, siteLon, bodyLat, bodyLon) - horizonDeg;
}

function rowAt(table: EphemTable, hourOffset: number): { sunLat: number; sunLon: number; earthLat: number; earthLon: number } | null {
  const { header, rows } = table;
  const step = header.step_hours;
  const pos = hourOffset / step;
  if (pos < 0 || pos > header.n - 1 || rows.length < 6) return null;
  const i0 = Math.min(Math.floor(pos), header.n - 2);
  const f = pos - i0;
  const a = i0 * 6;
  const b = a + 6;
  const lerp = (c: number) => rows[a + c] + (rows[b + c] - rows[a + c]) * f;
  const wrap = (c: number) => {
    const from = rows[a + c];
    const to = rows[a + c] + (((rows[b + c] - rows[a + c] + 540) % 360) - 180);
    return from + (to - from) * f;
  };
  return { sunLat: lerp(0), sunLon: wrap(1), earthLat: lerp(3), earthLon: wrap(4) };
}

/**
 * Per-hour Sun/Earth visibility for one site, from the ephemeris table.
 * Returns a Uint8Array of TL_* states, or null when the table does not cover
 * the window. Geometry-only: horizonDeg is a single mean horizon, not the
 * per-azimuth mask the engine uses for final metrics.
 */
export function siteTimeline(table: EphemTable, siteLat: number, siteLon: number, startIso: string, hours: number, horizonDeg = 0): Uint8Array | null {
  const t0 = Date.parse(table.header.t0_iso);
  const start = Date.parse(startIso);
  if (!Number.isFinite(t0) || !Number.isFinite(start) || hours < 1) return null;
  const offset0 = (start - t0) / 3_600_000;
  const out = new Uint8Array(hours);
  for (let h = 0; h < hours; h++) {
    const row = rowAt(table, offset0 + h);
    if (!row) return null;
    const sun = bodyElevationDeg(siteLat, siteLon, row.sunLat, row.sunLon, horizonDeg) > 0;
    const earth = bodyElevationDeg(siteLat, siteLon, row.earthLat, row.earthLon, horizonDeg) > 0;
    out[h] = sun && earth ? TL_BOTH : sun ? TL_SUN : earth ? TL_EARTH : TL_DARK;
  }
  return out;
}

/** Table coverage in ISO instants, for honest "outside coverage" UI. */
export function ephemCoverage(table: EphemTable): { start: string; end: string } | null {
  const t0 = Date.parse(table.header.t0_iso);
  if (!Number.isFinite(t0)) return null;
  const end = t0 + table.header.n * table.header.step_hours * 3_600_000;
  return { start: new Date(t0).toISOString(), end: new Date(end).toISOString() };
}

/**
 * Composite readiness heuristic (0–100): weighted mean of four 0–100 subscores.
 * lit/earth are the engine's window percentages; dark/blackout score is the
 * inverse of the longest streak expressed as a share of the window.
 * shortcut: heuristic for UI comparison only — not an engine score; replace with
 * grid_scores/engine ranking when ENG scoring lands.
 */
export function readinessScore(metrics: Metrics, mw: MissionWeights, hours: number): number | null {
  const total = mw.lit + mw.earth + mw.dark + mw.blackout;
  if (total <= 0 || hours <= 0) return null;
  const dark = clamp(100 - (metrics.longest_dark_h / hours) * 100, 0, 100);
  const blackout = clamp(100 - (metrics.longest_blackout_h / hours) * 100, 0, 100);
  const sum = mw.lit * metrics.pct_lit + mw.earth * metrics.pct_earth_visible + mw.dark * dark + mw.blackout * blackout;
  return Math.round((sum / total) * 10) / 10;
}
