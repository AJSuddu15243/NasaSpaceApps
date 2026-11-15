import { useEffect, useMemo, useState } from 'react';
import { loadDemoData, loadSites, type DemoData } from '../../shell/data';
import type { Site } from '../../contracts/sites';
import { GRID_REGIONS, loadGrid, type Grid, type GridRegion } from '../heatmap/grid';
import { BASE_M, EXCLUSION_M, ICE_REF_KM, gridFactors, scoreCells, topAreas, type PreviewArea } from '../heatmap/score';
import { loadBakedFracs } from '../heatmap/baked';
import type { ScoreSource, WindowFracs } from '../heatmap/layers';
import { GRID_PARAMS, scoresFromFracs, topAreas as engineTopAreas, windowCells, windowFactors } from '../../engine';
import { createPool, type EnginePool } from '../../engine/pool';
import { ref } from '../../engine/protocol';
import { scenarioInstant } from '../timeline/MissionTimeline';
import type { Scenario } from '../../shell/scenario';
import type { Weights } from '../../contracts/engine-api';

export type Status = 'loading' | 'ready' | 'error';
export interface MissionData {
  /** The catalogue alone, so the picker and markers survive an ephem or mask failure. */
  sites: { status: Status; data: Site[]; error?: string };
  demo: { status: Status; data?: DemoData; error?: string };
  grids: { status: Status; data: Partial<Record<GridRegion, Grid>>; error?: string };
  retry: () => void;
}

/** Loads the site catalogue (mock engine fixtures) and the real terrain/science grids in parallel. */
export function useMissionData(): MissionData {
  const [attempt, setAttempt] = useState(0);
  const [demo, setDemo] = useState<MissionData['demo']>({ status: 'loading' });
  const [sites, setSites] = useState<MissionData['sites']>({ status: 'loading', data: [] });
  const [grids, setGrids] = useState<MissionData['grids']>({ status: 'loading', data: {} });
  useEffect(() => {
    const controller = new AbortController();
    setDemo(value => value.status === 'ready' ? value : { status: 'loading' });
    setSites(value => value.status === 'ready' ? value : { status: 'loading', data: [] });
    const catalogue = loadSites(controller.signal);
    catalogue.then(({ sites }) => { if (!controller.signal.aborted) setSites({ status: 'ready', data: sites }); })
      .catch((error: unknown) => { if (!controller.signal.aborted) setSites({ status: 'error', data: [], error: error instanceof Error ? error.message : 'Catalogue could not load.' }); });
    loadDemoData(controller.signal, fetch, catalogue).then(data => { if (!controller.signal.aborted) setDemo({ status: 'ready', data }); })
      .catch((error: unknown) => { if (!controller.signal.aborted) setDemo({ status: 'error', error: error instanceof Error ? error.message : 'Catalogue could not load.' }); });
    setGrids(value => value.status === 'ready' ? value : { status: 'loading', data: {} });
    Promise.allSettled(GRID_REGIONS.map(async region => [region, await loadGrid(region)] as const))
      .then(entries => {
        if (controller.signal.aborted) return;
        const loaded = entries.flatMap(entry => entry.status === 'fulfilled' ? [entry.value] : []);
        const missing = entries.flatMap((entry, i) => entry.status === 'rejected' ? [GRID_REGIONS[i]] : []);
        setGrids({ status: missing.length ? 'error' : 'ready', data: Object.fromEntries(loaded), error: missing.length ? missing.join(', ') : undefined });
      })
      .catch((error: unknown) => { if (!controller.signal.aborted) setGrids({ status: 'error', data: {}, error: error instanceof Error ? error.message : 'Terrain grids could not load.' }); });
    return () => controller.abort();
  }, [attempt]);
  return { sites, demo, grids, retry: () => setAttempt(n => n + 1) };
}

type Factors = ReturnType<typeof gridFactors>;
const ENGINE_KEYS = ['sun', 'earth', 'slope', 'crater', 'rock', 'thermal'] as const;
export const ZERO_WEIGHTS = 'Every engine weight is 0: give at least one factor a weight to rank areas.';
/** `window` = engine grid_fracs columns for the arrival window (absent on the preview). `computing` = the preview is showing
 * while the engine request for this window is still in flight (false once it lands or failed). */
