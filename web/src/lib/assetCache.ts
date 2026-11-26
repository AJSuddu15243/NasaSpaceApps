declare const __ASSET_HASHES__: Record<string, string>;
declare const __ASSET_REVISION__: string;

const PREFIX = 'lunala-public-assets-';

/** Only build-pinned public files enter this cache. Never cache API calls or scenario URLs. */
export function createAssetFetcher(hashes: Record<string, string>, revision: string,
  request: typeof fetch = fetch, storage: CacheStorage | undefined = globalThis.caches): typeof fetch {
  const name = PREFIX + revision;
  let opened: Promise<Cache | undefined> | undefined;
  const open = () => opened ??= (async () => {
    try {
      const cache = await storage?.open(name);
      // Keep this build only. Failures/quota/private browsing fall back to normal downloads.
      for (const key of await storage?.keys() ?? []) if (key.startsWith(PREFIX) && key !== name) await storage?.delete(key);
      return cache;
    } catch { return undefined; }
  })();
  const valid = async (response: Response, hash: string) => {
    const bytes = await response.clone().arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('') === hash;
  };
  return async (input, init) => {
    const path = typeof input === 'string' ? input : '';
    const hash = hashes[path];
    if (!hash || !/^\/(data|textures)\//.test(path) || (init?.method && init.method !== 'GET')
      || init?.cache === 'no-store' || !globalThis.crypto?.subtle) return request(input, init);
    const signal = init?.signal;
    signal?.throwIfAborted();
    const cache = await open();
    let hit: Response | undefined;
    try { hit = await cache?.match(path); } catch { /* Storage is optional. */ }
    signal?.throwIfAborted();
    if (hit) {
      if (hit.ok && await valid(hit, hash)) { signal?.throwIfAborted(); return hit; }
      try { await cache?.delete(path); } catch { /* A corrupt entry must never be used. */ }
    }
    const response = await request(input, init);
    if (!response.ok) return response;
    // Also catches an old deployment response or SPA HTML in place of a binary.
    if (!await valid(response, hash)) throw new Error('Science assets changed while loading. Reload to get the current version.');
    signal?.throwIfAborted();
    try { await cache?.put(path, response.clone()); } catch { /* Quota does not prevent learning. */ }
    return response;
  };
}

// Development keeps live files live; production revisions are generated from actual file bytes by Vite.
export const fetchAsset: typeof fetch = typeof __ASSET_HASHES__ === 'undefined'
  ? (...args) => fetch(...args)
  : createAssetFetcher(__ASSET_HASHES__, __ASSET_REVISION__);
