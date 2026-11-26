# Lunala — Lunar Landing Site Navigator

An open-source educational lunar exploration lab for students, teachers and curious explorers. Compare south-polar lunar landing sites and dates by
Sun and Earth geometry against the real terrain horizon — solar power, thermal
exposure and direct-to-Earth communications — with a deterministic Rust/WASM
engine and a React/Three.js front end.

- **Live URL:** https://lunar-window-smoky.vercel.app/ · [Workspace](https://lunar-window-smoky.vercel.app/app). Production API setup and deployment verification are tracked in #5.
- **Demo surface:** the landing page and interactive mission workspace.
- **Build spec:** [SPEC.md](SPEC.md) · **Team proposal:** [docs/PROPOSAL.md](docs/PROPOSAL.md)
- **Methods, data sources, assumptions, validation status:** [docs/METHODS.md](docs/METHODS.md)

> Demo status: the 3 surveyed regions (Connecting Ridge, Haworth, Malapert Massif)
> run the real WASM engine on real LOLA masks and the JPL Horizons table. Only the
> `demo-*` sites use clearly labelled synthetic data (`web/public/data/mock/`).

Start with [learning activities](https://lunar-window-smoky.vercel.app/docs#activities): predict how terrain affects sunlight, compare arrival dates, and explain why changing priorities changes a ranking. The public code spans Python data processing, typed data contracts, a deterministic Rust/WASM engine, worker orchestration, and React/Three.js rendering. Team contributions remain credited in the application.

Public data files are cached in the browser by their build-time SHA-256 hashes; a new data revision replaces the cache. Failed, corrupt, private and API responses are excluded. Storage failures fall back to the network. Auto graphics renders settled terrain on demand; Lite lowers pixel density, disables terrain shadows and uses a static landing Moon. These settings affect presentation, not scientific values.

**Licensing:** original project code is available under the [MIT License](LICENSE), with contributor approval. NASA datasets and third-party dependencies retain their own terms and attribution; see [methods and attribution](docs/METHODS.md#license-and-attribution).

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
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Output directory | `dist` |

`web/vercel.json` routes `/api/ask` to a server-only function and other deep links
such as `/app?...` to the SPA; existing assets and `web/public/data/` are served
as-is. `/version.json` records the deployment's source commit without credentials.
Verify its SHA against the production branch after each deploy.

The existing project currently uses CLI deployments. From a clean checkout of main,
linked to that existing project, run:

```sh
vercel --prod --yes --build-env VERCEL_GIT_COMMIT_SHA="$(git rev-parse HEAD)"
```

The explicit public SHA is needed because CLI builds have no Git checkout. Main
pushes alone will not deploy until the project has a Git integration.

Solgaleo needs Production-only `ASK_API_KEY` (sensitive), `ASK_BASE_URL` and
`ASK_MODEL`, plus one published SDK firewall rule `solgaleo-ip`: 10 requests/minute in a
shared (`all`) bucket. This also bounds any individual visitor. Production functions run in
`iad1` so the regional shared counter uses one region.
See [local and production AI setup](docs/LOCAL-DEV.md#ask-ai-optional). Never use
`VITE_` for credentials. Redeploy after environment changes. Until configuration
is complete, the assistant reports an unavailable state; the lunar workspace
works independently. The optional local database API is not deployed publicly.

## How it fits together

```
NASA sources ──► pipeline ──► web/public/data/* ──► web app (React)
                    │                                    │
                    └─ engine masks bin (native Rust)     └─ engine WASM (same crate)
```

The same Rust crate produces the offline horizon masks (native bin, run by the
pipeline) and the in-browser scoring WASM, so the numbers a learner sees in the UI
come from the same deterministic code that validated the masks.

## License and attribution

See [docs/METHODS.md](docs/METHODS.md#license-and-attribution). NASA data
products keep their per-file citations in `source_urls` headers and
`web/public/data/manifest.json`.
