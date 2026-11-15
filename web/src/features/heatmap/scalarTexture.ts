import { ClampToEdgeWrapping, DataTexture, NearestFilter, RGBAFormat, SRGBColorSpace, UnsignedByteType } from 'three';
import type { Grid } from './grid';
import type { SouthPoleTile } from '../../scene/types';
import { gridBounds } from './specimen';

function rgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** One opaque texel per science cell, aligned to the finer LOLA relief at the display edge. */
export function scalarTexture(grid: Grid, tile: SouthPoleTile, values: Float32Array, range: [number, number], ramp: [string, string, string]): DataTexture {
  const { nx, ny } = grid.header;
  if (values.length !== nx * ny || !Number.isFinite(range[0]) || !Number.isFinite(range[1]) || range[1] <= range[0])
    throw new Error('Scalar layer shape or display range is invalid.');
  const colors = ramp.map(rgb);
  const bytes = new Uint8Array(values.length * 4);
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const t = Number.isFinite(value) ? Math.min(1, Math.max(0, (value - range[0]) / (range[1] - range[0]))) : -1;
    const a = t < 0 ? 0 : t < 0.5 ? 0 : 1;
    const b = t < 0 ? 0 : t < 0.5 ? 1 : 2;
    const blend = t < 0 ? 0 : t < 0.5 ? t * 2 : (t - 0.5) * 2;
    for (let c = 0; c < 3; c++) bytes[i * 4 + c] = t < 0 ? 55 : Math.round(colors[a][c] * (1 - blend) + colors[b][c] * blend);
    bytes[i * 4 + 3] = 255;
  }
  const texture = new DataTexture(bytes, nx, ny, RGBAFormat, UnsignedByteType);
  texture.flipY = false; // Grid row 0 and tile V=0 both start at projected y_min.
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  const [left, right, bottom, top] = gridBounds(grid, tile);
  texture.repeat.set(2 / (right - left), 2 / (top - bottom));
  texture.offset.set(-(left + 1) / (right - left), -(bottom + 1) / (top - bottom));
  texture.needsUpdate = true;
  return texture;
}
