// Bake engine grid_fracs for the demo windows (plan step 8) + a daily site_metrics table, with the shipped WASM.
// Usage (from web/): pnpm bake   → web/public/data/baked/. Re-run after every wasm rebuild (bake.test.ts guards it).
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as wasm from '../src/engine/pkg/lunar_engine.js';
import { BAKED_FORMAT, bakedFile, encodeFracs, type BakedIndex } from '../src/features/heatmap/baked.ts';

const web = new URL('..', import.meta.url);
const read = (p: string) => readFileSync(new URL(p, web));
const json = (p: string) => JSON.parse(read(p).toString('utf8'));
const wasmBytes = read('src/engine/pkg/lunar_engine_bg.wasm');
wasm.initSync({ module: wasmBytes });

const ephemHeader = json('public/data/ephem.json');
const ephemBin = read('public/data/ephem.bin');
const rows = new Float32Array(ephemBin.buffer.slice(ephemBin.byteOffset, ephemBin.byteOffset + ephemBin.byteLength));
const t0 = Date.parse(ephemHeader.t0_iso);
const hoursSinceT0 = (iso: string) => (Date.parse(iso) - t0) / 3_600_000;
const DAY = 86_400_000;

// Must equal GRID_PARAMS in src/engine/index.ts (useRegionResults ignores the bake otherwise).
const GRID = { battery_h: 0, survival_temp_k: 233, antenna_margin_deg: 2, step_hours: 1 };
const HOURS = 336;
const REGIONS = ['connecting-ridge', 'haworth', 'malapert-massif'];
const STARTS = Array.from({ length: 15 }, (_, d) => new Date(Date.parse('2027-01-15T00:00:00Z') + d * DAY).toISOString());
// Default site-card params (plan step 5): 233 K survival, 48 h battery.
const SITE = { battery_h: 48, survival_temp_k: 233, antenna_margin_deg: 2, slope_limit_deg: 10, step_hours: 1 };
const DAILY_FIRST = '2026-11-15T00:00:00.000Z';

const out = new URL('public/data/baked/', web);
mkdirSync(out, { recursive: true });
const files: Record<string, string> = {};
let ms = 0;
for (const region of REGIONS) {
  const header = json(`public/data/grid/${region}.json`);
  const grid = new Uint8Array(read(`public/data/grid/${region}.bin`));
  for (const start of STARTS) {
    const t = performance.now();
    const fracs = wasm.grid_fracs(grid, header, rows, hoursSinceT0(start), HOURS, { ...GRID, slope_limit_deg: 10 });
    ms += performance.now() - t;
    const bytes = encodeFracs(fracs);
    const name = bakedFile(region, start);
    writeFileSync(new URL(name, out), bytes);
    files[name] = wasm.output_hash(bytes);
  }
}
console.log(`grid_fracs: ${REGIONS.length * STARTS.length} windows of ${HOURS} h in ${(ms / 1000).toFixed(1)} s`);

// Columnar daily table: one array per Metrics field, values rounded to 1e-3 (null stays null).
const lastStart = t0 + (ephemHeader.n - 1 - HOURS) * 3_600_000;
const days = Math.floor((lastStart - Date.parse(DAILY_FIRST)) / DAY) + 1;
const sites: Record<string, Record<string, (number | null)[]>> = {};
const t = performance.now();
for (const id of REGIONS) {
  const m = json(`public/data/masks/${id}.json`);
  const geom = { lat_deg: m.lat, lon_deg: m.lon, elev_m: m.elev_m, slope_deg: m.slope_deg, aspect_deg: m.aspect_deg };
  const mask = Float32Array.from(m.mask_deg);
  const cols: Record<string, (number | null)[]> = {};
  for (let d = 0; d < days; d++) {
    const metrics = wasm.site_metrics(geom, mask, rows, hoursSinceT0(DAILY_FIRST) + d * 24, HOURS, SITE) as Record<string, number | null>;
    for (const [k, v] of Object.entries(metrics)) (cols[k] ??= []).push(v === null ? null : Math.round(v * 1000) / 1000);
  }
  sites[id] = cols;
}
const daily = JSON.stringify({ format: 'site-daily/1', first: DAILY_FIRST, step_days: 1, days, hours: HOURS, params: SITE, rounding: 1e-3, sites });
writeFileSync(new URL('site-daily.json', out), daily);
console.log(`site_metrics: ${days} days x ${REGIONS.length} sites in ${((performance.now() - t) / 1000).toFixed(1)} s, ${(daily.length / 1e6).toFixed(2)} MB`);

const index: BakedIndex = {
  format: BAKED_FORMAT,
  wasm_sha256: createHash('sha256').update(wasmBytes).digest('hex'),
  quantisation: 'planar u8 sun_frac | u8 earth_frac | u8 cold_frac | u16le longest_dark_h; fraction q = round(v*254), v = q/254, 255 = NaN; dark hours whole, 65535 = NaN; hashes = engine output_hash of the stored bytes',
  params: GRID, hours: HOURS, regions: REGIONS, starts: STARTS, files,
  site_daily: { file: 'site-daily.json', hash: wasm.output_hash(new TextEncoder().encode(daily)), first: DAILY_FIRST, days, hours: HOURS, params: SITE },
};
writeFileSync(new URL('index.json', out), JSON.stringify(index, null, 2) + '\n');
