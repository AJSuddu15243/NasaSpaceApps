/**
 * Numbers the explainer and glossary copy quotes, computed by the Rust/WASM engine from the shipped data
 * (JPL Horizons ephem.bin 2026–2030, LOLA masks/*.json, grid/connecting-ridge.bin). facts.test.ts recomputes
 * every value, so a data or engine change that moves one fails the build instead of leaving stale copy.
 */
export const FACTS = {
  years: '2026–2030',
  /** Max |sub-solar latitude| over the table, degrees. */
  subSolarLatDeg: 1.59,
  /** Max |sub-Earth latitude| / |sub-Earth longitude| over the table (libration), degrees. */
  earthLatDeg: 6.86,
  earthLonDeg: 8.05,
  /** Per curated site over the whole table: highest Sun elevation (deg) and longest run without sunlight above the terrain (h). */
  sites: {
    'connecting-ridge': { name: 'Connecting ridge', maxSunElDeg: 2.06, longestDarkH: 504 },
    haworth: { name: 'Haworth', maxSunElDeg: 4.82, longestDarkH: 2813 },
    'malapert-massif': { name: 'Malapert massif', maxSunElDeg: 5.59, longestDarkH: 2106 },
  },
  /** Connecting-ridge grid, default window (2027-01-15, 336 h): two cells 6 × 160 m apart, one lit the whole window, one never. */
  nearbyContrast: { metres: 960, sunPoints: 100 },
} as const;

const days = (h: number) => Math.round(h / 24);
const s = FACTS.sites;
/** "2.06–5.59°": the range of peak Sun elevations across the three sites. */
export const SUN_PEAK_RANGE = `${s['connecting-ridge'].maxSunElDeg.toFixed(2)}–${s['malapert-massif'].maxSunElDeg.toFixed(2)}°`;
/** "21–117 days": the range of longest darkness across the three sites. */
export const DARK_RANGE = `${days(s['connecting-ridge'].longestDarkH)}–${days(s.haworth.longestDarkH)} days`;
