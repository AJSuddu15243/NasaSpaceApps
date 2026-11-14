import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./LandingSections.tsx', import.meta.url), 'utf8');

describe('landing story contract', () => {
  it('contains the required story, evidence and handoff sections', () => {
    for (const heading of ['HOW IT WORKS', 'THE PRODUCT', 'VALIDATION', 'TEAM', 'PRIMARY RESOURCES']) {
      expect(source).toContain(heading);
    }
    expect(source).toContain('Compare landing sites');
    expect(source.match(/Compare landing sites/g)).toHaveLength(1);
    expect(source).toContain('synthetic');
    expect(source).toContain('JPL Horizons');
  });

  it('keeps banned marketing language and implied validation out of the copy', () => {
    for (const word of ['seamless', 'revolutionize', 'unlock', 'cutting-edge', 'harness', 'leverage', 'empower', 'game-changer', 'delve']) {
      expect(source.toLowerCase()).not.toContain(word);
    }
    expect(source).toContain('NEXT');
    expect(source).toContain('Planned timeline view');
  });
});
