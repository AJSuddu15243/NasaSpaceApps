import type { SiteMask } from '../contracts/site-mask.ts';
import type { EphemHeader } from '../contracts/ephem.ts';
import type { GridHeader } from '../contracts/grid.ts';
import type { Area, Metrics, Params, Weights } from '../contracts/engine-api.ts';
import { mockSiteMetrics } from './mock.ts';

export interface EngineAdapter {
  site_metrics: (mask: SiteMask, ephem: EphemHeader, t_start: string, hours: number, params: Params) => Metrics;
  grid_scores: (grid: GridHeader, ephem: EphemHeader, t_start: string, hours: number, weights: Weights) => Float32Array;
  top_areas: (scores: Float32Array, window_cells: number, n: number) => Area[];
  output_hash: (input: unknown) => string;
}

// shortcut: static results and empty grid/area output, replace with typed WASM calls after ENG-4/ENG-7 land.
export const engine: EngineAdapter = {
  site_metrics: () => mockSiteMetrics(),
  grid_scores: grid => new Float32Array(grid.nx * grid.ny),
  top_areas: () => [],
  output_hash: () => 'MOCK_ONLY',
};
