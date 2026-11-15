import { describe, expect, it } from 'vitest';
import { DEFAULT_SCENARIO, readScenario, validUtc, writeScenario } from '../scenario';
import { createShellStore, type BrowserPort } from '../store';
describe('shareable scenario boundary', () => {
  it('round-trips every supported field, including zero sites and weights', () => {
    for (const scenario of [DEFAULT_SCENARIO, { ...DEFAULT_SCENARIO, sites: [], date: '2030-06-01T23:59:00.000Z', hours: 8760, mode: 'explorer' as const, view: 'map' as const, weights: { sun: 0, earth: 0, slope: 0, crater: 0, rock: 0, thermal: 0 } }]) {
      expect(readScenario(writeScenario(scenario))).toEqual({ scenario, warnings: [] });
    }
  });
  it.each(['2026-02-29T12:00:00Z', '2026-13-01T00:00:00Z', '2026-01-01T24:00:00Z', '2026-01-01T00:00:00+01:00', 'NaN', '<script>'])('rejects invalid UTC %s', date => expect(validUtc(date)).toBe(false));
  it('accepts a leap date and preserves UTC independent of timezone', () => expect(validUtc('2028-02-29T23:59:00Z')).toBe(true));
  it('does not let malformed links throw, add path traversal, or change unavailable weights', () => {
    const { scenario, warnings } = readScenario('?sites=../x,a,a,b,c,d,e&hours=Infinity&date=invalid&weights=NaN,2,3,4&mode=admin&view=unknown');
    expect(scenario.sites).toEqual(['a', 'b', 'c', 'd']); expect(scenario.hours).toBe(336);
    expect(scenario.weights.rock).toBe(0); expect(scenario.weights.thermal).toBe(0); expect(warnings.length).toBe(6);
  });
  it.each(['0', '-1', '1.5', '8761', '', '1e2'])('recovers bad mission lengths %s', value => expect(readScenario(`?hours=${value}`).warnings).toHaveLength(1));
  it('handles unsupported versions, oversized links and duplicate fields', () => {
    expect(readScenario('?v=9&hours=2').scenario.hours).toBe(336);
    expect(readScenario('?'+ 'x'.repeat(4096)).warnings).toHaveLength(1);
    expect(readScenario('?hours=24&hours=48').scenario.hours).toBe(24);
    expect(readScenario('?hours=24&hours=48').warnings).toHaveLength(1);
  });
});
it('publishes state and restores it on browser navigation without duplicate listeners', () => {
  const url = new URL('https://example.test/app');
  const listeners = new Set<() => void>();
  let replaces = 0;
  const port: BrowserPort = { location: url, history: {
    pushState: (_data, _unused, next) => { url.href = new URL(String(next), url).href; },
    replaceState: (_data, _unused, next) => { replaces++; url.href = new URL(String(next), url).href; },
  }, addEventListener: (_event, fn) => { listeners.add(fn); }, removeEventListener: (_event, fn) => { listeners.delete(fn); } };
  const store = createShellStore(port); let updates = 0;
  const off1 = store.subscribe(() => updates++); const off2 = store.subscribe(() => {});
  expect(listeners.size).toBe(1);
  store.set({ hours: 48 }); expect(store.getSnapshot().scenario.hours).toBe(48); expect(updates).toBe(1);
  store.set({ hours: 48 }); expect(updates).toBe(1);
  store.set({ mode: 'planner' }, true); expect(replaces).toBe(1);
  store.navigate('/'); expect(store.getSnapshot().path).toBe('/');
  url.href = 'https://example.test/app?hours=72'; listeners.forEach(fn => fn()); expect(store.getSnapshot().scenario.hours).toBe(72);
  off1(); expect(listeners.size).toBe(1); off2(); expect(listeners.size).toBe(0);
});
