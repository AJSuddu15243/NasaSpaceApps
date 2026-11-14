import { describe, expect, it } from 'vitest';
import glossary from './glossary.json';
import { earthMoonComparison, explainers } from './explainers';

const BANNED = ['seamless', 'revolutionize', 'unlock', 'cutting-edge', 'harness', 'leverage', 'empower', 'game-changer', 'delve'];

describe('explorer content contract', () => {
  it('glossary entries have unique ids and both tooltip and explainer text', () => {
    const ids = glossary.terms.map(term => term.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const term of glossary.terms) {
      expect(term.term.length).toBeGreaterThan(3);
      expect(term.short.length).toBeGreaterThan(10);
      expect(term.short.length).toBeLessThanOrEqual(140); // tooltip length
      expect(term.long.length).toBeGreaterThan(40);
      expect(['terrain', 'lighting', 'communications', 'astronomy', 'coordinates', 'mission', 'data']).toContain(term.category);
    }
  });

  it('covers the terms the workspace actually uses', () => {
    const ids = new Set(glossary.terms.map(term => term.id));
    for (const required of ['horizon-mask', 'solar-window', 'earth-contact', 'blackout', 'psr', 'moon-me', 'synthetic-data']) {
      expect(ids.has(required)).toBe(true);
    }
  });

  it('explainers are grade-8 readable cards with unique ids', () => {
    const ids = explainers.map(item => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of explainers) {
      expect(item.title.length).toBeGreaterThan(10);
      expect(item.deck.length).toBeGreaterThan(30);
      expect(item.body.length).toBeGreaterThanOrEqual(1);
      for (const paragraph of item.body) {
        expect(paragraph.length).toBeGreaterThan(60);
        // Grade-8 proxy: no sentence over ~45 words.
        for (const sentence of paragraph.split(/(?<=[.!?])\s+/)) {
          expect(sentence.split(/\s+/).length).toBeLessThanOrEqual(45);
        }
      }
    }
  });

  it('comparison card has labelled rows with units-aware values', () => {
    expect(earthMoonComparison.rows.length).toBeGreaterThanOrEqual(4);
    for (const row of earthMoonComparison.rows) {
      expect(row.label.length).toBeGreaterThan(5);
      expect(row.earth.length).toBeGreaterThan(3);
      expect(row.moon.length).toBeGreaterThan(3);
    }
  });

  it('keeps banned marketing language out of all explorer copy', () => {
    const corpus = JSON.stringify(glossary).toLowerCase() + JSON.stringify(explainers).toLowerCase() + JSON.stringify(earthMoonComparison).toLowerCase();
    for (const word of BANNED) expect(corpus).not.toContain(word);
  });
});
