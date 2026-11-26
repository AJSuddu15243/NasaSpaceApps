import { fetchAsset } from '../lib/assetCache';
import { parseSites, parseMask, parseEphem, parseManifest } from './validation';
import type { SiteMask } from '../contracts/site-mask';
async function resource(path: string, signal: AbortSignal, request: typeof fetch) {
  const response = await request(`/data/${path}`, { signal });
  if (!response.ok) throw new Error(`Site data could not load (HTTP ${response.status}).`);
  return response;
}
/** Real catalogue (sites.json) + synthetic demo-* fixtures, loaded on their own so the picker never waits on ephem or masks. */
export async function loadSites(signal: AbortSignal, request: typeof fetch = fetchAsset) {
  const [realData, demoData] = await Promise.all(['sites.json', 'mock/sites.json'].map(path => resource(path, signal, request).then(r => r.json())));
  const real = parseSites(realData);
  const sites = parseSites([...real, ...parseSites(demoData)]); // second pass rejects ids shared by both files
  return { sites, realIds: new Set(real.map(site => site.id)) };
}
/** Catalogue + JPL Horizons ephemeris + PIPE-8 horizon masks (INT-1); demo-* fixtures keep their mock masks. */
export async function loadDemoData(signal: AbortSignal, request: typeof fetch = fetchAsset, catalogue = loadSites(signal, request)) {
  const get = (path: string) => resource(path, signal, request);
  const [{ sites: all, realIds }, manifest, header, bytes] = await Promise.all([
    catalogue, get('manifest.json').then(r => r.json()).then(parseManifest), get('ephem.json').then(r => r.json()), get('ephem.bin').then(r => r.arrayBuffer()),
  ]);
  const table = parseEphem(header, bytes);
  // The SPA rewrite answers a missing file with index.html, so only fetch real masks the pipeline manifest lists.
  const shipped = new Set(manifest.files.map(file => file.path));
  const masks = new Map<string, SiteMask>();
  await Promise.all(all.map(async site => {
    const path = realIds.has(site.id) ? `masks/${site.id}.json` : `mock/masks/${site.id}.json`;
    if (realIds.has(site.id) && !shipped.has(path)) return;
    const mask = parseMask(await get(path).then(r => r.json()), site.id);
    if (mask.lat !== site.lat || mask.lon !== site.lon) throw new Error('Site coordinates and terrain mask disagree.');
    masks.set(site.id, mask);
  }));
  const sites = all.map(site => {
    if (!realIds.has(site.id)) return site;
    const mask = masks.get(site.id);
    return { ...site, note: `${site.note} ${mask ? `LOLA elevation ${Math.round(mask.elev_m).toLocaleString('en-US')} m.` : 'No terrain data yet.'}` };
  });
  return { sites, masks, table };
}
export type DemoData = Awaited<ReturnType<typeof loadDemoData>>;
