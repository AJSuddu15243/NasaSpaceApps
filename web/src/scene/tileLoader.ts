import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import common from '../../../contracts/schemas/common.schema.json';
import schema from '../../../contracts/schemas/tile.schema.json';
import type { TileHeader } from '../contracts/tile';
import type { SouthPoleTile } from './types';
import { validateSouthPoleTile } from './terrain';
import { projectedPoint } from './coordinates';
import { cached, untilAborted } from '../lib/cache';
const ajv = new Ajv2020({ strict: false });
addFormats(ajv); ajv.addSchema(common);
const valid = ajv.compile<TileHeader>(schema);
export function decodeTile(header: unknown, bytes: ArrayBuffer): SouthPoleTile {
  if (!valid(header) || header.nx * header.ny > 1_000_000 || header.nx < 2 || header.ny < 2)
    throw new Error('Terrain header is invalid or exceeds the scene budget.');
  if (bytes.byteLength !== header.nx * header.ny * 4) throw new Error('Terrain byte length does not match its grid.');
  const values = new Float32Array(header.nx * header.ny);
  const data = new DataView(bytes);
  for (let i = 0; i < values.length; i++) {
    values[i] = data.getFloat32(i * 4, true);
    if (!Number.isFinite(values[i]) || values[i] === header.nodata) throw new Error('Terrain contains missing elevations.');
  }
  const tile = { id: header.region, x0M: header.x0, y0M: header.y0, cellM: header.cell_m,
    columns: header.nx, rows: header.ny, elevationM: values };
  validateSouthPoleTile(tile); return tile;
}
// shortcut: three PIPE-4 seed regions; use manifest discovery when more regions are shipped.
const regions = ['connecting-ridge', 'haworth', 'malapert-massif'];
// Unbounded is fine: one header (~1 KB) and one decoded tile (~250 KB) per shipped region.
const headers = new Map<string, Promise<TileHeader | null>>();
const tiles = new Map<string, Promise<SouthPoleTile>>();
/** Validated 80 m tile header for a region, or null when that region is not shipped. */
const tileHeader = (region: string) => cached(headers, region, async () => {
  const response = await fetch(`/data/tiles/${region}_80m.json`);
  if (response.status === 404 || response.headers.get('content-type')?.includes('text/html')) return null;
  if (!response.ok) throw new Error('Terrain catalogue could not load.');
  const header: unknown = await response.json();
  if (!valid(header)) throw new Error('Terrain header is invalid.');
  return header;
});
/** Decoded 80 m tile for a shipped region (null when it is not shipped); cached and shared across callers. */
export async function loadRegionTile(region: string, signal?: AbortSignal): Promise<SouthPoleTile | null> {
  const header = await untilAborted(tileHeader(region), signal);
  if (!header) return null;
  return untilAborted(cached(tiles, region, async () => {
    const binary = await fetch(`/data/tiles/${region}_80m.bin`);
    if (!binary.ok) throw new Error('Terrain elevations could not load.');
    return decodeTile(header, await binary.arrayBuffer());
  }), signal);
}
export async function loadSiteTile(lat: number, lon: number, signal: AbortSignal): Promise<SouthPoleTile | null> {
  const p = projectedPoint(lat, lon);
  if (!p) return null;
  for (const region of regions) {
    const header = await untilAborted(tileHeader(region), signal);
    if (!header) continue;
    if (p.x < header.x0 || p.y < header.y0 || p.x > header.x0 + (header.nx - 1) * header.cell_m || p.y > header.y0 + (header.ny - 1) * header.cell_m) continue;
    return loadRegionTile(region, signal);
  }
  return null;
}
