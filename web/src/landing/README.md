# Landing (`/`)

One fixed WebGL Moon, a scroll-scrubbed eight-chapter story, and a dive into `/app`.
Design references: Ascenta Studio (Last Dept., Basalte, Nival, Ciel) and fojcikdominik.com.

| File | Role |
|---|---|
| `LandingPage.tsx` | Chrome (pill nav, status bar, rail, loader), chapters, Lenis scroll, dive |
| `story.ts` | Pure maths: chapter keys, easing, Moon-fixed frame, site list, polar projection (unit-tested) |
| `MoonStage.tsx` | R3F stage: Lunar-Lambert Moon shader, LOLA cap, stars, Earth, site rings + projected labels |
| `textures.ts` | Loads `public/textures/moon/manifest.json` with real byte progress (no three.js import) |

## Data on this page
- Moon: NASA SVS CGI Moon Kit LROC colour + LOLA elevation (`public/textures/moon_*.jpg`).
- Sites: region centres from `pipeline/config.yaml`; heights from PIPE-3. A test checks both match.
- Numbers in the copy come from PIPE-2 / PIPE-3 checks (±1.59° Sun latitude, ±6.86° Earth latitude, 43,824 rows, 80 m grid).
- Scroll sets a date (from the navigator default 2027-01-15, one Sun turn per synodic month); the Sun and Earth are placed for it with Astronomy Engine (`sunEarthAt`). The navigator uses the Horizons table.

## Real south-pole relief (do this once, on the machine with the DEM)
    cd pipeline && make terrain-fetch
    python ../web/scripts/make-polar-cap.py data/raw/LDEM_80S_80MPP_ADJ.TIF
Commit `web/public/textures/moon/south-cap-normal-2048.jpg` and the updated `manifest.json`.
The shader samples it in the DEM's own polar-stereographic grid (`story.polarStereo` is the tested twin).

## Tuning
Camera, tilt, Sun and overlay strength per chapter: `KEYS` in `story.ts`. Copy: `LandingPage.tsx`.
Reduced motion snaps chapters; no WebGL2 or save-data shows a static Moon.

## Verify
    pnpm typecheck && pnpm lint && pnpm test && pnpm build
    PLAYWRIGHT_CHROMIUM_EXECUTABLE=<chrome> pnpm test:browser src/landing
