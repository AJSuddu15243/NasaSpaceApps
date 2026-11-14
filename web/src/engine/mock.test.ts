import test from 'node:test';
import assert from 'node:assert/strict';
import { mockSiteMetrics } from './mock.ts';
import { engine } from './index.ts';

test('mock engine returns separate contract-shaped metric objects', () => {
  const first = mockSiteMetrics();
  const second = mockSiteMetrics();
  assert.equal(first.pct_lit, 80);
  assert.notEqual(first, second);
});

test('mock adapter keeps output explicitly non-physical', () => {
  const grid = { nx: 3, ny: 2 } as Parameters<typeof engine.grid_scores>[0];
  assert.equal(engine.grid_scores(grid, {} as Parameters<typeof engine.grid_scores>[1], '', 1, {} as Parameters<typeof engine.grid_scores>[4]).length, 6);
  assert.deepEqual(engine.top_areas(new Float32Array(4), 2, 3), []);
  assert.equal(engine.output_hash({}), 'MOCK_ONLY');
});
