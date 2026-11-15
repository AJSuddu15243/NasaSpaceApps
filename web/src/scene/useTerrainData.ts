import { useEffect, useState } from 'react';
import { loadSiteTile } from './tileLoader';
import { loadTerrainAssets, type TerrainAssets } from './terrainAssets';
import type { SouthPoleTile } from './types';
export function useTerrainData(site?: { id: string; lat: number; lon: number }, retryKey = 0) {
  const [state, setState] = useState<{ id: string; ready: boolean; tile?: SouthPoleTile; assets?: TerrainAssets; error?: string }>({ id: '', ready: false });
  useEffect(() => {
    if (!site) return;
    const controller = new AbortController();
    setState({ id: site.id, ready: false });
    const load = async () => {
      const tile = site.id.startsWith('demo-') ? null : await loadSiteTile(site.lat, site.lon, controller.signal);
      const assets = tile ? await loadTerrainAssets(tile, controller.signal) : undefined;
      if (!controller.signal.aborted) setState({ id: site.id, ready: true, tile: tile ?? undefined, assets });
    };
    void load().catch((error: unknown) => {
      if (!controller.signal.aborted) setState({ id: site.id, ready: true, error: error instanceof Error ? error.message : 'Terrain failed to load.' });
    });
    return () => controller.abort();
  }, [site?.id, site?.lat, site?.lon, retryKey]);
  return state.id === site?.id ? state : { id: '', ready: false, tile: undefined, assets: undefined, error: undefined };
}
