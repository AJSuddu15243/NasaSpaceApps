# Pipeline handoff notes

## Confirmed conventions

- Pipeline coordinates: Moon-fixed `MOON_ME`; latitude degrees north, longitude degrees east
  in [-180, 180]; south polar stereographic grid coordinates and heights in metres.
- Radius 1,737,400 m. Far/near terrain 240/80 m; heatmap cells 160 m; horizon range 150 km;
  site/grid azimuth bins 360/64; shipped budget 25 MB.
- Hourly UTC reference interval is inclusive: 2026-01-01T00:00Z through 2030-12-31T23:00Z,
  43,824 samples. SPEC body distances stay in kilometres, not metres.
- Relative data paths are rooted in this checkout regardless of cwd or alternate config location.
- Every stage is a stub. No raw data, ephemerides, masks, or output products were generated for PIPE-1.
- `terrain-fetch` starts in trek.py; PIPE-3 owns invoking pgda.py as fallback. Layers is shared by
  PIPE-5/PIPE-6. All stages run sequentially; no parallel heavy jobs.

## Sources

[NASA Lunar Surface Data Book, M2M-30044, baseline 18 March 2025](https://ntrs.nasa.gov/api/citations/20250002845/downloads/M2M-30044%20Lunar%20Surface%20Data%20Book%20Baseline_Final.pdf),
Table A2.1-1, printed p. 75, supplies original polygon centres:

| Region | Latitude (degrees north) | Longitude (degrees east, signed) |
|---|---:|---:|
| Connecting Ridge (R01) | -89.4632 | -137.49 |
| Haworth | -86.7639 | -22.777 |
| Malapert Massif (R23) | -85.9948 | -0.23578 |

These are polygon-centre seeds, not final landing sites or crater centres. Values are transcribed
without longitude arithmetic; negative longitude is west in the east-positive pipeline convention.
NASA's [ADC 2023 data page](https://www.nasa.gov/learning-resources/app-development-challenge/2023-handbook-and-coding-components/)
labels latitude degrees north and longitude degrees east. The book attributes polygon coordinates to
PGDA DEMs. Its table does not explicitly label the realization `MOON_ME`; downstream source-frame
verification remains necessary. All regions therefore remain `confirmed: false`.

Existing ADC file links remain in `LunarLandingSiteNavigation/RESOURCES.md`; no files outside pipeline/
were edited. The source above is recorded here under PIPE-1's folder restriction.

## Gotchas

- `schemas.py` warns once per missing schema kind until FND-1 lands. A present invalid schema fails;
  it is never silently skipped. External schema references are not retrieved over the network.
- Binary arrays are C-order little-endian; dtype headers use canonical names such as float32.
  `read_array` checks exact byte length before mapping. The writer rejects nonfinite numeric values.
- shortcut: binary/header writes are not a transactional pair, upgrade to versioned staging before
  concurrent publishers or serving readers during generation. Regenerate after an interrupted write.
- shortcut: caches assume one writer per path and persist without expiry, add locking/refresh policy
  if concurrent jobs or changing API responses are introduced. Use a new cache directory to refresh.
- `cached_get` is for small API payloads. Large rasters must use `download` and windowed reads.
- Resume identity includes URL and authoritative SHA-256. Without a matching identity sidecar, an
  existing partial file is discarded. HTTP 200 restarts; HTTP 206 must describe the expected range.
- The repository location is derived from the editable source package. Standalone wheel use is not
  supported because config and contracts live outside the installed package.
- Pyproj is a dev dependency for coordinate cross-checks; production transforms belong to PIPE-4.

## Adversarial review: attack → tests → gaps → gap tests

1. Config silently defaults misspellings, accepts invalid units/types, or redirects output with cwd.
   `tests/test_config.py` checks dotted errors, immutable nested regions, exact defaults, UTC,
   alternate config locations, and cwd-independent paths.
2. Writer and reader share an endian/order bug and still round-trip. `tests/test_binio.py` compares
   bytes to independent struct packing with a big-endian transposed input; also checks provenance,
   malformed metadata and exact payload length.
3. Resume duplicates a prefix or publishes corrupted/incomplete content. `tests/test_fetch.py` uses
   fake transports for ignored/malformed ranges, short bodies, checksum mismatch and interruptions.

Initial gaps: happy paths could ignore query identity, accept duplicate YAML keys, resume another
URL's bytes, bypass validation after an earlier missing-schema warning, or only expose commands in
help without executing them. Additional tests exercise each of these independent behaviors.
Remaining limitations: no real network, raster processing, physical validation or production data
is exercised in this scaffold. Passing stubs proves dispatch only, not completion of PIPE-2..10.

## Open questions

- FND-1 schema identifiers and any cross-file references need checking when those contracts land.
- Downstream owners must verify final region bounds, source frame realization and input checksums.
- Rock-layer polar coverage is still unconfirmed; no real data claim is made here.

## Ready-to-paste PIPE-2 prompt

Implement PIPE-2 using the merged PIPE-1 scaffold. Read Agent.md, SPEC.md, pipeline/AGENTS.md,
README.md and NOTES.md first, plus the PIPE-2 issue. Work in pipeline/ only. Implement
src/lunar_pipeline/horizons.py and ephem.py through run(cfg: Config), with focused tests and notes.
Do not change __main__.py, Makefile, pyproject.toml, uv.lock or config.yaml. Reuse load_config,
cached_get, write_array and schemas.validate. Preserve MOON_ME, east-positive longitude,
UTC hourly 2026–2030 inclusive (43,824 samples), and SPEC's float32 ephemeris field order and
kilometre distance fields. Use chunked offline acquisition and fake transports/fixtures in tests;
never contact Horizons from tests. Attack frame/time/order/leakage assumptions before writing tests,
then close coverage gaps. Do not fabricate physical outputs or bypass unresolved frame conversions.
Run make lint, make test, command-specific checks; report factual findings and a reviewable diff.

## PIPE-1 verification

Clean uv setup succeeded with CPython 3.12.16 and the committed lockfile. Ruff check and format
passed; all 81 offline tests passed. `make all` ran all eight stages in order; root CLI help listed
all commands. The requested `rm -rf pipeline/.venv` was rejected by command review, so the existing
environment was moved to ignored `pipeline/data/venv-before-clean` before recreating `.venv`.
No checks ran against the moved environment. Local proof logs and a before/after patch are in
ignored `pipeline/data/`; only source, tests, config, docs and the lockfile are committed.
