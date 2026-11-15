# Lunar Window — Lunar Landing Site Navigator

A NASA Space Apps project: compare south-polar lunar landing sites and dates by
Sun and Earth geometry against the real terrain horizon — solar power, thermal
exposure and direct-to-Earth communications — with a deterministic Rust/WASM
engine and a React/Three.js front end.

- **Live URL:** not deployed yet — Vercel previews are tracked in #5.
- **Screenshots:** pending the first deploy; the landing page and workspace are
  the demo surface.
- **Build spec:** [SPEC.md](SPEC.md) · **Team proposal:** [docs/PROPOSAL.md](docs/PROPOSAL.md)
- **Methods, data sources, assumptions, validation status:** [docs/METHODS.md](docs/METHODS.md)
- **Official challenge:** [docs/CHALLENGE.md](docs/CHALLENGE.md)

> Demo status: the 3 surveyed regions (Connecting Ridge, Haworth, Malapert Massif)
> run the real WASM engine on real LOLA masks and the JPL Horizons table. Only the
> `demo-*` sites use clearly labelled synthetic data (`web/public/data/mock/`).

Full local setup (prerequisites, scenario database, pipeline): [docs/LOCAL-DEV.md](docs/LOCAL-DEV.md).

## Repository layout

| Path | What it is | Stack |
|---|---|---|
| `web/` | Front end: landing page + mission workspace | React 19, TypeScript, Vite, Tailwind, Three.js / React Three Fiber |
| `engine/` | Simulation core: WASM lib for the app + native mask builder | Rust, wasm-bindgen, wasm-pack |
| `pipeline/` | Data pipeline: NASA sources → versioned binary/JSON contracts | Python 3.12, uv |
| `contracts/` | Shared JSON schemas and boundary validators | JSON Schema, Node |
| `server/` | Optional scenario database (not used by the static demo) | Postgres, Drizzle |
| `docs/` | Proposal, spec-adjacent docs, methods, task board | Markdown |
| `LunarLandingSiteNavigation/` | Older ADC terrain grids and links (reference only) | — |

## Quick start

### Web app

```sh
cd web
pnpm install
pnpm dev        # http://127.0.0.1:4173  (landing at /, workspace at /app)
pnpm typecheck && pnpm lint && pnpm test   # the CI gates
pnpm build      # typecheck + production build → web/dist
pnpm exec vite preview   # serve the production build
```

### Contracts

```sh
cd contracts
pnpm install
pnpm test && pnpm check && pnpm validate-data   # schemas, generated types, data files
```

### Engine (Rust → WASM)

```sh
cd engine
cargo test                                          # native tests
cargo clippy --all-targets -- -D warnings           # lint gate
./build.sh                                          # wasm-pack release → web/src/engine/pkg
```

`build.sh` needs [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/)
and fails if the `.wasm` exceeds the 1.5 MB budget.

### Pipeline (Python)

```sh
cd pipeline
make setup     # uv sync (Python 3.12, locked)
make all       # ephem → terrain → layers → masks → validate → imagery → package
make test && make lint
```

`make test` exports `PYTHONPATH=src`; to run pytest directly use
`PYTHONPATH=src uv run --locked pytest`.

Pipeline outputs land in `web/public/data/` and are committed once they fit the
25 MB budget; raw downloads stay in `pipeline/data/` (gitignored).

## Deploy (Vercel)

| Setting | Value |
|---|---|
| Root directory | `web` |
| Install command | `pnpm install` |
| Build command | `pnpm build` |
| Output directory | `dist` |

`web/vercel.json` rewrites every path to `/index.html` so deep links such as
`/app?...` load the SPA; files under `web/public/data/` are served as-is.

## How it fits together

```
NASA sources ──► pipeline ──► web/public/data/* ──► web app (React)
                    │                                    │
                    └─ engine masks bin (native Rust)     └─ engine WASM (same crate)
```

The same Rust crate produces the offline horizon masks (native bin, run by the
pipeline) and the in-browser scoring WASM, so the numbers a judge sees in the UI
come from the same deterministic code that validated the masks.

## License and attribution

See [docs/METHODS.md](docs/METHODS.md#license-and-attribution). NASA data
products keep their per-file citations in `source_urls` headers and
`web/public/data/manifest.json`.
