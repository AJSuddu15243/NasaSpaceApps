import test from 'node:test';
import assert from 'node:assert/strict';
import { routeForPath } from './routing.ts';
test('routes landing and app paths', () => { assert.equal(routeForPath('/'), 'landing'); assert.equal(routeForPath('/app'), 'app'); assert.equal(routeForPath('/app/map'), 'app'); });
