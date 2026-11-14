## Goal
Show **why** terrain matters: a 360° horizon panorama per site, with the Sun and Earth tracks over the window. Absorbs WEB-9 (panorama) and WEB-10 (time-series charts). Read `dataviz` skill first.

## Real data available now
- `web/public/data/validation/{connecting-ridge,haworth,malapert-massif}.json` (PIPE-7, merged): hourly `sun_az, sun_el, earth_az, earth_el` from JPL Horizons for a lunar surface observer, Jan 2026 + Jul 2028, 1440 samples per site.
- Terrain horizon masks: **not yet**. They come from ENG-3 + PIPE-8 as `masks/{site}.json` (360 bins, degrees). Until then draw only the geometric horizon (0°) and label it "terrain mask pending".

## Build
1. Panorama SVG, x = azimuth 0–360° (N at the left edge, E at 90), y = elevation −5° to +15°. Filled terrain silhouette from the mask; dashed 0° line; Sun track as amber dots (opacity = time), Earth track as blue dots; current-time markers bound to the UI-3 playhead.
2. A shaded overlay where the track is **below** the terrain line, labelled "blocked by terrain".
3. Below it, two small multiples over the window: Sun elevation − horizon (h) and Earth elevation − horizon − antenna margin (h); zero line emphasised; shaded where negative.
4. A loader in `web/src/features/horizon/data.ts` validated with the existing ajv contracts. Real-data badge only when the mask is real.

## Acceptance
- At 2026-01-01T00Z, Malapert shows Sun az 32.87°, el 4.71°, matching the JSON.
- Azimuth wrap-around is handled (no line across the chart at 360→0).
- Axis labels carry units; accessible palette; table fallback for screen readers.
