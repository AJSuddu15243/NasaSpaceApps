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

`make tiles` (PIPE-4) cuts the DEM per config region into float32 tiles (contract `tile`; rows grow
with +y, so the DEM is flipped; cells are block means snapped to DEM pixel edges):
- far field ±`max_distance_km` at `far_field_m` → `pipeline/data/tiles/{region}_240m.bin` (pipeline-only:
  ~6 MB each, mask-builder input);
- near field ±10 km at `near_field_m` → `web/public/data/tiles/{region}_80m.bin` (shipped, 250 KB each).
`coords.to_xy` / `to_latlon` convert lat/lon ↔ south polar stereographic metres (R = 1737.4 km).

`make layers` (PIPE-5) writes `web/public/data/grid/{region}.bin` + `.json` (contract `grid`): ±10 km at
160 m (125 × 125, 312 KB per region), float32 layers `slope_deg, aspect_deg, elev_m, crater_depth_m,
roughness_deg`, computed at 80 m with a 640 m margin, then 2 × 2 aggregated. Slope uses Horn's method and
the **max** of the 2 × 2 (conservative for the hard slope limit); aspect is the downhill direction clockwise
from local north (0 on flat cells); crater depth is max − min within 500 m after removing the
least-squares plane (so regional slope isn't counted as depth); roughness is the std-dev of
slope over 5 × 5. The mask layer is added by PIPE-8.

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
