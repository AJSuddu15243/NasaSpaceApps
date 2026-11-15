import type { DemoData } from '../shell/data';
import type { Params } from '../contracts/engine-api';
import type { SiteMask } from '../contracts/site-mask';
import { siteTrack } from './index';

type Ephem = DemoData['table'];

/** Engine hourly track split into columns (degrees; lit 0..1 = visible fraction of the solar disk; earthVis 0/1). */
export interface Track { hours: number; sunAz: Float32Array; sunEl: Float32Array; sunLit: Float32Array; earthAz: Float32Array; earthEl: Float32Array; earthVis: Float32Array }

export function splitTrack(raw: Float32Array): Track {
  const n = raw.length / 6;
  const col = (c: number) => { const out = new Float32Array(n); for (let i = 0; i < n; i++) out[i] = raw[i * 6 + c]; return out; };
  return { hours: n, sunAz: col(0), sunEl: col(1), sunLit: col(2), earthAz: col(3), earthEl: col(4), earthVis: col(5) };
}

/** Share of steps with any Sun disk above the terrain / Earth in view (0..1). */
export const litShare = (t: Track) => t.sunLit.reduce((a, v) => a + (v > 0 ? 1 : 0), 0) / Math.max(1, t.hours);
export const earthShare = (t: Track) => t.earthVis.reduce((a, v) => a + v, 0) / Math.max(1, t.hours);

// Several panels ask for the same window each render; site_track over 336 h is ~ms, but don't repeat it per panel.
const cache = new Map<string, Track>();
const CACHE_MAX = 32;

/** Engine track for a real (masked) site; throws UnavailableScenario like the other facade calls. Not for demo-* fixtures. */
export function trackFor(mask: SiteMask, ephem: Ephem, startIso: string, hours: number, params: Params): Track {
  const key = `${mask.id}|${mask.lat}|${mask.lon}|${startIso}|${hours}|${JSON.stringify(params)}|${ephem.header.t0_iso}|${ephem.header.n}`;
  let t = cache.get(key);
  if (!t) {
    t = splitTrack(siteTrack(mask, ephem, startIso, hours, params));
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
    cache.set(key, t);
  }
  return t;
}
