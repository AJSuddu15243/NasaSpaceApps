# PIPE-2 handoff: Horizons client + hourly ephem table

## Confirmed Horizons conventions (checked 2026-11-14 with live replies, DE441)
Sources: API doc https://ssd-api.jpl.nasa.gov/doc/horizons.html, manual
https://ssd.jpl.nasa.gov/horizons/manual.html#obsquan, plus the column definitions Horizons prints
after `$$EOE` in every reply (saved in `tests/fixtures/horizons_2026-01-02T12_48h.txt`).

Request: target `301`, observer `500@399` (geocentre), `EPHEM_TYPE=OBSERVER`, `STEP_SIZE='1 h'`,
`CSV_FORMAT=YES`, `ANG_FORMAT=DEG`, `EXTRA_PREC=YES`, `TIME_DIGITS=MINUTES`, `QUANTITIES='14,15,19,20'`.

| Code | Columns | Meaning | Unit | Field |
|---|---|---|---|---|
| 14 | ObsSub-LON, ObsSub-LAT | sub-observer (sub-Earth) point | deg | earth_lon, earth_lat |
| 15 | SunSub-LON, SunSub-LAT | sub-solar point | deg | sun_lon, sun_lat |
| 19 | r, rdot | Sun range from the target (Moon) centre | **AU**, km/s | sun_dist_km = r · 149,597,870.7 |
| 20 | delta, deldot | target (Moon) range from the observer (geocentre) | **AU**, km/s | earth_dist_km = delta · 149,597,870.7 |

- Delta is in AU, not km. Both distances use the AU that Horizons prints in its header
  (`1 au= 149597870.700 km`).
- **Longitude sign:** the header says `Target pole/equ : MOON_ME {East-longitude positive}`, and the column
  text says "Positive longitude is to the EAST for this target". Horizons gives [0, 360). We wrap to
  [-180, 180) after the float32 cast; a value that rounds to 180.0 becomes -180.0. Sign check: sun_lon falls
  about 0.505 deg/h (32.520, 32.014, 31.509 on 2026-01-01 00-02 UT).
- **Frame:** `MOON_ME` (the mean-Earth/polar-axis frame), the same frame as our terrain, so **no conversion
  is needed**. Target radii are 1737.4 km on all axes. On that sphere, Horizons' "planetodetic" latitude
  equals planetocentric latitude. The parser rejects any reply whose header lacks `MOON_ME` or
  `{East-longitude positive}`.
- **Apparent geometry:** 14 and 20 correct for the down-leg light time from the Moon to the geocentre
  (~1.28 s). 15 also corrects for the light time from the Sun to the Moon. That is right for illumination:
  it is where the Sun appears from the Moon. The 1.28 s lag is about 1.8e-4 deg of sun_lon, roughly 5 m on
  the ground. It is accepted and not corrected.
- Time tags are UTC. Future leap seconds are unknown, so Horizons holds the last one constant. The EOP
  prediction ends 2027-02; that only affects topocentric observers, and ours is the geocentre.
- Errors still come back as HTTP 200 plain text with no `$$SOE` (example:
  `tests/fixtures/horizons_error_bad_time.txt`).
  `cached_get(validate=...)` runs the parser before writing the cache, so a bad reply is never cached.
  A cached body that fails validation is deleted and fetched again.

## Output
- `web/public/data/ephem.bin`: 43,824 rows x 6 float32 little-endian = 1,051,776 bytes.
- Columns: `[sun_lat, sun_lon, sun_dist_km, earth_lat, earth_lon, earth_dist_km]`.
- Row k is at 2026-01-01T00:00:00Z + k h.
- `ephem.json` contains exactly the 8 fields of the ephem contract.
- `source_urls` lists the five exact yearly request URLs.
- Five requests are made, one per calendar year, in sequence with a 1 s pause. They are cached in
  `pipeline/data/cache/`, so a second `make ephem` makes zero requests and writes a byte-identical `ephem.bin`.
- Full-moon reference: USNO lists 2026-01-03 10:03 UT
  (https://aa.usno.navy.mil/api/moon/phases/date?date=2026-01-01&nump=4).

## Range checks (`ephem.check`, run on every `make ephem`)
Measured on the real 2026-2030 table:

| Check | Limit | Measured |
|---|---|---|
| sun_lat | abs ≤ 1.6 | -1.588 .. 1.586 |
| earth_lat | abs ≤ 6.9 | -6.858 .. 6.856 |
| earth_lon | abs ≤ 8.2 | -8.046 .. 8.054 |
| earth_lat, earth_lon step | < 0.1 deg/h | passes |
| unwrapped sun_lon step | in [-0.52, -0.50] deg/h | -0.5106 .. -0.5051 (mean -12.1908 deg/day) |
| earth_dist_km | 356,000 .. 407,000 | 356,648 .. 406,664 |
| sun_dist_km | 1.4664e8 .. 1.5256e8 | 1.46705e8 .. 1.52485e8 |
| Earth-Sun distance (law of cosines) | 1.4705e8 .. 1.5215e8 | 1.470984e8 .. 1.521005e8 |
| full moon | within 3 h of USNO 2026-01-03 10:03 UT | -0.05 h (separation 4.27 deg) |

- The Earth-Sun row matches the published perihelion and aphelion distances.
- **Gotcha: sun_dist_km does not fit 1.47e8 .. 1.52e8.** That range is Earth's distance from the Sun,
  and the Moon's distance differs by up to one lunar distance.
  - Minimum: 2027-01-07 16 UT, a new moon near perihelion with the Moon at apogee.
  - Maximum: 2028-07-06 21 UT, a full moon near aphelion.
- So the check tests the implied Earth-Sun distance against Earth-orbit bounds. The sun_dist_km envelope
  is that range ± 407,000 km.
- Output sha256 (2026-11-14, DE441): `97767be0e17f4fd2b122460c5f9305cb3069abd2ffe3350694e270fc45abd81b`.
  The bin is byte-identical on a second, cached run. Only `generated_at` in the JSON changes.

## For the next agent
- Read the table with `binio.read_array("web/public/data/ephem.bin")` → (43824, 6) `<f4` memmap.
- In JS/Rust, read it as 6 little-endian f32 per row, 24 bytes per row. Row k is at
  2026-01-01T00:00:00Z + k h, UTC.
- Sub-points are planetocentric on the 1737.4 km sphere. To get the Moon-fixed unit vector to a body, use
  (cos lat cos lon, cos lat sin lon, sin lat). Multiply by the distance in km to get the vector from the
  Moon's centre.
  - Earth vector: the Moon-centre → geocentre distance.
  - Sun vector: the Moon-centre → Sun distance.
- Parallax from a site comes from subtracting the site's position vector.
- `pipeline/tests/test_cli_schemas.py` now replaces `ephem.run` with an offline dispatch probe. Without
  it, `main(["ephem"])` and `main(["all"])` would call Horizons. `horizons` no longer has a stub `run()`.
- `web/public/data/ephem.{bin,json}` are not committed by PIPE-2. Run `cd pipeline && make ephem`
  (~1 min, 5 requests).
