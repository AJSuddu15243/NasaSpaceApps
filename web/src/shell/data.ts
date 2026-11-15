import { parseSites, parseMask, parseEphem } from './validation';
import type { SiteMask } from '../contracts/site-mask';
import { SITES } from '../landing/story';
/** Real JPL Horizons ephemeris + PIPE-8 horizon masks for the surveyed regions (INT-1); demo-* sites keep their mock masks. */
export async function loadDemoData(signal: AbortSignal, request: typeof fetch = fetch) {
  async function resource(path: string) {
    const response = await request(`/data/${path}`, { signal });
    if (!response.ok) throw new Error(`Site data could not load (HTTP ${response.status}).`);
    return response;
  }
  const [siteData, header, bytes] = await Promise.all([
    resource('mock/sites.json').then(r => r.json()), resource('ephem.json').then(r => r.json()), resource('ephem.bin').then(r => r.arrayBuffer()),
  ]);
  const sites = parseSites(siteData);
  const table = parseEphem(header, bytes);
  const masks = new Map<string, SiteMask>();
  const wanted = [...sites.map(site => ({ ...site, path: `mock/masks/${site.id}.json` })), ...SITES.map(site => ({ ...site, path: `masks/${site.id}.json` }))];
  await Promise.all(wanted.map(async site => {
    const mask = parseMask(await resource(site.path).then(r => r.json()), site.id);
    if (mask.lat !== site.lat || mask.lon !== site.lon) throw new Error('Site coordinates and terrain mask disagree.');
    masks.set(site.id, mask);
  }));
  return { sites, masks, table };
}
export type DemoData = Awaited<ReturnType<typeof loadDemoData>>;
