# Task board: Lunar Landing Site Navigator

> Generated from the same data as our GitHub issues. Pick an issue on GitHub, assign yourself, and follow "How we work".

## Team roles (6 people)

| Role | Owner | Folders | Issues |
|---|---|---|---|
| Pipeline (Sri) | Sri | `pipeline/`, `contracts/` | FND-1, PIPE-1, PIPE-2, PIPE-3, PIPE-4, PIPE-5, PIPE-6, PIPE-7, PIPE-8, PIPE-9, PIPE-10, INT-2 |
| Rust engine | _add name_ | `engine/`, `web/src/engine/` | ENG-1, ENG-2, ENG-3, ENG-4, ENG-5, ENG-6, ENG-7, ENG-8, ENG-9 |
| App UI | _add name_ | `web/` app (features, shell) | FND-3, WEB-1, WEB-3, WEB-4, WEB-5, WEB-6, WEB-7, WEB-8, WEB-9, WEB-11, WEB-15, INT-1 |
| 3D & graphics | _add name_ | `web/src/scene/` | SCN-1, SCN-2, SCN-3, SCN-4, SCN-5, SCN-6, SCN-7, SCN-8 |
| Design & landing | _add name_ | `web/src/landing/`, `web/src/design/`, `web/src/brand/`, `web/src/features/modes/` | WEB-2, WEB-12, LND-1, LND-2, LND-3, LND-4, LND-5 |
| Ephemeris, data & validation | _add name_ | `web/src/ephem/`, `sites.json`, `web/src/features/{charts,validation,export}/`, `docs/`, CI | FND-2, DATA-1, EPH-1, EPH-2, DATA-2, DOC-1, DOC-2, WEB-10, WEB-13, WEB-14 |

## How we work

