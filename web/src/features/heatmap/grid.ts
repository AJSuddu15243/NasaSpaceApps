import { fetchAsset } from '../../lib/assetCache';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import common from '../../../../contracts/schemas/common.schema.json';
import gridSchema from '../../../../contracts/schemas/grid.schema.json';
import type { GridHeader } from '../../contracts/grid';
import type { SiteMask } from '../../contracts/site-mask';

const ajv = new Ajv2020({ strict: false, strictNumbers: true });
addFormats(ajv);
ajv.addSchema(common);
const checkGrid = ajv.compile<GridHeader>(gridSchema);

export const GRID_REGIONS = ['connecting-ridge', 'haworth', 'malapert-massif'] as const;
export type GridRegion = typeof GRID_REGIONS[number];
export type LayerName = 'slope_deg' | 'aspect_deg' | 'elev_m' | 'crater_depth_m' | 'roughness_deg' | 'rock' | 'sun_avg' | 'earth_avg' | 'psr' | 'ice_favorability';
/** `bytes` is the raw .bin the engine reads (grid_fracs, scores_from_fracs); absent on synthetic test grids. */
export interface Grid { header: GridHeader; layers: Partial<Record<LayerName, Float32Array>>; bytes?: Uint8Array }

export const isGridRegion = (id: string | undefined): id is GridRegion => !!id && (GRID_REGIONS as readonly string[]).includes(id);

/** Validate the header against the `grid` contract and slice its float32 scalar layers (mask is skipped). */
export function parseGrid(value: unknown, bytes: ArrayBuffer, region: string): Grid {
  if (!checkGrid(value)) throw new Error('Grid header does not match the contract.');
  if (value.region !== region) throw new Error('Grid belongs to another region.');
  const n = value.nx * value.ny;
  if (n > 1_000_000) throw new Error('Grid is larger than the display budget.');
  let offset = 0;
  if (Object.keys(value.layer_info).length !== value.layers.length) throw new Error('Grid layer metadata does not match its layers.');
  const sizes = { float32: 4, int16: 2, uint16: 2, uint8: 1 };
  for (const name of value.layers) {
    const info = value.layer_info[name];
    if (!info || info.byte_offset !== offset || info.byte_length !== n * info.components * sizes[info.dtype]) throw new Error('Grid layers overlap or have invalid lengths.');
    offset += info.byte_length;
  }
  if (offset !== bytes.byteLength) throw new Error('Grid binary length does not match its layers.');
  const layers: Grid['layers'] = {};
  for (const name of value.layers) {
    if (name === 'mask') continue;
    const info = value.layer_info[name];
    if (!info || info.dtype !== 'float32' || info.components !== 1) continue;
    if (info.byte_length !== n * 4 || info.byte_offset + info.byte_length > bytes.byteLength) throw new Error(`Layer ${name} has the wrong size.`);
    const view = new DataView(bytes, info.byte_offset, info.byte_length);
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const v = view.getFloat32(i * 4, true);
      const missing = info.nodata !== null && v === info.nodata;
      const physical = v * info.scale + info.offset;
      if (!missing && !Number.isFinite(physical)) throw new Error(`Layer ${name} contains invalid values.`);
      out[i] = missing ? NaN : physical;
    }
    layers[name as LayerName] = out;
  }
  return { header: value, layers, bytes: new Uint8Array(bytes) };
}

const cache = new Map<string, Promise<Grid>>();
/** Cached per region; a failed load is evicted so Retry works. */
export function loadGrid(region: GridRegion, request: typeof fetch = fetchAsset): Promise<Grid> {
  let pending = cache.get(region);
  if (!pending) {
    pending = (async () => {
      const get = async (path: string) => {
        const response = await request(`/data/grid/${path}`);
        if (!response.ok) throw new Error(`Grid download failed (${response.status}).`);
        return response;
      };
      const [header, bytes] = await Promise.all([get(`${region}.json`).then(r => r.json()), get(`${region}.bin`).then(r => r.arrayBuffer())]);
      return parseGrid(header, bytes, region);
    })();
    pending.catch(() => cache.delete(region));
    cache.set(region, pending);
  }
  return pending;
}
export const loadAllGrids = () => Promise.all(GRID_REGIONS.map(region => loadGrid(region)));

