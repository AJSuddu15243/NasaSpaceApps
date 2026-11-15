import type { Grid, LayerName } from './grid';
import type { Weights } from '../../contracts/engine-api';

export type HeatLayer = 'score' | 'sun' | 'earth' | 'sun_lt' | 'earth_lt' | 'ice' | 'imagery' | 'elevation' | 'slope' | 'relief' | 'crater' | 'roughness' | 'favorability';
/** Anatomy stack, bottom → top: the ground first, then what it looks like, its shape, and what it means. */
export const STACK: HeatLayer[] = ['relief', 'imagery', 'elevation', 'slope', 'crater', 'roughness', 'ice', 'favorability', 'earth_lt', 'sun_lt', 'earth', 'sun', 'score'];
/** Every heat layer (URL state, validation). */
export const HEAT_LAYERS: HeatLayer[] = STACK;
/** Shape-of-the-ground layers that share one "Terrain" dock button. */
export const TERRAIN_LAYERS: HeatLayer[] = ['slope', 'elevation', 'relief'];
export type DockLayer = Exclude<HeatLayer, 'slope' | 'elevation' | 'relief'> | 'terrain';
/** Tie order for the weighted dock (same factor order as the priorities panel). */
const DOCK_BASE: DockLayer[] = ['sun', 'sun_lt', 'earth', 'earth_lt', 'terrain', 'crater', 'ice', 'favorability', 'roughness'];
/** Dock buttons: combined score first, then each factor by the user's weight (descending, stable on ties), unweighted photo last. */
export function dockLayers(weights: Weights, ice: number): DockLayer[] {
  const weight = (key: DockLayer) => key === 'sun' || key === 'sun_lt' ? weights.sun : key === 'earth' || key === 'earth_lt' ? weights.earth
    : key === 'terrain' ? weights.slope : key === 'crater' ? weights.crater : key === 'roughness' ? weights.rock : ice;
  return ['score', ...[...DOCK_BASE].sort((a, b) => weight(b) - weight(a)), 'imagery'];
}
/** Layers using the source imagery, elevation, or slope terrain shader; other layers use opaque scalar textures. */
export const SURFACE_LAYERS: HeatLayer[] = ['relief', 'imagery', 'elevation', 'slope'];

