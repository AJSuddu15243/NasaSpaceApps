## Goal
One clean, demo-ready workspace screen in the landing's design system. Judges see 5 minutes of clicking, so `/app` must read like a professional mission tool, not a dashboard template.

## Inputs
- #84 (resizable panels + globe view) is **merged**. `web/src/shell/theme.css` (from the landing PR) re-points the tokens: Archivo display, Geist Mono labels, warm ink `#09090a` / paper `#ece8e1`, one amber accent `hsl(28 80% 67%)`, pill buttons. Remove anything in the #84 styles that fights it.
- #98 (light/dark toggle) is merged. Dark stays the default for the demo. Check that the light theme still reads well with `theme.css` (it overrides with `:root[data-theme='light']`).

## Build
1. **Header**: same chrome as the landing. Brand left; pill nav center (Workspace · Method ↗ back to `/#method`); Share pill right; a `SYNTHETIC` / `REAL` data badge driven by the data source, not hard-coded.
2. **Layout at 1440×900 with no page scroll**: Sites (280 px) | Observe canvas (flex) | Compare (320 px). The timeline from UI-3 docks under the canvas.
3. **Scenario controls (absorbs WEB-4)**: arrival UTC, mission length, battery-survival threshold, antenna margin, all in the URL (already validated in `shell/scenario.ts`).
4. **States (absorbs WEB-15)**: loading skeletons in the panel shapes, an empty state when no sites are selected, error + Retry, and an honest "No computed results for this window" state. Keyboard path through all controls, with visible focus. Axe clean.
5. Fix the 2 failing `shell.browser.ts` tests; they already fail on `main`.

## Acceptance
- Screenshot at 1440×900: everything above the fold, nothing overlapping, no default browser checkboxes.
- `pnpm test:browser` green. CI green.
