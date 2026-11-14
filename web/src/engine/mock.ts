import type { Metrics } from '../contracts/engine-api.ts';

const exampleMetrics: Metrics = {
  pct_lit: 80, longest_dark_h: 24, pct_earth_visible: 85, longest_blackout_h: 8,
  h_to_first_sunset: 36, h_to_first_earthset: 20,
  mean_sun_el_deg: 3, max_sun_el_deg: 7,
  mean_power_vertical: 0.75, mean_power_horizontal: 0.05,
  t_min_k: 90, t_max_k: 245, h_below_survival: 12,
};

// shortcut: fixed illustrative result, replace with the WASM engine when ENG-4 lands.
export function mockSiteMetrics(): Metrics { return { ...exampleMetrics }; }
