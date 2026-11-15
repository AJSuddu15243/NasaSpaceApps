import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import common from '../../../contracts/schemas/common.schema.json';
import imagerySchema from '../../../contracts/schemas/imagery.schema.json';
import type { ImageryHeader } from '../contracts/imagery';
import type { SouthPoleTile } from './types';
import { decodeSlope, type SlopeGrid } from './heatmap/slope';
import { isGridRegion, loadGrid } from '../features/heatmap/grid';
import { cached, untilAborted } from '../lib/cache';
const ajv = new Ajv2020({ strict: false });
addFormats(ajv); ajv.addSchema(common);
const validImagery = ajv.compile<ImageryHeader>(imagerySchema);
export interface TerrainAssets { slope?: SlopeGrid; imagery?: ImageryHeader; notices: string[] }
// Unbounded is fine: one slope grid and one small header per shipped region (three today).
const slopes = new Map<string, Promise<SlopeGrid>>();
const imageryHeaders = new Map<string, Promise<ImageryHeader>>();
/** Slope + imagery header for a tile. Each piece is cached and a failed one is not, so Retry refetches only what failed. */
export async function loadTerrainAssets(tile: SouthPoleTile, signal?: AbortSignal): Promise<TerrainAssets> {
  const notices: string[] = [];
  const [slope, imagery] = await Promise.all([
    untilAborted(cached(slopes, tile.id, async () => {
      // Shares the mission data's grid cache, so each region's grid is downloaded and parsed once.
      if (!isGridRegion(tile.id)) throw new Error('Slope data unavailable.');
      const grid = await loadGrid(tile.id);
      if (!grid.bytes) throw new Error('Slope data unavailable.');
      return decodeSlope(grid.header, grid.bytes.buffer as ArrayBuffer, tile.id);
    }), signal).catch(() => { notices.push('Slope data unavailable for this region.'); return undefined; }),
    untilAborted(cached(imageryHeaders, tile.id, async () => {
      const res = await fetch(`/data/imagery/${tile.id}.json`);
      if (!res.ok) throw new Error('ImageryHeader unavailable.');
      const header: unknown = await res.json();
      if (!validImagery(header) || header.region !== tile.id) throw new Error('Invalid imagery header.');
      return header;
    }), signal).catch(() => { notices.push('NAC imagery unavailable for this region.'); return undefined; }),
  ]);
  return { slope, imagery, notices };
}
