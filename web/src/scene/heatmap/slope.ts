import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { DataTexture, LinearFilter, RGBAFormat, UnsignedByteType } from 'three';
import common from '../../../../contracts/schemas/common.schema.json';
import schema from '../../../../contracts/schemas/grid.schema.json';
import type { GridHeader } from '../../contracts/grid';
import type { SouthPoleTile } from '../types';

const ajv = new Ajv2020({ strict: false });
addFormats(ajv); ajv.addSchema(common);
const valid = ajv.compile<GridHeader>(schema);
export const SLOPE_LIMIT_DEG = 10;
export interface SlopeGrid { header: GridHeader; values: Float32Array }
export function decodeSlope(header: unknown, bytes: ArrayBuffer, region: string): SlopeGrid {
  if (!valid(header) || header.region !== region || header.nx * header.ny > 1_000_000)
    throw new Error('Slope grid header is invalid or belongs to another region.');
  const info = header.layer_info.slope_deg;
  const count = header.nx * header.ny;
  if (!header.layers.includes('slope_deg') || !info || info.units !== 'deg' || info.dtype !== 'float32' || info.components !== 1 || info.byte_length !== count * 4 || info.byte_offset + info.byte_length > bytes.byteLength)
    throw new Error('Slope grid layout or units are invalid.');
  const view = new DataView(bytes, info.byte_offset, info.byte_length);
  const values = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const raw = view.getFloat32(i * 4, true);
    const value = raw * info.scale + info.offset;
    if (!Number.isFinite(value) || raw === info.nodata || value < 0 || value > 90)
      throw new Error('Slope grid contains missing or invalid degrees.');
    values[i] = value;
  }
  return { header, values };
}

/** Nearest cell for inspection; the GPU interpolates the displayed 10° contour. */
export function slopeAt(grid: SlopeGrid, x: number, y: number): number | null {
  const h = grid.header;
  const col = Math.floor((x - h.x0) / h.cell_m + 0.5), row = Math.floor((y - h.y0) / h.cell_m + 0.5);
  return col < 0 || row < 0 || col >= h.nx || row >= h.ny ? null : grid.values[row * h.nx + col];
}

/** 16-bit slope encoded in RGBA8 for portable, linearly filtered GPU display. */
export function slopeTexture(grid: SlopeGrid) {
  const pixels = new Uint8Array(grid.values.length * 4);
  grid.values.forEach((value, i) => {
    const packed = Math.round(value / 90 * 65535);
    pixels[i * 4] = packed >> 8; pixels[i * 4 + 1] = packed & 255;
    pixels[i * 4 + 3] = 255;
  });
  const texture = new DataTexture(pixels, grid.header.nx, grid.header.ny, RGBAFormat, UnsignedByteType);
  texture.minFilter = LinearFilter; texture.magFilter = LinearFilter;
  texture.generateMipmaps = false; texture.needsUpdate = true;
  return texture;
}
export function slopeUv(tile: SouthPoleTile, grid: SlopeGrid): [number, number, number, number] {
  const h = grid.header;
  return [(tile.x0M - h.x0) / (h.nx * h.cell_m) + 0.5 / h.nx,
    (tile.y0M - h.y0) / (h.ny * h.cell_m) + 0.5 / h.ny,
    (tile.columns - 1) * tile.cellM / (h.nx * h.cell_m),
    (tile.rows - 1) * tile.cellM / (h.ny * h.cell_m)];
}
