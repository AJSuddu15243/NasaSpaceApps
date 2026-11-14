## Goal
Finish the Moon landing on `feat/landing-moon-stage` and merge it. It replaces the landing from #85: one fixed WebGL Moon, scroll-scrubbed chapters, dive into `/app`. Design references: Ascenta Studio (Last Dept., Basalte, Nival, Ciel) and fojcikdominik.com.

## Already done (branch)
- `web/src/landing/{LandingPage.tsx,MoonStage.tsx,story.ts,textures.ts,landing.css}`, README in the same folder.
- NASA LROC colour + LOLA height Moon, Lunar-Lambert shader, loader with real byte progress, pill nav, status bar with per-chapter hint, rail, site rings with projected labels, Earth on the horizon, method ledger, team, final dive.
- Tests: `story.test.ts` (keys, camera never inside the Moon, PIPE-3 grid coordinates, copy rules) and `landing.browser.ts` (3 Playwright tests incl. axe).

## To do (in order)
1. **Real south-pole relief.** On the machine with the DEM: `cd pipeline && make terrain-fetch && python ../web/scripts/make-polar-cap.py data/raw/LDEM_80S_80MPP_ADJ.TIF`. Commit `web/public/textures/moon/south-cap-normal-2048.jpg` and `manifest.json`. Check chapters 01–03: craters must look like LOLA (Shackleton next to the pole, Malapert massif under ring 03). Without it, chapters 01–03 stay soft.
2. **Chapter tuning on a real GPU.** Scroll each chapter at 1440×900 and 390×844. Adjust only `KEYS` in `story.ts` (camera, tilt, sunLon, sites, earth). Acceptance: the Moon never sits under body copy, every chapter has one clear subject, and no jumps between chapters.
3. **Hover ↔ list sync on site rings.** Already wired both ways; verify the pointer works through the overlay (`.lw-story` is `pointer-events:none`).
4. **Real Sun for chapter 02 (stretch).** Replace `illustrativeDate` with the PIPE-2 `ephem.bin` sub-solar longitude at a real date range, then remove the "Illustrative lighting" caption.
5. Record the 20 s landing segment for LND-5.

## Acceptance
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` and `pnpm test:browser src/landing` pass.
- First JS bundle stays under 300 kB (three.js only loads with the stage).
- Reduced motion snaps chapters; no WebGL2 shows the static Moon; no horizontal overflow at 375 px.
- Every number in the copy traces to PIPE-2/PIPE-3/PIPE-7 notes. No new unverified claims.
