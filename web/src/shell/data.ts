import { parseSites, parseMask, parseEphem } from './validation';
import type { SiteMask } from '../contracts/site-mask';
/** Real catalogue (sites.json) + JPL Horizons ephemeris + PIPE-8 horizon masks (INT-1); demo-* fixtures keep their mock masks. */
export async function loadDemoData(signal: AbortSignal, request: typeof fetch = fetch) {
  async function resource(path: string) {
    const response = await request(`/data/${path}`, { signal });
    if (!response.ok) throw new Error(`Site data could not load (HTTP ${response.status}).`);
    return response;
  }
  const [realData, demoData, manifest, header, bytes] = await Promise.all([
    resource('sites.json').then(r => r.json()), resource('mock/sites.json').then(r => r.json()), resource('manifest.json').then(r => r.json()),
    resource('ephem.json').then(r => r.json()), resource('ephem.bin').then(r => r.arrayBuffer()),
  ]);
  const real = parseSites(realData);
  const sites = parseSites([...real, ...parseSites(demoData)]); // second pass rejects ids shared by both files
  const table = parseEphem(header, bytes);
  // The SPA rewrite answers a missing file with index.html, so only fetch masks the pipeline manifest lists.
  const shipped = new Set<string>((manifest as { files?: { path: string }[] }).files?.map(file => file.path) ?? []);
  const masks = new Map<string, SiteMask>();
  await Promise.all(sites.map(async site => {
    const path = real.includes(site) ? `masks/${site.id}.json` : `mock/masks/${site.id}.json`;
    if (real.includes(site) && !shipped.has(path)) return;
    const mask = parseMask(await resource(path).then(r => r.json()), site.id);
    if (mask.lat !== site.lat || mask.lon !== site.lon) throw new Error('Site coordinates and terrain mask disagree.');
    masks.set(site.id, mask);
  }));
  for (const site of real) {
    const mask = masks.get(site.id);
    site.note = `${site.note} ${mask ? `LOLA elevation ${Math.round(mask.elev_m).toLocaleString('en-US')} m.` : 'No terrain data yet.'}`;
  }
  return { sites, masks, table };
}
export type DemoData = Awaited<ReturnType<typeof loadDemoData>>;
