/* GENERATED from contracts/schemas/validation.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * URLs of every upstream dataset or API this file was derived from (no units). At least one.
 *
 * @minItems 1
 */
export type SourceUrls = string[];

/**
 * Reference Sun and Earth directions from JPL Horizons for one site (web/public/data/validation/{site_id}.json), used to check the engine's geometry. Angles are for the body centre as seen from the site on the smooth sphere plus elev_m; no terrain, no refraction.
 */
export interface ValidationSet {
  /**
   * Contract version of this file (unitless integer). Bumped on any breaking change to the file's schema.
   */
  schema_version: 1;
  /**
   * Instant this file was generated, UTC ISO 8601 with Z.
   */
  generated_at: string;
  source_urls: SourceUrls;
  /**
   * Site id (no units); equals the id in sites.json and the file name.
   */
  site_id: string;
  /**
   * Planetocentric latitude in degrees, Moon-fixed mean-Earth frame (MOON_ME), in [-90, 90]; south is negative.
   */
  lat: number;
  /**
   * East-positive longitude in degrees, Moon-fixed mean-Earth frame (MOON_ME), in [-180, 180). 180 itself is written as -180.
   */
  lon: number;
  /**
   * Terrain height in metres above the 1737400 m reference sphere (negative below it).
   */
  elev_m: number;
  /**
   * Reference directions at sampled instants.
   *
   * @minItems 1
   */
  samples: ValidationSample[];
}
/**
 * Sun and Earth direction at one instant.
 */
export interface ValidationSample {
  /**
   * Instant of the sample, UTC ISO 8601 with Z.
   */
  t_iso: string;
  /**
   * Azimuth in degrees, clockwise from local north as seen from above (north 0, east 90), in [0, 360).
   */
  sun_az: number;
  /**
   * Angle in degrees above the local horizontal plane (the plane perpendicular to the radial through the site), in [-90, 90]; negative is below the plane. No refraction.
   */
  sun_el: number;
  /**
   * Azimuth in degrees, clockwise from local north as seen from above (north 0, east 90), in [0, 360).
   */
  earth_az: number;
  /**
   * Angle in degrees above the local horizontal plane (the plane perpendicular to the radial through the site), in [-90, 90]; negative is below the plane. No refraction.
   */
  earth_el: number;
}
