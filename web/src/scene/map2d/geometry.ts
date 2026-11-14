export interface PolarGridConfig {
  centerX: number;
  centerZ: number;
  extentKm: number;
  spacingKm: number;
}

/** Grid coordinates stay in the source polar-stereographic metre frame. */
export function gridLines({ centerX, centerZ, extentKm, spacingKm }: PolarGridConfig): Float32Array {
  if (![centerX, centerZ, extentKm, spacingKm].every(Number.isFinite) || extentKm <= 0 || spacingKm <= 0) {
    throw new RangeError('Grid centre and spacing must be finite; extent and spacing must be positive');
  }
  if (extentKm / spacingKm > 100) throw new RangeError('Use at most 100 grid intervals');
  const half = extentKm * 500;
  const step = spacingKm * 1000;
  const minX = centerX - half;
  const maxX = centerX + half;
  const minZ = centerZ - half;
  const maxZ = centerZ + half;
  const values: number[] = [];
  const startX = Math.ceil(minX / step) * step;
  const startZ = Math.ceil(minZ / step) * step;
  for (let x = startX; x <= maxX; x += step) values.push(x || 0, minZ, x || 0, maxZ);
  for (let z = startZ; z <= maxZ; z += step) values.push(minX, z || 0, maxX, z || 0);
  return Float32Array.from(values);
}

export function coordinateLabel(lat: number, lon: number): string {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90) throw new RangeError('Invalid latitude or longitude');
  const normalizedLon = ((lon + 180) % 360 + 360) % 360 - 180;
  const latitude = `${Math.abs(lat).toFixed(2)}°${lat < 0 ? 'S' : 'N'}`;
  const longitude = `${Math.abs(normalizedLon).toFixed(2)}°${normalizedLon < 0 ? 'W' : 'E'}`;
  return `${latitude}  ${longitude}`;
}
