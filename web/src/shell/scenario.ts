import type { Weights } from '../contracts/engine-api';
export type View = '3d' | 'panorama' | 'map' | 'globe';
export type Mode = 'planner' | 'explorer';
export interface Scenario { sites: string[]; date: string; hours: number; weights: Weights; mode: Mode; view: View }
export const DEFAULT_SCENARIO: Scenario = {
  sites: ['demo-ridge-a', 'demo-ridge-b'], date: '2026-11-14T12:00:00.000Z', hours: 336,
  weights: { sun: 50, earth: 35, slope: 10, crater: 5, rock: 0, thermal: 0 }, mode: 'planner', view: '3d',
};
const keys = ['sun', 'earth', 'slope', 'crater'] as const;
export const MAX_SITES = 4;
export function validUtc(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 19) === value.slice(0, 19);
}
export function readScenario(search: string): { scenario: Scenario; warnings: string[] } {
  const warnings: string[] = [];
  const scenario: Scenario = structuredClone(DEFAULT_SCENARIO);
  if (search.length > 4096) return { scenario, warnings: ['The scenario link is too long. Defaults were restored.'] };
  const q = new URLSearchParams(search);
  if (q.has('v') && q.get('v') !== '1') return { scenario, warnings: ['This link uses an unsupported version. Defaults were restored.'] };
  for (const key of ['sites', 'date', 'hours', 'weights', 'mode', 'view', 'v']) {
    if (q.getAll(key).length > 1) warnings.push(`Duplicate ${key} field: the first value was used.`);
  }
  if (q.has('sites')) {
    const ids = q.get('sites')!.split(',').filter(Boolean);
    scenario.sites = [...new Set(ids.filter(id => /^[a-z0-9][a-z0-9-]{0,63}$/.test(id)))].slice(0, MAX_SITES);
    if (scenario.sites.length !== ids.length) warnings.push('Invalid, duplicate or excess site IDs were removed.');
  }
  if (q.has('date')) {
    const value = q.get('date')!;
    if (validUtc(value)) scenario.date = new Date(value).toISOString();
    else warnings.push('Invalid UTC date: the default date was restored.');
  }
  if (q.has('hours')) {
    const value = q.get('hours')!;
    if (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 8760) scenario.hours = Number(value);
    else warnings.push('Mission length must be 1–8760 whole hours. The default was restored.');
  }
  if (q.has('weights')) {
    const values = q.get('weights')!.split(',');
    if (values.length === 4 && values.every(v => /^\d+(\.\d{1,2})?$/.test(v) && Number(v) <= 100)) {
      keys.forEach((key, i) => { scenario.weights[key] = Number(values[i]); });
    } else warnings.push('Invalid weights: defaults were restored.');
  }
  if (q.has('mode')) {
    const mode = q.get('mode');
    if (mode === 'planner' || mode === 'explorer') scenario.mode = mode;
    else warnings.push('Unknown mode: Planner was restored.');
  }
  if (q.has('view')) {
    const view = q.get('view');
    if (view === '3d' || view === 'panorama' || view === 'map' || view === 'globe') scenario.view = view;
    else warnings.push('Unknown view: 3D was restored.');
  }
  return { scenario, warnings };
}
export function writeScenario(scenario: Scenario): string {
  const q = new URLSearchParams({ v: '1', sites: scenario.sites.join(','), date: scenario.date,
    hours: String(scenario.hours), weights: keys.map(key => scenario.weights[key]).join(','), mode: scenario.mode, view: scenario.view });
  return `?${q.toString()}`;
}
