"""PIPE-2: hourly Moon-fixed (MOON_ME) Sun/Earth table -> ephem.bin + ephem.json.

Rows are [sun_lat, sun_lon, sun_dist_km, earth_lat, earth_lon, earth_dist_km] as float32, in degrees
(east-positive longitude in [-180, 180)) and km, from JPL Horizons (see horizons.py), hourly UTC.
"""

import hashlib
from datetime import UTC, datetime, timedelta

import numpy as np

from . import horizons, schemas
from .binio import write_array
from .config import Config

HOUR = timedelta(hours=1)
# USNO Astronomical Applications, phases of the Moon: full moon 2026-01-03 10:03 UT.
FULL_MOON = datetime(2026, 1, 3, 10, 3, tzinfo=UTC)
FULL_MOON_URL = "https://aa.usno.navy.mil/api/moon/phases/date?date=2026-01-01&nump=4"
# Physical envelopes (degrees, km). A value outside is a bug, not noise.
LIMITS = {
    "sun_lat": 1.6,  # lunar spin axis is 1.54 deg from the ecliptic pole
    "earth_lat": 6.9,  # optical libration in latitude, max about 6.8 deg
    "earth_lon": 8.2,  # optical libration in longitude, max about 7.9 deg
}
EARTH_DIST_KM = (356_000, 407_000)  # lunar perigee / apogee extremes
# Earth-Sun: a(1 -/+ e) with a = 1 AU, e = 0.0167, plus about 4,700 km Earth-Moon barycentre wobble.
EARTH_SUN_KM = (1.4705e8, 1.5215e8)
# The Moon is up to one lunar distance nearer the Sun (new moon) or farther (full moon) than Earth.
SUN_DIST_KM = (EARTH_SUN_KM[0] - EARTH_DIST_KM[1], EARTH_SUN_KM[1] + EARTH_DIST_KM[1])
DIST_KM = {"earth_dist_km": EARTH_DIST_KM, "sun_dist_km": SUN_DIST_KM}
EARTH_STEP_DEG = 0.1  # libration rate peaks near 0.08 deg/h
# Sub-solar longitude drifts west at the synodic rate: 13.176 - 0.986 = 12.19 deg/day (0.508 deg/h).
SUN_LON_STEP_DEG = (-0.52, -0.50)


def wrap_lon(lon) -> np.ndarray:
    """Wrap degrees to float32 in [-180, 180); values that round to 180.0 in float32 become -180."""
    out = ((np.asarray(lon, dtype=np.float64) + 180.0) % 360.0 - 180.0).astype(np.float32)
    out[out >= 180] -= np.float32(360)
    return out


def to_table(rows) -> np.ndarray:
    table = np.asarray(rows, dtype=np.float32).copy()
    for name in ("sun_lon", "earth_lon"):
        col = horizons.FIELDS.index(name)
        table[:, col] = wrap_lon(np.asarray(rows)[:, col])
    return table


def _col(table, name):
    return table[:, horizons.FIELDS.index(name)].astype(np.float64)


def _unit(lat, lon):
    lat, lon = np.radians(lat), np.radians(lon)
    return np.stack([np.cos(lat) * np.cos(lon), np.cos(lat) * np.sin(lon), np.sin(lat)], axis=1)


