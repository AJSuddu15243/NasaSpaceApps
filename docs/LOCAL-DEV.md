# Running Lunar Window locally

Everything you need to run the web app, the scenario database, and the data
pipeline on one machine. Commands assume macOS/Linux; Windows uses the same
tools via WSL or native installs.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 22+ | `brew install node` or nvm |
| pnpm | 10+ | `corepack enable` |
| Python | 3.12+ | `brew install python@3.12` |
| uv | latest | `brew install uv` |
| Docker Desktop | any recent | https://docker.com/products/docker-desktop |
| Rust | stable | `brew install rust` (only for the engine) |

## 1. Web app (the whole UI)

```bash
cd web
pnpm install
pnpm dev          # http://127.0.0.1:4173
```

Routes: `/` landing, `/app` workspace, `/docs` documentation, `/design`
design reference. Theme toggle is in the header; everything persists in the
URL, so any scenario is shareable as a link.

Other web commands:

```bash
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm test         # vitest (80 tests)
pnpm build        # production build → dist/
pnpm exec vite preview  # serve the production build (no `preview` script)
```

## 2. Scenario database (Postgres + Drizzle + API)

Requires Docker Desktop running.

```bash
cd server
pnpm install
pnpm db:up        # postgres:16-alpine on :5432 (named volume, auto-restart)
pnpm db:migrate   # apply drizzle/0000_*.sql → scenarios table
pnpm api          # scenarios API on :8787
```

The API is zero-dependency `node:http`:

- `GET /api/scenarios` — list saved scenarios
- `GET /api/scenarios/:slug` — fetch one
- `POST /api/scenarios` — `{ name, payload }` save (same-name resave updates)
- `DELETE /api/scenarios/:slug` — remove
- `POST /api/ask` — `{ question, context }` → `{ answer }` (Ask AI button in `/app`)

### Ask AI (optional)

The "Ask AI" button in the workspace answers questions about what is on
screen. It proxies to any OpenAI-compatible chat API — all of these have
free tiers and need no card:

```bash
# Groq (fastest free option — console.groq.com → API Keys)
cd server
ASK_API_KEY=gsk_... \
ASK_BASE_URL=https://api.groq.com/openai/v1/chat/completions \
ASK_MODEL=openai/gpt-oss-120b \
pnpm api

# or Gemini (aistudio.google.com → Get API key)
ASK_API_KEY=AIza... \
ASK_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/chat/completions \
ASK_MODEL=gemini-2.0-flash \
pnpm api

# or GitHub Models with a personal access token (github.com/settings/tokens)
GITHUB_TOKEN=github_pat_... pnpm api
```

See `server/.env.example` for the full list. Without a key the endpoint
returns 503 and the panel shows a readable offline message — the rest of
the app is unaffected, so judging never breaks.

**Web integration is automatic in dev**: `web/vite.config.ts` proxies `/api`
to `:8787`, so saving a scenario in `/app` writes to Postgres *and*
localStorage. `VITE_API_URL` overrides the API base in any build. If the API
or DB is down, the app silently stays on localStorage — nothing breaks
offline.

Schema lives in `server/src/schema.ts`; after changing it run
`pnpm db:generate` (writes a new SQL migration into `server/drizzle/`) and
`pnpm db:migrate`. `pnpm db:studio` opens Drizzle Studio.

DB credentials (local dev only, from `docker-compose.yml`):
`postgres://lunar:lunar@localhost:5432/lunar_window`
— override with `DATABASE_URL` in `server/.env`.

## 3. Data pipeline (optional — regenerates `web/public/data/`)

Only needed to rebuild the shipped NASA datasets; the committed outputs are
already in the repo.

```bash
cd pipeline
make setup        # uv sync (first time only)
make ephem        # JPL Horizons → ephem.bin/json (needs network)
make terrain      # LOLA tiles → tiles/ + grid/
make layers       # slope/crater/rock derived layers
make masks        # horizon masks per site (calls the Rust engine binary)
make validate     # Horizons cross-check → validation/
make imagery      # surface imagery textures
make package      # manifest.json + size budget
make all          # everything, cached and idempotent
make test         # pytest (212 tests)
```

Raw downloads cache in `pipeline/data/` (gitignored, never committed).

## 4. Engine (optional — Rust → WASM)

```bash
cd engine
cargo build --release
wasm-pack build --target web   # or the repo's documented build
```

The web app currently consumes the engine through `web/src/engine/` — the
mock adapter serves labelled synthetic fixtures until the WASM worker
adapter lands (ENG-9).

## Quick sanity check

```bash
cd web && pnpm typecheck && pnpm test && pnpm build   # all green
cd server && pnpm typecheck                            # clean
cd pipeline && make test                               # 212 tests
```

## Troubleshooting

- **`/app` shows "could not load"** — the mock data under `web/public/data/mock/`
  must exist; run `cd web && pnpm generate:mock` if missing.
- **Save Scenario does nothing persistent** — expected offline; start
  `pnpm db:up && pnpm api` in `server/` and reload.
- **Port 5432 busy** — another Postgres is running; stop it or change the
  host port in `server/docker-compose.yml` and `DATABASE_URL`.
- **`pnpm db:migrate` hangs** — the container isn't healthy yet; check
  `docker ps` and `docker logs lunar-window-db`.
