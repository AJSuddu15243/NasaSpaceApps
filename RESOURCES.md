# Mission-control science sources

Existing terrain-source notes: [legacy resources](LunarLandingSiteNavigation/RESOURCES.md).

- [PGDA product 69](https://pgda.gsfc.nasa.gov/products/69): 60 m south-polar Sun/Earth average
  visibility and permanent-shadow products, aggregated onto 160 m region grids. Long-term model
  outputs, not launch-date results or detected ice.
- [USGS south-pole Ice Favorability Index](https://astrogeology.usgs.gov/search/map/moon_ice_favorability_index_south_pole_591mp):
  Cannon & Britt (2020), native 591 m, a geologic favorability model rather than ice abundance.
  The pipeline honors the source CRS and preserves nodata in nearest-neighbour reprojection.
- Reproduce: `cd pipeline && uv run --frozen python -m lunar_pipeline science`, then
  `uv run --frozen python -m lunar_pipeline package`. Raw TIFFs remain ignored under `pipeline/data/raw/`.
  Checksums are pinned in the science stage; citations and output hashes appear in the packaged manifest.

See [the mission-control handoff](docs/handoff/MISSION-CONTROL.md) for contracts and limitations.
