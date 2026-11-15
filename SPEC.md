# SPEC: Lunar Landing Site Navigator

Mission-control science extension: region grids may also contain `sun_avg`, `earth_avg`, `psr`,
and `ice_favorability` float32 scalar fraction layers. The first three are long-term PGDA 69 products;
IFI is the Cannon & Britt 2020 geologic model at native 591 m resolution, preserving nodata.
These optional layers do not change the engine API. See [the handoff](docs/handoff/MISSION-CONTROL.md).

> **Build spec for the team proposal in [`docs/PROPOSAL.md`](docs/PROPOSAL.md)** (the proposal wins if they
> disagree). Builds on the draft [`.agent/PLAN.md`](.agent/PLAN.md) and follows the engineering guardrails in
> [`.agent/STACK_REVIEW.md`](.agent/STACK_REVIEW.md). Official challenge text: [`docs/CHALLENGE.md`](docs/CHALLENGE.md).

**Pitch:** "Launch slipped two weeks? In seconds, see which south-pole landing sites still get enough sunlight,
safe temperatures and Earth contact, computed by a deterministic Rust/WASM engine from real LOLA terrain and
JPL ephemerides."

## Features (from the proposal; nothing cut)

| # | Feature | What the user gets | Proposal / challenge objective |
|---|---|---|---|
| 1 | **Deterministic Rust/WASM simulation engine** | Solar illumination, thermal exposure and DTE radio visibility for any site and time, computed in the browser; same inputs → same output hash on every machine; validation panel vs JPL Horizons | Simulation core, ephemeris & horizon positioning, accuracy |
| 2 | **Interactive timeline scrubber + launch-delay mode** | Scrub dates, times, lunar days, seasons and multi-year epochs; "slip the launch" slider re-scores every site instantly; viability calendar of good landing dates | Dynamic time control & launch-window scrubbing |
| 3 | **Weighted greedy site evaluator** | Custom weights for continuous sunlight, Earth contact, low slope, crater depth, rock distribution; greedy top-N landing *areas*; "nearby better spot" | Multi-site comparison & optimization |
| 4 | **Multi-site heatmaps + side-by-side compare** | GPU-rendered suitability heatmaps; probe any point; compare cards with green/yellow/red badges and sunset/Earthset countdowns | Multi-site heatmap overlays, rapid comparison |
| 5 | **3D experience** | three.js landing page (intro animation, what / why / how / team / resources); in-app 3D globe + local south-pole mesh with GLSL lighting, shadows and skybox; 360° horizon panorama with Sun and Earth paths | Accessibility, multiple visualisations, temporal dynamics |

Modes: **Planner** (numbers, editable thresholds and weights, CSV export) and **Explorer** (plain-language
explanations for students and the public).

## Tech stack (from the proposal)
- **Simulation core:** Rust → WebAssembly via `wasm-pack` / `wasm-bindgen`. Precompiled `.wasm` committed to
  `web/src/engine/pkg/` so users never wait for compilation. (Emscripten is the C/C++ toolchain; not needed.)
- **3D:** React Three Fiber (three.js) for the globe, local landing meshes and skybox lighting.
- **GPU shaders:** custom GLSL for elevation shading, shadows, lighting gradients and heatmaps.
- **UI:** React + Tailwind + shadcn/ui + Kokonut UI (React Bits for landing-page accents), minimal styling to
  leave GPU headroom for the canvas.
- **Terrain:** LOLA DEMs via NASA Moon Trek and LROC QuickMap (their download / tile APIs); direct LOLA GeoTIFF
  from PGDA (`https://pgda.gsfc.nasa.gov/data/LOLA_20mpp/LDEM_80S_80MPP_ADJ.TIF`, 181 MB) as fallback. Existing
  ADC grids in `LunarLandingSiteNavigation/data/` for high-res local meshes.
- **Ephemeris:** **Astronomy Engine (JS)** for real-time Sun/Earth at any date while scrubbing; **JPL Horizons**
  for a precomputed reference table (hourly 2026–2030) used for validation and the determinism demo.

