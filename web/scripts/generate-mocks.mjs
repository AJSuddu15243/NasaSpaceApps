import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export function generateMocks(root) {
  mkdirSync(resolve(root, 'masks'), { recursive: true });
  mkdirSync(resolve(root, 'grid'), { recursive: true });
  const json = (path, value) => writeFileSync(resolve(root, path), JSON.stringify(value, null, 2) + '\n');
  const source = 'https://github.com/AJSuddu15243/NasaSpaceApps/blob/main/web/README.md';
  const meta = { schema_version: 1, generated_at: '2026-11-14T12:00:00Z', source_urls: [source] };
  // Real sites live in ../sites.json; mock/ holds only synthetic fixtures.
  const sites = [
    { id: 'demo-ridge-a', name: 'Demo ridge A', lat: -89.5, lon: 30, category: 'demo', note: 'Synthetic fixture for interface testing; not a landing site.', source_url: source },
    { id: 'demo-ridge-b', name: 'Demo ridge B', lat: -88.8, lon: 45, category: 'demo', note: 'Synthetic fixture for interface testing; not a landing site.', source_url: source },
    { id: 'demo-basin-c', name: 'Demo basin C', lat: -89.1, lon: -20, category: 'demo', note: 'Synthetic fixture for interface testing; not a landing site.', source_url: source },
  ];
  json('sites.json', sites);
  for (const site of sites) json(`masks/${site.id}.json`, { ...meta, id: site.id, lat: site.lat, lon: site.lon, elev_m: 0, slope_deg: 4, bins: 360, mask_deg: Array(360).fill(2), max_distance_km: 150, dem_source: 'Synthetic flat horizon; not a DEM' });
  const n = 337;
  json('ephem.json', { ...meta, t0_iso: '2026-11-14T12:00:00.000Z', step_hours: 1, n, fields: ['sun_lat', 'sun_lon', 'sun_dist_km', 'earth_lat', 'earth_lon', 'earth_dist_km'], dtype: 'float32' });
  const buffer = Buffer.alloc(n * 24);
  for (let i = 0; i < n; i++) [-1, 0, 149597870, 0, 0, 384400].forEach((value, j) => buffer.writeFloatLE(value, (i * 6 + j) * 4));
  writeFileSync(resolve(root, 'ephem.bin'), buffer);
  json('grid/demo.json', { ...meta, region: 'demo', crs: 'polar-stereo-south', crs_params: { lat_0: -90, lon_0: 0, radius_m: 1737400 }, x0: 0, y0: 0, cell_m: 240, nx: 1, ny: 1, bins: 64, layers: ['mask'], layer_info: { mask: { dtype: 'int16', scale: 0.01, offset: 0, units: 'deg', components: 64, nodata: null, byte_offset: 0, byte_length: 128 } } });
  const grid = Buffer.alloc(128); for (let i = 0; i < 64; i++) grid.writeInt16LE(200, i * 2);
  writeFileSync(resolve(root, 'grid/demo.bin'), grid);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) generateMocks(resolve('public/data/mock'));
