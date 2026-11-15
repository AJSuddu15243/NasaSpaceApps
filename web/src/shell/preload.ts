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
