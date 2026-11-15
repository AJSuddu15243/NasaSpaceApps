import type { Grid, LayerName } from './grid';

export type HeatLayer = 'score' | 'sun' | 'earth' | 'ice' | 'imagery' | 'elevation' | 'slope' | 'relief' | 'crater' | 'roughness' | 'favorability';
/** Dock order (most mission-relevant first). */
export const HEAT_LAYERS: HeatLayer[] = ['score', 'sun', 'earth', 'ice', 'favorability', 'imagery', 'elevation', 'slope', 'relief', 'crater', 'roughness'];
/** Anatomy stack, bottom → top: the ground first, then what it looks like, its shape, and what it means. */
export const STACK: HeatLayer[] = ['relief', 'imagery', 'elevation', 'slope', 'crater', 'roughness', 'ice', 'favorability', 'earth', 'sun', 'score'];
/** Layers drawn as draped terrain surfaces (PR #118 shader); the rest are dot matrices. */
export const SURFACE_LAYERS: HeatLayer[] = ['relief', 'imagery', 'elevation', 'slope'];

/** Data provenance shown on every layer; never implies more than the source supports. */
export type Status = 'real' | 'proxy' | 'preview';
export interface LayerSpec {
  key: HeatLayer;
  label: string;
  short: string;
  /** Grid layer read for this heatmap (score is computed). */
  source?: LayerName;
  units: string;
  status: Status;
  /** Sequential single-hue ramp, dim → bright on the dark surface (dataviz: one hue, low→high). */
  ramp: [string, string, string];
  /** Plain-language meaning for Explorer mode. */
  explain: string;
  /** What the data cannot tell you. */
  caveat: string;
  citation: string;
  format: (v: number) => string;
  /** Higher is better for landing? Used only for wording, never for scoring. */
  better: 'high' | 'low' | 'neither';
}

const pct = (v: number) => `${Math.round(v * 100)}%`;
const MAZARICO = 'Mazarico et al. 2011 · LOLA · PGDA product 69';
const LOLA = 'LOLA 80 m DEM (PGDA product 90) → 160 m cells';