export interface RegionResult { grid: Grid; scores: Float32Array; areas: PreviewArea[]; factors: Factors; source: ScoreSource; window?: WindowFracs; computing?: boolean; error?: string }
type EngineSource = Exclude<ScoreSource, 'preview'>;
type EngineFracs = { key: string; fracs: Float32Array; source: EngineSource } | { key: string; failed: true };

let pool: Promise<EnginePool> | undefined;
/** One worker pool for the app; a failed start is forgotten so the next window retries. */
function enginePool(): Promise<EnginePool> {
  pool ??= createPool();
  pool.catch(() => { pool = undefined; });
  return pool;
}

const sent = new WeakMap<EnginePool, Map<string, unknown>>();
/** Caches `value` in every worker once per pool (not per call) and returns the ref the call args use. */
function cached(p: EnginePool, key: string, value: unknown) {
  const m = sent.get(p) ?? new Map<string, unknown>(); sent.set(p, m);
  if (m.get(key) !== value) { p.set(key, value); m.set(key, value); }
  return ref(key);
}

/** grid_fracs for one region's window: baked when that start was baked, else live on the worker pool. Null when the
 * window is no longer wanted, a newer request superseded it, or there is no ephem table. */
export async function regionFracs(region: GridRegion, grid: Grid, start: string, hours: number, table: DemoData['table'] | undefined, survivalK: number,
  wanted: () => boolean = () => true, getPool: () => Promise<EnginePool> = enginePool, request: typeof fetch = fetch): Promise<{ fracs: Float32Array; source: EngineSource } | null> {
  // cold_frac depends on the survival temperature; loadBakedFracs returns null unless it matches the bake (233 K).
  const params = { ...GRID_PARAMS, survival_temp_k: survivalK };
  const baked = await loadBakedFracs(region, start, hours, grid.header.nx * grid.header.ny, params, request).catch(() => null);
  if (baked) return { fracs: baked, source: 'baked' };
  if (!table || !grid.bytes || !wanted()) return null;
  // shortcut: ~0.65 s per region per 336 h in a worker, linear in hours; cap or chunk long windows if 8760 h runs get used.
  const t_start_h = (Date.parse(start) - Date.parse(table.header.t0_iso)) / 3_600_000;
  const p = await getPool();
  const fracs = await p.latest<Float32Array>(`fracs:${region}`, 'grid_fracs', [cached(p, `grid:${region}`, grid.bytes), grid.header, cached(p, 'ephem', table.rows), t_start_h, hours, params]);
  return fracs && { fracs, source: 'live' };
}

/** Engine grid_fracs → the RegionResult shape the UI already draws (scores, top-3 areas as PreviewArea, factor layers).
 * Throws when the main-thread engine cannot score (caller falls back to the preview). */
export function engineResult(grid: Grid, preview: Factors, fracs: Float32Array, weights: Weights, slopeLimit: number, source: EngineSource): RegionResult {
  const h = grid.header; const bytes = grid.bytes;
  if (!bytes) throw new Error('Grid has no raw bytes for the engine.');
  const params = { ...GRID_PARAMS, slope_limit_deg: slopeLimit };
  // The ice-access weight is display-only (scenario.ice): only the six engine weights reach the WASM.
  const w: Weights = { sun: weights.sun, earth: weights.earth, slope: weights.slope, crater: weights.crater, rock: weights.rock, thermal: weights.thermal };
  const scores = scoresFromFracs(bytes, h, fracs, w, params);
  const k = windowCells(BASE_M, h.cell_m);
  const nan = (v: number | null) => v ?? NaN;
  const areas = engineTopAreas(scores, h, k, EXCLUSION_M, 3).map((a): PreviewArea => {
    const col = Math.round((a.x_m - h.x0) / h.cell_m); const row = Math.round((a.y_m - h.y0) / h.cell_m); const index = row * h.nx + col;
    const f = windowFactors(bytes, h, fracs, params, k, a.x_m, a.y_m);
    const iceKm = preview.ice_km[index];
    return { index, col, row, x_m: a.x_m, y_m: a.y_m, lat: a.lat, lon: a.lon, score: a.score, radius_m: a.radius_m, iceKm,
      factors: { sun: nan(f.sun), earth: nan(f.earth), slope: nan(f.slope), crater: nan(f.crater), rock: nan(f.rock), thermal: nan(f.thermal), ice: 1 - Math.min(1, Math.max(0, iceKm / ICE_REF_KM)) } };
  });
  const column = (c: number) => { const out = new Float32Array(fracs.length / 4); for (let i = 0; i < out.length; i++) out[i] = fracs[i * 4 + c]; return out; };
  const window: WindowFracs = { sun_frac: column(0), earth_frac: column(1), cold_frac: column(2), dark_h: column(3) };
  return { grid, scores, areas, source, window, computing: false, factors: { ...preview, sun_frac: window.sun_frac, earth_frac: window.earth_frac, cold_frac: window.cold_frac } };
}

