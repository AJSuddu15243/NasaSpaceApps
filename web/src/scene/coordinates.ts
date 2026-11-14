import { Vector3 } from 'three';
import { MOON_RADIUS_M } from './terrain';
import type { SouthPoleTile } from './types';

const RAD = Math.PI / 180;

/** Display edge conversion: source grids stay in south-polar stereographic metres. */
export function projectedPoint(lat: number, lon: number) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > -80) return null;
  const rho = 2 * MOON_RADIUS_M * Math.tan(Math.PI / 4 + lat * RAD / 2);
  return { x: rho * Math.sin(lon * RAD), y: rho * Math.cos(lon * RAD) };
}

export function geographicPoint(x: number, y: number) {
  return { lat: (2 * Math.atan(Math.hypot(x, y) / (2 * MOON_RADIUS_M)) - Math.PI / 2) / RAD,
    lon: Math.atan2(x, y) / RAD };
}

/** R3F axes: +Y north pole, +Z 0°E, +X 90°E. */
export function bodyDirection(lat: number, lon: number): [number, number, number] {
  return [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)];
}

export function surfacePoint(x: number, y: number, elevationM = 0): Vector3 {
  const { lat, lon } = geographicPoint(x, y);
  return new Vector3(...bodyDirection(lat, lon)).multiplyScalar((MOON_RADIUS_M + elevationM) / 1000);
}

export function tileFrame(tile: SouthPoleTile) {
  const x = tile.x0M + (tile.columns - 1) * tile.cellM / 2;
  const y = tile.y0M + (tile.rows - 1) * tile.cellM / 2;
  const origin = surfacePoint(x, y, sampleHeight(tile, x, y) ?? 0);
  const normal = origin.clone().normalize();
  const up = surfacePoint(x, y + 1).sub(surfacePoint(x, y)).normalize();
  const right = up.clone().cross(normal).normalize();
  return { x, y, origin, normal, up, right,
    span: Math.max(tile.columns - 1, tile.rows - 1) * tile.cellM / 1000 };
}
export type TerrainFrame = ReturnType<typeof tileFrame>;

/** Bilinear height for drawing markers, never for mission metrics. */
export function sampleHeight(tile: SouthPoleTile, x: number, y: number): number | null {
  const col = (x - tile.x0M) / tile.cellM;
  const row = (y - tile.y0M) / tile.cellM;
  if (col < 0 || row < 0 || col > tile.columns - 1 || row > tile.rows - 1) return null;
  const c = Math.min(Math.floor(col), tile.columns - 2);
  const r = Math.min(Math.floor(row), tile.rows - 2);
  const fx = col - c, fy = row - r;
  const a = tile.elevationM[r * tile.columns + c] * (1 - fx) + tile.elevationM[r * tile.columns + c + 1] * fx;
  const b = tile.elevationM[(r + 1) * tile.columns + c] * (1 - fx) + tile.elevationM[(r + 1) * tile.columns + c + 1] * fx;
  return a * (1 - fy) + b * fy;
}
