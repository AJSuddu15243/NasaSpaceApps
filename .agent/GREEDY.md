# Design: Weighted scoring + greedy top-N areas (ENG-6, ENG-7)

> **Design agreed with Ananth 2026-11-14 (decisions 1–10 below). Implemented:** ENG-6 in `engine/src/score.rs`
> (`score_cells`, `cell_factors`, `grid_fracs`, `scores_from_fracs`, `psr_flags`), ENG-7 in `engine/src/greedy.rs`
> (`window_cells`, `top_areas`, `nearby_better`, `window_factors`); WASM exports + typed wrappers in `web/src/engine/index.ts`.
> Contracts: `SPEC.md` (engine API, grid format). Issues: #21 (ENG-6), #22 (ENG-7).

## Why this can be built now
Scoring and greedy selection only read **per-cell factor layers** (plain `f32` arrays, `nx × ny`, row-major).
They never touch horizon masks, ephemeris, or the pipeline. So we build and test them on hand-made and mock
grids now; later ENG-4/ENG-5 fill the sun/earth/thermal layers and the pipeline fills slope/crater/rock.

```
pipeline ─► slope_deg, crater_depth_m, rock ─┐
ENG-4    ─► sun_frac, earth_frac ────────────┼─► score_cells(weights) ─► score[] ─► top_areas() ─► Area[]
ENG-5    ─► cold_frac ───────────────────────┘          (ENG-6)                     (ENG-7)   nearby_better()
```

## Step 1: Normalise each factor to [0, 1], higher = better (ENG-6)

| Factor | Source layer | Normalised `f` | Notes |
|---|---|---|---|
| Sun | `sun_frac` (0–1) | `sun_frac` | per-cell `pct_lit / 100` (contract `Metrics`) |
| Earth | `earth_frac` (0–1) | `earth_frac` | per-cell `pct_earth_visible / 100` |
| Slope | `slope_deg` | `1 − slope / slope_max` | **hard limit**: `slope > slope_max` → cell excluded (default 10°) |
| Crater depth | `crater_depth_m` | `1 − clamp(depth / depth_ref, 0, 1)` | `depth_ref = 50 m` (decided) |
| Rock | `rock` | `1 − clamp(rock / rock_ref, 0, 1)` | weight defaults to 0; `rock_ref` set once PIPE-6 picks a source |
| Thermal | `cold_frac` = `h_below_survival / hours` | `1 − cold_frac` | from ENG-5; survival temp default **233 K / −40 °C** (decided 6) |

**Decided (1): hybrid.** Scores and ranking use the fixed ranges above, so a score means the same in every
region. Min-max is used only to stretch heatmap colours for display (SCN-4); it never feeds the score.

## Step 2: Weighted cell score (ENG-6)
```
valid[c] = slope[c] ≤ slope_max  AND  every factor with weight > 0 is finite at c
score[c] = Σ wᵢ·fᵢ[c] / Σ wᵢ        if valid[c]
         = NaN                       otherwise   (NaN = "excluded", the heatmap draws it as no-go)
```
- Default weights (decided, power-first): sun 0.35, earth 0.25, slope 0.20, thermal 0.10, crater 0.10, rock 0.
- Dividing by `Σ wᵢ` keeps scores in [0, 1] whatever the sliders add up to. All weights 0 → error, not NaN grid.
- A factor with weight 0 is ignored entirely, so "rock: no data" (NaN layer) doesn't exclude anything.
- PSR flag is a **separate `u8` layer**, not a score factor (sun% already ~0 there). Rule from #21:
  mask above `90 − |lat| + 1.54 + 0.27` degrees in every azimuth bin (`psr_flags`, Err when the grid has no mask layer).
- Night-survival gate (Ananth, 2026-11-14): after `score_cells`, a cell is NaN when `longest_dark_h > battery_h`; `battery_h = 0`
  turns it off. **The heatmap default is gate off** (see "Results on the real grids").

## Step 3: Window average = "is the whole base footprint good?" (ENG-7)
- Base footprint is a `k × k` cell window, **`k` = the smallest odd integer ≥ `base_m / cell_m`** (clarified
  2026-11-14: odd so the window has a centre cell for `Area.x_m/y_m`, never smaller than the base). Default
  `base_m = 400`: **k = 3 (480 m) at the shipped 160 m grid cells**, 5 at 80 m, 3 at 240 m. `window_cells(base_m, cell_m)`
  computes it. Window score = mean of `score` inside. Windows that cross the grid edge are invalid.