/** Projected south-polar-stereographic (m) → lat/lon (deg), the inverse of the pipeline's coords.to_xy. */
export function xyToLatLon(x: number, y: number, radiusM = 1_737_400) {
  const rho = Math.hypot(x, y);
  const lat = (2 * Math.atan(rho / (2 * radiusM)) - Math.PI / 2) * 180 / Math.PI;
  const lon = rho === 0 ? 0 : Math.atan2(x, y) * 180 / Math.PI;
  return { lat, lon };
}
export function cellLatLon(header: GridHeader, index: number) {
  const col = index % header.nx; const row = Math.floor(index / header.nx);
  return xyToLatLon(header.x0 + col * header.cell_m, header.y0 + row * header.cell_m);
}

/** 64-bin horizon mask of the grid cell containing (lat, lon), as a SiteMask for the engine facade (site_metrics,
 * trackFor). Cell centre coordinates, so results match grid_fracs for that cell. Null outside the grid or on no-data. */
export function maskAt(grid: Grid, lat: number, lon: number): SiteMask | null {
  const h = grid.header; const info = h.layer_info.mask;
  if (!grid.bytes || !info || info.dtype !== 'int16' || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const rad = Math.PI / 180; const rho = 2 * h.crs_params.radius_m * Math.tan(Math.PI / 4 + lat * rad / 2);
  const col = Math.round((rho * Math.sin(lon * rad) - h.x0) / h.cell_m); const row = Math.round((rho * Math.cos(lon * rad) - h.y0) / h.cell_m);
  if (col < 0 || col >= h.nx || row < 0 || row >= h.ny) return null;
  const i = row * h.nx + col;
  const elev = grid.layers.elev_m?.[i] ?? NaN; const slope = grid.layers.slope_deg?.[i] ?? NaN; const aspect = grid.layers.aspect_deg?.[i] ?? NaN;
  if (!Number.isFinite(elev) || !Number.isFinite(slope)) return null;
  const bins = info.components;
  const view = new DataView(grid.bytes.buffer, grid.bytes.byteOffset + info.byte_offset, info.byte_length);
  const mask_deg: number[] = [];
  for (let b = 0; b < bins; b++) {
    const raw = view.getInt16((i * bins + b) * 2, true);
    if (info.nodata !== null && raw === info.nodata) return null;
    mask_deg.push(raw * info.scale + info.offset);
  }
  const c = cellLatLon(h, i);
  return { schema_version: 1, generated_at: h.generated_at, source_urls: h.source_urls, id: `${h.region}#${i}`, lat: c.lat, lon: c.lon, elev_m: elev, slope_deg: slope,
    ...(Number.isFinite(aspect) ? { aspect_deg: aspect } : {}),
    // The contract types curated masks as 360 bins; the engine takes any bin count.
    bins: bins as 360, mask_deg, max_distance_km: 150, dem_source: `LOLA grid ${h.region} mask layer (${bins} bins, ${h.cell_m} m cell)` };
}

/** Engine horizon for a place: its curated 360-bin mask, else the 64-bin mask of the covering grid cell; null means
 * flat horizon only. demo-* fixtures always return null so they keep their synthetic path. */
export function siteMaskFor(place: { id: string; lat: number; lon: number }, masks: ReadonlyMap<string, SiteMask> | undefined, grids: Partial<Record<GridRegion, Grid>>): SiteMask | null {
  if (place.id.startsWith('demo-')) return null;
  const curated = masks?.get(place.id);
  if (curated) return curated;
  for (const grid of Object.values(grids)) { const m = grid && maskAt(grid, place.lat, place.lon); if (m) return m; }
  return null;
}

/** Terrain horizon (deg) at azimuth az, linear between bin centres (bin b sits at b * 360 / bins). */
export function horizonAt(mask_deg: ArrayLike<number>, az: number): number {
  const n = mask_deg.length; const f = ((az % 360 + 360) % 360) / 360 * n;
  const b = Math.floor(f) % n; const t = f - Math.floor(f);
  return mask_deg[b] * (1 - t) + mask_deg[(b + 1) % n] * t;
}
