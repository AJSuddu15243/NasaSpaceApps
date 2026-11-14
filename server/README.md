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
cp .env.example .env # DATABASE_URL (defaults already match compose)
```

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