def check(table, t0: datetime, n_expected: int) -> dict:
    """Raise ValueError unless the table is physically plausible; return the measured values."""
    n = len(table)
    if table.shape != (n_expected, len(horizons.FIELDS)) or table.dtype != np.float32:
        raise ValueError(f"ephem: expected {n_expected} float32 rows of 6, got {table.shape}")
    if not np.isfinite(table).all():
        raise ValueError("ephem: NaN or infinite value")
    stats = {name: (_col(table, name).min(), _col(table, name).max()) for name in horizons.FIELDS}
    for name in ("sun_lon", "earth_lon"):
        lo, hi = stats[name]
        if lo < -180 or hi >= 180:
            raise ValueError(f"ephem: {name} outside [-180, 180)")
    for name, limit in LIMITS.items():
        if max(abs(v) for v in stats[name]) > limit:
            raise ValueError(f"ephem: |{name}| exceeds {limit} deg: {stats[name]}")
    for name, (lo, hi) in DIST_KM.items():
        if stats[name][0] < lo or stats[name][1] > hi:
            raise ValueError(f"ephem: {name} outside [{lo}, {hi}] km: {stats[name]}")
    sun = _unit(_col(table, "sun_lat"), _col(table, "sun_lon"))
    earth = _unit(_col(table, "earth_lat"), _col(table, "earth_lon"))
    cos_sep = np.clip((sun * earth).sum(axis=1), -1, 1)
    s_km, e_km = _col(table, "sun_dist_km"), _col(table, "earth_dist_km")
    earth_sun = np.sqrt(s_km**2 + e_km**2 - 2 * s_km * e_km * cos_sep)  # law of cosines
    stats["earth_sun_km"] = (earth_sun.min(), earth_sun.max())
    if earth_sun.min() < EARTH_SUN_KM[0] or earth_sun.max() > EARTH_SUN_KM[1]:
        raise ValueError(f"ephem: implied Earth-Sun distance outside {EARTH_SUN_KM} km")
    for name in ("earth_lat", "earth_lon"):
        step = np.abs(np.diff(_col(table, name))).max(initial=0)
        if step >= EARTH_STEP_DEG:
            raise ValueError(f"ephem: {name} jumps {step:.4f} deg in one hour")
    steps = np.diff(np.unwrap(_col(table, "sun_lon"), period=360))
    stats["sun_lon_step_min"], stats["sun_lon_step_max"] = steps.min(), steps.max()
    stats["sun_lon_step_mean"] = steps.mean()
    lo, hi = SUN_LON_STEP_DEG
    if steps.min() < lo or steps.max() > hi:
        raise ValueError(f"ephem: sun_lon hourly step {steps.min():.4f}..{steps.max():.4f}")
    stats["full_moon_offset_h"] = None
    t_end = t0 + (n - 1) * HOUR
    if t0 <= FULL_MOON <= t_end:
        # At full moon the Sun and Earth sit in nearly the same direction seen from the Moon.
        times = [t0 + k * HOUR for k in range(n)]
        january = np.array([t.year == 2026 and t.month == 1 for t in times])
        sep = np.degrees(np.arccos(cos_sep))
        sep[~january] = np.inf
        k = int(sep.argmin())
        stats["full_moon_offset_h"] = (times[k] - FULL_MOON) / HOUR
        stats["full_moon_sep_deg"] = sep[k]
        if abs(stats["full_moon_offset_h"]) > 3:
            raise ValueError(
                f"ephem: closest Sun/Earth sub-points at {times[k]}, full moon {FULL_MOON}"
            )
    return stats


def _iso(t: datetime) -> str:
    return t.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def make_header(t0: datetime, n: int, urls) -> dict:
    return {
        "schema_version": 1,
        "generated_at": _iso(datetime.now(UTC)),
        "source_urls": list(urls),
        "t0_iso": _iso(t0),
        "step_hours": 1,
        "n": n,
        "fields": list(horizons.FIELDS),
        "dtype": "float32",
    }


def run(cfg: Config) -> None:
    ep = cfg.ephemeris
    if ep.step_hours != 1:
        raise ValueError("ephemeris.step_hours: the ephem contract fixes 1 h")
    n_expected = horizons.row_count(ep.start, ep.end)
    rows, urls, requests_made = horizons.fetch_all(ep.start, ep.end, cfg.paths.cache / "horizons")
    table = to_table(rows)
    stats = check(table, ep.start, n_expected)
    header = make_header(ep.start, len(table), urls)
    schemas.validate("ephem", header)
    path = cfg.paths.out / "ephem.bin"
    write_array(path, table, header)
    size = path.stat().st_size
    if size != len(table) * 24:
        raise ValueError(f"ephem: {path} is {size} bytes, expected {len(table) * 24}")
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    print(f"ephem: network requests: {requests_made}")
    print(f"ephem: wrote {path} ({size} bytes, sha256 {digest}) + {path.with_suffix('.json').name}")
    print(f"ephem: n={len(table)} t0={header['t0_iso']} shape={table.shape} dtype={table.dtype}")
    for name in (*horizons.FIELDS, "earth_sun_km"):
        lo, hi = stats[name]
        print(f"ephem:   {name:<14} min {lo:>16.6f}  max {hi:>16.6f}")
    print(
        f"ephem: sun_lon hourly step {stats['sun_lon_step_min']:.5f}.."
        f"{stats['sun_lon_step_max']:.5f}"
        f" deg/h (mean {stats['sun_lon_step_mean'] * 24:.4f} deg/day)"
    )
    if stats["full_moon_offset_h"] is not None:
        print(
            f"ephem: min Sun/Earth sub-point separation {stats['full_moon_sep_deg']:.3f} deg at"
            f" {stats['full_moon_offset_h']:+.2f} h from USNO full moon {_iso(FULL_MOON)}"
            f" ({FULL_MOON_URL})"
        )
    for k in np.linspace(0, len(table) - 1, 5).astype(int):
        print(f"ephem:   {_iso(ep.start + int(k) * HOUR)} {np.array2string(table[k], precision=6)}")
