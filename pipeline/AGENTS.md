# pipeline/ — agent guide (data pipeline, owner: Sri)

Read the root `Agent.md` and `SPEC.md` first. This file adds the rules for `pipeline/` only.

## What this folder does
Turns NASA data into the small, versioned files the app and the Rust engine read. Nothing here runs in the
browser. Every output goes to `web/public/data/` and matches a contract in `SPEC.md` ("File contracts").

```
pipeline/
├── pyproject.toml          # Python 3.12, managed with uv; ruff + pytest
├── config.yaml             # regions, date range, resolutions, output paths (single place for knobs)
├── Makefile                # make setup | ephem | terrain | layers | masks | validate | imagery | package | all | test | lint
├── src/lunar_pipeline/
│   ├── __main__.py         # CLI: python -m lunar_pipeline <command>
│   ├── config.py           # strict frozen config; repository-root paths
│   ├── binio.py            # little-endian arrays + required metadata
│   ├── fetch.py            # cache, retries, streaming/resume + SHA-256
│   ├── schemas.py          # shared schema validation; warn once if missing
│   ├── masks.py            # native Rust masks adapter (PIPE-8)
│   ├── coords.py           # lat/lon <-> south polar stereographic (MOON_ME, R = 1737.4 km) + tests
│   ├── horizons.py         # JPL Horizons API client: chunking, retries, caching, parsing
│   ├── ephem.py            # builds ephem.bin + ephem.json (hourly 2026-2030)
│   ├── terrain/
│   │   ├── trek.py         # Moon Trek / QuickMap download APIs
│   │   ├── pgda.py         # PGDA LOLA GeoTIFF fallback
│   │   ├── tiles.py        # crop + downsample to raw float32 tiles + JSON header
│   │   ├── imagery.py      # surface imagery (PIPE-10)
│   │   └── layers.py       # slope, crater depth (local relief), roughness proxy, rock layer
│   ├── validate.py         # Horizons topocentric az/el for curated sites -> validation set
│   └── package.py          # manifest.json, size budget, citations
├── tests/                  # pytest; fixtures only, never hits the network
└── data/                   # raw/ and cache/ (gitignored, never committed)
```

## Pipeline order
`ephem` → `terrain` → `layers` → `masks` (calls the engine's native Rust bin `cargo run --release --bin masks`) →
`validate` → `imagery` → `package`. `make all` runs them in order and is safe to re-run (cached, idempotent).

## Outputs (all in `web/public/data/`)
| File | Made by | Contract |
|---|---|---|
| `ephem.bin`, `ephem.json` | `ephem` | SPEC: ephem |
| `tiles/{region}_{res}m.bin` + `.json` | `terrain` | raw float32 little-endian heights (m) + header |
| `grid/{region}.bin` + `.json` | `layers` + `masks` | SPEC: grid (mask, slope_deg, aspect_deg, elev_m, crater_depth_m, roughness_deg, rock) |
| `masks/{site_id}.json` | `masks` | SPEC: masks |
| `validation/{site_id}.json` | `validate` | `{ site_id, samples: [{ t_iso, sun_az, sun_el, earth_az, earth_el }] }` |
| `manifest.json` | `package` | `{ schema_version, generated_at, files: [{ path, bytes, sha256, source_urls }] }` |

## Rules
- **Units and frames everywhere:** metres, degrees, UTC ISO 8601; Moon-fixed MOON_ME; south polar stereographic
  in metres for grids. Put units in every JSON header.
- **Every binary has a JSON header** with `schema_version`, `source_urls`, `generated_at`, shape and dtype.
- **Shipped size budget:** under 25 MB total in `web/public/data/`; anything bigger gets downsampled or tiled.
- **Raw data never goes in git.** Cache downloads in `pipeline/data/` and verify them by checksum.
- **Tests never use the network.** Save a small real response as a fixture and test the parser against it.
- **Cite every source** (URL + dataset name) in the JSON header and in `manifest.json`.
- Changing a contract means changing `SPEC.md` in the same PR and telling the engine and web owners.
- Mark any shortcut with `shortcut: <limit>, <when to upgrade>` (root `Agent.md` rule).

## How teammates use it
`cd pipeline && make setup && make all` regenerates every data file. To use the data without running the
pipeline, pull `main`: the outputs are committed under `web/public/data/` once they fit the size budget.

## Stage status

PIPE-1 to PIPE-10 are implemented and their outputs are committed under `web/public/data/` (GitHub issues hold
the live status). `terrain` is a Make alias for CLI `terrain-fetch` then `tiles`. The CLI registry imports stages
lazily; each stage implements `run(cfg: Config) -> None`.

Downstream issues edit their own modules and tests, leaving __main__.py, Makefile, pyproject.toml,
uv.lock and config.yaml stable. Use sequential streaming downloads and raster windows on the
16 GB MacBook Air. Tests use fake transports; conftest.py blocks accidental network access.
Read README.md for helper signatures and NOTES.md for source provenance and limitations.
