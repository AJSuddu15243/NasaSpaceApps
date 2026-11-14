# Lunar pipeline scaffold (PIPE-1)

Python >=3.12, managed by uv; `.python-version` selects Python 3.12.
Install [uv](https://docs.astral.sh/uv/getting-started/installation/), then from the repository root:

```sh
cd pipeline
make setup
make lint
make test
make all
```

`setup` installs the committed lockfile, including dev tools. Tests are offline.
**Every stage is currently a stub**: `make all` prints the planned stages and writes no data.

From the repository root:

```sh
uv run --project pipeline python -m lunar_pipeline --help
uv run --project pipeline python -m lunar_pipeline ephem --config pipeline/config.yaml
```

`--config` also works before the command. Relative paths *inside* any config resolve from the
repository root; the explicit config filename resolves from the caller's working directory.
This is a repository tool: use the uv editable install in this checkout, not a standalone wheel.

## Commands and ownership

| CLI command | Module under `src/lunar_pipeline/` | Issue |
|---|---|---|
| ephem | ephem.py (uses horizons.py) | PIPE-2 |
| terrain-fetch | terrain/trek.py (owns PGDA fallback via terrain/pgda.py) | PIPE-3 |
| tiles | terrain/tiles.py (uses coords.py) | PIPE-4 |
| layers | terrain/layers.py | PIPE-5, PIPE-6 |
| masks | masks.py | PIPE-8 |
| validate | validate.py | PIPE-7 |
| imagery | terrain/imagery.py | PIPE-10 |
| package | package.py | PIPE-9 |

Each module exposes `run(cfg: Config) -> None`. `all` runs the table in order, sequentially.
Make targets mirror the CLI, plus `setup`, `test`, `lint`, and `terrain` (terrain-fetch then tiles).
No later stage needs to change the registry, Makefile, configuration, or dependency files.
Coordinate shared edits to `terrain/layers.py` between PIPE-5 and PIPE-6.

## Shared interfaces

- `config.load_config(path=None) -> Config`: frozen dataclasses and read-only region mapping;
  missing/unknown keys fail by name. UTC timestamps are parsed to timezone-aware datetimes.
- `binio.write_array(path, array, header)`: `.bin` plus adjacent `.json`; C-order, little-endian,
  real numeric arrays, no precision conversion. Headers require `schema_version` (string),
  `generated_at` (UTC ISO 8601), `source_urls` (URL list), `dtype`, `shape` (integer list), `units`
  (string). Additional contract fields survive. `read_array(path)` returns `(array, header)`;
  nonempty arrays are read-only memory maps. Writes buffer byte swapping in small chunks.
- `fetch.cached_get(url, cache_dir, *, params=None, session=None, retries=3, backoff=0.5,
  sleep=time.sleep) -> bytes`: for small API responses; cache key includes query parameters.
- `fetch.download(url, path, sha256, *, session=None, retries=3, backoff=0.5,
  sleep=time.sleep) -> Path`: 1 MiB streamed chunks, resumable `.part` plus identity sidecar,
  verified SHA-256 before atomic promotion. Inject a requests-compatible transport in tests.
  `retries` counts additional attempts. Interrupted streams retain partial bytes; a checksum
  mismatch removes them. A correct existing destination avoids the network.
- `schemas.validate(kind, obj)`: load `contracts/schemas/<kind>.schema.json`. Missing schemas
  warn once per kind; invalid present schemas/objects raise. Remote reference retrieval is disabled.

Metres for terrain and south polar stereographic grids, degrees for angles, UTC for time,
Moon-fixed `MOON_ME`, east-positive longitude in [-180, 180]. SPEC ephemeris distances remain
explicitly named `sun_dist_km`/`earth_dist_km` in kilometres.

Raw/cache downloads live in ignored `data/`; outputs eventually go to `web/public/data/`.
Never load a whole DEM: later stages must use rasterio windows. See [NOTES.md](NOTES.md)
for provenance, limitations, adversarial coverage, and downstream handoff.
