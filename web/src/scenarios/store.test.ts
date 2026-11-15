import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SCENARIO } from '../shell/scenario';
import { deleteScenario, getScenario, listScenarios, saveScenario, scenarioShareUrl } from './store';

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    clear: () => map.clear(),
    removeItem: (k: string) => void map.delete(k),
    key: () => null,
    get length() { return map.size; },
  };
}

describe('scenario store', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage());
    vi.stubGlobal('location', { origin: 'https://x.test' });
  });

  it('saves, lists, gets and deletes scenarios', () => {
    const saved = saveScenario('Pole survey', DEFAULT_SCENARIO);
    expect(saved.slug).toBe('pole-survey');
    expect(getScenario('pole-survey')?.name).toBe('Pole survey');
    expect(listScenarios()).toHaveLength(1);
    deleteScenario('pole-survey');
    expect(getScenario('pole-survey')).toBeUndefined();
  });

  it('re-saving the same name updates in place; new names append', () => {
    saveScenario('Survey', DEFAULT_SCENARIO);
    saveScenario('Survey', { ...DEFAULT_SCENARIO, hours: 48 });
    expect(listScenarios()).toHaveLength(1);
    expect(getScenario('survey')?.scenario.hours).toBe(48);
    saveScenario('Landing survey', DEFAULT_SCENARIO);
    expect(listScenarios()).toHaveLength(2);
    // Names that slugify identically share one entry rather than duplicating.
    saveScenario('Survey!', DEFAULT_SCENARIO);
    expect(listScenarios()).toHaveLength(2);
  });

  it('falls back to untitled and survives corrupt storage', () => {
    expect(saveScenario('  ', DEFAULT_SCENARIO).name).toBe('Untitled scenario');
    localStorage.setItem('lunar-window-scenarios-v1', '{not json');
    expect(listScenarios()).toEqual([]);
    localStorage.setItem('lunar-window-scenarios-v1', '[{"bad":1}]');
    expect(saveScenario('ok', DEFAULT_SCENARIO).slug).toBe('ok');
  });

  it('builds a clean share URL', () => {
    expect(scenarioShareUrl('pole-survey', 'https://x.test')).toBe('https://x.test/app?scenario=pole-survey');
    expect(scenarioShareUrl('a b', 'https://x.test')).toContain('scenario=a%20b');
  });
});

it('migrates old saved scenarios without losing new mission state on a round trip', () => {
  const old = { ...DEFAULT_SCENARIO } as Partial<typeof DEFAULT_SCENARIO>;
  delete old.heat; delete old.ice; delete old.slopeLimit;
  localStorage.setItem('lunar-window-scenarios-v1', JSON.stringify([{ slug: 'legacy', name: 'Legacy', scenario: old, created_at: '2026-01-01T00:00:00Z' }]));
  expect(getScenario('legacy')?.scenario.heat).toBe('score');
  expect(getScenario('legacy')?.scenario.slopeLimit).toBe(10);
  const scenario = { ...DEFAULT_SCENARIO, heat: 'imagery' as const, ice: 20, slopeLimit: 7, focus: 'haworth', delay: 3, playhead: 12 };
  saveScenario('Layered', scenario);
  expect(getScenario('layered')?.scenario).toEqual(scenario);
});
