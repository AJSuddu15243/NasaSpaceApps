# Design: Weighted scoring + greedy top-N areas (ENG-6, ENG-7)

> **Design agreed with Ananth 2026-11-14 (decisions 1–5 below).** Nothing is implemented yet; implementation needs his go-ahead.
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
| Thermal | `cold_frac` = `h_below_survival / hours` | `1 − cold_frac` | from ENG-5; survival temp default still open (FND-1 example 120 K vs ENG-5 suggestion 233 K) |

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
  mask above `90 − |lat| + 1.54 + 0.27` degrees in every azimuth bin. Needs masks, so it's built with ENG-4.

## Step 3: Window average = "is the whole base footprint good?" (ENG-7)
- Base footprint is a `k × k` cell window, `k = ceil(base_m / cell_m)`. Default `base_m = 400` (k = 5 at 80 m cells). Window score = mean of `score` inside.
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
- Return `{ cell, dist_m, delta: per-factor (best − site) }` → powers "1.2 km away gets +18% sunlight".
- If the site's own window is invalid (e.g. on a steep slope), still return the best nearby, flagged `site_valid: false`.

## Contract gap in SPEC
`top_areas(scores, window_cells, n)` can't work as written: it also needs `nx, ny, cell_m` and `exclusion_m`.
Proposed: `top_areas(scores, nx, ny, cell_m, window_cells, exclusion_m, n) -> Area[]`. Needs a SPEC update.
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
2. ~~Base footprint + exclusion radius~~: **decided, 400 m footprint (5×5 cells at 80 m) / 2 km exclusion**; both adjustable in the UI.
3. ~~`depth_ref`~~: **decided, 50 m**. `rock_ref` deferred until PIPE-6 picks a source.
4. ~~Default weights~~: **decided, power-first** (sun 0.35, earth 0.25, slope 0.20, thermal 0.10, crater 0.10, rock 0).
5. ~~Window validity~~: **decided, all cells valid**; empty result → "no landable area" UI state.

Still open: `rock_ref` (after PIPE-6); the SPEC `top_areas` signature change (team sign-off).
