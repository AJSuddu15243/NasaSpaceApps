# Plan: Moon Base Location Sim

> **⚠️ DRAFT — not the final plan.** This is just what we've worked out so far. Expect anything here to change as the team decides.

## Goal
Test many candidate moon base sites at the same time and rank them using a **deterministic** simulation that runs
in the browser. The globe is rendered in WebGL with three.js. Output is a heatmap of good landing *areas*
(not single points), plus a ranked list of the top N sites. Everything runs on the user's machine:
no server, and no waiting for predictions.

## What the sim answers
- **Solar / thermal:** the share of time each cell is in sunlight, and how that changes as the sun moves. This helps plan landing windows and operation timing.
- **Communication:** the share of time each cell has direct line of sight to Earth.
- **Safety and terrain:** slope (hard limit), crater depth, surface rock layer depth, crowding (lower weights).

## Decision: sim language
| Option | Verdict |
|---|---|
| **Rust → WASM** (`wasm-pack`) | Recommended. Fast, safe memory handling, easy JS bindings. |
| **C → WASM** (Emscripten) | Equally fast. Pick it if the team already knows C. |
| Python | Not recommended. Pyodide is about 10 MB and slow to start; a server adds network delay and hosting cost. |

- [ ] **Team decides Rust or C.** Note: the original idea doc called a compiled sim "extra work". The extra work is mostly about half a day of WASM build setup; the sim itself is small.
- Determinism rules: no `-ffast-math`, no unseeded random numbers, a fixed time step, and integer or fixed-order loops.

## Architecture
```
time slider ──► ephemeris(t) ──► sunDir, earthDir ─┬─► three.js DirectionalLight (visual only)
                                                   └─► WASM sim (numbers) [Web Worker]
                                                          │
                                   Float32Array score grid (shared WASM memory, no copy)
                                                          │
                                   THREE.DataTexture ──► heatmap overlay on moon mesh
```
**Rule:** three.js lighting is only for display. The sim never reads lighting back from the GPU.
Both sides take the sun direction from the same `ephemeris(t)`.

## Core algorithm
1. **Horizon masks (precompute once per region).** For each terrain cell, store the horizon angle in 64 compass directions,
   computed from the ADC height grids (`LunarLandingSiteNavigation/data/`). This is the only expensive step.
   Run it once in WASM, or offline, and ship the result as a binary file.
2. **For each time step, using O(1) per cell:**
   - Sunlit: the sun's elevation is above the cell's horizon angle in the sun's direction.
   - Earth contact: Earth's elevation is above the cell's horizon angle in Earth's direction.
     The same mask serves both checks.
3. **Ephemeris:** the sun's direction goes all the way around once every 29.53 days and moves only about ±1.54° north and south.
   Earth stays nearly fixed, with about ±7° of libration. Start with a simple formula and upgrade to a SPICE-generated lookup table later if needed.
4. **Scoring:** `score = w1·sun% + w2·earth% + w3·(1 − slope) + small weights for crater depth, rock depth and crowding`.
   Cells over the slope limit (about 8–10°) are excluded outright. The weights are function inputs, which become UI sliders.
5. **Areas, using greedy selection:** average the scores over a sliding window the size of the base, pick the best window, rule out its surroundings,
   then repeat until N sites are chosen.

## Task checklist
### Phase 0: Setup
- [ ] Decide on Rust or C
- [ ] Download one region's data (start with Haworth) following `RESOURCES.md`
- [ ] Set up the toolchain: `wasm-pack` or Emscripten, plus Vite and three.js

### Phase 1: Skeleton (get the pipeline working end to end with a dummy sim)
- [ ] three.js moon mesh built from the height grid, with a `DirectionalLight` driven by a time slider
- [ ] A WASM module in a Web Worker that returns a dummy `Float32Array` grid
- [ ] The grid shown as a `DataTexture` heatmap overlay

### Phase 2: Real sim
- [ ] Shared `ephemeris(t)` used by both the light and the sim
- [ ] Horizon mask precompute and its binary file format
- [ ] Sunlight and Earth-contact percentages over a chosen time range
- [ ] Self-check: identical inputs give a bit-identical output hash (the determinism demo)

### Phase 3: Ranking and UI
- [ ] Weighted score with the slope limit
- [ ] Sliding window plus greedy top-N site selection
- [ ] Weight sliders and multiple regions shown together
- [ ] Real-time time scrubbing that shows sunlight and contact changing over time

### Phase 4: Demo
- [ ] Timing numbers (milliseconds per time step for the grid size used)
- [ ] Determinism demo: same seed and weights give the same hash every run
- [ ] Pitch slides
