import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import common from '../../../contracts/schemas/common.schema.json';
import imagerySchema from '../../../contracts/schemas/imagery.schema.json';
import type { ImageryHeader } from '../contracts/imagery';
import type { SouthPoleTile } from './types';
import { decodeSlope, type SlopeGrid } from './heatmap/slope';
const ajv = new Ajv2020({ strict: false });
addFormats(ajv); ajv.addSchema(common);
const validImagery = ajv.compile<ImageryHeader>(imagerySchema);
export interface TerrainAssets { slope?: SlopeGrid; imagery?: ImageryHeader; notices: string[] }
export async function loadTerrainAssets(tile: SouthPoleTile, signal: AbortSignal): Promise<TerrainAssets> {
  const notices: string[] = [];
  const [slope, imagery] = await Promise.all([
    (async () => {
      const [header, binary] = await Promise.all([fetch(`/data/grid/${tile.id}.json`, { signal }), fetch(`/data/grid/${tile.id}.bin`, { signal })]);
      if (!header.ok || !binary.ok) throw new Error('Slope data unavailable.');
      return decodeSlope(await header.json(), await binary.arrayBuffer(), tile.id);
    })().catch(() => { notices.push('Slope data unavailable for this region.'); return undefined; }),
    (async () => {
      const res = await fetch(`/data/imagery/${tile.id}.json`, { signal });
      if (!res.ok) throw new Error('ImageryHeader unavailable.');
      const header: unknown = await res.json();
      if (!validImagery(header) || header.region !== tile.id) throw new Error('Invalid imagery header.');
      return header;
    })().catch(() => { notices.push('NAC imagery unavailable for this region.'); return undefined; }),
  ]);
  return { slope, imagery, notices };
}
