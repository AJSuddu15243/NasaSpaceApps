import test from 'node:test';
import assert from 'node:assert/strict';
import { addSelection, customSiteId, emitSiteMapClick, searchSites, SITE_MAP_CLICK_EVENT, validateCustomSite, type CuratedSite, type SelectedSite, type SiteMapClickDetail } from './sites.ts';

const curated: CuratedSite[] = [
  { id: 'haworth', name: 'Haworth', lat: -87, lon: 14, category: 'artemis3', note: 'South pole rim', source_url: 'https://example.com' },
  { id: 'apollo-11', name: 'Apollo 11', lat: 0.7, lon: 23, category: 'apollo', note: 'Equatorial reference', source_url: 'https://example.com' },
];

test('search filters names, notes and categories without changing source order', () => {
  assert.deepEqual(searchSites(curated, '  HAW '), [curated[0]]);
  assert.deepEqual(searchSites(curated, 'reference'), [curated[1]]);
  assert.deepEqual(searchSites(curated, ''), curated);
});

test('custom coordinates require a name and south-pole decimal bounds', () => {
  assert.deepEqual(validateCustomSite(' Ridge ', '-80', '180'), { name: 'Ridge', lat: -80, lon: 180 });
  assert.deepEqual(validateCustomSite('Pole', '-90', '-180'), { name: 'Pole', lat: -90, lon: -180 });
  assert.equal(validateCustomSite('', '-85', '0'), 'Enter a site name.');
  assert.equal(validateCustomSite('X', '-79.9', '0'), 'Latitude must be from 90°S to 80°S.');
  assert.equal(validateCustomSite('X', '-91', '0'), 'Latitude must be from 90°S to 80°S.');
  assert.equal(validateCustomSite('X', '-85', '180.1'), 'Longitude must be from 180°W to 180°E.');
  assert.equal(validateCustomSite('X', '-85abc', '0'), 'Enter decimal latitude and longitude.');
});

test('selection is capped at four with duplicate and coordinate identity checks', () => {
  const selected: SelectedSite[] = Array.from({ length: 4 }, (_, index) => ({ kind: 'custom', id: `custom:${index}`, name: `${index}`, lat: -85, lon: index }));
  assert.match(addSelection(selected, { kind: 'curated', site: curated[0], id: curated[0].id }) as string, /up to 4/);
  assert.deepEqual(addSelection(selected, selected[0]), selected);
  assert.equal(customSiteId(-85, 10), customSiteId(-85, 10));
});

test('scene click helper emits the typed coordinate detail', () => {
  const target = new EventTarget();
  let received: SiteMapClickDetail | undefined;
  target.addEventListener(SITE_MAP_CLICK_EVENT, event => { received = (event as CustomEvent<SiteMapClickDetail>).detail; });
  emitSiteMapClick(target, { lat: -85.5, lon: 42, name: 'Map point' });
  assert.deepEqual(received, { lat: -85.5, lon: 42, name: 'Map point' });
});
