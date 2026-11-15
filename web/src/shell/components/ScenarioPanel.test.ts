import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { DEFAULT_SCENARIO } from '../scenario';
import { ScenarioPanel } from './ScenarioPanel';

const render = (sites: string[]) => renderToStaticMarkup(createElement(ScenarioPanel, { scenario: { ...DEFAULT_SCENARIO, mode: 'planner', sites }, data: { sites: [] }, change: () => {} }));

it('mission-weight sliders show only when a synthetic demo-* site is in the shortlist', () => {
  expect(render(['haworth'])).not.toContain('Readiness score weights');
  expect(render(['haworth', 'demo-ridge-a'])).toContain('Readiness score weights · synthetic demo sites only');
});
