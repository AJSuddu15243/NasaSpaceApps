# Methods, data sources and assumptions

How Lunar Window turns lunar data into landing-site comparisons. This document
is the reproducibility contract: what we compute, where the inputs come from,
and what we assume. It describes the *designed* system; where a piece is still
scaffolded or running on synthetic stand-ins, that is stated explicitly.

## Coordinate frames and units

- All positions are reported in the **Moon-fixed mean-Earth frame (MOON_ME)**:
  latitude/longitude in degrees, east-positive longitude, negative southern
  latitude. The frame rotates with the Moon so site coordinates never drift.
- Terrain grids use NASA's shipped **south polar stereographic** projection in
  metres (R = 1737.4 km); conversion to lat/lon happens only at the edges
  (`pipeline/src/lunar_pipeline/coords.py`).
- Times are UTC ISO 8601; the app works in hours for window metrics.

## Pipeline (`pipeline/`)

Stages run in order and are idempotent (`make all`):

`ephem` → `terrain-fetch`/`tiles` → `layers` → `masks` → `validate` →
`imagery` → `package`

| Stage | What it produces | Source |
|---|---|---|
| `ephem` | `ephem.bin`/`ephem.json`: hourly Sun and Earth sub-points, distances, 2026–2030 | JPL Horizons (`pipeline/src/lunar_pipeline/horizons.py`) |
| `terrain` | Float32 elevation tiles + JSON headers | NASA Moon Trek / LROC QuickMap APIs, PGDA LOLA GeoTIFF fallback (`terrain/trek.py`, `terrain/pgda.py`) |
| `layers` | Slope, crater depth (local relief), roughness proxy, rock layer | Derived from elevation tiles (`terrain/layers.py`) |
| `masks` | Per-site horizon masks via the engine's native Rust bin | `engine/src/bin/masks.rs` |
| `validate` | Horizons topocentric az/el samples per curated site | JPL Horizons |
| `imagery` | Surface imagery textures | NASA Moon Trek / LROC |
| `package` | `manifest.json` with per-file SHA-256 and `source_urls` | — |

Every binary output carries a JSON header with `schema_version`, `source_urls`,
`generated_at`, shape and dtype. Raw downloads stay in `pipeline/data/` (gitignored)
and are checksum-verified. Shipped data budget: under 25 MB in `web/public/data/`.

## Engine (`engine/`)

One Rust crate, two outputs:

- **WASM library** (`src/lib.rs`) shipped to the web app via `wasm-pack`
  (wasm-opt `-O`, fails the build over 1.5 MB). Objects cross the boundary as
  JSON through `contracts.rs`/`contracts/schemas`; bulk arrays cross as typed
  arrays.
- **Native `masks` bin** — offline horizon-mask builder invoked by the pipeline;
  never shipped to the browser.

Determinism rules: fixed loop order, no fast-math, no unseeded randomness, f64
accumulation, pinned `rust-toolchain.toml`. Same inputs → same outputs, which is
what makes shareable scenario URLs meaningful.

## What the app computes

For a scenario (set of sites + date/window + weights):

1. **Horizon masking** — for each site and each azimuth, the elevation angle at
   which local terrain blocks the sky. Built offline by the native masks bin from
   the elevation tiles.
2. **Illumination** — hourly Sun az/el from `ephem.bin`; a site is sunlit when the
   Sun clears the local horizon mask. Produces sunlit hours and longest darkness.
3. **Earth visibility** — same geometry against the sub-Earth point: Earth-visible
   hours, longest blackout, and direct-to-Earth contact windows.
4. **Thermal estimate** — equilibrium-temperature proxy from solar exposure and
   assumed surface properties (see Assumptions).
5. **Scoring** — a weighted combination of the above metrics with per-metric
   status (good / marginal / poor) and an explainable comparison table.

## Assumptions (stated wherever they matter)

- **No lunar atmosphere**: the horizon is terrain plus the lunar disk only.
- **No thermal inertia model yet**: temperature is an equilibrium estimate, not a
  transient simulation (ENG-5).
- **Rock layer is a proxy** until a polar rock distribution source is confirmed
  (PIPE-6).
- **Synthetic demonstration data**: until the pipeline's real outputs are
  packaged, `web/public/data/mock/` supplies stand-ins. The UI labels synthetic
  values explicitly and never presents them as measurements.
- Ephemeris is tabulated hourly (2026–2030); a live "now" mode and
  Astronomy-Engine fallback are planned (EPH-1/EPH-2).

## Validation status

- Contract validation: every data file is schema-checked against
  `contracts/schemas/` (`contracts/src/validate-data.mjs`); unknown or missing
  fields are rejected at the engine boundary.
- Accuracy validation: `pipeline validate` produces JPL Horizons topocentric
  Sun/Earth az/el samples per curated site for comparison against engine output
  (PIPE-7, in progress — PR #86).
- Until the validation set lands, illumination/contact numbers should be read as
  *demonstration-grade*, not flight-grade.

## Citations

Primary sources are cited per-file in each JSON header and aggregated in
`web/public/data/manifest.json` (`source_urls` per file):

- NASA Moon Trek / LROC QuickMap — terrain imagery and elevation services
- PGDA LOLA GeoTIFF — LOLA elevation fallback
- JPL Horizons — Sun/Earth ephemerides and validation samples
- NASA SVS / LROC WAC — global imagery mosaic (landing page texture)

## License and attribution

Project code is proprietary to the team unless a LICENSE file is added.
NASA data products are used under NASA's open data policies; each dataset keeps
its own citation in the file headers above — please preserve them when
redistributing derived products.