- A window is **valid only if every cell in it is valid** (decided): a base can't straddle a cliff edge. If no window
  is valid, return an empty list; the UI shows a "no landable area" state (WEB-11).
- Computed with two summed-area tables (sum of scores, count of invalid cells) → O(1) per window,
  O(nx·ny) total regardless of `k`. Accumulate in `f64` in fixed row-major order (determinism).

## Step 4: Greedy top-N with exclusion radius (ENG-7)
```
cands = all valid windows, sorted by (window_score desc, cell index asc)   // index tie-break = deterministic
picked = []
for w in cands:
    if every p in picked has dist(w, p) ≥ exclusion_m: picked.push(w)   // default exclusion_m = 2000
    if picked.len() == n: break
```
- Distance check against ≤ N picked centres instead of painting an exclusion bitmap: simpler, same result.
- Cost: O(M log M + M·N), M = cells. For a 1000×1000 grid that's well under the 100 ms budget *(unverified)*.
- Output per area: contract `Area` (`x_m, y_m, lat, lon, score, radius_m`; best first, so rank = index), with
  `radius_m = exclusion_m`. **Proposed addition** (needs FND-1 sign-off): `factors: {sun, earth, slope, crater,
  rock, thermal}`, the window means of each normalised factor, so the UI can say *why* an area ranked.
- Honest caveat: greedy gives the true #1, then the best non-overlapping #2, etc. It does not maximise the
  *sum* of N scores. For a ranked list that's the behaviour we want.

## Step 5: `nearby_better(site, radius_m)` (ENG-7)
- Among valid windows whose centre is within `radius_m` of `site`, return the best one (ties: nearer, then index).
- Return `{ x_m, y_m, lat, lon, dist_m, score, site_score, site_valid, delta: {sun, earth, slope, crater, rock, thermal} }`
  (`delta` = best − site window means of the normalised factors) → powers "1.2 km away gets +18% sunlight", or `null`
  when no window qualifies. The site is the grid cell containing its (x, y); distances are from that cell's centre,
  Euclidean in projected metres, `radius_m` in metres. The site is compared through its **own 64-bin grid window**, not
  its 360-bin card metrics, so deltas are not a bin-count artefact.
- If the site's own window is invalid (e.g. on a steep slope), still return the best nearby, flagged `site_valid: false`
  (`site_score: null`); factor deltas are still given (factors are computed past the slope limit, only the score excludes).
- `window_factors(grid, header, fracs, params, k, x_m, y_m)` returns the same factor means for any area or site
  (why it ranked), so `Area` needs no `factors` field.

## Contract gap in SPEC
`top_areas(scores, window_cells, n)` can't work as written: it also needs `nx, ny, cell_m` and `exclusion_m`.
**Decided (Ananth, 2026-11-14):** `top_areas(scores, header: GridHeader, window_cells, exclusion_m, n) -> Area[]`;
the header gives `nx, ny, x0, y0, cell_m` and the CRS for `Area.lat/lon`. Engine-only PR; the PR body flags the
web/contracts owners that SPEC, the engine-api schema and TS types need the matching update.
The same gap hits `grid_scores(grid, ...)`: raw `.bin` bytes carry no `nx, ny` or layer offsets, so it also needs
the `GridHeader`. ENG-1 stubs keep SPEC's signatures until the team agrees (see the ENG-1 PR).

## Tests on hand-made grids (acceptance for #21 / #22)
1. Single bright cell on a flat grid → it ranks #1; its neighbours within `exclusion_m` never appear.
2. Two peaks closer than `exclusion_m` → only the higher one is picked; a farther lower peak is #2.
3. Great score next to one over-slope cell → that window is invalid; the window beside it wins.
4. Equal scores everywhere → picks are in index order (determinism).
5. All weights 0 → error. Weight on a NaN layer → those cells excluded; weight 0 on it → unaffected.
6. Doubling every weight → identical scores (normalisation by Σw).
7. `nearby_better` with radius 0 → returns the site itself, deltas 0.
8. Same inputs twice → bit-identical output (feeds ENG-8 hash).

