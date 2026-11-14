/* GENERATED from contracts/schemas/engine-api.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * PROPOSED (not yet signed off by the engine and web owners). Value types that cross the engine API: site_metrics(mask, ephem, t_start, hours, params) -> Metrics, grid_scores(grid, ephem, t_start, hours, weights) -> Float32Array, top_areas(scores, window_cells, n) -> Area[]. This wrapper object exists only so the types can be validated and generated together.
 */
export interface EngineApiTypes {
  params?: Params;
  weights?: Weights;
  metrics?: Metrics;
  /**
   * Result of top_areas, best first.
   */
  areas?: Area[];
}
/**
 * PROPOSED. Mission thresholds and the simulation step passed to site_metrics.
 *
 * This interface was referenced by `EngineApiTypes`'s JSON-Schema
 * via the `definition` "params".
 */
export interface Params {
  /**
   * Hours the lander can run without sunlight.
   */
  battery_h: number;
  /**
   * Surface temperature in kelvin below which an hour counts towards h_below_survival.
   */
  survival_temp_k: number;
  /**
   * Degrees the Earth's centre must be above the terrain mask to count as in contact.
   */
  antenna_margin_deg: number;
  /**
   * Hard slope limit in degrees from horizontal (default 10).
   */
  slope_limit_deg: number;
  /**
   * Fixed simulation time step in hours.
   */
  step_hours: number;
}
/**
 * PROPOSED. Weights of the greedy evaluator's normalised factors (unitless, each >= 0); score = sum of weight * factor.
 *
 * This interface was referenced by `EngineApiTypes`'s JSON-Schema
 * via the `definition` "weights".
 */
export interface Weights {
  /**
   * Weight of continuous sunlight (unitless).
   */
  sun: number;
  /**
   * Weight of Earth contact (unitless).
   */
  earth: number;
  /**
   * Weight of low slope (unitless).
   */
  slope: number;
  /**
   * Weight of shallow crater depth (unitless).
   */
  crater: number;
  /**
   * Weight of low rock abundance (unitless); defaults to 0 because the rock layer is a terrain-roughness proxy, not measured rocks.
   */
  rock: number;
  /**
   * Weight of benign thermal exposure (unitless).
   */
  thermal: number;
}
/**
 * PROPOSED. Result of site_metrics over the window [t_start, t_start + hours].
 *
 * This interface was referenced by `EngineApiTypes`'s JSON-Schema
 * via the `definition` "metrics".
 */
export interface Metrics {
  /**
   * Percent of the window with any of the Sun's disk above the mask, in [0, 100].
   */
  pct_lit: number;
  /**
   * Longest continuous stretch without sunlight, in hours.
   */
  longest_dark_h: number;
  /**
   * Percent of the window with the Earth's centre above the mask plus the antenna margin, in [0, 100].
   */
  pct_earth_visible: number;
  /**
   * Longest continuous stretch without Earth contact, in hours.
   */
  longest_blackout_h: number;
  /**
   * Hours from t_start to the first sunset in the window; null when there is none.
   */
  h_to_first_sunset: number | null;
  /**
   * Hours from t_start to the first Earthset in the window; null when there is none.
   */
  h_to_first_earthset: number | null;
  /**
   * Mean elevation of the Sun's centre over the window, in degrees above the local horizontal plane.
   */
  mean_sun_el_deg: number;
  /**
   * Highest elevation of the Sun's centre in the window, in degrees above the local horizontal plane.
   */
  max_sun_el_deg: number;
  /**
   * Mean of lit * cos(elevation) for a vertical Sun-tracking panel: a fraction of full normal-incidence power, in [0, 1].
   */
  mean_power_vertical: number;
  /**
   * Mean of lit * sin(elevation) for a horizontal panel: a fraction of full normal-incidence power, in [0, 1].
   */
  mean_power_horizontal: number;
  /**
   * Lowest surface temperature in the window, in kelvin (simplified, no thermal inertia).
   */
  t_min_k: number;
  /**
   * Highest surface temperature in the window, in kelvin (simplified, no thermal inertia).
   */
  t_max_k: number;
  /**
   * Hours in the window with surface temperature below survival_temp_k.
   */
  h_below_survival: number;
}
/**
 * PROPOSED. One landing area returned by top_areas.
 *
 * This interface was referenced by `EngineApiTypes`'s JSON-Schema
 * via the `definition` "area".
 */
export interface Area {
  /**
   * Projected x of the area centre in metres (south polar stereographic, see the grid contract).
   */
  x_m: number;
  /**
   * Projected y of the area centre in metres (south polar stereographic, see the grid contract).
   */
  y_m: number;
  /**
   * Planetocentric latitude in degrees, Moon-fixed mean-Earth frame (MOON_ME), in [-90, 90]; south is negative.
   */
  lat: number;
  /**
   * East-positive longitude in degrees, Moon-fixed mean-Earth frame (MOON_ME), in [-180, 180). 180 itself is written as -180.
   */
  lon: number;
  /**
   * Mean weighted score over the area's window (unitless).
   */
  score: number;
  /**
   * Radius in metres of the area, i.e. of the surroundings excluded from later picks.
   */
  radius_m: number;
}
