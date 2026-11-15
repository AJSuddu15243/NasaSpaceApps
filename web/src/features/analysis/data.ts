import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import common from '../../../../contracts/schemas/common.schema.json';
import tileSchema from '../../../../contracts/schemas/tile.schema.json';
import validationSchema from '../../../../contracts/schemas/validation.schema.json';
import type { TileHeader } from '../../contracts/tile';
import type { ValidationSet } from '../../contracts/validation';

const ajv = new Ajv2020({ strict: false, strictNumbers: true });
addFormats(ajv);
ajv.addSchema(common);
const checkTile = ajv.compile<TileHeader>(tileSchema);
const checkReference = ajv.compile<ValidationSet>(validationSchema);
export const REGION_IDS = ['connecting-ridge', 'haworth', 'malapert-massif'] as const;
export interface TerrainData { header: TileHeader; heights: Float32Array; min: number; max: number }
export interface AnalysisData { terrain: TerrainData; reference: ValidationSet }

export function parseTerrain(value: unknown, bytes: ArrayBuffer, region: string): TerrainData {
  if (!checkTile(value) || value.region !== region || value.nx * value.ny > 1_000_000 || bytes.byteLength !== value.nx * value.ny * 4) throw new Error('Terrain dimensions or region do not match the source.');
  const heights = new Float32Array(value.nx * value.ny);
  const view = new DataView(bytes);
  let min = Infinity; let max = -Infinity;
  for (let i = 0; i < heights.length; i++) {
    const height = view.getFloat32(i * 4, true);
    if (!Number.isFinite(height) || height === value.nodata) throw new Error('Terrain contains missing or non-finite heights.');
    heights[i] = height;
    min = Math.min(min, height); max = Math.max(max, height);
  }
  return { header: value, heights, min, max };
}
export function parseReference(value: unknown, region: string): ValidationSet {
  if (!checkReference(value) || value.site_id !== region) throw new Error('Reference data belongs to another site or is invalid.');
  let previous = -Infinity;
  for (const sample of value.samples) {
    const time = Date.parse(sample.t_iso);
    if (!Number.isFinite(time) || time <= previous) throw new Error('Reference times must be unique and increasing.');
    previous = time;
  }
  return value;
}
export async function loadAnalysis(region: string, signal: AbortSignal, request: typeof fetch = fetch): Promise<AnalysisData> {
  if (!(REGION_IDS as readonly string[]).includes(region)) throw new Error('No terrain or reference coverage for this location.');
  const get = async (path: string) => {
    const response = await request(`/data/${path}`, { signal });
    if (!response.ok) throw new Error(`Source download failed (${response.status}). Retry when the data is available.`);
    return response;
  };
  const [header, bytes, reference] = await Promise.all([
    get(`tiles/${region}_80m.json`).then(r => r.json()),
    get(`tiles/${region}_80m.bin`).then(r => r.arrayBuffer()),
    get(`validation/${region}.json`).then(r => r.json()),
  ]);
  return { terrain: parseTerrain(header, bytes, region), reference: parseReference(reference, region) };
}
/** Never clamp across gaps in the disjoint Jan 2026 / Jul 2028 reference windows. */
export function referenceWindow(reference: ValidationSet, date: string) {
  const start = Date.parse(date);
  const current = reference.samples.find(sample => {
    const offset = start - Date.parse(sample.t_iso);
    return offset >= 0 && offset < 3_600_000;
  });
  if (!current) return [];
  const first = reference.samples.indexOf(current);
  const samples = [current];
  for (let i = first + 1; i < reference.samples.length && samples.length < 25; i++) {
    const next = reference.samples[i];
    if (Date.parse(next.t_iso) - Date.parse(samples[samples.length - 1].t_iso) !== 3_600_000) break;
    samples.push(next);
  }
  return samples;
}
/** Display-only resampling of the whole tile; both outer edges are retained. */
export function wireframe(terrain: TerrainData): string[] {
  const { header, heights, min, max } = terrain;
  const count = 20;
  const point = (row: number, col: number) => {
    const h = heights[row * header.nx + col];
    const u = col / Math.max(1, header.nx - 1); const v = row / Math.max(1, header.ny - 1);
    const z = (h - min) / Math.max(1, max - min);
    return `${(40 + u * 270 + v * 95).toFixed(1)},${(210 - v * 95 - z * 95).toFixed(1)}`;
  };
  const paths: string[] = [];
  for (let line = 0; line <= count; line++) {
    const row = Math.round(line / count * (header.ny - 1));
    const col = Math.round(line / count * (header.nx - 1));
    paths.push(Array.from({ length: count + 1 }, (_, i) => point(row, Math.round(i / count * (header.nx - 1)))).join(' '));
    paths.push(Array.from({ length: count + 1 }, (_, i) => point(Math.round(i / count * (header.ny - 1)), col)).join(' '));
  }
  return paths;
}
