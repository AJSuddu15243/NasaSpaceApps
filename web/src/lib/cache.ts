/** Shared promise cache: concurrent callers get one load; a rejected load is evicted so a retry refetches.
 * `max` drops the oldest entry once exceeded. Cached values are shared, so callers must not mutate them. */
export function cached<T>(cache: Map<string, Promise<T>>, key: string, load: () => Promise<T>, max = Infinity): Promise<T> {
  let pending = cache.get(key);
  if (!pending) {
    const p = load();
    p.catch(() => { if (cache.get(key) === p) cache.delete(key); });
    cache.set(key, pending = p);
    if (cache.size > max) cache.delete(cache.keys().next().value!);
  }
  return pending;
}

/** `promise`, unless this caller's signal aborts first; the shared load keeps running for the other callers. */
export function untilAborted<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    if (signal.aborted) { abort(); return; }
    signal.addEventListener('abort', abort, { once: true });
    const done = () => signal.removeEventListener('abort', abort);
    promise.then(value => { done(); resolve(value); }, (error: unknown) => { done(); reject(error); });
  });
}
