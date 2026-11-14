/* GENERATED from contracts/schemas/tile.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * URLs of every upstream dataset or API this file was derived from (no units). At least one.
 *
 * @minItems 1
 */
export type SourceUrls = string[];

/**
 * Header (web/public/data/tiles/{region}_{res}m.json) for a raw terrain height tile handed from the pipeline to the engine's mask builder. The binary is nx * ny little-endian float32 heights, row-major; file length is nx * ny * 4 bytes. Axis and index convention: see x0.
 */
export interface TileHeader {
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
   * Region id (no units); the file name is {region}_{res}m.
   */
  region: string;
  /**
   * Projection name (no units). Always south polar stereographic on a sphere; parameters are in crs_params.
   */
  crs: "polar-stereo-south";
  crs_params: CrsParams;
  /**
   * Projected x in metres of the CENTRE of cell (col 0, row 0). Raster axis convention, defined only here: col grows with +x, row grows with +y, so the centre of cell (col, row) is (x0 + col * cell_m, y0 + row * cell_m). Cells are stored row-major: index = row * nx + col. Binary values are little-endian.
   */
  x0: number;
  /**
   * Projected y in metres of the CENTRE of cell (col 0, row 0). See x0 for the axis convention.
   */
  y0: number;
  /**
   * Cell size in projected metres, the same along x and y.
   */
  cell_m: number;
  /**
   * Number of columns (cells along +x); unitless count.
   */
  nx: number;
  /**
   * Number of rows (cells along +y); unitless count.
   */
  ny: number;
  /**
   * Element type of the binary (no units): IEEE 754 binary32, little-endian.
   */
  dtype: "float32";
  /**
   * Unit of the stored heights: metres.
   */
  units: "m";
  /**
   * Stored value in metres that marks a missing cell, or null when every cell is valid.
   */
  nodata: number | null;
  /**
   * Radius in metres of the sphere the heights are measured from; a cell's distance from the Moon's centre is this plus its height.
   */
  height_reference_radius_m: 1737400;
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
