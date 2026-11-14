/* GENERATED from contracts/schemas/site-mask.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * URLs of every upstream dataset or API this file was derived from (no units). At least one.
 *
 * @minItems 1
 */
export type SourceUrls = string[];

/**
 * Terrain horizon mask for one curated site (web/public/data/masks/{id}.json), built by the engine's native mask builder.
 */
export interface SiteMask {
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
  id: string;
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
   * Compass direction the site slope faces (downhill), degrees clockwise from local north in [0, 360); optional until the mask builder (ENG-3 / PIPE-8) writes it.
   */
  aspect_deg?: number;
  /**
   * Terrain slope at the site in degrees from horizontal, in [0, 90].
   */
  slope_deg: number;
  /**
   * Number of azimuth bins (unitless count); equals mask_deg.length. Fixed at 360 for curated sites.
   */
  bins: 360;
  /**
   * mask_deg[i] is the terrain horizon elevation angle in degrees at azimuth i * (360 / bins) degrees (clockwise from local north). Elevation is measured above the local horizontal plane; a body is hidden when it is below this angle.
   *
   * @minItems 360
   * @maxItems 360
   *
   * Items: Angle in degrees above the local horizontal plane (the plane perpendicular to the radial through the site), in [-90, 90]; negative is below the plane. No refraction.
   */
  mask_deg: number[];
  /**
   * Distance in kilometres out to which terrain was searched when building the mask.
   */
  max_distance_km: number;
  /**
   * Name and resolution of the elevation model the mask was built from (no units), e.g. LOLA LDEM_80S_80MPP_ADJ; its URL is in source_urls.
   */
  dem_source: string;
}
