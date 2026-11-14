/* GENERATED from contracts/schemas/ephem.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * URLs of every upstream dataset or API this file was derived from (no units). At least one.
 *
 * @minItems 1
 */
export type SourceUrls = string[];

/**
 * Header (web/public/data/ephem.json) for the Sun/Earth reference table ephem.bin. The binary is n rows x 6 little-endian float32, row-major, in the order of `fields`; row k is the instant t0_iso + k * step_hours; file length is n * 24 bytes.
 */
export interface EphemHeader {
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
   * Instant of row 0, UTC ISO 8601 with Z.
   */
  t0_iso: string;
  /**
   * Time between consecutive rows in hours.
   */
  step_hours: 1;
  /**
   * Number of rows (unitless count).
   */
  n: number;
  /**
   * Column order of each row. sun_lat, sun_lon: sub-solar point in degrees; earth_lat, earth_lon: sub-Earth point in degrees; both in the Moon-fixed mean-Earth frame, longitude east-positive in [-180, 180). sun_dist_km, earth_dist_km: distance from the Moon's centre to the body's centre in kilometres.
   */
  fields: ("sun_lat" | "sun_lon" | "sun_dist_km" | "earth_lat" | "earth_lon" | "earth_dist_km")[];
  /**
   * Element type of ephem.bin (no units): IEEE 754 binary32, little-endian.
   */
  dtype: "float32";
}