export const LAYERS: Record<HeatLayer, LayerSpec> = {
  score: { key: 'score', label: 'Landing suitability', short: 'Suitability', units: '0–1', status: 'preview', ramp: ['#292115', '#b68142', '#fff0cc'], format: v => v.toFixed(2), better: 'high',
    explain: 'Your priorities combined into one score per 160 m cell. Steeper than the slope limit = excluded (dim dots).',
    caveat: 'Preview computed in the browser with the engine\'s formula on long-term averages. The Rust engine\'s date-specific grid_scores will replace it.',
    citation: 'Formula: engine/src/score.rs · inputs below' },
  sun: { key: 'sun', label: 'Sunlight (solar power)', short: 'Sunlight', source: 'sun_avg', units: '% of time', status: 'real', ramp: ['#2a1a05', '#d98a1c', '#ffe1a3'], format: pct, better: 'high',
    explain: 'How often the Sun is above the local terrain horizon. More sunlight means more solar power and shorter cold nights.',
    caveat: 'Average over the 18.6-year lunar cycle, not your launch date. Move the timeline for date-specific Sun position.',
    citation: MAZARICO },
  earth: { key: 'earth', label: 'Earth visibility (radio contact)', short: 'Radio', source: 'earth_avg', units: '% of time', status: 'real', ramp: ['#071a2e', '#2f7fd9', '#bfe0ff'], format: pct, better: 'high',
    explain: 'How often Earth is above the horizon, so a lander can talk directly to the Deep Space Network without a relay.',
    caveat: 'Line-of-sight only: no antenna link budget, no relay satellites. Long-term average; Earth bobs with libration.',
    citation: MAZARICO },
  ice: { key: 'ice', label: 'Permanent shadow (water-ice traps)', short: 'Ice traps', source: 'psr', units: '% of cell', status: 'real', ramp: ['#04161c', '#1aa6b8', '#b8f6ff'], format: pct, better: 'neither',
    explain: 'Ground that never sees the Sun. Some permanently shadowed cold traps can preserve water ice. This layer measures shadow, not temperature or ice abundance.',
    caveat: 'Shadow is necessary, not proof: ice presence needs neutron/UV/radar data. This map alone cannot establish landing safety or resource accessibility.',
    citation: MAZARICO },
  favorability: { key: 'favorability', label: 'Ice favorability model', short: 'Ice model', source: 'ice_favorability', units: 'index', status: 'preview', ramp: ['#101d27', '#509bb9', '#e1f5ff'], format: v => v.toFixed(3), better: 'neither',
    explain: 'A geologic model of where conditions favor ice deposits. Higher index means more favorable in this model.',
    caveat: 'Native resolution 591 m, displayed with nearest-neighbour sampling. Not measured ice presence, concentration, or a date-specific prediction.',
    citation: 'Cannon & Britt 2020 · USGS Ice Favorability Index south pole' },
  relief: { key: 'relief', label: 'Terrain relief (the ground)', short: 'Relief', units: 'm', status: 'real', ramp: ['#1a1d1f', '#6b7075', '#d6d8da'], format: v => `${Math.round(v).toLocaleString()} m`, better: 'neither',
    explain: 'The bare shape of the ground at 80 m resolution, lit by the real Sun at your playhead time. The cut-away side shows the terrain profile.',
    caveat: 'The cut-away below the surface is illustrative depth, not measured subsurface layers.',
    citation: 'LOLA 80 m DEM (PGDA product 90) · lighting from JPL Horizons ephemeris' },
  imagery: { key: 'imagery', label: 'Orbital photo (LROC NAC)', short: 'NAC photo', units: '', status: 'real', ramp: ['#141414', '#7a7a7a', '#f0f0f0'], format: v => String(v), better: 'neither',
    explain: 'A real photo mosaic from the Lunar Reconnaissance Orbiter Narrow Angle Camera, draped on the terrain.',
    caveat: 'Shadows in the photo are from the dates the images were taken, not your playhead time.',
    citation: 'LRO LROC NAC south-pole mosaic (NASA/GSFC/ASU) via Moon Trek' },
  elevation: { key: 'elevation', label: 'Topography', short: 'Elevation', source: 'elev_m', units: 'm', status: 'real', ramp: ['#00204d', '#99946b', '#fde737'], format: v => `${Math.round(v).toLocaleString()} m`, better: 'neither',
    explain: 'Height above the 1,737.4 km reference sphere. High ridges see the Sun and Earth longer; low craters stay dark.',
    caveat: 'Terrain heights are sampled at 80 m; cell probes are 160 m averages. Individual boulders are far smaller.',
    citation: LOLA },
  slope: { key: 'slope', label: 'Slope (landing safety)', short: 'Slope', source: 'slope_deg', units: '°', status: 'real', ramp: ['#00204d', '#99946b', '#fde737'], format: v => `${v.toFixed(1)}°`, better: 'low',
    explain: 'How steep the ground is. Landers tip over on steep ground, so cells over the slope limit are ruled out.',
    caveat: 'Worst 80 m slope inside each 160 m cell (conservative).',
    citation: LOLA },
  crater: { key: 'crater', label: 'Crater depth', short: 'Craters', source: 'crater_depth_m', units: 'm', status: 'real', ramp: ['#171612', '#948675', '#fff1db'], format: v => `${Math.round(v)} m`, better: 'low',
    explain: 'Local relief within 500 m after removing the regional tilt. Deep pits hide the horizon and trap cold.',
    caveat: 'Detrended relief, not individual crater rims.',
    citation: LOLA },
  roughness: { key: 'roughness', label: 'Roughness (rock proxy)', short: 'Roughness', source: 'roughness_deg', units: '°', status: 'proxy', ramp: ['#211a10', '#a78b56', '#fff0cc'], format: v => `${v.toFixed(1)}°`, better: 'low',
    explain: 'How bumpy the ground is. We use it as a stand-in for rocks because no rock map covers 85–90° S.',
    caveat: 'Proxy, not measured rocks.',
    citation: LOLA },
};

/** Where a region's score came from: baked or live Rust/WASM grid_fracs for the window, or the JS preview. */
export type ScoreSource = 'baked' | 'live' | 'preview';
/** The score layer spec for a source: engine scores are `real`; the preview keeps its preview caveat. */
export function scoreLayer(source: ScoreSource): LayerSpec {
  if (source === 'preview') return LAYERS.score;
  return { ...LAYERS.score, status: 'real',
    caveat: `Rust/WASM engine scores for your arrival window (${source === 'baked' ? 'precomputed with the shipped engine, fractions stored at 0.4 % steps' : 'computed in your browser'}). The ice-access weight is display-only and not part of this score.`,
    citation: 'engine/src/score.rs grid_fracs + scores_from_fracs · inputs below' };
}

export function isHeatLayer(value: unknown): value is HeatLayer {
  return typeof value === 'string' && (HEAT_LAYERS as string[]).includes(value);
}

/** Robust display range (2nd–98th percentile) so one outlier does not wash out the map. */
export function displayRange(values: Float32Array): [number, number] {
  const finite = Array.from(values).filter(Number.isFinite).sort((a, b) => a - b);
  if (!finite.length) return [0, 1];
  const at = (q: number) => finite[Math.min(finite.length - 1, Math.max(0, Math.round(q * (finite.length - 1))))];
  const lo = at(0.02); const hi = at(0.98);
  return hi > lo ? [lo, hi] : [finite[0], finite[finite.length - 1] + 1e-6];
}

export function layerValues(grid: Grid, key: HeatLayer, score?: Float32Array): Float32Array | undefined {
  if (key === 'score') return score;
  const source = LAYERS[key].source;
  return source ? grid.layers[source] : undefined;
}

/** Rank of `value` among finite `values` as a 0–100 percentile (100 = highest). */
export function percentile(values: Float32Array, value: number): number {
  let below = 0; let n = 0;
  for (const v of values) { if (!Number.isFinite(v)) continue; n++; if (v < value) below++; }
  return n ? Math.round(below / n * 100) : 0;
}
