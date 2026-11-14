/* GENERATED from contracts/schemas/imagery.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * URLs of every upstream dataset or API this file was derived from (no units). At least one.
 *
 * @minItems 1
 */
export type SourceUrls = string[];

/**
 * Sidecar (web/public/data/imagery/{region}.json) for imagery/{region}.webp, an orbital image texture for the 3D south-pole patch. The WebP is RGB with the same grey value in every channel. Image axes: column 0 is x_min and columns grow with +x; row 0 is y_max (north-up, the usual image convention), so rows grow with -y. This is the OPPOSITE row direction to the x0/y0 raster convention in common.schema.json. Pixels are areas: pixel (col, row) spans x in [x_min + col * pixel_m, x_min + (col + 1) * pixel_m] and y in [y_max - (row + 1) * pixel_m, y_max - row * pixel_m].
 */
export interface ImageryHeader {
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
   * Credit line to show wherever the image is displayed (no units).
   */
  attribution: string;
  /**
   * Region id (no units); equals the file name.
   */
  region: string;
  /**
   * Projection name (no units). Always south polar stereographic on a sphere; parameters are in crs_params.
   */
  crs: "polar-stereo-south";
  crs_params: CrsParams;
  /**
   * Projected x in metres of the left edge of column 0.
   */
  x_min: number;
  /**
   * Projected x in metres of the right edge of the last column.
   */
  x_max: number;
  /**
   * Projected y in metres of the bottom edge of the last row.
   */
  y_min: number;
  /**
   * Projected y in metres of the top edge of row 0.
   */
  y_max: number;
  /**
   * Pixel size in projected metres, the same along x and y: (x_max - x_min) / width.
   */
  pixel_m: number;
  /**
   * Image width in pixels (columns along +x); unitless count.
   */
  width: number;
  /**
   * Image height in pixels (rows along -y); unitless count.
   */
  height: number;
  /**
   * Image file format (no units).
   */
  format: "webp";
  /**
   * Which y edge image row 0 sits on (no units): always y_max (north-up).
   */
  row0: "y_max";
  /**
   * Grey value (0-255, no units) meaning no imagery (shadowed gaps or no coverage), or null when every pixel is valid.
   */
  nodata: number | null;
  /**
   * Lossy WebP quality used (0-100, no units).
   */
  webp_quality: number;
  /**
   * WMTS tile matrix level the pixels were read from (no units).
   */
  source_level: number;
  /**
   * Pixel size in metres of the source tiles at source_level; pixel_m >= this (never upsampled).
   */
  source_pixel_m: number;
}
/**
 * Parameters of the south polar stereographic projection, true scale at the pole (k0 = 1). With rho = 2 * radius_m * tan(pi/4 + lat/2) (lat in radians, negative in the south): x = rho * sin(lon), y = rho * cos(lon). So +y points along longitude 0 (towards Earth) and +x along longitude 90 east.
 */
export interface CrsParams {
  /**
   * Latitude of the projection origin in degrees: the south pole.
   */
  lat_0: -90;
  /**
   * Central longitude in degrees: the meridian that maps to the +y axis.
   */
  lon_0: 0;
  /**
   * Radius of the reference sphere in metres.
   */
  radius_m: 1737400;
}
