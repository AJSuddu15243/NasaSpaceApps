# PIPE-3 handoff: PGDA LOLA south-pole DEM

## File
`pipeline/data/raw/LDEM_80S_80MPP_ADJ.TIF` (from `cfg.paths.raw`), produced by `make terrain-fetch`.
- URL: https://pgda.gsfc.nasa.gov/data/LOLA_20mpp/LDEM_80S_80MPP_ADJ.TIF (product page
  https://pgda.gsfc.nasa.gov/products/90). Constants: `terrain.pgda.URL`, `PRODUCT_URL`, `SHA256`.
- Size 189,158,392 bytes (HTTP `Content-Length`, `Last-Modified: Fri, 07 Jul 2023`).
- SHA-256 `82030dcbdd7c4bb0c7d858e9b4b293b9f2cda5a543ba31ec0f42784bd6beee5a`, pinned 2026-11-14.
  **Trust-on-first-use**: PGDA publishes no checksum. The pin only proves later downloads match the first one.

## How to read it (source of each fact)
| Fact | Value | Source |
|---|---|---|
| CRS | IAU 30135 "Moon (2015) - Sphere / Ocentric / South Polar", Polar_Stereographic, lat_origin -90, central_meridian 0, false E/N 0, metres | file WKT (`describe: crs_wkt`) |
| Sphere | R = 1,737,400 m (IAU 30100), inverse flattening 0 | file WKT |
| +x axis | points to lon **90 E** | measured: inverse-transform (1000, 0) through the file CRS |
| +y axis | points to lon **0 E** (so x = ρ sin λ, y = ρ cos λ, ρ = 2R tan(colat/2)) | measured: (0, 1000) |
| WKT AXIS labels | `AXIS["Easting",NORTH],AXIS["Northing",NORTH]`: GDAL's odd polar labels; ignore them | file WKT |
| Geotransform | (80, 0, -304000, 0, -80, 304000): row 0 is the top (+y, 0 E side), pixel-is-area | file transform, `AREA_OR_POINT=Area`, GMT `node_offset=1` |
| Pixel | 80 m × 80 m | file |
| Shape | 7600 × 7600 (width × height), 1 band, 512 × 512 blocks, overviews 2/4/8/16, COG, DEFLATE, predictor 3 | file |
| Extent | x, y ∈ [-304000, 304000] m; half-width 304.0 km = 2R tan(5°) (80 S) | file bounds; check |
| dtype | float32 | file |
| nodata | NaN (`_FillValue nan`); 0 non-finite pixels in the whole file | file; streamed count |
| Units | metres; no scale (1.0) / offset (0.0); band `units` tag empty | PGDA page ("surface height (in meters)"); file history `gmt grdmath … 1000.0 MUL` (km → m) |
| Height reference | heights relative to the 1,737.4 km sphere | datum radius in file WKT; LOLA convention (reference sphere 1737.4 km). The file itself has no explicit "height above" tag |
| Frame | MOON_ME, JPL DE421 | PGDA page: "south polar stereographic X/Y coordinates in meters and in the MOON_ME reference frame of the JPL DE421 ephemeris". Not in the file metadata |
| Range | -7295.5 .. 7026.3 m | streamed min/max; matches file tag `z#actual_range` |

## Checks on the real file (`make terrain-fetch` output)
- Half-width 304.0 km vs 80 S on 1737.4 km: 304.0 km. PASS.
- Pole: x = y = 0 falls on the corner shared by 4 pixels; floor-indexing gives row/col (3800, 3800), 1282.3 m.
- Shackleton (89.67 S, 129.8 E) centre row/col (3880, 3896): floor (min within 4 km) -2869 m, rim (max at 9–12 km) 1737 m, depth 4606 m. PASS (expect ~4 km).
- Range -7295.5 .. 7026.3 m, non-integer floats. PASS.
- Region centres (config.yaml), x/y via the file CRS:
  | Region | x m | y m | row, col | elevation m |
  |---|---:|---:|---|---:|
  | connecting-ridge | -10999 | -11999 | 3949, 3662 | 1946.4 |
  | haworth | -38000 | 90501 | 2668, 3324 | 1631.5 |
  | malapert-massif | -500 | 121500 | 2281, 3793 | 4784.6 |
  The M2M-30044 centres map to round x/y in this projection, suggesting the Data Book used the same PGDA grid and lon convention.

## Gotchas for PIPE-4 / ENG-3
- Pixel-is-area: centre of (row, col) is x = -304000 + 80 (col + 0.5), y = 304000 - 80 (row + 0.5).
- The pole is a pixel corner, not a pixel centre.
- Use `rasterio` windows (512 px blocks) or overviews; full band = 231 MB as float32.
- No NaNs today, but nodata is NaN: use `np.isfinite`, not `== nodata`.
- `pgda.locate`, `disk_minmax` are preview helpers for checks only; PIPE-4 owns coords.py.
- Headers downstream should cite `pgda.URL` and `pgda.PRODUCT_URL` (dataset: LOLA LDEM 80S 80 m/px, PGDA product 90; Barker et al.).
- Moon Trek / QuickMap have no scriptable numeric DEM (README "Terrain sources"); Trek WMTS PNGs may serve imagery (PIPE-10).
