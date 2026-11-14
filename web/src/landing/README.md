# LND-2 · Landing hero

The root route presents Lunar Window with a stylised south-pole approach and an
immediate handoff to the app. The Moon is procedural: no terrain texture or mission
data is downloaded, and the directional light is visual only.

## Performance and fallbacks

- The copy, static Moon and navigator action render in the initial application bundle.
- The R3F/Three.js scene is a separate lazy chunk and never blocks the action.
- Reduced motion, data-saver, unavailable WebGL, four or fewer logical CPUs, and
  four GiB or less reported memory use the static render.
- Animated devices cap pixel ratio at 1.5 and stop rendering after the 2.2 s approach.

## Verify

From the web folder, run:

    pnpm exec eslint src/landing src/main.tsx
    pnpm typecheck
    pnpm test
    pnpm build
    pnpm test:browser

The browser checks include the 2.5 s interaction budget, Axe WCAG rules, navigator
handoff, reduced motion, the static fallback and mobile overflow.

## Limits

This hero is intentionally stylised, not a terrain or ephemeris visualization. LND-3
owns the longer problem/method story below it. Real terrain remains in the app and
data workstreams.