/** Suitability per region for the arrival window [date + delay, + hours). Engine scores come from baked grid_fracs when
 * that start was baked, else from grid_fracs on the worker pool; the JS preview shows until they arrive (source says which). */
export function useRegionResults(grids: Partial<Record<GridRegion, Grid>>, scenario: Pick<Scenario, 'weights' | 'ice' | 'slopeLimit' | 'date' | 'hours' | 'delay' | 'survivalK'>, table?: DemoData['table']) {
  const { ice, slopeLimit, hours, survivalK } = scenario;
  // Keyed on the values: the store hands out a new weights object on every scenario change (playhead, heat layer).
  const weightKey = ENGINE_KEYS.map(k => scenario.weights[k]).join(',');
  const weights = useMemo((): Weights => { const [sun, earth, slope, crater, rock, thermal] = weightKey.split(',').map(Number); return { sun, earth, slope, crater, rock, thermal }; }, [weightKey]);
  const start = scenarioInstant({ date: scenario.date, delay: scenario.delay });
  const key = `${start}|${hours}|${survivalK}`;
  const factors = useMemo(() => Object.fromEntries(Object.entries(grids).map(([region, grid]) => [region, gridFactors(grid!)])) as Partial<Record<GridRegion, Factors>>, [grids]);
  const [engine, setEngine] = useState<Partial<Record<GridRegion, EngineFracs>>>({});
  useEffect(() => {
    let current = true;
    for (const region of GRID_REGIONS) {
      const grid = grids[region];
      if (!grid?.bytes) continue;
      // A table-less failure for this window is stale once the table is here: drop it so the live run reads "computing".
      if (table) setEngine(value => { const e = value[region]; if (!e || e.key !== key || !('failed' in e)) return value; const next = { ...value }; delete next[region]; return next; });
      regionFracs(region, grid, start, hours, table, survivalK, () => current)
        // No ephem table (still loading or failed) and no baked file → preview, not "computing" forever; a later table re-runs this.
        .then(r => { if (current && (r || !table)) setEngine(value => ({ ...value, [region]: r ? { key, ...r } : { key, failed: true } })); })
        .catch((error: unknown) => { console.warn(`engine heatmap for ${region} unavailable; showing the preview`, error); if (current) setEngine(value => ({ ...value, [region]: { key, failed: true } })); });
    }
    return () => { current = false; };
  }, [grids, table, start, hours, survivalK, key]);
  return useMemo(() => {
    const out: Partial<Record<GridRegion, RegionResult>> = {};
    for (const region of GRID_REGIONS) {
      const grid = grids[region]; const f = factors[region];
      if (!grid || !f) continue;
      // The engine rejects an all-zero weight sum; ice alone is display-only, so there is nothing to rank.
      if (ENGINE_KEYS.every(k => weights[k] === 0)) { out[region] = { grid, scores: new Float32Array(grid.header.nx * grid.header.ny).fill(NaN), factors: f, areas: [], source: 'preview', computing: false, error: ZERO_WEIGHTS }; continue; }
      const e = engine[region];
      if (e?.key === key && 'fracs' in e) {
        try { out[region] = engineResult(grid, f, e.fracs, weights, slopeLimit, e.source); continue; }
        catch (error) { console.warn(`engine scoring failed for ${region}; showing the preview`, error); }
      }
      const computing = !!grid.bytes && e?.key !== key;
      try {
        // Preview on long-term averages: thermal stays 0 because there is no cold_frac layer without the engine.
        const scores = scoreCells(f, { ...weights, thermal: 0, ice }, slopeLimit);
        out[region] = { grid, scores, factors: f, areas: topAreas(grid, scores, f, slopeLimit, 3), source: 'preview', computing };
      } catch (error) {
        out[region] = { grid, scores: new Float32Array(grid.header.nx * grid.header.ny).fill(NaN), factors: f, areas: [], source: 'preview', computing, error: error instanceof Error ? error.message : 'Scoring failed.' };
      }
    }
    return out;
  }, [grids, factors, engine, key, weights, ice, slopeLimit]);
}
