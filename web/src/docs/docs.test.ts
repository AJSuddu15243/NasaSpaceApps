import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./DocsPage.tsx', import.meta.url), 'utf8');

describe('documentation page contract', () => {
  it('covers the required documentation areas', () => {
    for (const heading of ['Getting started', 'Core concepts', 'Mission workflow', 'Views &amp; sharing', 'Data &amp; sources', 'Glossary', 'Architecture']) {
      expect(source).toContain(heading);
    }
  });

  it('renders real content modules instead of hardcoded copy', () => {
    expect(source).toContain('glossary.json');
    expect(source).toContain('explainers');
    expect(source).toContain('earthMoonComparison');
  });

  it('keeps banned marketing language out of the page', () => {
    for (const word of ['seamless', 'revolutionize', 'unlock', 'cutting-edge', 'harness', 'leverage', 'empower', 'game-changer', 'delve']) {
      expect(source.toLowerCase()).not.toContain(word);
    }
  });
});
