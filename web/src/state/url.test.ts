import test from 'node:test';
import assert from 'node:assert/strict';
import { isSiteToken, parseScenario, serializeScenario } from './url.ts';

test('scenario URL round trips sites, time, weights and mode', () => {
  const fallback = '2026-11-14T00:00:00.000Z';
  const parsed = parseScenario('?sites=haworth,nobile-rim-1&date=2027-01-01T00%3A00%3A00.000Z&window=168&weights=1,0.5,0.2,0.4,0,0.7&mode=explorer', fallback);
  assert.deepEqual(parseScenario(`?${serializeScenario(parsed)}`, fallback), parsed);
});

test('invalid and duplicate URL values fall back safely', () => {
  const fallback = '2026-11-14T00:00:00.000Z';
  const parsed = parseScenario('?sites=a,a,b,c,d,e,../bad&date=bad&window=-1&weights=1,NaN,0,0,0,0&mode=other', fallback);
  assert.deepEqual(parsed.siteIds, ['a', 'b', 'c', 'd']);
  assert.equal(parsed.dateIso, fallback);
  assert.equal(parsed.windowHours, 336);
  assert.equal(parsed.mode, 'planner');
  assert.equal(parsed.weights.earth, 1);
});

test('custom south-pole coordinates survive shared URLs', () => {
  assert.equal(isSiteToken('custom:-85.123456:42.000000'), true);
  assert.equal(isSiteToken('custom:-70:42'), false);
  assert.deepEqual(parseScenario('?sites=custom%3A-85.123456%3A42.000000', '2026-11-14T00:00:00.000Z').siteIds, ['custom:-85.123456:42.000000']);
});
