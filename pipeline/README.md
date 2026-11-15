# Lunar pipeline scaffold (PIPE-1)

Python >=3.12, managed by uv; `.python-version` selects Python 3.12.
Install [uv](https://docs.astral.sh/uv/getting-started/installation/), then from the repository root:

```sh
cd pipeline
make setup
make lint
make test
make all
```

`setup` installs the committed lockfile, including dev tools. Tests are offline.
Stages are stubs unless listed below; stubs print their issue ID and write no data.
`terrain-fetch` (PIPE-3) is implemented: see "Terrain sources".

From the repository root:

```sh
uv run --project pipeline python -m lunar_pipeline --help
uv run --project pipeline python -m lunar_pipeline ephem --config pipeline/config.yaml
```

`--config` also works before the command. Relative paths *inside* any config resolve from the
repository root; the explicit config filename resolves from the caller's working directory.
This is a repository tool: use the uv editable install in this checkout, not a standalone wheel.

## Commands and ownership

| CLI command | Module under `src/lunar_pipeline/` | Issue |
|---|---|---|
| ephem | ephem.py (uses horizons.py) | PIPE-2 |
| terrain-fetch | terrain/trek.py (owns PGDA fallback via terrain/pgda.py) | PIPE-3 |
| tiles | terrain/tiles.py (uses coords.py) | PIPE-4 |
| layers | terrain/layers.py | PIPE-5, PIPE-6 |
| masks | masks.py | PIPE-8 |
| validate | validate.py | PIPE-7 |
| imagery | terrain/imagery.py | PIPE-10 |
| package | package.py | PIPE-9 |

Each module exposes `run(cfg: Config) -> None`. `all` runs the table in order, sequentially.
Make targets mirror the CLI, plus `setup`, `test`, `lint`, and `terrain` (terrain-fetch then tiles).
No later stage needs to change the registry, Makefile, configuration, or dependency files.
Coordinate shared edits to `terrain/layers.py` between PIPE-5 and PIPE-6.

## Terrain sources (PIPE-3)

Research, 2026-11-14 (timeboxed): can Moon Trek or LROC QuickMap return LOLA heights as numbers
for an extent?

| Endpoint | Returns | Analysis? | Why |
|---|---|---|---|
| `https://trek.nasa.gov/tiles/Moon/EQ/<layer>/1.0.0/WMTSCapabilities.xml` (WMTS) | `image/png` tiles (e.g. `LRO_LOLA_ClrShade_Global_128ppd_v04`) | No | Rendered 8-bit colour/shade, not metres. Use for imagery only |
| `https://trek.nasa.gov/tiles/Moon/SP/...` (south-pole tiles) | HTTP 403 (listing), 404 for guessed DEM layer names | No | No documented numeric DEM layer |
| `https://trek.nasa.gov/moon/TrekWS/rest/...` (catalogue/search) | HTTP 404 on public paths | No | No public, documented subset-by-extent API |
| `https://quickmap.lroc.asu.edu/` → `quickmap.lroc.im-ldi.com` | JS app shell; `/api/` returns the same HTML | No | GeoTIFF export only through the interactive UI; not scriptable |
| `https://pgda.gsfc.nasa.gov/data/LOLA_20mpp/LDEM_80S_80MPP_ADJ.TIF` | float32 COG, heights in m, 80 m/px, 80 S to pole | **Yes** | Numeric, cited, range requests supported. **Chosen** |

`make terrain-fetch` downloads the PGDA DEM into `data/raw/` (189,158,392 bytes, SHA-256 pinned
in `terrain/pgda.py`), prints its metadata and runs physics checks; a second run only re-hashes.
The pin is trust-on-first-use: PGDA publishes no checksum. Facts and gotchas: `notes/pipe-3.md`.

`make validate` writes `web/public/data/validation/{site_id}.json`: JPL Horizons apparent Sun/Earth
az/el from each config site (0 m on the 1737.4 km sphere), two 30-day hourly windows (Jan 2026,
Jul 2028). Each run also recomputes them from PIPE-2 sub-points and fails above 0.1 deg (measured
0.006 deg). Handoff for ENG-2 / EPH-2: `notes/pipe-7.md`.

`make tiles` (PIPE-4) cuts the DEM per config region into float32 tiles (contract `tile`; rows grow
with +y, so the DEM is flipped; cells are block means snapped to DEM pixel edges):
- far field ±(`max_distance_km` + 15 km margin, so off-centre heatmap cells also reach 150 km) at
  `far_field_m` → `pipeline/data/tiles/{region}_240m.bin` (pipeline-only: ~7.5 MB each, mask-builder input);
- near field ±10 km at `near_field_m` → `web/public/data/tiles/{region}_80m.bin` (shipped, 250 KB each).
`coords.to_xy` / `to_latlon` convert lat/lon ↔ south polar stereographic metres (R = 1737.4 km).

`make layers` (PIPE-5) writes `web/public/data/grid/{region}.bin` + `.json` (contract `grid`): ±10 km at
160 m (125 × 125, 375 KB per region), float32 layers `slope_deg, aspect_deg, elev_m, crater_depth_m,
roughness_deg, rock`, computed at 80 m with a 640 m margin, then 2 × 2 aggregated. Slope uses Horn's method and
the **max** of the 2 × 2 (conservative for the hard slope limit); aspect is the downhill direction clockwise
from local north (0 on flat cells); crater depth is max − min within 500 m after removing the
least-squares plane (so regional slope isn't counted as depth); roughness is the std-dev of
slope over 5 × 5. The mask layer is added by PIPE-8.

### Rock distribution (PIPE-6)

`rock` (units `fraction`) = clip(`roughness_deg` / 5°, 0, 1), flagged `"proxy": true` with a `note` in
`layer_info.rock`. It's a **proxy for terrain roughness, not measured rocks**, and its weight defaults to 0.
The reference (5°) is fixed so regions compare: on the PGDA 80 m DEM the median roughness is 0.9–1.1° and the
99th percentile is 3.8–5.3° across the three regions, and 5° is also half the 10° slope limit. Only 0.2–1.3% of
cells saturate at 1. Rock min/mean/max: connecting-ridge 0.03/0.28/1.00, haworth 0.04/0.24/1.00,
malapert-massif 0.04/0.22/1.00.

Sources searched (2026-11-14). None gives a public rock or boulder raster for 85–90° S:

| Source | Coverage / resolution | Verdict |
|---|---|---|
| Diviner rock abundance (Bandfield et al. 2011, JGR 116, E00H02), [GDR L3](https://ode.rsl.wustl.edu/moon/pagehelp/Content/Missions_Instruments/LRO/DIVINER/GDR_L3.htm) | 60° S–60° N only | No polar coverage |
| LROC NAC boulder maps (Aussel et al. 2025, [doi:10.5281/zenodo.15520275](https://doi.org/10.5281/zenodo.15520275)) | 60° S–60° N only | No polar coverage |
| Boazman et al. 2022, PSJ, [doi:10.3847/PSJ/aca590](https://doi.org/10.3847/PSJ/aca590) | Artemis sites near Shackleton | Boulder counts in the paper; no public raster found |
| Mini-RF CPR south-polar mosaic ([PDS](https://pds-geosciences.wustl.edu/lro/lro-l-mrflro-4-cdr-v1/lromrf_0005/data/sar/mosaics/)) | 948 m/px | Rejected: coarser than the 160 m grid, swath gaps, and high CPR can mean ice as well as rocks |
| LOLA multi-baseline roughness (PGDA product 90, Barker et al. 2023) | 1 km/px | Considered: coarser, and it measures the same thing as `roughness_deg` |

Upgrade path: a polar NAC boulder-density map (like Aussel et al. 2025, extended past 60° S, or a released
Boazman et al. product) would replace the proxy directly as a measured rock fraction. Drop `proxy` when it does.

`make package` (PIPE-9) writes `web/public/data/manifest.json` (contract `manifest`): every shipped file
(dotfiles and the manifest itself excluded) with bytes, SHA-256 and `source_urls`, taken from the file's
own JSON, from each `sites.json` entry's `source_url`, or from the sibling `{stem}.json` header for
binaries and imagery. It fails on an uncited file or when the folder exceeds `data_budget_mb` (decimal MB,
raw bytes; Vercel compresses on the fly, so no `.br` files). It prints the distinct citations for LND-4.
Run it last, after every data PR has merged.

`make imagery` (PIPE-10) writes `web/public/data/imagery/{region}.webp` + `.json` (contract
`imagery`): LROC NAC south-pole mosaic (`LRO_NAC_AvgMosaic_SPole855_1mp`, 1 m/px to 85.5 S) from the
Moon Trek WMTS `https://trek.nasa.gov/tiles/Moon/SP/<layer>/1.0.0/WMTSCapabilities.xml`. Same
projection as the PGDA DEM (FGDC metadata: polar stereographic, lon 0, true scale at -90, R 1737.4
km). Trek's deepest level is 11 (4.18 m/px; 12 is 404), ~19 x 19 PNG tiles per region, cached in
`data/cache/trek/` (~2.5 min first run). Extent = the PIPE-4 near-field tile footprint (+-10 km,
80 m DEM pixel edges), averaged to 4096 x 4096 (4.88 m/px). Image row 0 is `y_min` (rows grow with +y, the
common.schema.json raster convention, not north-up), col 0 is `x_min`. The few source nodata pixels
(28-263 per region) are filled from their neighbours, so `nodata` is null. Greyscale encoded as RGB
WebP (lossy: decoded channels may differ slightly); quality steps down until each file is
<= min(4 MB, 6 MB / regions).
Check against the DEM: a sun-free slope model (brightness ~ gx, gy, |g|) fits r = 0.91 / 0.82 /
0.94 (connecting-ridge / haworth / malapert) as delivered, against the 80 m DEM window in contract
row order (row 0 = y_min), vs <= 0.30 / 0.44 / 0.79 for the best of the 7 other flips/rotations.

## Shared interfaces

- `config.load_config(path=None) -> Config`: frozen dataclasses and read-only region mapping;
  missing/unknown keys fail by name. UTC timestamps are parsed to timezone-aware datetimes.
- `binio.write_array(path, array, header)`: `.bin` plus adjacent `.json`; C-order, little-endian,
  real numeric arrays, no precision conversion. Headers require `schema_version` (integer 1),
  `generated_at` (UTC ISO 8601), `source_urls` (URL list) and `dtype`. Generic internal headers
  also require explicit `shape` (integer list) and `units` (string). Exported tile/ephem headers
  carry their own descriptors instead: ephem `n` + `fields` derives shape (n, len(fields)) with
  per-column units and no top-level `units`; tile `nx` + `ny` derives shape (ny, nx) and still
  requires `units`. Additional contract fields survive. `read_array(path)` returns `(array, header)`;
  nonempty arrays are read-only memory maps. Writes buffer byte swapping in small chunks.
- `fetch.cached_get(url, cache_dir, *, params=None, session=None, retries=3, backoff=0.5,
  sleep=time.sleep) -> bytes`: for small API responses; cache key includes query parameters.
- `fetch.download(url, path, sha256, *, session=None, retries=3, backoff=0.5,
  sleep=time.sleep) -> Path`: 1 MiB streamed chunks, resumable `.part` plus identity sidecar,
  verified SHA-256 before atomic promotion. Inject a requests-compatible transport in tests.
  `retries` counts additional attempts. Interrupted streams retain partial bytes; a checksum
  mismatch removes them. A correct existing destination avoids the network.
- `schemas.validate(kind, obj)`: load `contracts/schemas/<kind>.schema.json`. Missing schemas
  warn once per kind; invalid present schemas/objects raise. Remote reference retrieval is disabled.

Metres for terrain and south polar stereographic grids, degrees for angles, UTC for time,
Moon-fixed `MOON_ME`, east-positive longitude in [-180, 180]. SPEC ephemeris distances remain
explicitly named `sun_dist_km`/`earth_dist_km` in kilometres.

Raw/cache downloads live in ignored `data/`; outputs eventually go to `web/public/data/`.
Never load a whole DEM: later stages must use rasterio windows. See [NOTES.md](NOTES.md)
for provenance, limitations, adversarial coverage, and downstream handoff.
