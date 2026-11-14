import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { KINDS, validate } from '../src/validate.mjs';

const dir = join(import.meta.dirname, '../examples');
const read = (...parts) => JSON.parse(readFileSync(join(dir, ...parts), 'utf8'));
const kindOf = (file) => file.split('.')[0];

const validFiles = readdirSync(join(dir, 'valid'));
const invalidFiles = readdirSync(join(dir, 'invalid')).filter((f) => f !== 'rules.json');
const rules = read('invalid', 'rules.json');

describe('valid examples', () => {
  it('has one for every schema', () => {
    expect(validFiles.map(kindOf).sort()).toEqual([...KINDS].sort());
  });
  it.each(validFiles)('%s passes', (file) => {
    expect(validate(kindOf(file), read('valid', file))).toEqual([]);
  });
});

describe('invalid examples', () => {
  it('has at least one for every schema, each with an expected rule', () => {
    expect([...new Set(invalidFiles.map(kindOf))].sort()).toEqual([...KINDS].sort());
    expect(Object.keys(rules).sort()).toEqual([...invalidFiles].sort());
  });
  it.each(invalidFiles)('%s fails only for the rule in its name', (file) => {
    const failures = validate(kindOf(file), read('invalid', file));
    expect(failures.length).toBeGreaterThan(0);
    for (const failure of failures) expect(failure).toMatchObject(rules[file]);
  });
});

describe('projection formula in common.schema.json', () => {
  it('matches the x_m, y_m, lat, lon of the example areas', () => {
    const radius = 1737400;
    const rad = Math.PI / 180;
    for (const area of read('valid', 'engine-api.json').areas) {
      const rho = 2 * radius * Math.tan(Math.PI / 4 + (area.lat * rad) / 2);
      expect(rho * Math.sin(area.lon * rad)).toBeCloseTo(area.x_m, 0);
      expect(rho * Math.cos(area.lon * rad)).toBeCloseTo(area.y_m, 0);
    }
  });
});
