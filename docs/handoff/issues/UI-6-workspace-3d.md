## Goal (Advait)
Make the workspace 3D view the place the landing dives into: the same Moon, then real terrain at the selected site. Absorbs SCN-3, SCN-4, SCN-5, SCN-6 and SCN-8; SCN-1 (#49) stays yours and closes with this.

## Inputs on main
- NASA textures: `web/public/textures/moon_color.jpg` (LROC), `moon_elevation.jpg` (LOLA). The landing shader in `web/src/landing/MoonStage.tsx` (Lunar-Lambert + LOLA bump + polar cap) can be lifted as-is.
- **LROC NAC imagery for the patch** (PIPE-10, merged): see `pipeline/notes/`.
- **Real tiles** (PIPE-4, merged): `web/public/data/tiles/{site}_80m.{bin,json}`, 250×250 float32 at 80 m, ±10 km, rows grow with +y (already flipped). Contract: `contracts/schemas/tile.schema.json`.
- **Real slope/crater layers** (PIPE-5, merged): `web/public/data/grid/{site}.{bin,json}`, 125×125 cells at 160 m.
- Sun/Earth direction: `web/public/data/ephem.bin` (PIPE-2) → EPH-2 provider; until EPH-2, read the table directly (row k = 2026-01-01T00Z + k h).

## Build (in order, each one demoable)
1. **Framing fix**: the globe currently renders as a small grey ball at the top of the canvas. The Moon must fill 70% of the canvas height at load, with the south pole tilted toward the camera.
2. **Site patch from real tiles**: replace `mockTerrain.ts` with the PIPE-4 tile for the selected site (vertical exaggeration ×1, then a ×2 toggle). Hillshade/contours from SCN-2 keep working.
3. **Sun from ephemeris (SCN-3)**: the directional light follows the UI-3 playhead time; shadows on, PCF, map size 2048. Visual only; physics stays in the engine.
4. **Markers (SCN-5)**: ring + label per selected site (copy the landing style); click selects the site in the URL.
5. **Slope overlay (SCN-4, reduced)**: colour the patch by `slope_deg` with a 10° hard-limit contour and a legend.
6. Surface view (SCN-6) only if 1–5 are done.
7. Budget (SCN-8): 60 fps on an M1 Air at 1440×900, DPR cap 1.75, pause when off-screen.

## Acceptance
- Selecting Malapert puts the camera over the PIPE-4 tile with the 4,785 m massif clearly visible.
- No physics in shaders. Lazy-loaded; first bundle unchanged.
