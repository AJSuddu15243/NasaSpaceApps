import { desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { scenarios } from './schema.ts';

export interface ScenarioRecord {
  slug: string;
  name: string;
  /** Site ids plus mission settings, shaped like the web app's Scenario minus `sites`/`date`/`hours` columns. */
  payload: {
    sites: string[];
    date: string;
    hours: number;
    weights: Record<string, number>;
    missionWeights: Record<string, number>;
    mode: string;
    view: string;
    /** Other web Scenario fields (survivalK, batteryH, ice, slopeLimit, focus, layer, heat, playhead, delay); kept in the weights jsonb. */
    [extra: string]: unknown;
  };
  createdAt: string;
}

const url = process.env.DATABASE_URL ?? 'postgres://lunar:lunar@localhost:5432/lunar_window';
const client = postgres(url, { max: 5 });
export const db = drizzle(client, { schema: { scenarios } });

function slugify(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32) || 'scenario';
  return base;
}

export async function listScenarios(): Promise<ScenarioRecord[]> {
  const rows = await db.select().from(scenarios).orderBy(desc(scenarios.createdAt)).limit(50);
  return rows.map(toRecord);
}

export async function getScenario(slug: string): Promise<ScenarioRecord | undefined> {
  const rows = await db.select().from(scenarios).where(eq(scenarios.id, slug)).limit(1);
  return rows[0] ? toRecord(rows[0]) : undefined;
}

export async function saveScenario(name: string, payload: ScenarioRecord['payload']): Promise<ScenarioRecord> {
  // Slug is deterministic from the name: re-saving updates in place, and names
  // that slugify identically share one row (same rule as the web store).
  const slug = slugify(name.trim() || 'untitled');
  const weights = toWeights(payload);
  const [row] = await db.insert(scenarios).values({
    id: slug,
    name: name.trim() || 'Untitled scenario',
    sites: payload.sites,
    landingDateUtc: payload.date,
    durationHours: payload.hours,
    weights,
  }).onConflictDoUpdate({
    target: scenarios.id,
    set: { name: name.trim() || 'Untitled scenario', sites: payload.sites, landingDateUtc: payload.date, durationHours: payload.hours, weights },
  }).returning();
  return toRecord(row);
}

export async function deleteScenario(slug: string): Promise<void> {
  await db.delete(scenarios).where(eq(scenarios.id, slug));
}

/** Row `weights` jsonb: both weight sets, mode/view, and every extra payload field (no migration needed). */
export function toWeights(payload: ScenarioRecord['payload']): Record<string, unknown> {
  const { sites: _s, date: _d, hours: _h, weights: engine, missionWeights: mission, mode, view, ...extras } = payload;
  return { ...extras, engine, mission, mode, view };
}

export function toRecord(row: typeof scenarios.$inferSelect): ScenarioRecord {
  const { engine, mission, mode, view, ...extras } = row.weights as { engine?: Record<string, number>; mission?: Record<string, number>; mode?: string; view?: string; [extra: string]: unknown };
  return {
    slug: row.id,
    name: row.name,
    payload: {
      ...extras,
      sites: row.sites,
      // pg returns "YYYY-MM-DD HH:MM:SS+00"; the web contract wants ISO-8601 Z.
      date: new Date(row.landingDateUtc).toISOString(),
      hours: row.durationHours,
      weights: engine ?? {},
      missionWeights: mission ?? {},
      mode: mode ?? 'planner',
      view: view ?? '3d',
    },
    createdAt: row.createdAt,
  };
}
