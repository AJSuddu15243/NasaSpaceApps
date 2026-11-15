import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import common from '../../../contracts/schemas/common.schema.json';
import sites from '../../../contracts/schemas/sites.schema.json';
import mask from '../../../contracts/schemas/site-mask.schema.json';
import ephem from '../../../contracts/schemas/ephem.schema.json';
import engine from '../../../contracts/schemas/engine-api.schema.json';
import type { Sites } from '../contracts/sites';
import type { SiteMask } from '../contracts/site-mask';
import type { EphemHeader } from '../contracts/ephem';
import type { Metrics } from '../contracts/engine-api';
const ajv = new Ajv2020({ allErrors: true, strict: false, strictNumbers: true });
addFormats(ajv); ajv.addSchema(common); ajv.addSchema(engine);
const sitesCheck = ajv.compile<Sites>(sites);
const maskCheck = ajv.compile<SiteMask>(mask);
const ephemCheck = ajv.compile<EphemHeader>(ephem);
const metricsCheck = ajv.compile<Metrics>({ $ref: 'engine-api.schema.json#/$defs/metrics' });
export function parseSites(value: unknown): Sites {
  if (!sitesCheck(value) || value.length > 100 || new Set(value.map(site => site.id)).size !== value.length) throw new Error('The site catalogue is invalid.');
  return value;
}
export function parseMask(value: unknown, id: string): SiteMask {
  if (!maskCheck(value) || value.id !== id) throw new Error('A terrain mask is invalid or belongs to another site.');
  return value;
}
export function parseEphem(value: unknown, bytes: ArrayBuffer): { header: EphemHeader; rows: Float32Array } {
  if (!ephemCheck(value) || value.n > 43_824 /* 2026-2030 hourly */ || bytes.byteLength !== value.n * 24) throw new Error('The ephemeris table does not match its header.');
  const view = new DataView(bytes);
  const rows = new Float32Array(value.n * 6);
  for (let i = 0; i < rows.length; i++) {
    const n = view.getFloat32(i * 4, true);
    const col = i % 6;
    if (!Number.isFinite(n) || ((col === 0 || col === 3) && Math.abs(n) > 90) || ((col === 1 || col === 4) && (n < -180 || n >= 180)) || ((col === 2 || col === 5) && n <= 0)) throw new Error('The ephemeris table contains invalid angles or distances.');
    rows[i] = n;
  }
  return { header: value, rows };
}
export function parseMetrics(value: unknown, hours: number): Metrics {
  if (!metricsCheck(value)) throw new Error('The engine returned invalid metrics.');
  if (value.t_min_k > value.t_max_k || value.mean_sun_el_deg > value.max_sun_el_deg) throw new Error('The engine returned inconsistent ranges.');
  for (const n of [value.longest_dark_h, value.longest_blackout_h, value.h_below_survival, value.h_to_first_sunset, value.h_to_first_earthset]) {
    if (n !== null && n > hours) throw new Error('An engine duration exceeds the mission window.');
  }
  return value;
}
