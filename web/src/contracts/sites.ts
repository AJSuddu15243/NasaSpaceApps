/* GENERATED from contracts/schemas/sites.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * Curated landing sites (web/public/data/sites.json). Hand-curated, so it is a bare array without the generated-file envelope; each site cites its own source.
 *
 * @minItems 1
 */
export type Sites = Site[];

/**
 * One curated landing site.
 */
export interface Site {
  /**
   * Unique site id (no units); also the file name in masks/{id}.json and validation/{id}.json.
   */
  id: string;
  /**
   * Display name (no units).
   */
  name: string;
  /**
   * Planetocentric latitude in degrees, Moon-fixed mean-Earth frame (MOON_ME), in [-90, 90]; south is negative.
   */
  lat: number;
  /**
   * East-positive longitude in degrees, Moon-fixed mean-Earth frame (MOON_ME), in [-180, 180). 180 itself is written as -180.
   */
  lon: number;
  /**
   * Site group (no units): Artemis III candidate region, CLPS lander, international mission, Apollo (equatorial contrast), or demo (synthetic fixture for interface testing).
   */
  category: "artemis3" | "clps" | "intl" | "apollo" | "demo";
  /**
   * One-line plain-language note shown in the UI (no units); may be empty.
   */
  note: string;
  /**
   * URL of the source the coordinates were taken from (no units).
   */
  source_url: string;
}
