import type { Params, Metrics } from '../contracts/engine-api';
import type { SiteMask } from '../contracts/site-mask';
import type { DemoData } from '../shell/data';
import { parseMetrics } from '../shell/validation';
export const MOCK_DATE = '2026-11-14T12:00:00.000Z';
export const MOCK_PARAMS: Params = { battery_h: 48, survival_temp_k: 100, antenna_margin_deg: 2, slope_limit_deg: 10, step_hours: 1 };
export class UnavailableScenario extends Error {}
// shortcut: fixed synthetic fixtures, not physics; replace this adapter with the Rust/WASM worker when ENG-9 lands.
const FIXTURES: Record<string, Metrics> = {
  'demo-ridge-a': { pct_lit: 82, longest_dark_h: 32, pct_earth_visible: 64, longest_blackout_h: 18, h_to_first_sunset: 96, h_to_first_earthset: 48, mean_sun_el_deg: 1.8, max_sun_el_deg: 4, mean_power_vertical: 0.8, mean_power_horizontal: 0.03, t_min_k: 70, t_max_k: 220, h_below_survival: 32 },
  'demo-ridge-b': { pct_lit: 71, longest_dark_h: 46, pct_earth_visible: 86, longest_blackout_h: 12, h_to_first_sunset: 72, h_to_first_earthset: 84, mean_sun_el_deg: 1.2, max_sun_el_deg: 3, mean_power_vertical: 0.7, mean_power_horizontal: 0.02, t_min_k: 65, t_max_k: 215, h_below_survival: 46 },
  'demo-basin-c': { pct_lit: 44, longest_dark_h: 96, pct_earth_visible: 52, longest_blackout_h: 40, h_to_first_sunset: 36, h_to_first_earthset: 24, mean_sun_el_deg: 0.8, max_sun_el_deg: 2, mean_power_vertical: 0.4, mean_power_horizontal: 0.01, t_min_k: 55, t_max_k: 190, h_below_survival: 96 },
};
export function site_metrics(mask: SiteMask, ephem: DemoData['table'], t_start: string, hours: number, params: Params): Metrics {
  if (t_start !== MOCK_DATE || hours !== 336 || ephem.header.t0_iso !== MOCK_DATE || ephem.header.n < 337 || Object.keys(MOCK_PARAMS).some(key => params[key as keyof Params] !== MOCK_PARAMS[key as keyof Params])) {
    throw new UnavailableScenario('No computed results for this scenario. Restore the demo window to inspect synthetic examples.');
  }
  const fixture = FIXTURES[mask.id];
  if (!fixture) throw new UnavailableScenario('No example metrics for this site.');
  return parseMetrics({ ...fixture }, hours);
}
