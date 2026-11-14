# Quality bar: ship an industry-grade tool, not AI slop

Every PR is checked against this list. Agents read it before writing code or copy.

## Product and design
- **One look.** Use the tokens from the design-system issue (WEB-2): one sans for UI, one mono for numbers,
  a lunar grey scale, **amber = Sun/power**, **blue = Earth/comms**, red/yellow/green only for status. No other colours.
- **No AI-default styling:** no purple gradients, glowing blobs, glassmorphism stacks, emoji in the UI, stock
  "rocket" icons, or centred hero text over a random gradient.
- **Data first.** Every number shows units (°, h, W/m², K). Tabular figures for numbers. Use real data in
  screenshots, never lorem ipsum.
- **Every state is designed:** loading, empty, error, and "no data for this layer". Nothing jumps on load.
- **Motion has a job** (explains time passing or a change). Respect `prefers-reduced-motion`.
- **Accessible:** WCAG AA contrast, full keyboard use, visible focus, labelled controls, charts with text
  summaries.

## Copy
- Plain, specific, numeric: "Sunlit 82% of the 14-day window" beats "Excellent illumination".
- Banned words: seamless, revolutionize, unlock, cutting-edge, harness, leverage, empower, game-changer, delve.
- State assumptions where they matter (no thermal inertia, DSN always sees the Moon, rock layer is a proxy).

## Code
- TypeScript strict, no `any`; Rust with `clippy -D warnings`; Python with ruff.
- Components under ~200 lines; one responsibility each; no dead code or commented-out blocks.
- Pure functions for anything numeric, with tests. Same inputs → same outputs.
- No new dependency without a reason in the PR description.

## Performance budgets
- Initial JS under 300 KB gzipped (WASM and data load lazily); WASM under 1.5 MB.
- 3D scene at 60 fps on an M1 MacBook Air; pause rendering when the tab is hidden.
- Re-scoring after a slider move feels instant (under 100 ms for curated sites).

## Every PR
- Closes one issue; title starts with the issue ID, e.g. `[WEB-5] Compare cards`.
- Tests pass and you ran the app. UI PRs include a screenshot or short GIF.
- Reviewer checks: matches SPEC contracts, follows this file, no files outside the issue's folders.
