# UI-6 workspace scene (#107)

This work continues the closed SCN-3/4/5/6/8 issues under UI-6. A future PR should reference
`Closes #107` and, when its acceptance is met, `Closes #49`. The existing SCN-3 branch name is harmless.
No commit, push, issue edit, or PR creation is part of this local implementation.

## Try it

From `web/`, run `pnpm install --frozen-lockfile` and `pnpm dev`, then open `/app`.
In 3D terrain, the overview shares the landing Moon shader and local NASA textures.
Choose Malapert Massif, Haworth, or Connecting Ridge in **Terrain at** to enter that real patch.
Choose **Slope heatmap** in **Layer**, adjust opacity, toggle 100 m elevation contours,
and switch between ×1 and ×2 relief. **Polar map** uses the same geometry and layers.
Selected-site buttons and the region selector put the focused coordinate first in the scenario URL.
The three presets are pipeline coverage centres, not independently verified landing recommendations.

## Rendering and data

- Near tiles: `data/tiles/{region}_80m.{json,bin}`, full 250×250 grid in local kilometres,
  transformed at the display edge from the supplied polar-stereographic metre grid.
- Slope: `data/grid/{region}.{json,bin}`, validated `slope_deg` layer at 160 m. The layer
  stores the conservative maximum of 2×2 80 m source slopes. A portable RGBA8 DataTexture
  encodes 16-bit degrees in two channels. The fixed Cividis display saturates at 30°;
  a white 10° contour shows the current project slope limit. It is not a suitability score.
- NAC imagery: validated sidecar extent determines UV alignment. `flipY=false` preserves
  PIPE-10's row 0 = y_min convention. Imagery contains acquisition-time shadows; choose
  Relief to inspect only the moving rendered shadows. Elevation and slope always use source
  values, even with ×2 display geometry.
- Sun: `simulationRef` drives a PCF 2048² directional shadow map, fitted to the near patch.
  The standard material's lighting and depth pipeline remains intact. Ambient display fill
  makes unlit terrain readable. No visibility, power, temperature or score comes from shaders.
- The scene reads packaged `/data/ephem.{json,bin}` (43,824 hourly JPL Horizons rows covering
  2026–2030), otherwise the workspace's labelled synthetic table. Dates outside the loaded
  table disable solar lighting instead of clamping to a misleading endpoint. The shipped mock
  table remains constant; the packaged reference is what makes scene lighting move with time.
  UI-3 can pass its playhead as the existing `date` input; EPH-2 can replace the table adapter.
- Lazy scene loading, DPR ≤1.5, rendering on demand, off-screen/tab pause and geometry,
  texture and control cleanup bound work when switching regions.

## Verification and limits

Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` from `web/`.
Tests cover coordinate orientation, source elevation preservation, real slope decoding,
texture packing/alignment, invalid inputs, the packaged reference table, and moving Sun direction.
Browser QA at 1440×900 covers overview/local switching, Malapert's real tile, two dates with
different shadows, region switching, slope/contour/relief/opacity controls, URL selection and
the two former error-boundary failures. The scene uses demand rendering rather than animating
while idle, so an interaction FPS number was not inferred from idle frames. M1 Air interaction
measurement remains a release/PR hardware gate. Surface/lander view remains optional work.
The panorama is owned by UI-4; score/sun/Earth/PSR heatmaps need the engine outputs.
The installed skills do not include the repository's named `dataviz` skill; the scene retains
SCN-2's accessible Cividis palette, labelled degrees/metres and numeric slope summary.

## Task checklist

- [x] Read SPEC, proposal, quality bar, updated UI-6 issue and team handoff.
- [x] Identify regions and tile/imagery/slope inputs; reuse existing contracts and shader.
- [x] Reach scene, workspace mount, tests and this reproducibility note.
- [x] Validate shapes, finite values, units and region identity at data boundaries.
- [x] Show 10° project slope limit, fixed legend, units and text summary.
- [x] No new raw data or external source; existing pipeline citations are displayed.
- [x] Browser visual QA at 1440×900 with no runtime errors in the tested paths.
- [ ] Measure interaction FPS on an M1 Air at 1440×900 (hardware release gate).
- [ ] Verify against UI-3's integrated time playhead after its branch lands.
