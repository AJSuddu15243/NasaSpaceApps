# Running Lunala locally

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
pnpm test         # unit and contract tests
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

Solgaleo calls the same-origin `/api/ask` endpoint. For local use, copy
`server/.env.example` to `server/.env`, set `ASK_API_KEY` privately, then run
`pnpm api` in `server/`. The explicit server settings are `ASK_API_KEY`,
`ASK_BASE_URL` (an HTTPS chat-completions endpoint), and `ASK_MODEL`.
There is no GitHub-token fallback. Never put credentials in `VITE_` variables.

Production uses `web/api/ask.ts` on Vercel, independently of the optional
scenario database. Configure server-only Production environment variables and
publish one SDK firewall rule `solgaleo-ip` (fixed window, 10 requests/60 seconds,
429 on limit). The handler checks that rule with a fixed shared `all` key; the shared
cap also bounds any individual visitor. This uses one rate-limit rule, as required on Hobby. The cap is 10/minute
across visitors; the original separate 500/hour rule is not configured. Production functions stay in `iad1` because
counters are regional. Redeploy after configuration changes and also set provider-side quotas. Missing credentials
or unavailable firewall rules return a controlled 503; the workspace remains usable.
Preview builds must not receive the production key unless explicitly trusted.

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

The web app consumes the real WASM engine through `web/src/engine/`.
Only explicitly labelled `demo-*` sites use synthetic fixtures.

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
