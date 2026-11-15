// Run: pnpm test (node --test, no database: postgres() connects lazily and these helpers never query).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { toRecord, toWeights, type ScenarioRecord } from './scenarios.ts';

test('extra Planner fields survive the weights jsonb round trip', () => {
  const payload: ScenarioRecord['payload'] = {
    sites: ['haworth'], date: '2027-01-15T00:00:00.000Z', hours: 336,
    weights: { sun: 1 }, missionWeights: { lit: 2 }, mode: 'planner', view: '3d',
    survivalK: 150, batteryH: 0, ice: 40, slopeLimit: 15, focus: 'haworth', layer: 'slope', heat: 'score', playhead: 12, delay: 7,
  };
  const row = { id: 'x', name: 'X', sites: payload.sites, landingDateUtc: '2027-01-15 00:00:00+00', durationHours: 336, weights: toWeights(payload), createdAt: 'now' };
  assert.deepEqual(toRecord(row).payload, payload);
});

test('old rows without extras keep their defaults', () => {
  const row = { id: 'x', name: 'X', sites: [], landingDateUtc: '2027-01-15 00:00:00+00', durationHours: 24, weights: { engine: { sun: 1 } }, createdAt: 'now' };
  assert.deepEqual(toRecord(row).payload, { sites: [], date: '2027-01-15T00:00:00.000Z', hours: 24, weights: { sun: 1 }, missionWeights: {}, mode: 'planner', view: '3d' });
});

test('unknown payload keys are not stored', () => {
  const payload = { sites: [], date: '2027-01-15T00:00:00.000Z', hours: 24, weights: {}, missionWeights: {}, mode: 'planner', view: '3d', survivalK: 150, junk: 'x' };
  assert.deepEqual(toWeights(payload), { survivalK: 150, engine: {}, mission: {}, mode: 'planner', view: '3d' });
});
