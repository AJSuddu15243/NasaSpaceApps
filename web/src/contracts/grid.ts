/* GENERATED from contracts/schemas/grid.schema.json by `pnpm gen` in contracts/. DO NOT EDIT: change the schema, then regenerate. */

/**
 * URLs of every upstream dataset or API this file was derived from (no units). At least one.
 *
 * @minItems 1
 */
export type SourceUrls = string[];

/**
 * Header (web/public/data/grid/{region}.json) for the heatmap layer stack {region}.bin. The binary is the layers in the order of `layers`, back to back, each described by layer_info. Axis and index convention: see x0.
 */
export interface GridHeader {
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
   * Region id (no units); equals the file name.
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
   * Azimuth bins per cell in the mask layer (unitless count). Bin b covers azimuth b * (360 / bins) degrees clockwise from local north.
   */
  bins: 64;
  /**
   * Layers present in the binary, in file order (no units). A layer without data (e.g. rock before a source is confirmed) is left out.
   *
   * @minItems 1
   */
  layers: ("mask" | "slope_deg" | "aspect_deg" | "elev_m" | "crater_depth_m" | "roughness_deg" | "rock")[];
  /**
   * Storage description of each layer, keyed by layer name; its keys equal `layers`.
   */
  layer_info: {
    /**
     * Terrain horizon elevation per azimuth bin, stored as int16 hundredths of a degree with components = bins.
     */
    mask?: GridLayerInfo & {
      dtype?: "int16";
      scale?: 0.01;
      offset?: 0;
      units?: "deg";
    };
    slope_deg?: GridLayerInfo & {
      units?: "deg";
      components?: 1;
    };
    /**
     * Compass direction the slope faces (downhill), degrees clockwise from local north in [0, 360); 0 where the cell is flat (slope 0).
     */
    aspect_deg?: GridLayerInfo & {
      units?: "deg";
      components?: 1;
    };
    elev_m?: GridLayerInfo & {
      units?: "m";
      components?: 1;
    };
    crater_depth_m?: GridLayerInfo & {
      units?: "m";
      components?: 1;
    };
    /**
     * Standard deviation of slope (degrees) over a 5 x 5 window of 80 m cells; the rock-distribution proxy input (PIPE-6).
     */
    roughness_deg?: GridLayerInfo & {
      units?: "deg";
      components?: 1;
    };
    rock?: GridLayerInfo & {
      units?: "fraction";
      components?: 1;
    };
  };
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
/**
 * How one layer is stored. The value for cell index i (= row * nx + col) and component c is the little-endian element at byte_offset + (i * components + c) * itemsize, and its physical value is stored * scale + offset.
 *
 * This interface was referenced by `GridHeader`'s JSON-Schema
 * via the `definition` "layer".
 */
export interface GridLayerInfo {
  /**
   * Stored element type (no units); itemsize is 1, 2, 2 and 4 bytes.
   */
  dtype: "uint8" | "int16" | "uint16" | "float32";
  /**
   * Multiplier from stored value to physical value, in `units` per stored count.
   */
  scale: number;
  /**
   * Added after scaling, in `units`.
   */
  offset: number;
  /**
   * Unit of the physical value, e.g. deg, m, fraction.
   */
  units: string;
  /**
   * Values per cell (unitless count): bins for the mask layer, 1 for scalar layers.
   */
  components: number;
  /**
   * STORED value (before scale and offset) that marks a missing cell, or null when every cell is valid.
   */
  nodata: number | null;
  /**
   * Offset in bytes of the layer's first element from the start of the .bin.
   */
  byte_offset: number;
  /**
   * Length of the layer in bytes: nx * ny * components * itemsize.
   */
  byte_length: number;
}