## Engineering guardrails (from STACK_REVIEW; they keep the features working, they don't cut any)
1. **Astronomy Engine can't put an observer on the Moon.** Compute Moon→Sun and Moon→Earth vectors
   (`GeoVector(Sun)` − `GeoMoon`, and −`GeoMoon`), then rotate into the Moon-fixed frame with
   `RotationAxis(Body.Moon)`. About 50 lines; unit-test it against the Horizons table.
2. **Determinism across browsers.** JS trig can differ in the last bits, so quantize Astronomy Engine outputs
   (round to 1e-7 rad) before handing them to WASM. The determinism hash is computed from the shipped Horizons
   table inputs, which are bit-identical everywhere.
   *ENG-8 deviation:* ephem rows are f32, whose ulp (~3e-5° at 360°) is coarser than 1e-7 rad (~5.7e-6°), so the
   engine's `quantize_ephem` snaps the angle columns to 2^-13° (~1.2e-4°, ~2.1e-6 rad; exact in f32, far below
   the 0.01° accuracy bar) and leaves distances as f32.
3. **Horizons is offline only** (no browser CORS, network round-trip). Use it to build and validate the table.
4. **Horizons need far terrain.** South-pole horizons are set by mountains 100+ km away: build masks from a wide
   DEM with lunar curvature, not from a cropped landing area.
5. **Physics stays in WASM; GLSL only draws.** The GPU never computes or reads back results.
6. **Threads:** several Web Workers, each with its own WASM instance (no COOP/COEP headers needed).
7. **R3F:** keep sim data in refs, not React state, so sliders don't re-render the scene.
8. **Rendering budget:** low-res whole-Moon sphere + high-res patches per region; heatmap textures R16F or RGBA8.

## Simulation model (Rust engine)
- **Horizon mask** (precomputed natively in Rust): per site, max terrain elevation angle per azimuth bin out to
  ~150 km, 3D vectors on a 1737.4 km sphere + DEM height; no refraction. 360 bins for curated sites, 64 bins
  for heatmap cells.
- **Sun/Earth az/el:** vector from site to body in the site's East-North-Up frame, from sub-solar / sub-Earth
  points and distances (Moon-fixed); includes Earth parallax (~0.26°) and libration.
- **Solar:** lit fraction of the 0.53° disk above the mask; power ∝ lit · cos(elev) (vertical tracking panel) and
  lit · sin(elev) (horizontal panel); % lit, longest darkness, time to sunset.
