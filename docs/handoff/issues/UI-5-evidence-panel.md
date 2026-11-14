## Goal
Make accuracy visible. Judges will ask "is this real?", so answer in the product. Absorbs WEB-13 (validation + determinism). WEB-11 (weights/greedy UI) becomes a stretch here; WEB-14 (export) is cut.

## Build
1. **Method drawer** (opened from the header "Method" pill and from a "How do we know?" link on each compare card):
   - Sources table: LOLA LDEM 80 m (PGDA, SHA-256 `82030dcb…`), JPL Horizons DE441 MOON_ME 2026–2030 (43,824 rows), PIPE-7 surface-observer set.
   - **Ephemeris check**: from `pipeline/notes/pipe-7.md`, max error vs Horizons is Sun 0.0002° and Earth 0.006°. Once ENG-2 lands, recompute in the browser: engine az/el vs `validation/*.json`, with mean/max |Δ| and N samples.
   - **Determinism**: show the engine `hash` for the current scenario, plus "Run again" proving the same hash (ENG-8).
   - Status chips: Verified / In progress / Synthetic, driven by data flags.
2. Explorer-mode copy from `web/src/content/glossary.json` + `explainers.ts` (DOC-1, merged) as tooltips on every metric label.
3. Stretch: weights sliders (sunlight, Earth, slope) feeding ENG-6 `score_cells` once exposed.

## Acceptance
- No number appears that isn't loaded from a file or computed at runtime.
- Drawer is keyboard accessible and closes on Esc.
