# server/ — scenario database

Postgres + Drizzle persistence for saved mission scenarios. The web app is a
static SPA, so this is a standalone package: it owns the `scenarios` table and
the repository functions; wiring it to an HTTP API (and swapping the web
`localStorage` store in `web/src/scenarios/store.ts` for fetch calls) is a
follow-up.

## Setup

```bash
cd server
pnpm install
pnpm db:up          # docker compose: postgres:16-alpine on :5432
pnpm db:generate    # regenerate SQL migrations after schema changes
pnpm db:migrate     # apply migrations
pnpm api            # scenarios API on :8787 (needs the db running)
cp .env.example .env # DATABASE_URL (defaults already match compose)
```

## API

`node src/api.ts` (zero-dependency `node:http`, CORS open for local dev):

| Route | Purpose |
|---|---|
| `GET /api/scenarios` | list saved scenarios (newest first, max 50) |
| `GET /api/scenarios/:slug` | fetch one |
| `POST /api/scenarios` | `{ name, payload }` → saved record (same-name resave updates) |
| `DELETE /api/scenarios/:slug` | remove |

The web app mirrors saves to this API when reachable: `web/vite.config.ts`
proxies `/api` → `localhost:8787` in dev, `VITE_API_URL` overrides the base in
any build, and `localStorage` remains the synchronous fallback so `/app`
works fully offline.

## Schema

`scenarios`: `id` (slug PK), `name`, `sites` jsonb, `landing_date_utc`,
`duration_hours`, `weights` jsonb (`{ engine, mission, mode, view }`),
`created_at`. Migration SQL lives in `server/drizzle/` and is committed.

## Usage

```ts
import { listScenarios, getScenario, saveScenario, deleteScenario } from './scenarios';

const saved = await saveScenario('Shackleton survey', {
  sites: ['connecting-ridge'], date: '2026-11-14T12:00:00.000Z', hours: 336,
  weights: { sun: 50, earth: 35, slope: 10, crater: 5, rock: 0, thermal: 0 },
  missionWeights: { lit: 40, earth: 30, dark: 15, blackout: 15 },
  mode: 'planner', view: 'globe',
});
```
