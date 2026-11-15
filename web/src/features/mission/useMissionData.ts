import { useEffect, useMemo, useState } from 'react';
import { loadDemoData, type DemoData } from '../../shell/data';
import { GRID_REGIONS, loadGrid, type Grid, type GridRegion } from '../heatmap/grid';
import { gridFactors, scoreCells, topAreas, type PreviewArea } from '../heatmap/score';
import type { Scenario } from '../../shell/scenario';

export type Status = 'loading' | 'ready' | 'error';
export interface MissionData {
  demo: { status: Status; data?: DemoData; error?: string };
  grids: { status: Status; data: Partial<Record<GridRegion, Grid>>; error?: string };
  retry: () => void;
}

/** Loads the site catalogue (mock engine fixtures) and the real terrain/science grids in parallel. */
export function useMissionData(): MissionData {
  const [attempt, setAttempt] = useState(0);
  const [demo, setDemo] = useState<MissionData['demo']>({ status: 'loading' });
  const [grids, setGrids] = useState<MissionData['grids']>({ status: 'loading', data: {} });
  useEffect(() => {
    const controller = new AbortController();
    setDemo(value => value.status === 'ready' ? value : { status: 'loading' });
    loadDemoData(controller.signal).then(data => { if (!controller.signal.aborted) setDemo({ status: 'ready', data }); })
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
  return { demo, grids, retry: () => setAttempt(n => n + 1) };
}

export interface RegionResult { grid: Grid; scores: Float32Array; areas: PreviewArea[]; factors: ReturnType<typeof gridFactors>; error?: string }

/** Suitability preview per region for the current priorities; recomputed only when they change. */
export function useRegionResults(grids: Partial<Record<GridRegion, Grid>>, scenario: Pick<Scenario, 'weights' | 'ice' | 'slopeLimit'>) {
  const { weights, ice, slopeLimit } = scenario;
  const factors = useMemo(() => Object.fromEntries(Object.entries(grids).map(([region, grid]) => [region, gridFactors(grid!)])) as Partial<Record<GridRegion, ReturnType<typeof gridFactors>>>, [grids]);
  return useMemo(() => {
    const out: Partial<Record<GridRegion, RegionResult>> = {};
    for (const region of GRID_REGIONS) {
      const grid = grids[region]; const f = factors[region];
      if (!grid || !f) continue;
      try {
        // thermal stays 0: the engine's thermal model (ENG-5) has not shipped, so there is no cold_frac layer.
        const scores = scoreCells(f, { ...weights, thermal: 0, ice }, slopeLimit);
        out[region] = { grid, scores, factors: f, areas: topAreas(grid, scores, f, slopeLimit, 3) };
      } catch (error) {
        out[region] = { grid, scores: new Float32Array(grid.header.nx * grid.header.ny).fill(NaN), factors: f, areas: [], error: error instanceof Error ? error.message : 'Scoring failed.' };
      }
    }
    return out;
  }, [grids, factors, weights, ice, slopeLimit]);
}