/** Data provenance shown on every layer; never implies more than the source supports. */
export type Status = 'real' | 'proxy' | 'preview';
export interface LayerSpec {
  key: HeatLayer;
  label: string;
  short: string;
  /** Grid layer read for this heatmap (score, sun and earth come from the engine window). */
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
const WINDOW = 'engine/src/score.rs grid_fracs · 64-bin LOLA horizon masks · JPL Horizons ephemeris';
const LOLA = 'LOLA 80 m DEM (PGDA product 90) → 160 m cells';

export const LAYERS: Record<HeatLayer, LayerSpec> = {
  score: { key: 'score', label: 'Landing suitability', short: 'Suitability', units: '0–1', status: 'preview', ramp: ['#614724', '#b68142', '#fff0cc'], format: v => v.toFixed(2), better: 'high',
    explain: 'Your priorities combined into one score per 160 m cell. Steeper than the slope limit = excluded (grey cells).',
    caveat: 'Preview computed in the browser with the engine\'s formula on long-term averages. The Rust engine\'s date-specific grid_scores will replace it.',
    citation: 'Formula: engine/src/score.rs · inputs below' },
  sun: { key: 'sun', label: 'Sunlight (solar power)', short: 'Sunlight', units: '% of window', status: 'real', ramp: ['#744314', '#d98a1c', '#ffe1a3'], format: pct, better: 'high',
    explain: 'How much of your arrival window the Sun is above the local terrain horizon. More sunlight means more solar power and shorter cold nights.',
    caveat: 'Rust/WASM engine for your arrival window (date + delay, window length). Move the timeline date or delay to recompute.',
    citation: WINDOW },
  earth: { key: 'earth', label: 'Earth visibility (radio contact)', short: 'Radio', units: '% of window', status: 'real', ramp: ['#24496a', '#2f7fd9', '#bfe0ff'], format: pct, better: 'high',
    explain: 'How much of your arrival window Earth is above the horizon, so a lander can talk directly to the Deep Space Network without a relay.',
    caveat: 'Rust/WASM engine for your arrival window. Line-of-sight only: no antenna link budget, no relay satellites.',
    citation: WINDOW },
  sun_lt: { key: 'sun_lt', label: 'Sunlight, long-term (18.6 yr)', short: 'Sun 18.6 yr', source: 'sun_avg', units: '% of time', status: 'real', ramp: ['#744314', '#d98a1c', '#ffe1a3'], format: pct, better: 'high',
    explain: 'How often the Sun is above the local terrain horizon, averaged over the 18.6-year lunar precession cycle.',
    caveat: 'Long-term (18.6 yr) average, not your launch date: it does not move with the timeline. The Sunlight layer is the window value.',
    citation: MAZARICO },
  earth_lt: { key: 'earth_lt', label: 'Earth visibility, long-term (18.6 yr)', short: 'Radio 18.6 yr', source: 'earth_avg', units: '% of time', status: 'real', ramp: ['#24496a', '#2f7fd9', '#bfe0ff'], format: pct, better: 'high',
    explain: 'How often Earth is above the horizon, averaged over the 18.6-year cycle; Earth bobs with libration.',
    caveat: 'Long-term (18.6 yr) average, not your launch date: it does not move with the timeline. The Radio layer is the window value.',
    citation: MAZARICO },
  ice: { key: 'ice', label: 'Permanent shadow (water-ice traps)', short: 'Ice traps', source: 'psr', units: '% of cell', status: 'real', ramp: ['#1c6670', '#1aa6b8', '#b8f6ff'], format: pct, better: 'neither',
    explain: 'Ground that never sees the Sun. Some permanently shadowed cold traps can preserve water ice. This layer measures shadow, not temperature or ice abundance.',
    caveat: 'Shadow is necessary, not proof: ice presence needs neutron/UV/radar data. This map alone cannot establish landing safety or resource accessibility.',
    citation: MAZARICO },
  favorability: { key: 'favorability', label: 'Ice favorability model', short: 'Ice model', source: 'ice_favorability', units: 'index', status: 'preview', ramp: ['#375c71', '#509bb9', '#e1f5ff'], format: v => v.toFixed(3), better: 'neither',
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
  crater: { key: 'crater', label: 'Crater depth', short: 'Craters', source: 'crater_depth_m', units: 'm', status: 'real', ramp: ['#59534b', '#948675', '#fff1db'], format: v => `${Math.round(v)} m`, better: 'low',
    explain: 'Local relief within 500 m after removing the regional tilt. Deep pits hide the horizon and trap cold.',
    caveat: 'Detrended relief, not individual crater rims.',
    citation: LOLA },
  roughness: { key: 'roughness', label: 'Roughness (rock proxy)', short: 'Roughness', source: 'roughness_deg', units: '°', status: 'proxy', ramp: ['#5a482d', '#a78b56', '#fff0cc'], format: v => `${v.toFixed(1)}°`, better: 'low',
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

/** A layer's spec for the region's score source: score uses scoreLayer; window layers say baked or live. */
export function layerSpec(key: HeatLayer, source: ScoreSource): LayerSpec {
  if (key === 'score') return scoreLayer(source);
  if ((key === 'sun' || key === 'earth') && source !== 'preview') return { ...LAYERS[key], caveat: `${LAYERS[key].caveat} ${source === 'baked' ? 'Precomputed with the shipped engine (0.4 % steps).' : 'Computed in your browser.'}` };
  return LAYERS[key];
}

/** Engine grid_fracs columns for the arrival window, one value per cell. */
export interface WindowFracs { sun_frac: Float32Array; earth_frac: Float32Array; cold_frac: Float32Array; dark_h: Float32Array }

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

/** Values drawn for a layer; sun/earth are undefined until the engine window fractions arrive. */
export function layerValues(grid: Grid, key: HeatLayer, score?: Float32Array, window?: WindowFracs): Float32Array | undefined {
  if (key === 'score') return score;
  if (key === 'sun') return window?.sun_frac;
  if (key === 'earth') return window?.earth_frac;
  const source = LAYERS[key].source;
  return source ? grid.layers[source] : undefined;
}

/** Rank of `value` among finite `values` as a 0–100 percentile (100 = highest). */
export function percentile(values: Float32Array, value: number): number {
  let below = 0; let n = 0;
  for (const v of values) { if (!Number.isFinite(v)) continue; n++; if (v < value) below++; }
  return n ? Math.round(below / n * 100) : 0;
}
