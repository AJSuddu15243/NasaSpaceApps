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
    const mask = parseMask(await resource(`masks/${site.id}.json`).then(r => r.json()), site.id);
    if (mask.lat !== site.lat || mask.lon !== site.lon) throw new Error('Site coordinates and terrain mask disagree.');
    masks.set(site.id, mask);
  }));
  return { sites, masks, table };
}
export type DemoData = Awaited<ReturnType<typeof loadDemoData>>;