## Decisions
1. ~~Normalisation~~: **decided, hybrid** (fixed ranges for scores, min-max for display colours only).
2. ~~Base footprint + exclusion radius~~: **decided, 400 m footprint (3×3 = 480 m at the shipped 160 m cells, 5×5 at 80 m; see step 3) / 2 km exclusion**; both adjustable in the UI.
3. ~~`depth_ref`~~: **decided, 50 m**. `rock_ref` deferred until PIPE-6 picks a source.
4. ~~Default weights~~: **decided, power-first** (sun 0.35, earth 0.25, slope 0.20, thermal 0.10, crater 0.10, rock 0).
5. ~~Window validity~~: **decided, all cells valid**; empty result → "no landable area" UI state.

6. ~~Survival temperature default~~: **decided, 233 K** (electronics/battery survival). The default lives in
   the web `Params` (`web/src/engine/mock.ts` has 100 K, contract examples 120 K): flagged for the web owner.
7. ~~ENG-6 scope~~: **decided, pure scoring first.** `score.rs::score_cells(layers, weights, slope_limit_deg)`
   is built and tested on hand-made layers now; `grid_scores` (per-cell metrics on the 64-bin masks) is wired
   once ENG-4 (sun/earth) and PIPE-5 (slope/crater) land.
8. ~~`grid_scores` signature~~: **decided, `grid_scores(grid, header, ephem, t_start, hours, weights, params)`**
   (limits live in `Params`). Same engine-only PR rule as `top_areas`.
9. ~~"Without copying"~~: **decided, one copy is fine**: return `Vec<f32>`, wasm-bindgen copies it once into a
   `Float32Array` (~4 MB at 1000×1000). A view into WASM memory goes stale when memory grows.
10. PSR flag is its own export, `psr_flags(grid, header) -> Uint8Array` (time-independent, once per region).

11. ~~Split the time simulation from weights~~: **decided, `grid_fracs` + `scores_from_fracs`** (amends 8).
    `grid_fracs(grid, header, ephem, t_start_h, hours, params) -> Float32Array` (4 per cell: sun_frac, earth_frac,
    cold_frac, longest_dark_h; same `metrics::window` inner fn as site cards on each cell's 64-bin mask) runs once per
    time window; `scores_from_fracs(grid, header, fracs, weights, params)` re-scores on every slider move.
    `grid_scores(grid, header, ephem, t_start_h, hours, weights, params)` = both. `t_start_h` = hours since ephem t0.
    Battery gate in `scores_from_fracs`, `battery_h = 0` = off.

## Results on the real grids (2026-11-14, 14 days from 2026-01-02T12Z, default weights, 400 m base, 2 km exclusion)
`cargo test --release --test grid_real -- --ignored --nocapture`. 125 × 125 cells at 160 m, k = 3.

| Region | Valid, gate off | Valid, battery 48 h | Valid, 24 h | PSR | #1 area (lat, lon, score) |
|---|---|---|---|---|---|
| haworth | 55.5% | 14.9% | 4.0% | 0.2% | −86.8740, −22.9955, 0.622 |
| connecting-ridge | 28.9% | 0.9% | 0.7% | 1.4% | −89.4456, −137.1211, 0.557 |
| malapert-massif | 14.0% | 2.0% | 1.6% | 0.0% | −85.9762, 1.8779, 0.624 |

81–97% of cells have a dark run > 48 h in this window, so a 48 h gate blanks the heatmap (connecting-ridge keeps
2 areas). **Default for the heatmap: gate off** (`GRID_PARAMS.battery_h = 0` in `web/src/engine/index.ts`); site
cards still show `survives_night`. Timing: `grid_fracs` ≈ 0.4 s native release, ≈ 0.75 s WASM (node) per region;
`scores_from_fracs` ≈ 1 ms; `top_areas` < 1 ms. WASM and native top-3 agree.

Still open: `rock_ref` (after PIPE-6); SPEC / engine-api schema / TS text for the new `grid_scores`, `grid_fracs`,
`scores_from_fracs`, `top_areas`, `nearby_better`, `window_factors`, `psr_flags` signatures (web/contracts owners).
