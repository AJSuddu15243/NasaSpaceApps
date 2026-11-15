import type { Weights } from '../contracts/engine-api';
import { isHeatLayer, type HeatLayer } from '../features/heatmap/layers';
export type View = '3d' | 'panorama' | 'map' | 'globe';
export type Mode = 'planner' | 'explorer';
/** Analysis tabs. 'heatmap' is kept so older shared links stay valid; it opens the 'terrain' (Why here) tab. */
export type AnalysisLayer = 'terrain' | 'heatmap' | 'horizon' | 'libration' | 'evidence';
const LAYERS: AnalysisLayer[] = ['terrain', 'heatmap', 'horizon', 'libration', 'evidence'];
export interface MissionWeights { lit: number; earth: number; dark: number; blackout: number }
export interface Scenario { missionWeights: MissionWeights; focus?: string; layer?: AnalysisLayer; heat: HeatLayer; playhead?: number; delay?: number; sites: string[]; date: string; hours: number; weights: Weights; ice: number; slopeLimit: number; survivalK: number; batteryH: number; mode: Mode; view: View }
export const DEFAULT_SCENARIO: Scenario = {
  sites: ['connecting-ridge', 'haworth', 'malapert-massif'], date: '2027-01-15T00:00:00.000Z', hours: 336, heat: 'score',
  weights: { sun: 35, earth: 25, slope: 20, crater: 10, rock: 0, thermal: 10 }, missionWeights: { lit: 40, earth: 30, dark: 15, blackout: 15 }, ice: 0, slopeLimit: 10,
  survivalK: 233, batteryH: 48, mode: 'explorer', view: '3d',
};
const keys = ['sun', 'earth', 'slope', 'crater'] as const;
const keys5 = [...keys, 'rock'] as const;
const mwKeys = ['lit', 'earth', 'dark', 'blackout'] as const;
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
  for (const key of ['sites', 'date', 'hours', 'weights', 'mw', 'mode', 'view', 'v', 'focus', 'layer', 'playhead', 'delay', 'heat', 'ice', 'sl', 'surv', 'bat']) {
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
    // 4 values = links from before the rock weight was editable; 5 = sun, earth, slope, crater, rock.
    if ((values.length === 4 || values.length === 5) && values.every(v => /^\d+(\.\d{1,2})?$/.test(v) && Number(v) <= 100)) {
      keys5.slice(0, values.length).forEach((key, i) => { scenario.weights[key] = Number(values[i]); });
    } else warnings.push('Invalid weights: defaults were restored.');
  }
  if (q.has('mw')) {
    const values = q.get('mw')!.split(',');
    if (values.length === 4 && values.every(v => /^\d+(\.\d{1,2})?$/.test(v) && Number(v) <= 100)) {
      mwKeys.forEach((key, i) => { scenario.missionWeights[key] = Number(values[i]); });
    } else warnings.push('Invalid mission weights: defaults were restored.');
  }
  if (q.has('mode')) {
    const mode = q.get('mode');
    if (mode === 'planner' || mode === 'explorer') scenario.mode = mode;
    else warnings.push('Unknown mode: Explorer was restored.');
  }
  if (q.has('view')) {
    const view = q.get('view');
    if (view === '3d' || view === 'panorama' || view === 'map' || view === 'globe') scenario.view = view;
    else warnings.push('Unknown view: 3D was restored.');
  }
  if (q.has('focus')) {
    const focus = q.get('focus')!;
    if (/^[a-z0-9][a-z0-9-]{0,63}$/.test(focus)) scenario.focus = focus;
    else warnings.push('Invalid focused location was removed.');
  }
  if (q.has('layer')) {
    const layer = q.get('layer');
    if (LAYERS.includes(layer as AnalysisLayer)) scenario.layer = layer as AnalysisLayer;
    else warnings.push('Unknown analysis layer was removed.');
  }
  if (q.has('heat')) {
    const heat = q.get('heat');
    if (isHeatLayer(heat)) scenario.heat = heat;
    else warnings.push('Unknown heatmap layer: suitability was restored.');
  }
  if (q.has('ice')) {
    const value = q.get('ice')!;
    if (/^\d+(\.\d{1,2})?$/.test(value) && Number(value) <= 100) scenario.ice = Number(value);
    else warnings.push('Invalid ice-access weight was removed.');
  }
  if (q.has('sl')) {
    const value = q.get('sl')!;
    if (/^\d+(\.\d)?$/.test(value) && Number(value) >= 1 && Number(value) <= 30) scenario.slopeLimit = Number(value);
    else warnings.push('Slope limit must be 1–30°. 10° was restored.');
  }
  if (q.has('surv')) {
    const value = q.get('surv')!;
    if (/^\d+$/.test(value) && Number(value) >= 40 && Number(value) <= 400) scenario.survivalK = Number(value);
    else warnings.push('Survival temperature must be 40–400 whole kelvin. 233 K was restored.');
  }
  if (q.has('bat')) {
    const value = q.get('bat')!;
    if (/^\d+$/.test(value) && Number(value) <= 720) scenario.batteryH = Number(value);
    else warnings.push('Battery must be 0–720 whole hours. 48 h was restored.');
  }
  for (const key of ['playhead', 'delay'] as const) {
    if (!q.has(key)) continue;
    const value = q.get(key)!;
    const limit = key === 'playhead' ? scenario.hours : 365;
    if (/^\d+$/.test(value) && Number(value) <= limit) scenario[key] = Number(value);
    else warnings.push(`Invalid ${key} was removed.`);
  }
  return { scenario, warnings };
}
export function writeScenario(scenario: Scenario): string {
  const q = new URLSearchParams({ v: '1', sites: scenario.sites.join(','), date: scenario.date,
    hours: String(scenario.hours), weights: keys5.map(key => scenario.weights[key]).join(','),
    mw: mwKeys.map(key => scenario.missionWeights[key]).join(','), mode: scenario.mode, view: scenario.view });
  if (scenario.heat !== DEFAULT_SCENARIO.heat) q.set('heat', scenario.heat);
  if (scenario.ice !== DEFAULT_SCENARIO.ice) q.set('ice', String(scenario.ice));
  if (scenario.slopeLimit !== DEFAULT_SCENARIO.slopeLimit) q.set('sl', String(scenario.slopeLimit));
  if (scenario.survivalK !== DEFAULT_SCENARIO.survivalK) q.set('surv', String(scenario.survivalK));
  if (scenario.batteryH !== DEFAULT_SCENARIO.batteryH) q.set('bat', String(scenario.batteryH));
  for (const key of ['focus', 'layer', 'playhead', 'delay'] as const) {
    if (scenario[key] !== undefined) q.set(key, String(scenario[key]));
  }
  return `?${q.toString()}`;
}