- **Thermal exposure:** instantaneous radiative-equilibrium surface temperature,
  T = ((1 − A) · S · max(0, n·ŝ) · lit / (ε σ))^¼ with A ≈ 0.12, ε ≈ 0.95, S = 1361 W/m² × (1 AU / r)², n = local
  surface normal from the DEM slope and aspect; shadowed hours are floored at a fixed 40 K (`T_FLOOR_K`, not user-set). Metrics: min/max temperature and hours below a user-set survival temperature (default 233 K with a 48 h battery night gate on the site cards, both editable in Planner; the heatmap's `GRID_PARAMS` sets `battery_h` 0, so its gate is off; `MOCK_PARAMS`, 100 K, applies to the demo-* fixtures only). Label it "simplified, no thermal
  inertia" and show Diviner measurements as a reference where available.
- **DTE radio visibility:** Earth centre above the mask + antenna margin; % contact, longest blackout, time to
  Earthset. Stated assumption: a DSN station can see the Moon; no relays.
- **Badge thresholds (fixed defaults, `DEFAULT_THRESHOLDS`):** sunlit ≥ 40 %, Earth contact ≥ 40 %,
  longest darkness ≤ 180 h, longest blackout ≤ 180 h; 2+ failed checks = red, 1 = yellow.
- **Terrain factors:** slope (hard limit, default 10°; a 160 m grid cell takes the max of its 80 m slopes), aspect
  (downhill direction, for the thermal surface normal), crater depth (detrended local relief within 500 m) and roughness
  (std-dev of slope over 5 × 5 cells of 80 m) from the DEM. **Rock distribution:** no public
  rock-abundance or boulder raster covers 85–90° S (Diviner and NAC boulder maps stop at 60° S; search in
  `pipeline/README.md`), so `rock` is a DEM roughness proxy, clip(roughness / 5°, 0, 1), flagged `proxy: true`
  in the grid header. Its weight defaults to 0 and the UI must label it as a proxy, not measured rocks.
- **Weighted greedy evaluator:** score = Σ wᵢ · normalized factorᵢ (weights are UI sliders). Average over a
  base-sized window, pick the best, exclude its surroundings, repeat → top-N areas. "Nearby better spot" = best
  cell within R km of a chosen site.
- **Determinism:** fixed time step, fixed loop order, no fast-math, no unseeded randomness; `output_hash()`
  shown in the UI. ENG-8: FNV-1a 64 (16 hex) over an engine tag + canonical little-endian bytes (one NaN,
  -0 → +0, a tag byte before optional fields, contract field order); extra exports `metrics_hash(Metrics[])`
  and `quantize_ephem(Float32Array)`. `output_hash(bytes)` hashes raw bytes; `output_hash_f32(Float32Array)` is the
  canonical one, and the facade's `outputHash` uses it for every Float32Array (WASM NaN payloads are unspecified).

## File contracts (agree first; build on mocks until real data lands)
The source of truth is [`contracts/`](contracts/README.md): one JSON Schema per kind in `contracts/schemas/`
(fields, units, frames, byte layout), generated TypeScript types in `web/src/contracts/`, and
`pnpm validate-data` to check real and mock files. Paths below are under `web/public/data/`.

| Path | Schema |
|---|---|
| `sites.json` | `sites` |
| `masks/{site_id}.json` | `site-mask` |
| `ephem.bin` + `ephem.json` | `ephem` |
| `grid/{region}.bin` + `.json` | `grid` |
| `tiles/{region}_{res}m.bin` + `.json` | `tile` |
| `validation/{site_id}.json` | `validation` |
| `imagery/{region}.webp` + `.json` | `imagery` |
| `manifest.json` | `manifest` |

- `mock/`: same layout and schemas, fake values (owned by W3).
- `web/src/ephem/`: `sunEarthAt(date)` returns one row of the `ephem` fields (Astronomy Engine, quantized).
- Engine API (`engine/`, wrapped by `web/src/engine/index.ts`; `mock.ts` serves `demo-*` sites only), with `Params`,
  `Weights`, `Metrics` and `Area` defined in the `engine-api` schema (proposed until the engine and web owners
  sign off):
  `site_metrics(mask, ephem, t_start, hours, params) -> Metrics` (solar, thermal, DTE),
  `grid_scores(grid, ephem, t_start, hours, weights) -> Float32Array`,
  `top_areas(scores, window_cells, n) -> Area[]`, `output_hash(...) -> string`.
  **Rust/WASM signature change (ENG-4/9, decided with Ananth 2026-11-14; contract schema update is a follow-up
  PR):** `site_metrics(geom, mask, ephem, t_start_h, hours, params)` with `geom = {lat_deg, lon_deg, elev_m,
  slope_deg, aspect_deg?}`, `mask` a Float32Array (any bin count) and `t_start_h` in hours since the ephem `t0`;
  `site_extras` and `site_track` take the same arguments. The TS facade keeps
  `site_metrics(mask: SiteMask, table, t_start: ISO string, hours, params)`, builds `geom` from the SiteMask and
  converts ISO to hours; real masks and ephem run the WASM; `demo-*` sites stay on `mock.ts`.
  Grid exports (ENG-6/7, same follow-up for the schema text; design in [`.agent/GREEDY.md`](.agent/GREEDY.md)):
  `grid_scores(grid, header, ephem, t_start_h, hours, weights, params)`,
  `top_areas(scores, header, window_cells, exclusion_m, n)`, plus `grid_fracs(grid, header, ephem, t_start_h,
  hours, params)`, `scores_from_fracs(grid, header, fracs, weights, params)`, `psr_flags(grid, header)`,
  `window_cells(base_m, cell_m)`, `nearby_better(grid, header, fracs, weights, params, window_cells, x_m, y_m,
  radius_m)` and `window_factors(grid, header, fracs, params, window_cells, x_m, y_m)`.

## Curated sites (seed list; W6 verifies coordinates and cites sources)
Artemis III candidate regions (Peak near Cabeus B, Haworth, Malapert Massif, Mons Mouton Plateau, Mons Mouton,
Nobile Rim 1 and 2, de Gerlache Rim 2, Slater Plain) · Shackleton rim / Connecting Ridge · IM-2 (Mons Mouton
area) · Chandrayaan-3 · Chang'e-7 target area · Apollo 11 and 17 (equatorial contrast for Explorer mode).

## Workstreams (one Conductor workspace each; no folder overlap)

Issue-level breakdown (owners, milestones, challenge coverage): [`docs/TASKS.md`](docs/TASKS.md); GitHub issues hold the live status.
Pipeline layout and rules: [`pipeline/AGENTS.md`](pipeline/AGENTS.md).

Models assume Claude Pro + ChatGPT Pro. Claude seats (Fable, Opus) share one 5-hour window, so the volume work runs on Codex; if Claude runs low, move W3 to GPT-6.1 Sol.

| # | Folder | Task | Model | Start |
|---|---|---|---|---|
| W1 | `pipeline/` | Terrain via Trek/QuickMap APIs (PGDA fallback) → raw tiles; Horizons reference table; rock-data search; validation script | GPT-6.1 Sol (Codex), high | Now |
| W2 | `engine/` | Rust: masks (native), solar, thermal, DTE, terrain factors, greedy evaluator, hash; tests; `wasm-pack build` → `web/src/engine/pkg/` | Fable 5.2 (Claude), high | Now |
| W3 | `web/` shell | Vite + React + TS + Tailwind + shadcn + Kokonut; routes `/` and `/app`; picker, compare cards, timeline scrubber + delay slider, calendar, panorama, weight sliders; engine adapter + mocks; Vercel | Opus 5.5 (Claude), high | Now |
| W6 | `web/public/data/sites.json` | Curated sites with sources | GPT-6.1 Terra (Codex) | Now |
| W7 | `web/src/ephem/` | Astronomy Engine → Moon-fixed Sun/Earth (guardrails 1–2), tests vs Horizons table | GPT-6.1 Sol (Codex), high | Now |
| W4 | `web/src/scene/` | R3F globe + south-pole mesh, GLSL lighting / shadows / heatmap, skybox, site markers, click-to-probe | GPT-6 Astra (Codex), high | Now (on mocks) |
| W5 | `web/src/landing/` | three.js landing page + intro animation; what / why / how / team / resources | GPT-6.1 Sol (Codex) | Now |
| W8 | `docs/` | Explorer-mode copy, method notes, README, pitch script | Claude chat | Anytime |
| R | none (review only) | Review every PR against SPEC + contracts before merge; run tests and the app | GPT-6 Astra (Codex) or Opus 5.5, fresh workspace | From first PR |

## Timeline (hours from start)
- H0–1: merge this spec; W3 creates mock data and the engine adapter so every UI piece has data on day one.
- H1–4: W1 proves one terrain tile and the Horizons table; W2 proves one mask and site metrics; W3 skeleton deployed.
- H4–12: MVP on real data: compare cards, scrubber + delay slider, panorama, thermal + DTE metrics, hash.
- H12–20: heatmaps + greedy top-N, 3D scene, landing page, validation panel, Explorer mode.
- H20+: feature freeze, polish, demo video, slides. Long precompute jobs run overnight.

## Demo script (2 min)
1. Landing page intro flies into the south pole; one sentence on why the pole is hard.
2. Default scenario 2027-01-15, 336 h: Haworth red, Connecting Ridge and Malapert green. "Our launch slipped a
   week": +7 d slip kills Earth contact at every site and all three turn red.
3. Panorama + timeline: the Sun skims the ridge, Earth dips below the horizon; sunset/Earthset countdowns; temperature drops.
4. Greedy evaluator: adjust weights, the heatmap updates, top-3 areas appear, "1.2 km away gets +18% sunlight".
5. Validation vs JPL Horizons + the identical determinism hash on two laptops; Explorer mode for classrooms.

## Definition of done (MVP)
3+ curated sites and a date → side-by-side cards with solar, thermal and DTE metrics and badges; scrubber and
delay slider re-score instantly; panorama for the selected site; numbers validated against Horizons for 2+ sites;
same hash on two browsers; deployed URL. Stretch: everything else in the features table.
