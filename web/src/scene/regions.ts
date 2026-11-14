import { customSiteId } from '../features/sites/sites';
// PIPE-4 seed region centres from pipeline/config.yaml (NASA M2M-30044 Table A2.1-1).
// These are data coverage centres, not recommendations or verified landing coordinates.
export const TERRAIN_REGIONS = [
  { name: 'Connecting Ridge', lat: -89.4632, lon: -137.49 },
  { name: 'Haworth', lat: -86.7639, lon: -22.777 },
  { name: 'Malapert Massif', lat: -85.9948, lon: -0.23578 },
].map((site, index) => ({ ...site, id: customSiteId(site.lat, site.lon), index }));
