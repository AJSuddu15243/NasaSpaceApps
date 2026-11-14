/* GENERATED from contracts/schemas/imagery.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * URLs of every upstream dataset or API this file was derived from (no units). At least one.
 *
 * @minItems 1
 */
export type SourceUrls = string[];

/**
 * Sidecar (web/public/data/imagery/{region}.json) for imagery/{region}.webp, an orbital image texture for the 3D south-pole patch. The WebP is greyscale encoded as RGB; after decoding, channels may differ slightly because of lossy compression (use any one channel, or their mean). Image axes follow the x0/y0 raster convention in common.schema.json: column 0 is x_min and columns grow with +x; row 0 is y_min and rows grow with +y (so it is NOT north-up; a top-down image viewer shows it flipped vertically). Pixels are areas: pixel (col, row) spans x in [x_min + col * pixel_m, x_min + (col + 1) * pixel_m] and y in [y_min + row * pixel_m, y_min + (row + 1) * pixel_m]. validate-data checks that pixel_m * width = x_max - x_min, pixel_m * height = y_max - y_min and pixel_m >= source_pixel_m.
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
   * Projected y in metres of the bottom edge of row 0.
   */
  y_min: number;
  /**
   * Projected y in metres of the top edge of the last row.
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
   * Image height in pixels (rows along +y); unitless count.
   */
  height: number;
  /**
   * Image file format (no units).
   */
  format: "webp";
  /**
   * Which y edge image row 0 sits on (no units): always y_min (rows grow with +y, as in common.schema.json).
   */
  row0: "y_min";
  /**
   * Always null: every pixel is valid. Source gaps are filled from neighbouring pixels before encoding, because lossy WebP cannot keep an exact nodata value.
   */
  nodata: null;
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
