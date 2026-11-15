let navigatorModules: Promise<unknown> | undefined;

/** Warm the same modules used by the route and globe without mounting another scene. */
export function preloadNavigator(): Promise<unknown> {
  return navigatorModules ??= Promise.all([
    import('./Navigator'),
    import('../features/globe/MoonGlobeView'),
  ]).catch(error => {
    navigatorModules = undefined;
    throw error;
  });
}

let terrainWarm = false;
/** Once, at idle: warm the lazy 3D chunks (same modules as the lazy() views) and the default region's terrain into
 * the loader caches, so opening 3D or the heatmap does not wait on downloads. Best effort: views still load on demand. */
export function preloadTerrain(region = 'connecting-ridge') {
  if (terrainWarm) return;
  terrainWarm = true;
  const warm = () => void Promise.all([
    import('../features/heatmap/StrataView'), import('../scene/LunarScene'), import('../scene/SceneViewport'),
    Promise.all([import('../scene/tileLoader'), import('../scene/terrainAssets')])
      .then(async ([tiles, assets]) => { const tile = await tiles.loadRegionTile(region); if (tile) await assets.loadTerrainAssets(tile); }),
  ]).catch(() => { /* each view reports its own load errors */ });
  if (typeof requestIdleCallback === 'function') requestIdleCallback(warm, { timeout: 5000 }); else setTimeout(warm, 1500);
}

/** A navigation may finish only after readiness and motion, and never after cancellation. */
export function awaitNavigatorEntry(
  prepare: Promise<unknown>, signal: AbortSignal, motionMs: number, timeoutMs = 15_000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let motionTimer: ReturnType<typeof setTimeout> | undefined;
    let finished = false;
    const finish = (error?: unknown) => {
      if (finished) return;
      finished = true;
      clearTimeout(motionTimer);
      clearTimeout(deadline);
      signal.removeEventListener('abort', abort);
      if (error) reject(error); else resolve();
    };
    const abort = () => finish(new DOMException('Navigation cancelled', 'AbortError'));
    signal.addEventListener('abort', abort, { once: true });
    // Observe readiness even when already aborted, so a rejected import is always handled.
    const motion = new Promise<void>(done => { motionTimer = setTimeout(done, motionMs); });
    void Promise.all([prepare, motion]).then(() => finish(), finish);
    const deadline = setTimeout(() => finish(new Error('The navigator is taking longer than expected. Try again.')), timeoutMs);
    if (signal.aborted) abort();
  });
}