1. Pick an issue in the current milestone, assign yourself on GitHub, and answer its **Your calls** list (that's where the project gets your taste instead of AI defaults).
2. Open a Conductor workspace named after the issue ID (e.g. `PIPE-2`) on the issue's `feat/` branch (see "Work order by role"). Use the model listed for that issue.
3. Paste the **shared header**, then the issue's agent prompt with your answers.
4. Review the diff yourself, run it, then open a PR titled `[ID] …` with `Closes #<n>` and a screenshot for UI work.
5. The reviewer workspace checks it against SPEC, contracts and `docs/QUALITY.md`; then merge and pull.

## Branches

Every issue has one branch: `feat/<issue-id>-<short-name>`, listed in "Work order by role". The branches already exist on GitHub and are linked to their issues, so a PR from one closes its issue. Before you start, bring the branch up to date with `main` (`git fetch && git merge --ff-only origin/main`). One issue, one branch, one PR.

## Changing an issue

Issues are a starting point; the owner decides what's best. You may edit your issue's goal, acceptance criteria and "Your calls" on GitHub, split it, or drop a P2. Three rules: keep the issue ID in the title; leave a one-line comment saying what changed and why; and if the change touches a SPEC contract or something another issue depends on, tell that owner first and update `SPEC.md` in the same PR.

## Models by role (Claude Pro + ChatGPT Pro)

| Role | Primary | When stuck / review |
|---|---|---|
| Pipeline | GPT-6.1 Sol (Codex), high | Opus 5.5 |
| Rust engine | Fable 5.2 (Claude), high (included until Sun 11:59 pm PT) | GPT-6 Astra |
| App UI | Opus 5.5 (Claude), high | GPT-6.1 Sol |
| 3D & graphics | GPT-6 Astra (Codex), high | Opus 5.5 |
| Design & landing | GPT-6.1 Sol (Codex) | Opus 5.5 |
| Ephemeris, data & validation | GPT-6.1 Sol (Codex); GPT-6.1 Terra for small tasks | Opus 5.5 |
| Reviewer | GPT-6 Astra (Codex), fresh workspace | Opus 5.5 |

Claude seats share one 5-hour window per account, so keep Claude for the engine and the app UI; everything else runs on Codex.

## Shared header (paste first in every workspace)

```
Read CLAUDE.md / AGENTS.md (and the AGENTS.md inside your folder if there is one), SPEC.md, docs/PROPOSAL.md
and docs/QUALITY.md before anything else. You are implementing ONE GitHub issue, pasted below. Only create or
edit files in the folders the issue owns. Work on the issue's feat/ branch from docs/TASKS.md (rename your
branch to it if needed) and fast-forward it to origin/main first. Follow SPEC's file contracts exactly; if one looks wrong, stop and
tell me instead of changing it. If mock data you need doesn't exist yet, make a temporary mock in your own
folder. Use my answers to the issue's 'Your calls' exactly; ask if one is missing. Every algorithm gets a test,
and you run it. Never commit raw data. Reply first with a plan of at most 5 lines, then build in small
commits. When the acceptance criteria are met, open a PR titled '[ID] <title>' that says 'Closes #<issue>'.
Finish with: what you built, how to run it, what's mocked, what's left, and any risks.
```


## Critical path to a working demo

WEB-1 → PIPE-1 → PIPE-3 → PIPE-4 → ENG-3 → PIPE-8, alongside PIPE-2 → ENG-2 → ENG-4 → ENG-9, meeting at INT-1 → WEB-7. If you own one of these, it comes before anything else on your list.

## Work order by role

Issues in the same step touch different files and can run in parallel workspaces. Merge a step before starting the next. Models are suggestions: use the strongest one you have for the hard math and core contracts.

### Pipeline (Sri)

| Step | Issue | Branch | Model | Start when |
|---|---|---|---|---|
| 1 | PIPE-1 Pipeline scaffold: uv project, config, Makefile, CLI | `feat/pipe-1-pipeline-scaffold-uv-project` | GPT-6.1 Sol | Now |
| 1 | FND-1 Shared data contracts: TS types, Rust structs, JSON schemas | `feat/fnd-1-shared-data-contracts-ts` | Opus 5.5 (or GPT-6 Astra) | Now |
| 2 | PIPE-2 Horizons client + hourly Sun/Earth reference table (2026-2030) | `feat/pipe-2-horizons-client-hourly-sun` | GPT-6.1 Sol | PIPE-1 merged |
| 2 | PIPE-3 Terrain acquisition: Moon Trek / QuickMap APIs with PGDA fallback | `feat/pipe-3-terrain-acquisition-moon-trek` | GPT-6.1 Sol | PIPE-1 merged |
| 3 | PIPE-4 Coordinates + region tiles (far field 240 m, near field 80 m) | `feat/pipe-4-coordinates-region-tiles-far` | Opus 5.5 (or GPT-6 Astra) | PIPE-3 merged |
| 3 | PIPE-7 Validation set: Horizons topocentric Sun/Earth az/el for curated sites | `feat/pipe-7-validation-set-horizons-topocentric` | GPT-6.1 Sol | PIPE-2 merged (uses DATA-1 sites if ready) |
| 4 | PIPE-5 Derived layers: slope, crater depth, roughness | `feat/pipe-5-derived-layers-slope-crater` | GPT-6.1 Sol | PIPE-4 merged |
| 4 | PIPE-8 Run the engine mask builder from the pipeline | `feat/pipe-8-run-engine-mask-builder` | GPT-6.1 Sol | PIPE-4 and ENG-3 merged |
| 4 | PIPE-10 Imagery texture for the south-pole mesh (Moon Trek) | `feat/pipe-10-imagery-texture-south-pole` | GPT-6.1 Sol | PIPE-3 merged; ask SCN-1's owner for the patch extent |
| 5 | PIPE-6 Rock distribution: find a polar source or ship the proxy | `feat/pipe-6-rock-distribution-find-polar` | GPT-6.1 Terra | PIPE-5 merged |
| 5 | PIPE-9 Package: manifest, size budget, citations | `feat/pipe-9-package-manifest-size-budget` | GPT-6.1 Terra | Most outputs exist |
| 6 | INT-2 Find and save the demo scenarios | `feat/int-2-find-save-demo-scenarios` | Opus 5.5 | INT-1 merged |

### Rust engine

| Step | Issue | Branch | Model | Start when |
|---|---|---|---|---|
| 1 | ENG-1 Crate scaffold, wasm-bindgen exports, build script | `feat/eng-1-crate-scaffold-wasm-bindgen` | Fable 5.2 (or GPT-6 Astra) | Now; use SPEC's contract shapes, switch to FND-1's when it merges |
| 2 | ENG-2 Geometry: site frames and Sun/Earth az/el | `feat/eng-2-geometry-site-frames-sun` | Fable 5.2 (or GPT-6 Astra) | ENG-1 merged; final accuracy check when PIPE-7 lands |
| 3 | ENG-3 Horizon mask builder (native bin) | `feat/eng-3-horizon-mask-builder-native` | Fable 5.2 (or GPT-6 Astra) | ENG-2 merged; synthetic tiles first, real tiles after PIPE-4 |
| 3 | ENG-4 Illumination + direct-to-Earth metrics over a window | `feat/eng-4-illumination-direct-earth-metrics` | Fable 5.2 (or GPT-6 Astra) | ENG-2 merged |
| 4 | ENG-9 Web Worker pool + typed TS wrapper | `feat/eng-9-web-worker-pool-typed` | GPT-6.1 Sol (or Opus 5.5) | ENG-4 and WEB-1 merged |
| 4 | ENG-5 Thermal model (equilibrium estimate) | `feat/eng-5-thermal-model-equilibrium-estimate` | GPT-6.1 Sol | ENG-4 merged |
| 5 | ENG-6 Grid scoring + PSR layer | `feat/eng-6-grid-scoring-psr-layer` | Opus 5.5 (or GPT-6 Astra) | ENG-4 and PIPE-5 merged |
| 5 | ENG-8 Determinism hash + golden tests | `feat/eng-8-determinism-hash-golden-tests` | GPT-6.1 Sol | ENG-4 merged |
| 6 | ENG-7 Weighted greedy top-N areas + nearby better spot | `feat/eng-7-weighted-greedy-top-n` | Opus 5.5 (or GPT-6 Astra) | ENG-6 merged |

### App UI

| Step | Issue | Branch | Model | Start when |
|---|---|---|---|---|
| 1 | WEB-1 App shell: routing, layout, state with shareable URLs | `feat/web-1-app-shell-routing-layout` | Opus 5.5 (or GPT-6.1 Sol) | Now; use SPEC's contract shapes, switch to FND-1's when it merges |
| 1 | FND-3 Vercel deploy with preview URLs per PR | `feat/fnd-3-vercel-deploy-preview-urls` | GPT-6.1 Terra | WEB-1 merged |
| 2 | WEB-4 Scenario controls: landing time, mission length, thresholds | `feat/web-4-scenario-controls-landing-time` | GPT-6.1 Sol | WEB-1 merged |
| 2 | WEB-6 Timeline scrubber + playback | `feat/web-6-timeline-scrubber-playback` | Opus 5.5 | WEB-1 merged |
| 2 | WEB-3 Site picker: curated, search, custom coordinates | `feat/web-3-site-picker-curated-search` | GPT-6.1 Sol | WEB-1 merged; mock sites until DATA-1 lands |
| 3 | WEB-5 Compare cards: metrics, badges, countdowns | `feat/web-5-compare-cards-metrics-badges` | Opus 5.5 | WEB-3 and WEB-4 merged; restyle with WEB-2 tokens |
| 3 | WEB-9 Horizon panorama | `feat/web-9-horizon-panorama` | Opus 5.5 (or GPT-6 Astra) | WEB-1 merged; mock mask until ENG-3 / PIPE-8 |
| 4 | WEB-7 Launch-delay simulator | `feat/web-7-launch-delay-simulator` | Opus 5.5 | WEB-5 merged |
| 4 | INT-1 Integration: real engine + real data end to end | `feat/int-1-integration-real-engine-real` | GPT-6.1 Sol | ENG-4, ENG-9, PIPE-2 and PIPE-8 merged |
| 5 | WEB-8 Viability calendar | `feat/web-8-viability-calendar` | GPT-6.1 Sol | WEB-7 and ENG-9 merged |
| 5 | WEB-11 Weights panel + greedy results | `feat/web-11-weights-panel-greedy-results` | GPT-6.1 Sol | ENG-7 merged (mock until then) |
| 6 | WEB-15 States, performance and accessibility pass | `feat/web-15-states-performance-accessibility-pass` | Opus 5.5 | Last, after feature freeze |

### 3D & graphics

| Step | Issue | Branch | Model | Start when |
|---|---|---|---|---|
| 1 | SCN-1 R3F scene: globe, south-pole patch, camera | `feat/scn-1-r3f-scene-globe-south` | GPT-6 Astra (or Opus 5.5) | Now on a mock height grid; real terrain after PIPE-4 |
| 2 | SCN-3 Sun light and shadows from the ephemeris | `feat/scn-3-sun-light-shadows-ephemeris` | GPT-6 Astra | SCN-1 merged; mock Sun direction until EPH-2 |
| 3 | SCN-5 Site markers + click-to-probe | `feat/scn-5-site-markers-click-probe` | GPT-6.1 Sol | SCN-1 merged |
| 3 | SCN-4 Heatmap overlay shader + legend | `feat/scn-4-heatmap-overlay-shader-legend` | GPT-6 Astra | SCN-1 merged; mock scores until ENG-6 |
| 4 | SCN-6 Surface view: stand at the lander | `feat/scn-6-surface-view-stand-lander` | GPT-6 Astra | SCN-1 and ENG-2 merged |
| 4 | SCN-2 Terrain shading: elevation, hillshade, contours | `feat/scn-2-terrain-shading-elevation-hillshade` | GPT-6.1 Sol | SCN-1 merged |
| 5 | SCN-7 2D polar map view | `feat/scn-7-2d-polar-map-view` | GPT-6.1 Sol | SCN-4 merged |
| 6 | SCN-8 Scene performance budget | `feat/scn-8-scene-performance-budget` | Opus 5.5 (or GPT-6 Astra) | Last, after feature freeze |

### Design & landing

| Step | Issue | Branch | Model | Start when |
|---|---|---|---|---|
| 1 | LND-1 Name, logo and voice | `feat/lnd-1-name-logo-voice` | Opus 5.5 | Now |
| 1 | WEB-2 Design system: tokens, type, components | `feat/web-2-design-system-tokens-type` | Opus 5.5 (or GPT-6.1 Sol) | Now as a tokens file; wire into the app when WEB-1 merges |
| 2 | LND-2 Landing hero + intro flight | `feat/lnd-2-landing-hero-intro-flight` | GPT-6.1 Sol | WEB-1 merged; fold the existing codex/w5-landing work into the web/ app |
| 3 | LND-3 Landing sections: problem, how it works, features, team | `feat/lnd-3-landing-sections-problem-how` | GPT-6.1 Sol | LND-2 merged |
| 3 | WEB-12 Planner / Explorer modes | `feat/web-12-planner-explorer-modes` | GPT-6.1 Sol | WEB-5 and DOC-1 merged |
| 4 | LND-4 Resources page: data, methods, classroom guide | `feat/lnd-4-resources-page-data-methods` | GPT-6.1 Terra | PIPE-9 and DOC-1 merged |
| 5 | LND-5 Demo video, slides and submission | `feat/lnd-5-demo-video-slides-submission` | Opus 5.5 (or Claude chat) | INT-2 merged |

### Ephemeris, data & validation

| Step | Issue | Branch | Model | Start when |
|---|---|---|---|---|
| 1 | DATA-1 Curated sites list with sources | `feat/data-1-curated-sites-list-sources` | GPT-6.1 Sol | Now; check every source link by hand |
| 1 | FND-2 CI: tests, lint and builds on every PR | `feat/fnd-2-ci-tests-lint-builds` | GPT-6.1 Terra | Now |
| 2 | EPH-1 Astronomy Engine: Moon-fixed Sun/Earth for any date | `feat/eph-1-astronomy-engine-moon-fixed` | GPT-6 Astra (or Opus 5.5) | Now; compare against PIPE-2's table when it merges |
| 2 | DOC-1 Explorer-mode copy + glossary | `feat/doc-1-explorer-mode-copy-glossary` | Opus 5.5 (or Claude chat) | Now |
| 3 | EPH-2 Ephemeris provider: table first, Astronomy Engine fallback, live 'now' | `feat/eph-2-ephemeris-provider-table-first` | GPT-6.1 Sol | EPH-1 and PIPE-2 merged |
| 3 | WEB-10 Time-series charts: sun vs horizon, Earth, power, temperature | `feat/web-10-time-series-charts-sun` | GPT-6.1 Sol | WEB-1 merged; mock series until ENG-4 |
| 4 | DATA-2 Validation panel data + accuracy report | `feat/data-2-validation-panel-data-accuracy` | GPT-6.1 Sol | ENG-2 and PIPE-7 merged |
| 4 | WEB-13 Validation panel + determinism check | `feat/web-13-validation-panel-determinism-check` | GPT-6.1 Sol | DATA-2 and ENG-8 merged |
| 5 | WEB-14 Export & share: CSV, PNG, mission brief | `feat/web-14-export-share-csv-png` | GPT-6.1 Terra | WEB-5 merged |
| 5 | DOC-2 README, methods & assumptions | `feat/doc-2-readme-methods-assumptions` | Opus 5.5 (or Claude chat) | DATA-2 merged |

## Corrections since the issues were created

| Issue | Correction |
|---|---|
| PIPE-2 | The table also needs the Moon-Sun distance (`sun_dist_km`). Expected Horizons quantity codes are 14, 15, 20 and 19; confirm all four in the Horizons manual before pulling data. |
| PIPE-8 | Size check: 64 float32 bins per 80 m cell is about 16 MB per region, over our 25 MB budget. Store the grid mask as int16 hundredths of a degree and use 160-240 m heatmap cells. Agree the dtype with the engine owner (ENG-3) and update the grid contract in SPEC.md in the same PR. |
| ENG-3 | Grid masks must fit the 25 MB data budget: write them as int16 hundredths of a degree at 160-240 m cells (see PIPE-8). Site masks stay 360 bins as JSON. |
| ENG-6 | PSR flag, precisely: the cell's mask is above the highest possible Sun elevation at that latitude (90 - |lat| + 1.54 + 0.27 degrees) in every azimuth bin. |
| LND-2 | A landing prototype already exists on `codex/w5-landing` as a separate Vite app built from an old `main`. Bring it up to date with `main` and fold it into the single `web/` app (one package.json, route `/`) once WEB-1 merges. |
| WEB-1 | Don't wait for FND-1: build on the contract shapes in SPEC.md and switch to `web/src/contracts/` when FND-1 merges. |
| ENG-1 | Don't wait for FND-1: build on the contract shapes in SPEC.md and adopt FND-1's Rust structs when it merges. |

## Milestones

### M1 Foundations (H0-4)

| ID | Issue | Role | Priority | Depends on |
|---|---|---|---|---|
| FND-1 | Shared data contracts: TS types, Rust structs, JSON schemas | Pipeline (Sri) | P0 | none |
| FND-3 | Vercel deploy with preview URLs per PR | App UI | P0 | WEB-1 |
| PIPE-1 | Pipeline scaffold: uv project, config, Makefile, CLI | Pipeline (Sri) | P0 | none |
| PIPE-2 | Horizons client + hourly Sun/Earth reference table (2026-2030) | Pipeline (Sri) | P0 | PIPE-1 |
| PIPE-3 | Terrain acquisition: Moon Trek / QuickMap APIs with PGDA fallback | Pipeline (Sri) | P0 | PIPE-1 |
| ENG-1 | Crate scaffold, wasm-bindgen exports, build script | Rust engine | P0 | FND-1 |
| DATA-1 | Curated sites list with sources | Ephemeris, data & validation | P0 | FND-1 |
| WEB-1 | App shell: routing, layout, state with shareable URLs | App UI | P0 | FND-1 |
| WEB-2 | Design system: tokens, type, components | Design & landing | P0 | WEB-1 |
| LND-1 | Name, logo and voice | Design & landing | P0 | none |
| FND-2 | CI: tests, lint and builds on every PR | Ephemeris, data & validation | P1 | none |

### M2 MVP (H4-12)

| ID | Issue | Role | Priority | Depends on |
|---|---|---|---|---|
| PIPE-4 | Coordinates + region tiles (far field 240 m, near field 80 m) | Pipeline (Sri) | P0 | PIPE-3 |
| PIPE-7 | Validation set: Horizons topocentric Sun/Earth az/el for curated sites | Pipeline (Sri) | P0 | PIPE-2, DATA-1 |
| ENG-2 | Geometry: site frames and Sun/Earth az/el | Rust engine | P0 | ENG-1, PIPE-7 |
| ENG-3 | Horizon mask builder (native bin) | Rust engine | P0 | ENG-1, PIPE-4 |
| ENG-4 | Illumination + direct-to-Earth metrics over a window | Rust engine | P0 | ENG-2 |
| WEB-3 | Site picker: curated, search, custom coordinates | App UI | P0 | WEB-1, DATA-1 |
| WEB-4 | Scenario controls: landing time, mission length, thresholds | App UI | P0 | WEB-1 |
| WEB-5 | Compare cards: metrics, badges, countdowns | App UI | P0 | WEB-3, WEB-4 |
| WEB-6 | Timeline scrubber + playback | App UI | P0 | WEB-1 |
| WEB-7 | Launch-delay simulator | App UI | P0 | WEB-5, ENG-4 |
| WEB-9 | Horizon panorama | App UI | P0 | WEB-1, ENG-3 |
| INT-1 | Integration: real engine + real data end to end | App UI | P0 | ENG-4, PIPE-2, PIPE-8 |
| SCN-1 | R3F scene: globe, south-pole patch, camera | 3D & graphics | P0 | WEB-1, PIPE-4 |
| SCN-3 | Sun light and shadows from the ephemeris | 3D & graphics | P0 | SCN-1, EPH-2 |
| PIPE-5 | Derived layers: slope, crater depth, roughness | Pipeline (Sri) | P1 | PIPE-4 |
| PIPE-8 | Run the engine mask builder from the pipeline | Pipeline (Sri) | P1 | PIPE-4, ENG-3 |
| ENG-5 | Thermal model (equilibrium estimate) | Rust engine | P1 | ENG-4 |
| EPH-1 | Astronomy Engine: Moon-fixed Sun/Earth for any date | Ephemeris, data & validation | P1 | PIPE-2 |
| EPH-2 | Ephemeris provider: table first, Astronomy Engine fallback, live 'now' | Ephemeris, data & validation | P1 | EPH-1, PIPE-2 |

### M3 Complete (H12-20)

| ID | Issue | Role | Priority | Depends on |
|---|---|---|---|---|
| PIPE-9 | Package: manifest, size budget, citations | Pipeline (Sri) | P1 | PIPE-2..8 |
| ENG-6 | Grid scoring + PSR layer | Rust engine | P1 | ENG-4, PIPE-5 |
| ENG-7 | Weighted greedy top-N areas + nearby better spot | Rust engine | P1 | ENG-6 |
| ENG-8 | Determinism hash + golden tests | Rust engine | P1 | ENG-4 |
| ENG-9 | Web Worker pool + typed TS wrapper | Rust engine | P1 | ENG-1, WEB-1 |
| DATA-2 | Validation panel data + accuracy report | Ephemeris, data & validation | P1 | ENG-2, PIPE-7 |
| DOC-1 | Explorer-mode copy + glossary | Ephemeris, data & validation | P1 | none |
| WEB-8 | Viability calendar | App UI | P1 | WEB-7, ENG-9 |
| WEB-10 | Time-series charts: sun vs horizon, Earth, power, temperature | Ephemeris, data & validation | P1 | ENG-4 |
| WEB-11 | Weights panel + greedy results | App UI | P1 | ENG-7 |
| WEB-12 | Planner / Explorer modes | Design & landing | P1 | WEB-5, DOC-1 |
| WEB-13 | Validation panel + determinism check | Ephemeris, data & validation | P1 | DATA-2, ENG-8 |
| SCN-2 | Terrain shading: elevation, hillshade, contours | 3D & graphics | P1 | SCN-1 |
| SCN-4 | Heatmap overlay shader + legend | 3D & graphics | P1 | SCN-1, ENG-6 |
| SCN-5 | Site markers + click-to-probe | 3D & graphics | P1 | SCN-1, WEB-3 |
| SCN-6 | Surface view: stand at the lander | 3D & graphics | P1 | SCN-1, ENG-2 |
| LND-2 | Landing hero + intro flight | Design & landing | P1 | WEB-2, LND-1 |
| LND-3 | Landing sections: problem, how it works, features, team | Design & landing | P1 | LND-2 |
| PIPE-6 | Rock distribution: find a polar source or ship the proxy | Pipeline (Sri) | P2 | PIPE-5 |
| PIPE-10 | Imagery texture for the south-pole mesh (Moon Trek) | Pipeline (Sri) | P2 | PIPE-3, SCN-1 |
| SCN-7 | 2D polar map view | 3D & graphics | P2 | SCN-4 |

### M4 Polish & submit (H20+)

| ID | Issue | Role | Priority | Depends on |
|---|---|---|---|---|
| LND-5 | Demo video, slides and submission | Design & landing | P0 | INT-2 |
| INT-2 | Find and save the demo scenarios | Pipeline (Sri) | P0 | INT-1 |
| DOC-2 | README, methods & assumptions | Ephemeris, data & validation | P1 | DATA-2 |
| WEB-15 | States, performance and accessibility pass | App UI | P1 | most WEB issues |
| SCN-8 | Scene performance budget | 3D & graphics | P1 | SCN-1..6 |
| WEB-14 | Export & share: CSV, PNG, mission brief | Ephemeris, data & validation | P2 | WEB-5 |
| LND-4 | Resources page: data, methods, classroom guide | Design & landing | P2 | PIPE-9, DOC-1 |

## Challenge coverage (every point in the challenge maps to issues)

| Code | Challenge point | Issues |
|---|---|---|
| O1 | Site selection & side-by-side comparison (curated + custom coords) | ENG-7, DATA-1, WEB-3, WEB-5, WEB-11, SCN-4, SCN-5 |
| O2 | Date/time flexibility across lunar days and seasons | EPH-1, EPH-2, WEB-4, WEB-6, WEB-8 |
| O3 | Sun & Earth vs horizon; time to sunset / Earthset | ENG-4, WEB-5, WEB-9, SCN-3, SCN-6 |
| O4 | Power & comms metrics: solar elevation, sunlight duration, Earth windows | ENG-4, ENG-5, WEB-4, WEB-5, WEB-10 |
| O5 | Multiple visualization approaches (2D, 3D, other) | PIPE-10, WEB-9, SCN-1, SCN-2, SCN-4, SCN-7 |
| O6 | Temporal dynamics: animation / timelines | WEB-6, WEB-10, SCN-3 |
| O7 | Accessibility across skill levels | DOC-1, WEB-2, WEB-12, WEB-15, LND-1, LND-2 |
| C1 | Ephemeris from Horizons or precomputed data | PIPE-1, PIPE-2, PIPE-7, ENG-2, EPH-1, EPH-2, DATA-2, WEB-13 |
| C2 | Real LOLA topography and accurate horizons | PIPE-1, PIPE-3, PIPE-4, PIPE-8, ENG-3 |
| C3 | No atmosphere: horizon = terrain + lunar sphere | PIPE-4, ENG-2, ENG-3, DOC-1, WEB-9 |
| C4 | Solar elevation displayed prominently | PIPE-7, ENG-2, ENG-4, WEB-5, WEB-10 |
| C5 | Rapid scenario comparison | FND-1, ENG-1, ENG-9, WEB-1, WEB-3, WEB-5, WEB-7, INT-1 |
| C6 | Make lunar vs terrestrial extremes obvious | ENG-5, DOC-1, SCN-6 |
| C7 | Why small location/date changes matter | PIPE-5, ENG-6, ENG-7, DOC-1, WEB-7, WEB-11, INT-2 |
| C8 | Earth libration and lunar orbital variation | PIPE-2, ENG-2, EPH-1, WEB-9, SCN-6 |
| C9 | Steep slopes, deep craters, extreme shadows | PIPE-3, PIPE-5, PIPE-6, ENG-3, ENG-6, SCN-2, SCN-3 |
| C10 | Science-engineering coordination | PIPE-9, ENG-8, DATA-2, DOC-2, WEB-1, WEB-13, WEB-14, LND-3, LND-4, LND-5 |
| C11 | Responding to schedule changes / launch delays | WEB-7, WEB-8, INT-2 |
| C12 | Education for students and the public | DATA-1, DOC-1, WEB-12, SCN-6, LND-2, LND-3, LND-4, LND-5 |

O = challenge objective, C = challenge consideration (see `docs/CHALLENGE.md`).
