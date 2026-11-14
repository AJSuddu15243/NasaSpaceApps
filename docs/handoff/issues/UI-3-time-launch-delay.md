## Goal
The feature that makes this app different: **move the arrival date and see why a site wins or loses.** Absorbs WEB-6 (timeline), WEB-7 (launch delay) and, as a stretch, WEB-8 (calendar).

## Build
1. **Timeline strip** under the Observe canvas: 336 h default window, hour ticks, three lanes per selected site: Sun visible (amber), Earth visible (blue), blackout (hatched). A playhead you drag; ←/→ step 1 h, Shift steps 24 h. The playhead time drives the canvas (Sun/Earth markers) and the countdowns.
2. **Launch delay control**: "Delay arrival by [0 | 1 | 3 | 7 | 14] days" segmented pill plus a free input. It produces a **baseline vs delayed** pair through the same engine call (`site_metrics`) with the same sites and thresholds.
3. **Delta cards**: for each site show sunlit %, longest darkness, Earth contact %, longest blackout, baseline → delayed, with the change coloured and one generated sentence of reason. Example: "Longest darkness grows 32 h → 71 h because the Sun stays below the ridge at az 140–175°."
4. **Data source**: the engine adapter (`web/src/engine/index.ts`) only. While ENG-4 isn't merged, the mock returns "no computed results" for non-demo windows. Show that state; never fake numbers.
5. Stretch (WEB-8): a 30-day calendar heat-strip of sunlit % for the first selected site.

## Acceptance
- Dragging the playhead never blocks input (engine calls go through the worker when ENG-9 lands; debounce at 120 ms until then).
- The URL holds the delay (`delay=7d`) and reproduces the same view.
- Unit tests for lane building and delta maths.
