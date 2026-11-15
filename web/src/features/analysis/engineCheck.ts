import type { Params } from '../../contracts/engine-api';
import type { SiteMask } from '../../contracts/site-mask';
import type { ValidationSet } from '../../contracts/validation';
import type { DemoData } from '../../shell/data';
import { trackFor } from '../../engine/track';

/** Worst |engine − Horizons| Sun/Earth elevation (deg) over every `every`-th reference sample. The engine runs
 * site_track on a flat 360-bin mask at the reference point (Horizons samples are geometric, height ref.elev_m), one
 * call per contiguous hourly run. Null when the engine cannot run (not loaded, window outside the table). */
export function engineVsHorizons(ref: ValidationSet, table: DemoData['table'], params: Params, every = 12) {
  const mask: SiteMask = { schema_version: 1, generated_at: ref.generated_at, source_urls: ref.source_urls, id: `horizons:${ref.site_id}`,
    lat: ref.lat, lon: ref.lon, elev_m: ref.elev_m, slope_deg: 0, bins: 360, mask_deg: Array<number>(360).fill(0), max_distance_km: 0, dem_source: 'flat (Horizons check)' };
  const t = (i: number) => Date.parse(ref.samples[i].t_iso);
  let worst = 0; let n = 0;
  try {
    for (let a = 0; a < ref.samples.length;) {
      let b = a + 1;
      while (b < ref.samples.length && t(b) - t(b - 1) === 3_600_000) b++;
      const track = trackFor(mask, table, new Date(t(a)).toISOString(), b - a, params);
      for (let i = a; i < b; i += every) {
        const s = ref.samples[i]; n++;
        worst = Math.max(worst, Math.abs(track.sunEl[i - a] - s.sun_el), Math.abs(track.earthEl[i - a] - s.earth_el));
      }
      a = b;
    }
  } catch { return null; }
  return { worst, n };
}
