# Explorer-mode content (DOC-1)

Plain-language copy for students and the public. Reading level target: grade 8.
Tone: friendly mission-control — precise, never breathless.

## Files

- `glossary.json` — terms used by tooltips across the app. Each entry has a
  `short` string (tooltip length) and a `long` string (explainer panel).
  Keys are stable IDs; UI looks terms up by `id`.
- `explainers.ts` — short explainer cards (`explainers`) and the Earth vs.
  Moon comparison card data (`earthMoonComparison`).

## Copy rules (docs/QUALITY.md)

- Label synthetic data honestly; never imply a synthetic value is a
  measurement.
- No banned marketing language (seamless, revolutionize, unlock,
  cutting-edge, harness, leverage, empower, game-changer, delve).
- Explain the *why* in Earth terms first, then the lunar consequence.

## Wiring

Content-only module — UI components consume it when explorer mode lands
(WEB-12). No rendering happens here yet.
