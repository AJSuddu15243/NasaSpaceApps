# Start here: MVP plan for demo day (first planned for Nov 14, 2026)

Read this first. Agents: read this file, then the issue file you were given in `docs/handoff/issues/`.

## The product in one line
**Lunar Window: pick a south-pole site, move the arrival date, see why it wins or loses (Sun, Earth, terrain).**
Four things make it different. Every UI hour goes into these:
1. **Where**: compare Artemis sites side by side (exists, WEB-5).
2. **When**: launch-delay comparison on a timeline (UI-3).
3. **Why**: horizon panorama showing terrain blocking the Sun or Earth (UI-4).
4. **Trust**: real NASA/JPL data with visible validation numbers (UI-5, plus the landing).

## Verified state of `main` (checked 2026-11-15 at `b685f21`)
| Area | State |
|---|---|
| Pipeline | PIPE-1 to PIPE-10 merged; PIPE-8 masks landed with the engine in #120. |
| Real data | `ephem.bin` (Horizons, 43,824 h), `masks/*.json` and `grid/*.bin` for 3 regions (Connecting Ridge, Haworth, Malapert Massif), `validation/*.json`, LROC/LOLA textures. Real `sites.json` (#125). |
| Engine | ENG-1 to ENG-9 merged in #120: `site_metrics`, `grid_fracs`/`grid_scores`, `top_areas`, `nearby_better`, `metrics_hash`, `output_hash` are real WASM (`web/src/engine/pkg/`). |
| Web | The 3 real regions run the WASM engine; `demo-*` sites stay on `mock.ts` and are labelled. #121 merged the #109/#111/#112 fixes and `web/vercel.json` (SPA rewrite). The heatmap score layer runs the engine: baked for 2027-01-15 + 0–14 d, live on the worker pool otherwise, JS preview while computing (#127). |
| Demo-ready (merged #124–#127) | Thresholds 40/40/180/180, default scenario 2027-01-15 + 336 h, slip re-scores the cards, 233 K / 48 h site params, hash under the cards, baked engine heatmap, real `sites.json`. Open after the demo: rest of INT-1 (#48), engine-api schema PR. |
| Not deployed | No Vercel URL yet (#5); settings are in the root `README.md`. |

## Who does what
| Person | Issues | First action |
|---|---|---|
| Anirvin (GitHub `anirvin-dev`) | merge `feat/landing-moon-stage`, run the remap, bake the LOLA cap, then UI-3 + UI-4 | Section A below |
| Aniketh (GitHub `AnikethB6`) | UI-1, UI-5, LND-5 (video and slides) | Prompt B |
| Shivang (GitHub `shaypat112`) | UI-2, FND-3 (deploy URL) | Prompt C |
| Advait (GitHub `Advait-Chandrakar1`) | UI-6 (absorbs SCN-3/4/5/6/8), SCN-1 | Prompt D |
| Ananth / AJ (GitHub `AJSuddu15243`) | Backend: ENG-2 → ENG-3 + PIPE-8 → ENG-4 → ENG-9 → INT-1 | Prompt E |

---
## A. Anirvin: do now, while your ChatGPT resets
1. **Land the landing branch** (needs your GitHub login; this session could not push):
   ```sh
   cd NasaSpaceApps && git fetch origin && git switch -c feat/landing-moon-stage origin/main
   git am ~/Downloads/landing-moon-stage.patch        # the patch file from the chat
   cd web && pnpm install && pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm dev
   git push -u origin feat/landing-moon-stage && gh pr create --fill --base main
   ```
2. **Bake the real south-pole relief** (only your machine has the DEM):
   `cd pipeline && python ../web/scripts/make-polar-cap.py data/raw/LDEM_80S_80MPP_ADJ.TIF`. Commit the jpg + `manifest.json` to the same branch, then scroll chapters 01–03.
3. **Remap issues**: `bash docs/handoff/remap-issues.sh` (dry run), then `--apply`. It only touches open, unassigned, non-data, non-Rust, non-pipeline issues and comments the context link on each.
4. **Delete empty branches**: `bash docs/handoff/cleanup-branches.sh` (dry run), then `--apply`. It deletes only branches 0 commits ahead of `main` with no open PR.
5. Then take UI-3 and UI-4 with this prompt:

> Implement `docs/handoff/issues/UI-3-time-launch-delay.md` (then UI-4). Read `docs/handoff/START-HERE.md`, `SPEC.md`, `web/README.md`, `pipeline/notes/pipe-7.md`. Work only in `web/src/features/timeline/`, `web/src/features/horizon/`, and the panel mount points in `web/src/shell/components/`. Physics stays in the engine adapter; never compute metrics in React. Follow `web/src/shell/theme.css` and the landing type system. Show real data where it exists, and label it. Finish with typecheck, lint, test, build and a 1440×900 screenshot.

## B. Aniketh: prompt
> You own UI-1 and UI-5 (`docs/handoff/issues/UI-1-landing.md`, `UI-5-evidence-panel.md`) and LND-5. Read `docs/handoff/START-HERE.md` and `web/src/landing/README.md`. The landing design language is fixed: one fixed WebGL Moon, tiny tracked Geist Mono labels, Archivo display with one Instrument Serif italic accent word, pill nav, status bar with a per-chapter hint, ease `cubic-bezier(.16,1,.3,1)`. Do not add sections, gradients, emoji or marketing words; tune `KEYS` in `story.ts` instead. Then build the UI-5 method drawer using only numbers loaded from files. Verify with `pnpm test:browser src/landing` and screenshots at 1440×900 and 390×844.

## C. Shivang: prompt
> You own UI-2 (`docs/handoff/issues/UI-2-workspace-shell.md`) and FND-3. After `feat/landing-moon-stage` merges, restyle the merged #84 layout to `web/src/shell/theme.css` (no new palette, no new fonts). Goal: one 1440×900 screen with no page scroll: Sites | Observe | Compare, with the UI-3 timeline docked under Observe. Add the loading, empty, error and no-result states, fix the 2 failing `shell.browser.ts` tests, and ship a Vercel URL for the demo. Close #83 as superseded.

## D. Advait: prompt
> You own UI-6 (`docs/handoff/issues/UI-6-workspace-3d.md`), which absorbs SCN-3/4/5/6/8. Read `web/src/landing/MoonStage.tsx` and reuse its Moon shader for the workspace globe. Order: fix the globe framing (it is a small grey ball right now) → real PIPE-4 tile for the selected site (`web/public/data/tiles/`) → Sun direction from `ephem.bin` at the playhead time → site rings → slope overlay with the 10° contour. Each step must be demoable on its own. Visual only, no physics in shaders. 60 fps on an M1 Air.

## E. Ananth (AJ): backend prompt
> Backend MVP for the demo. It must be real, not faked; scope it to the 3 curated regions. Read `engine/AGENTS.md`, `SPEC.md`, `pipeline/notes/pipe-2.md`, `pipe-3.md`, `pipe-7.md`.
> 1. **ENG-2** geometry from `ephem.bin` (body vector minus site vector, then ENU az/el). Test against `web/public/data/validation/*.json`: max |Δ| under 0.01° for the Sun and 0.02° for Earth.
> 2. **ENG-3 + PIPE-8**: 360-bin site masks for the 3 regions from the PIPE-4 far-field tiles (±150 km at 240 m), written to `web/public/data/masks/{site}.json`.
> 3. **ENG-4** `site_metrics` for a window: sunlit %, longest darkness, Earth contact % with antenna margin, longest blackout, sunset/Earthset countdowns. Use the solar disk (0.53°) for partial visibility.
> 4. **ENG-9** worker + typed wrapper; keep the `web/src/engine/index.ts` signature so UI-3 swaps in with zero UI changes. **INT-1**: real mode for the 3 regions, mock stays for demo sites and is labelled.
> 5. ENG-8 hash if time allows. ENG-5/6/7 are stretch goals.
> Batch decisions into one message with defaults. Do not change file contracts without a note in SPEC.md.

## Demo script (2 min)
Landing hero → scroll 3 chapters → Enter (dive) → select Malapert + Connecting ridge → panorama shows the Sun clipping the ridge → delay 7 days → delta cards change and explain why → open the Method drawer: Horizons error 0.0002° → close on the share link.
