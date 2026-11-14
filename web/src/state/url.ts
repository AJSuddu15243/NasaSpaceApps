export type Mode = 'planner' | 'explorer';
export interface Weights { sun: number; earth: number; slope: number; crater: number; rock: number; thermal: number }
export interface ScenarioState { siteIds: string[]; dateIso: string; windowHours: number; weights: Weights; mode: Mode }
export const defaultWeights: Weights = { sun: 1, earth: 1, slope: 1, crater: 1, rock: 0, thermal: 1 };
const weightKeys = ['sun', 'earth', 'slope', 'crater', 'rock', 'thermal'] as const;
const slug = /^[a-z0-9][a-z0-9-]*$/;
const customId = /^custom:(-?\d+(?:\.\d+)?):(-?\d+(?:\.\d+)?)$/;

export function isSiteToken(value: string): boolean {
  if (slug.test(value)) return true;
  const match = customId.exec(value);
  if (!match) return false;
  const lat = Number(match[1]);
  const lon = Number(match[2]);
  return lat >= -90 && lat <= -80 && lon >= -180 && lon < 180;
}

export function parseScenario(search: string, fallbackDateIso: string): ScenarioState {
  const params = new URLSearchParams(search);
  const rawSites = params.get('sites')?.split(',') ?? [];
  const siteIds = [...new Set(rawSites.filter(isSiteToken))].slice(0, 4);
  const date = params.get('date');
  const dateIso = date && Number.isFinite(Date.parse(date)) ? new Date(date).toISOString() : fallbackDateIso;
  const rawWindow = Number(params.get('window'));
  const windowHours = Number.isFinite(rawWindow) && rawWindow >= 1 && rawWindow <= 720 ? rawWindow : 336;
  const rawWeights = params.get('weights')?.split(',').map(Number);
  const weights = { ...defaultWeights };
  if (rawWeights?.length === weightKeys.length && rawWeights.every(value => Number.isFinite(value) && value >= 0 && value <= 1)) {
    weightKeys.forEach((key, index) => { weights[key] = rawWeights[index]; });
  }
  const mode = params.get('mode') === 'explorer' ? 'explorer' : 'planner';
  return { siteIds, dateIso, windowHours, weights, mode };
}

export function serializeScenario(state: ScenarioState): string {
  const params = new URLSearchParams();
  if (state.siteIds.length) params.set('sites', state.siteIds.join(','));
  params.set('date', state.dateIso);
  params.set('window', String(state.windowHours));
  params.set('weights', weightKeys.map(key => String(state.weights[key])).join(','));
  params.set('mode', state.mode);
  return params.toString();
}
