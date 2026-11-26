import { describe, expect, it, vi } from 'vitest';
import { createAssetFetcher } from './assetCache';

const path = '/data/grid/test.bin';
const bytes = 'verified terrain';
async function hash(text: string) {
  const result = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(result), n => n.toString(16).padStart(2, '0')).join('');
}
function storage() {
  const entries = new Map<string, Response>();
  const cache = { match: vi.fn(async (key: string) => entries.get(key)?.clone()),
    put: vi.fn(async (key: string, response: Response) => { entries.set(key, response.clone()); }),
    delete: vi.fn(async (key: string) => entries.delete(key)) };
  const store = { open: vi.fn(async () => cache), keys: vi.fn(async () => ['unrelated-app', 'lunala-public-assets-old']), delete: vi.fn(async () => true) };
  return { cache, store: store as unknown as CacheStorage, entries };
}

describe('public asset cache failure contracts', () => {
  it('reuses verified bytes after the loader is recreated, not just in memory', async () => {
    const { store } = storage(); const hashes = { [path]: await hash(bytes) };
    const network = vi.fn(async () => new Response(bytes));
    await (await createAssetFetcher(hashes, 'new', network, store)(path)).text();
    const offline = vi.fn(async () => { throw Error('offline'); });
    expect(await (await createAssetFetcher(hashes, 'new', offline, store)(path)).text()).toBe(bytes);
    expect(network).toHaveBeenCalledTimes(1); expect(offline).not.toHaveBeenCalled();
    expect(store.delete).toHaveBeenCalledWith('lunala-public-assets-old');
    expect(store.delete).not.toHaveBeenCalledWith('unrelated-app');
  });
  it('rejects stale deployment bytes and never makes them a successful cache entry', async () => {
    const { store, cache } = storage();
    const fetcher = createAssetFetcher({ [path]: await hash(bytes) }, 'new', vi.fn(async () => new Response('old terrain')), store);
    await expect(fetcher(path)).rejects.toThrow('changed while loading');
    expect(cache.put).not.toHaveBeenCalled();
  });
  it('evicts corrupt stored bytes and repairs them from the current network response', async () => {
    const { store, entries, cache } = storage(); entries.set(path, new Response('<html>SPA</html>'));
    const fetcher = createAssetFetcher({ [path]: await hash(bytes) }, 'new', vi.fn(async () => new Response(bytes)), store);
    expect(await (await fetcher(path)).text()).toBe(bytes); expect(cache.delete).toHaveBeenCalledWith(path);
  });
  it('repairs a stored error response even when its bytes happen to match', async () => {
    const { store, entries, cache } = storage(); entries.set(path, new Response(bytes, { status: 503 }));
    const fetcher = createAssetFetcher({ [path]: await hash(bytes) }, 'new', vi.fn(async () => new Response(bytes)), store);
    expect((await fetcher(path)).status).toBe(200); expect(cache.delete).toHaveBeenCalledWith(path);
  });
  it('excludes API traffic, unknown paths and non-GET requests even if names are supplied', async () => {
    const { store } = storage(); const network = vi.fn(async () => new Response(bytes));
    const fetcher = createAssetFetcher({ '/api/ask': await hash(bytes), [path]: await hash(bytes) }, 'new', network, store);
    await fetcher('/api/ask'); await fetcher('/data/not-pinned.bin'); await fetcher(path, { method: 'POST' });
    expect(network).toHaveBeenCalledTimes(3); expect(store.open).not.toHaveBeenCalled();
  });
  it('does not turn a storage denial or quota failure into a failed download', async () => {
    const { store, cache } = storage(); vi.mocked(cache.put).mockRejectedValue(Error('quota'));
    const hashes = { [path]: await hash(bytes) }; const network = vi.fn(async () => new Response(bytes));
    expect(await (await createAssetFetcher(hashes, 'new', network, store)(path)).text()).toBe(bytes);
    vi.mocked(store.open).mockRejectedValue(Error('private browsing'));
    expect(await (await createAssetFetcher(hashes, 'new', network, store)(path)).text()).toBe(bytes);
  });
  it('never stores an HTTP failure and allows a later retry', async () => {
    const { store, cache } = storage(); const network = vi.fn().mockResolvedValueOnce(new Response('missing', { status: 503 })).mockResolvedValue(new Response(bytes));
    const fetcher = createAssetFetcher({ [path]: await hash(bytes) }, 'new', network, store);
    expect((await fetcher(path)).status).toBe(503); expect(cache.put).not.toHaveBeenCalled();
    expect(await (await fetcher(path)).text()).toBe(bytes);
  });
  it('honors an aborted caller even when the requested file is already cached', async () => {
    const { store, entries } = storage(); entries.set(path, new Response(bytes));
    const network = vi.fn(async () => new Response(bytes)); const signal = AbortSignal.abort();
    await expect(createAssetFetcher({ [path]: await hash(bytes) }, 'new', network, store)(path, { signal })).rejects.toThrow();
    expect(network).not.toHaveBeenCalled();
  });
  // Gap: checking only rejected network responses misses valid-looking but incorrect JSON and browser corruption.
  it('does not reuse a valid-looking previous header when a new build pins different content', async () => {
    const { store, entries } = storage(); entries.set(path, new Response('{"region":"old"}'));
    const latest = '{"region":"new"}'; const network = vi.fn(async () => new Response(latest));
    expect(await (await createAssetFetcher({ [path]: await hash(latest) }, 'next', network, store)(path)).json()).toEqual({ region: 'new' });
  });
});
