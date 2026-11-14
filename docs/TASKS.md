# Task board: Lunar Landing Site Navigator

> Generated from the same data as our GitHub issues. Pick an issue on GitHub, assign yourself, and follow "How we work".

## Team roles (6 people)

| Role | Owner | Folders | Issues |
|---|---|---|---|
| Pipeline (Sri) | Sri | `pipeline/`, `contracts/` | FND-1, PIPE-1, PIPE-2, PIPE-3, PIPE-4, PIPE-5, PIPE-6, PIPE-7, PIPE-8, PIPE-9, PIPE-10, INT-2 |
| Rust engine | Rust teammate | `engine/`, `web/src/engine/` | ENG-1, ENG-2, ENG-3, ENG-4, ENG-5, ENG-6, ENG-7, ENG-8, ENG-9 |
| App UI | _assign_ | `web/` app (features, shell) | FND-3, WEB-1, WEB-3, WEB-4, WEB-5, WEB-6, WEB-7, WEB-8, WEB-9, WEB-11, WEB-15, INT-1 |
| 3D & graphics | _assign_ | `web/src/scene/` | SCN-1, SCN-2, SCN-3, SCN-4, SCN-5, SCN-6, SCN-7, SCN-8 |
| Design & landing | _assign_ | `web/src/landing/`, `web/src/design/`, `web/src/brand/`, `web/src/features/modes/` | WEB-2, WEB-12, LND-1, LND-2, LND-3, LND-4, LND-5 |
| Ephemeris, data & validation | _assign_ | `web/src/ephem/`, `sites.json`, `web/src/features/{charts,validation,export}/`, `docs/`, CI | FND-2, DATA-1, EPH-1, EPH-2, DATA-2, DOC-1, DOC-2, WEB-10, WEB-13, WEB-14 |

## How we work

1. Pick an issue in the current milestone, assign yourself on GitHub, and answer its **Your calls** list (that's where the project gets your taste instead of AI defaults).
2. Open a Conductor workspace named after the issue ID (e.g. `PIPE-2`). Use the model for your role below.
3. Paste the **shared header**, then the issue's agent prompt with your answers.
4. Review the diff yourself, run it, then open a PR titled `[ID] …` with `Closes #<n>` and a screenshot for UI work.
5. The reviewer workspace checks it against SPEC, contracts and `docs/QUALITY.md`; then merge and pull.

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
edit files in the folders the issue owns. Follow SPEC's file contracts exactly; if one looks wrong, stop and
tell me instead of changing it. If mock data you need doesn't exist yet, make a temporary mock in your own
folder. Use my answers to the issue's 'Your calls' exactly; ask if one is missing. Every algorithm gets a test,
and you run it. Never commit raw data. Reply first with a plan of at most 5 lines, then build in small
commits. When the acceptance criteria are met, open a PR titled '[ID] <title>' that says 'Closes #<issue>'.
Finish with: what you built, how to run it, what's mocked, what's left, and any risks.
```

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
