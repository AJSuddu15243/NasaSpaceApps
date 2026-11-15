// Baked engine grid_fracs (plan step 8): written by scripts/bake.ts, read by useRegionResults.
// No runtime imports: node runs scripts/bake.ts (type stripping) and imports this file directly.
//
// One file per region and start instant, /data/baked/{region}_{YYYY-MM-DD}.bin, planar (n = nx * ny cells):
//   sun_frac u8[n] | earth_frac u8[n] | cold_frac u8[n] | longest_dark_h u16le[n]
// Fractions: q = round(v * 254), v = q / 254 (0.4 % steps); q = 255 means NaN (cell without terrain data).
// longest_dark_h: whole hours (exact at step_hours 1); 65535 means NaN.

export const BAKED_FORMAT = 'baked-fracs/1';
export const FRAC_NAN = 255;
export const HOURS_NAN = 65535;
const FRAC_SCALE = 254;

export interface BakedIndex {
  format: typeof BAKED_FORMAT;
  /** sha256 (hex) of web/src/engine/pkg/lunar_engine_bg.wasm that produced the files. */
  wasm_sha256: string;
  quantisation: string;
  /** grid_fracs params; slope_limit_deg does not change fracs, only scores. */
  params: { battery_h: number; survival_temp_k: number; antenna_margin_deg: number; step_hours: number };
  hours: number;
  regions: string[];
  /** ISO start instants (UTC). */
  starts: string[];
  /** File name → engine output_hash of its stored bytes. */
  files: Record<string, string>;
  /** Daily site_metrics table, if it was baked. */
  site_daily?: { file: string; hash: string; first: string; days: number; hours: number; params: Record<string, number> };
}

export const bakedFile = (region: string, startIso: string) => `${region}_${startIso.slice(0, 10)}.bin`;

/** FRACS_PER_CELL floats per cell (engine layout) → planar bytes. */
export function encodeFracs(fracs: Float32Array): Uint8Array {
  if (fracs.length % 4) throw new Error('fracs length is not a multiple of 4');
  const n = fracs.length / 4;
  const out = new Uint8Array(n * 5);
  const view = new DataView(out.buffer);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 3; k++) {
      const v = fracs[i * 4 + k];
      if (!Number.isNaN(v) && !(v >= 0 && v <= 1)) throw new Error(`fraction out of range at cell ${i}: ${v}`);
      out[k * n + i] = Number.isNaN(v) ? FRAC_NAN : Math.round(v * FRAC_SCALE);
    }
    const h = fracs[i * 4 + 3];
    if (!Number.isNaN(h) && !(h >= 0 && h < HOURS_NAN && Number.isInteger(h))) throw new Error(`longest_dark_h not a whole hour at cell ${i}: ${h}`);
    view.setUint16(3 * n + i * 2, Number.isNaN(h) ? HOURS_NAN : h, true);
  }
  return out;
}

/** Planar bytes → FRACS_PER_CELL floats per cell, the shape scores_from_fracs takes. */
export function decodeFracs(bytes: Uint8Array, n: number): Float32Array {
  if (bytes.byteLength !== n * 5) throw new Error('Baked heatmap does not match the grid size.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const out = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 3; k++) {
      const q = bytes[k * n + i];
      out[i * 4 + k] = q === FRAC_NAN ? NaN : q / FRAC_SCALE;
    }
    const h = view.getUint16(3 * n + i * 2, true);
    out[i * 4 + 3] = h === HOURS_NAN ? NaN : h;
  }
  return out;
}

let index: Promise<BakedIndex | null> | undefined;
/** Baked fracs for (region, start, hours), or null when that window was not baked (caller runs the engine live). */
export async function loadBakedFracs(region: string, startIso: string, hours: number, n: number, params: BakedIndex['params'], request: typeof fetch = fetch): Promise<Float32Array | null> {
  index ??= request('/data/baked/index.json').then(r => r.ok ? r.json() as Promise<BakedIndex> : null).catch(() => null);
  const idx = await index;
  if (!idx) index = undefined; // a failed or missing index is retried on the next window, not cached for the session
  const start = new Date(startIso).toISOString();
  if (idx?.format !== BAKED_FORMAT || idx.hours !== hours || !idx.regions.includes(region) || !idx.starts.includes(start)) return null;
  if ((Object.keys(idx.params) as (keyof BakedIndex['params'])[]).some(k => idx.params[k] !== params[k])) return null;
  const response = await request(`/data/baked/${bakedFile(region, start)}`);
  if (!response.ok) return null;
  return decodeFracs(new Uint8Array(await response.arrayBuffer()), n);
}
