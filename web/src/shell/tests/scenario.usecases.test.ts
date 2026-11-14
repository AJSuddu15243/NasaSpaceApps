import { describe, expect, it } from 'vitest';
import { DEFAULT_SCENARIO, MAX_SITES, readScenario, writeScenario } from '../scenario';
import { customSiteId } from '../../features/sites/sites';

describe('workspace use cases', () => {
  it('a shared globe-view link restores sites, date and view exactly', () => {
    // Use case: user configures a scenario, copies the link, teammate opens it.
    const scenario = {
      ...DEFAULT_SCENARIO,
      sites: ['demo-ridge-a', 'demo-ridge-b', customSiteId(-89.5, -120.2)],
      date: '2027-03-15T06:00:00.000Z',
      hours: 336,
      view: 'globe' as const,
    };
    const { scenario: restored, warnings } = readScenario(writeScenario(scenario));
    expect(warnings).toEqual([]);
    expect(restored).toEqual(scenario);
  });

  it('caps site selection at MAX_SITES without throwing', () => {
    const tooMany = Array.from({ length: MAX_SITES + 3 }, (_, i) => `site-${i}`);
    const { scenario, warnings } = readScenario(`?sites=${tooMany.join(',')}`);
    expect(scenario.sites).toHaveLength(MAX_SITES);
    expect(scenario.sites[0]).toBe('site-0');
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('deduplicates repeated site picks in a shared link', () => {
    const { scenario } = readScenario('?sites=demo-ridge-a,demo-ridge-a,demo-basin-c,demo-ridge-a');
    expect(scenario.sites).toEqual(['demo-ridge-a', 'demo-basin-c']);
  });

  it('unknown view values fall back safely instead of breaking the workspace', () => {
    const { scenario, warnings } = readScenario('?view=globe-3d');
    expect(['3d', 'panorama', 'map', 'globe']).toContain(scenario.view);
    expect(warnings.length).toBeGreaterThan(0);
  });
});
