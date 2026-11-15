/**
 * W7: Moon-fixed Sun / Earth geometry at any instant (SPEC guardrails 1–2).
 *
 * Astronomy Engine cannot put an observer on the Moon, so: Moon→Sun = GeoVector(Sun) − GeoMoon and
 * Moon→Earth = −GeoMoon (J2000 equatorial, AU), rotated into the Moon body frame with the IAU rotation
 * model from RotationAxis(Body.Moon). Outputs are quantized (angles to 1e-7 rad) so the same instant gives
 * the same numbers in every browser. Geometry only: no terrain horizon, no refraction (no atmosphere).
 * shortcut: IAU Moon rotation model approximates MOON_ME to ~0.01°; swap for a DE-based PA→ME rotation if
 * validation against the Horizons table drifts past tolerance.
 */
import { Body, GeoMoon, GeoVector, MakeTime, RotationAxis, type Vector } from 'astronomy-engine';

export const MOON_RADIUS_KM = 1737.4;
const AU_KM = 149_597_870.7;
const DEG = Math.PI / 180;
const Q = 1e-7;

/** One row of the `ephem` contract fields. Angles in degrees, distances in km. */
export interface EphemRow { sun_lat: number; sun_lon: number; sun_dist_km: number; earth_lat: number; earth_lon: number; earth_dist_km: number }
export interface AzEl { az: number; el: number }
export interface SiteSky { sun: AzEl; earth: AzEl }

const qRad = (deg: number) => Math.round(deg * DEG / Q) * Q / DEG;
const qKm = (km: number) => Math.round(km * 1000) / 1000;

type V3 = [number, number, number];
/** J2000 equatorial → Moon body-fixed (IAU): Rz(W) · Rx(90° − δ) · Rz(90° + α). */
function toBodyFixed(v: V3, ra: number, dec: number, spin: number): V3 {
  const rz = (p: V3, a: number): V3 => [p[0] * Math.cos(a) + p[1] * Math.sin(a), -p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]];
  const rx = (p: V3, a: number): V3 => [p[0], p[1] * Math.cos(a) + p[2] * Math.sin(a), -p[1] * Math.sin(a) + p[2] * Math.cos(a)];
  return rz(rx(rz(v, (90 + ra) * DEG), (90 - dec) * DEG), spin * DEG);
}
const vec = (v: Vector): V3 => [v.x * AU_KM, v.y * AU_KM, v.z * AU_KM];
function subPoint(v: V3) {
  const r = Math.hypot(...v);
  const lon = Math.atan2(v[1], v[0]) / DEG;
  return { lat: qRad(Math.asin(v[2] / r) / DEG), lon: qRad(lon > 180 ? lon - 360 : lon), dist: qKm(r) };
}

/** Sub-solar and sub-Earth points on the Moon (MOON_ME approx.) and distances from the Moon's centre. */
export function sunEarthAt(date: Date | string): EphemRow {
  const time = MakeTime(new Date(date));
  const moon = vec(GeoMoon(time));
  const sunGeo = vec(GeoVector(Body.Sun, time, true));
  const axis = RotationAxis(Body.Moon, time);
  const sun = subPoint(toBodyFixed([sunGeo[0] - moon[0], sunGeo[1] - moon[1], sunGeo[2] - moon[2]], axis.ra * 15, axis.dec, axis.spin));
  const earth = subPoint(toBodyFixed([-moon[0], -moon[1], -moon[2]], axis.ra * 15, axis.dec, axis.spin));
  return { sun_lat: sun.lat, sun_lon: sun.lon, sun_dist_km: sun.dist, earth_lat: earth.lat, earth_lon: earth.lon, earth_dist_km: earth.dist };
}

/** Moon-fixed Cartesian (km) of a body given its sub-point and distance. */
function bodyXYZ(lat: number, lon: number, dist: number): V3 {
  return [dist * Math.cos(lat * DEG) * Math.cos(lon * DEG), dist * Math.cos(lat * DEG) * Math.sin(lon * DEG), dist * Math.sin(lat * DEG)];
}

/** Topocentric azimuth (deg clockwise from north) and elevation (deg) of a body seen from a surface site. */
export function azEl(siteLat: number, siteLon: number, bodyLat: number, bodyLon: number, bodyDistKm: number, siteHeightM = 0): AzEl {
  const r = MOON_RADIUS_KM + siteHeightM / 1000;
  const φ = siteLat * DEG; const λ = siteLon * DEG;
  const site: V3 = [r * Math.cos(φ) * Math.cos(λ), r * Math.cos(φ) * Math.sin(λ), r * Math.sin(φ)];
  const b = bodyXYZ(bodyLat, bodyLon, bodyDistKm);
  const d: V3 = [b[0] - site[0], b[1] - site[1], b[2] - site[2]];
  const east = -Math.sin(λ) * d[0] + Math.cos(λ) * d[1];
  const north = -Math.sin(φ) * Math.cos(λ) * d[0] - Math.sin(φ) * Math.sin(λ) * d[1] + Math.cos(φ) * d[2];
  const up = Math.cos(φ) * Math.cos(λ) * d[0] + Math.cos(φ) * Math.sin(λ) * d[1] + Math.sin(φ) * d[2];
  const az = Math.atan2(east, north) / DEG;
  return { az: (az + 360) % 360, el: Math.atan2(up, Math.hypot(east, north)) / DEG };
}

/** Geometric Sun and Earth directions from a site (no terrain). */
export function siteSky(lat: number, lon: number, date: Date | string, heightM = 0): SiteSky {
  const row = sunEarthAt(date);
  return { sun: azEl(lat, lon, row.sun_lat, row.sun_lon, row.sun_dist_km, heightM), earth: azEl(lat, lon, row.earth_lat, row.earth_lon, row.earth_dist_km, heightM) };
}

/** Hourly samples from `start` for `hours` hours (inclusive of the start hour). */
export function series(start: Date | string, hours: number, stepHours = 1) {
  const t0 = new Date(start).getTime();
  return Array.from({ length: Math.floor(hours / stepHours) + 1 }, (_, i) => {
    const t = new Date(t0 + i * stepHours * 3_600_000);
    return { t, row: sunEarthAt(t) };
  });
}
