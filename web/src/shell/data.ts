import { parseSites, parseMask, parseEphem } from './validation';
import type { SiteMask } from '../contracts/site-mask';
export async function loadDemoData(signal: AbortSignal, request: typeof fetch = fetch) {
  async function resource(path: string) {
    const response = await request(`/data/mock/${path}`, { signal });
    if (!response.ok) throw new Error(`Demo data could not load (HTTP ${response.status}).`);
    return response;
  }
  const [siteData, header, bytes] = await Promise.all([
    resource('sites.json').then(r => r.json()), resource('ephem.json').then(r => r.json()), resource('ephem.bin').then(r => r.arrayBuffer()),
  ]);
  const sites = parseSites(siteData);
  const table = parseEphem(header, bytes);
  const masks = new Map<string, SiteMask>();
  await Promise.all(sites.map(async site => {
    // Regions whose horizon mask has not shipped yet still list and plot;
    // metrics report the gap honestly instead of failing the whole load.
    const mask = await resource(`masks/${site.id}.json`).then(r => r.json()).catch(() => null);
    if (!mask) return;
    const parsed = parseMask(mask, site.id);
    if (parsed.lat !== site.lat || parsed.lon !== site.lon) throw new Error('Site coordinates and terrain mask disagree.');
    masks.set(site.id, parsed);
  }));
  return { sites, masks, table };
}
export type DemoData = Awaited<ReturnType<typeof loadDemoData>>;
