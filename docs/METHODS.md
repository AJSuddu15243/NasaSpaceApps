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
4. **Thermal estimate** — instantaneous radiative-equilibrium temperature from solar
   exposure, surface slope/aspect and assumed surface properties (see Assumptions).
5. **Scoring** — a weighted combination of the above metrics with per-metric
   status (good / marginal / poor) and an explainable comparison table.

## Assumptions (stated wherever they matter)

- **No lunar atmosphere**: the horizon is terrain plus the lunar sphere only; no refraction.
- **Horizon masks** (native `masks` bin, ENG-3):
  - The observer stands **2 m above the DEM surface** (`--observer-m 2`, a CLI flag, not stored in the mask
    file). Without it, bilinear sampling makes a site shade itself.
  - Rays march great circles on the 1737.4 km sphere out to **150 km** (`--max-km`), so far mountains set the
    horizon (SPEC guardrail 4). The far tiles are ±165 km (150 km + a 15 km margin for off-centre heatmap
    cells), so every ray runs the full distance: the shortest ends at its last 240 m sample, **149.8 km**, in
    all 3 regions (it was 139.3–139.8 km with ±150 km tiles; the bin warns if a ray stops at a tile edge).
  - **Fixed step = the cell size of the tile being sampled** (80 m near tile, then 240 m far tile). The first
    sample is one step out. Measured 2026-11-14 (release, 8 threads, Apple-silicon laptop): **~10 s per region**
    (15,625 grid cells + its site, ~1,530 cells/s), so the growing step was not needed.
  - **Each bin is a sector max**: the highest elevation over 4 sub-rays spread across the bin (360 bins per
    curated site, 64 per grid cell). This errs towards less Sun and Earth, the safe side.
- **Time steps**: windows are sampled at a **fixed step** (`step_hours`, default 1 h, from the hourly Horizons
  table), each sample weighted by the step. Sunset and Earthset times are interpolated between samples.
  Dark and blackout runs are clipped at the window edges.
- **Solar**: lit = fraction of the Sun's 0.53° disk above the mask line at the Sun's azimuth. **Lunar eclipses
  are folded in**: lit is multiplied by the part of the Sun's disk not covered by the Earth (geometric disk
  overlap; no penumbra or limb-darkening model).
- **Direct-to-Earth**: Earth's centre must clear the mask plus an antenna margin. **A DSN station is assumed to
  see the Moon, and relays are ignored.**
- **Thermal: simplified, no thermal inertia.** Instantaneous radiative equilibrium,
  T = ((1 − A) · S · max(0, n·ŝ) · lit / (ε σ))^¼, A = 0.12, ε = 0.95, S = 1361 W/m² × (1 AU / r)², n from
  the DEM slope and aspect. **Shadowed ground is floored at 40 K** (the real night surface is warmer, so cold
  extremes are bounded, not modelled). Diviner measurements are the reference where available.
- **Night-survival (battery) gate**: a site "survives the night" when its longest dark run is no longer than
  `battery_h` (default 48 h; `0` turns the gate off). On the heatmap the gate is **off by default**: a 48 h gate
  blanks 81–97% of cells over the 14-day demo window (`.agent/GREEDY.md`).
- **Rock layer is a proxy** (DEM roughness), weight 0 by default, labelled as a proxy (PIPE-6).
- **Synthetic demonstration data**: `web/public/data/mock/` supplies stand-ins for `demo-*` sites. The UI labels
  synthetic values explicitly and never presents them as measurements.
- Ephemeris is tabulated hourly (2026–2030); a live "now" mode and
  Astronomy-Engine fallback are planned (EPH-1/EPH-2).

## Validation status

- Contract validation: every data file is schema-checked against
  `contracts/schemas/` (`contracts/src/validate-data.mjs`); unknown or missing
  fields are rejected at the engine boundary.
- Accuracy validation: `pipeline validate` writes JPL Horizons topocentric Sun/Earth az/el samples for 3
  curated sites (`web/public/data/validation/`). The engine's geometry matches all 4,320 samples to under
  0.01° for the Sun and 0.02° for Earth (`engine/tests/geometry_validation.rs`, azimuth compared as a direction).
- Determinism: the engine hashes its outputs (FNV-1a 64); golden hashes from the WASM build are checked in CI
  (`web/src/engine/engine.test.ts`).
- Lighting, contact and thermal numbers are *demonstration-grade*, not flight-grade: the masks and thermal model
  carry the simplifications listed above.

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
