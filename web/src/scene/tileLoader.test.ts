// Loader caches: one download per region, failures not cached, one caller's abort never rejects another.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const file = (p: string) => readFileSync(new URL(`../../public/data/${p}`, import.meta.url));
let fail = false;
const request = vi.fn(async (url: string) => fail ? new Response(null, { status: 503 }) : new Response(file(url.replace('/data/', ''))));
const load = async () => (await import('./tileLoader')).loadRegionTile;

beforeEach(() => { vi.resetModules(); request.mockClear(); fail = false; vi.stubGlobal('fetch', request); });
afterEach(() => vi.unstubAllGlobals());

describe('terrain tile cache', () => {
  it('dedupes concurrent loads and serves repeats from memory', async () => {
    const loadRegionTile = await load();
    const [a, b] = await Promise.all([loadRegionTile('haworth'), loadRegionTile('haworth')]);
    expect(a).toBe(b);
    expect(await loadRegionTile('haworth')).toBe(a);
    expect(request).toHaveBeenCalledTimes(2); // header + elevations, once each
  });

  it('does not cache a failed load, so a retry refetches', async () => {
    const loadRegionTile = await load();
    fail = true;
    await expect(loadRegionTile('haworth')).rejects.toThrow('Terrain catalogue could not load.');
    fail = false;
    expect((await loadRegionTile('haworth'))?.id).toBe('haworth');
    expect(request).toHaveBeenCalledTimes(3);
  });

  it('lets one caller abort without rejecting another', async () => {
    const loadRegionTile = await load();
    const controller = new AbortController();
    const aborted = loadRegionTile('haworth', controller.signal);
    const other = loadRegionTile('haworth');
    controller.abort();
    await expect(aborted).rejects.toThrow();
    expect((await other)?.id).toBe('haworth');
    expect(request).toHaveBeenCalledTimes(2);
  });
});
