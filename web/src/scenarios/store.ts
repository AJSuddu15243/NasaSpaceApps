import type { Scenario } from '../shell/scenario';

/**
 * Local persistence for named mission scenarios.
 *
 * The app is a static SPA, so scenarios are stored in localStorage under a
 * stable key. The interface is deliberately backend-agnostic: swapping in a
 * SQLite/HTTP scenarios API later only requires reimplementing these four
 * functions — callers never touch storage directly.
 */
export interface StoredScenario {
  slug: string;
  name: string;
  scenario: Scenario;
  created_at: string;
}

const STORAGE_KEY = 'lunar-window-scenarios-v1';
const MAX_STORED = 50;

function readAll(): StoredScenario[] {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredScenario[]).filter(isStored) : [];
  } catch {
    return [];
  }
}

function isStored(value: unknown): value is StoredScenario {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.slug === 'string' && typeof v.name === 'string'
    && typeof v.created_at === 'string' && typeof v.scenario === 'object' && v.scenario !== null;
}

function writeAll(items: StoredScenario[]): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_STORED)));
  } catch {
    // Storage full or unavailable (private mode): saving is best-effort.
  }
}

function slugify(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32);
  return base || 'scenario';
}

function makeSlug(name: string, taken: Set<string>): string {
  const base = slugify(name);
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
  taken.add(slug);
  return slug;
}

export function listScenarios(): StoredScenario[] {
  return readAll().sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getScenario(slug: string): StoredScenario | undefined {
  return readAll().find(item => item.slug === slug);
}

export function saveScenario(name: string, scenario: Scenario): StoredScenario {
  const items = readAll();
  const clean = name.trim() || 'Untitled scenario';
  // Re-saving under the same name updates the existing entry in place.
  const existing = items.findIndex(item => item.slug === slugify(clean));
  const stored: StoredScenario = {
    slug: existing >= 0 ? items[existing].slug : makeSlug(clean, new Set(items.map(item => item.slug))),
    name: clean,
    scenario: structuredClone(scenario),
    created_at: new Date().toISOString(),
  };
  if (existing >= 0) items[existing] = stored; else items.unshift(stored);
  writeAll(items);
  pushScenario(stored);
  return stored;
}

export function deleteScenario(slug: string): void {
  writeAll(readAll().filter(item => item.slug !== slug));
}

/** Absolute share URL that hydrates the scenario on load. */
export function scenarioShareUrl(slug: string, origin = globalThis.location?.origin ?? ''): string {
  return `${origin}/app?scenario=${encodeURIComponent(slug)}`;
}

/* ---------- optional remote backend (server/ Postgres + Drizzle) ----------
 * When VITE_API_URL is set (or the dev proxy serves /api), saved scenarios are
 * mirrored to the API and pulled down on load. localStorage remains the
 * synchronous source of truth for hydration, so the app works fully offline.
 */
const API = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

function toPayload(scenario: Scenario) {
  return {
    sites: scenario.sites, date: scenario.date, hours: scenario.hours,
    weights: { ...scenario.weights },
    missionWeights: {},
    mode: scenario.mode, view: scenario.view,
  };
}

function fromRecord(record: { slug: string; name: string; payload: ScenarioRecordPayload; created_at?: string; createdAt?: string }): StoredScenario {
  const p = record.payload;
  return {
    slug: record.slug, name: record.name,
    scenario: { sites: p.sites, date: p.date, hours: p.hours, weights: p.weights as unknown as Scenario['weights'], mode: p.mode as Scenario['mode'], view: p.view as Scenario['view'] },
    created_at: record.created_at ?? record.createdAt ?? new Date().toISOString(),
  };
}

interface ScenarioRecordPayload {
  sites: string[]; date: string; hours: number;
  weights: Record<string, number>; missionWeights?: Record<string, number>;
  mode: string; view: string;
}

/** Fire-and-forget: mirror a locally saved scenario to the API when configured. */
export function pushScenario(stored: StoredScenario): void {
  try {
    void fetch(`${API}/scenarios`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: stored.name, payload: toPayload(stored.scenario) }),
    }).catch(() => { /* offline or no API: localStorage already has it */ });
  } catch { /* relative URL unsupported: stay local */ }
}

/**
 * Pull remote scenarios into localStorage. Remote wins on slug conflicts —
 * the DB is the shared source of truth. Safe to call once at startup; failures
 * are silent because local data remains valid.
 */
export async function syncRemoteScenarios(): Promise<number> {
  try {
    const response = await fetch(`${API}/scenarios`, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return 0;
    const records = (await response.json()) as { slug: string; name: string; payload: ScenarioRecordPayload; created_at: string }[];
    const local = readAll();
    const bySlug = new Map(local.map(item => [item.slug, item]));
    let added = 0;
    for (const record of records) {
      const mapped = fromRecord(record);
      if (!bySlug.has(mapped.slug)) added++;
      bySlug.set(mapped.slug, mapped);
    }
    writeAll([...bySlug.values()]);
    return added;
  } catch {
    return 0;
  }
}
