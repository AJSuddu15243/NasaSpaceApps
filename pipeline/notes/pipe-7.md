# PIPE-7 handoff: Horizons topocentric validation set

## What it is
Ground truth for ENG-2 (engine geometry) and EPH-2 (Astronomy Engine in the browser): the apparent
azimuth/elevation of the Sun and Earth **as seen from a lunar surface site**, computed by JPL Horizons.
`make validate` (~30 s on a cold cache, 14 requests; 0 requests when cached).

## Choices (agreed with Ananth, 2026-11-14)
- **Sites:** the 3 seeds in `config.yaml` (Connecting Ridge -89.4632/-137.49, Haworth -86.7639/-22.777,
  Malapert -85.9948/-0.23578; NASA M2M-30044). They are `confirmed: false`; re-run after DATA-1 confirms them.
- **Windows:** two 30-day hourly windows, `2026-01-01T00Z` and `2028-07-01T00Z` (720 samples each,
  1440 per site). Half a year apart: opposite Sun-declination sign and libration phase. Both lie inside
  the PIPE-2 ephem table, so row `k` of a window is ephem row `(t - 2026-01-01T00Z) / 1 h`.
- **Observer height:** 0 m on the 1737.4 km sphere (`elev_m: 0`). A few km of real height moves these
  directions by < 0.001 deg, so DEM heights add nothing for geometry validation.

## Horizons request (checked with live replies, DE441)
`COMMAND` `'10'` (Sun) / `'399'` (Earth), `CENTER='coord@301'`, `COORD_TYPE='GEODETIC'`,
`SITE_COORD='<E-lon 0..360>,<lat>,0.000'`, `QUANTITIES='4'`, other options as PIPE-2 (CSV, DEG,
`EXTRA_PREC`, 1 h, minutes).

- **Quantity 4** = "airless apparent azimuth and elevation of target center": light time, light bending,
  aberration included; **no refraction** (`Atmos refraction: NO (AIRLESS)`). Azimuth is clockwise from
  north (N 0, E 90, S 180, W 270). Elevation is above the plane perpendicular to the local zenith of the
  reference surface; that surface is the 1737.4 km sphere here, so zenith = radial "up".
- **Frame:** header says `Center pole/equ : MEAN_ME (high precision) {East-longitude positive}`. This is
  the same mean-Earth/polar-axis frame as PIPE-2's `MOON_ME` sub-points; the cross-check below proves
  they agree numerically. The negative longitude -137.49 is echoed as 222.51 E.
- **The parser refuses a reply unless** the header has the right target body, MEAN_ME + east-positive,
  radii `1737.4, 1737.4, 1737.4`, AIRLESS, and a `Center geodetic` line matching the requested site
  (within 1e-4 deg / 1 m), plus the exact columns and contiguous hourly timestamps. Bad replies are never
  cached (same `cached_get(validate=...)` pattern as PIPE-2).
- **Gotcha:** the `Center geodetic` line has two layouts: `222.51, -89.4632, 0.0` and
  `359.76422,-85.9948,-5.80676E-13` (no space, scientific notation). Both are fixtures.

## Built-in cross-check: ephem geometry vs Horizons topocentric
Every run recomputes each window with the method ENG-2 will use: site vector on the sphere, body vector
from the PIPE-2 geocentric sub-point × distance, subtract (parallax), rotate into East-North-Up,
`az = atan2(e, n)`, `el = asin(u)`. The run fails if any great-circle residual exceeds 0.1 deg.

Measured 2026-11-14 (all 3 sites, both windows):

| Body | Max residual | Mean |
|---|---|---|
| Sun | 0.00019 deg | 0.00018 deg |
| Earth | 0.00598 deg | 0.0036 deg |

- The residual is almost the same at every site because it is systematic (Horizons' topocentric
  aberration/light time vs geocentric sub-points), not site geometry. Tests prove the check is
  sensitive: dropping parallax (~0.26 deg for Earth) or using another site's coordinates fails it.
- **For ENG-2:** the 0.1 deg bar is reachable with plain f64 vector geometry on f32 ephem inputs;
  expect about 0.006 deg against this file. Much more than ~0.01 deg means a bug.

## Output
`web/public/data/validation/{site_id}.json`, contract `validation` (schema-checked before writing):
`schema_version, generated_at, source_urls (6 request URLs), site_id, lat, lon, elev_m, samples[]`;
each sample `{t_iso, sun_az, sun_el, earth_az, earth_el}` in degrees, UTC. ~225 KB per site, 672 KB total.

| Site | sun_el range | earth_el range | Earth below horizon | Sun below horizon |
|---|---|---|---|---|
| connecting-ridge | -0.85 .. 1.68 | -7.48 .. 6.24 | 53% | 20% |
| haworth | -3.04 .. 4.50 | -4.20 .. 9.69 | 39% | 45% |
| malapert-massif | -3.86 .. 5.31 | -3.07 .. 10.60 | 34% | 44% |

"Below horizon" is against the smooth sphere only; terrain masks (ENG-3) make the real numbers worse.
Envelope check on every run: |sun_el| ≤ colatitude + 1.6 + 0.5, |earth_el| ≤ colatitude + 6.9 + 0.5.

## Tests (`tests/test_validate.py`, offline fixtures)
Real-reply values; 12 bad-reply cases (error text, body/site/sign mix-ups, frame, radii, refraction,
columns, timestamps, out-of-range values); cross-check accuracy and sensitivity; great-circle residual
across north; envelope; end-to-end `run()` with a fake transport (schema-valid file, 3 requests with
pauses, second run cache-only). `test_cli_schemas.py` replaces `validate.run` with an offline probe,
as it does for `ephem`.

## For the next agent
- ENG-2: load a site file, take ephem rows for each `t_iso`, compute az/el in f64, assert great-circle
  error < 0.1 deg (expect ~0.006). Compare azimuths as directions, not raw numbers (359.9 vs 0.1).
- EPH-2: the same file checks Astronomy Engine's Moon-fixed vectors (SPEC guardrail 1).
- Local gotcha (this Mac only): the venv's `.pth` files get the macOS `hidden` flag and Python 3.12
  skips hidden `.pth` files, so `lunar_pipeline` fails to import. Fix:
  `chflags nohidden pipeline/.venv/lib/python3.12/site-packages/*.pth`.
