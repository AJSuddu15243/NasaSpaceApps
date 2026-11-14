"""PIPE-7: JPL Horizons topocentric Sun/Earth az/el for curated sites -> validation/{site_id}.json.

Observer: a site on the 1737.4 km sphere (CENTER coord@301, GEODETIC, height 0), quantity 4
(airless apparent azimuth/elevation of the body centre; azimuth clockwise from north). The reply
header must report the MEAN_ME frame, east-positive longitude, spherical radii, AIRLESS, and the
requested site. Each window is also recomputed from PIPE-2's geocentric sub-points with plain vector
geometry (what ENG-2 does); a residual above MAX_RESIDUAL_DEG fails the run.
"""

import json
import math
import re
import time
from datetime import UTC, datetime, timedelta
from functools import partial

import numpy as np
import requests

from . import horizons, schemas
from .config import Config
from .fetch import cached_get

HOUR = timedelta(hours=1)
# Two 30-day hourly windows half a year apart: opposite Sun-declination sign and libration phase.
WINDOWS = (datetime(2026, 1, 1, tzinfo=UTC), datetime(2028, 7, 1, tzinfo=UTC))
WINDOW_HOURS = 30 * 24
ELEV_M = 0.0  # observer on the reference sphere; a few km of height moves directions < 0.001 deg
BODIES = {"sun": ("10", "Sun (10)"), "earth": ("399", "Earth (399)")}
COLUMNS = ["Date__(UT)__HR:MN", "", "", "Azimuth_(a-app)", "Elevation_(a-app)", ""]
MAX_RESIDUAL_DEG = 0.1  # ENG-2 acceptance bar
# Highest possible elevation at latitude lat: colatitude + max sub-point latitude + parallax/disk.
SUN_LAT_MAX, EARTH_LAT_MAX = 1.6, 6.9  # same envelopes as ephem.LIMITS
MARGIN_DEG = 0.5
_TIME = re.compile(r"(\d{4})-([A-Z][a-z]{2})-(\d{2}) (\d{2}):(\d{2})")
_MONTHS = horizons._MONTHS
_NUM = r"([-+]?[\d.]+(?:E[-+]?\d+)?)"  # Horizons may print "-5.80676E-13" and drop the space
_SITE = re.compile(rf"^Center geodetic\s*:\s*{_NUM},\s*{_NUM},\s*{_NUM}\s*\{{E-lon", re.M)
_REQUIRED = (
    re.compile(r"^Center pole/equ\s*:\s*MEAN_ME\b.*\{East-longitude positive\}", re.M),
    re.compile(r"^Center radii\s*:\s*1737\.4, 1737\.4, 1737\.4 km", re.M),
    re.compile(r"^Atmos refraction:\s*NO \(AIRLESS\)", re.M),
)


def params(body: str, lat: float, lon: float, start: datetime, stop: datetime) -> dict:
    return {
        **horizons.PARAMS,
        "COMMAND": f"'{BODIES[body][0]}'",
        "CENTER": "'coord@301'",
        "COORD_TYPE": "'GEODETIC'",
        "SITE_COORD": f"'{lon % 360:.6f},{lat:.6f},{ELEV_M / 1000:.3f}'",
        "QUANTITIES": "'4'",
        "START_TIME": horizons._horizons_time(start),
        "STOP_TIME": horizons._horizons_time(stop),
    }


def parse_azel(body: bytes, name: str, lat: float, lon: float, t0: datetime, n: int) -> np.ndarray:
    """Return float64 (n, 2) [az, el] degrees; raise ValueError on any header or row mismatch."""
    text = body.decode("utf-8")
    lines = text.splitlines()
    if lines.count("$$SOE") != 1 or lines.count("$$EOE") != 1:
        raise ValueError("validate: reply lacks one $$SOE/$$EOE table (API error text?)")
    soe, eoe = lines.index("$$SOE"), lines.index("$$EOE")
    if not re.search(rf"^Target body name:\s*{re.escape(BODIES[name][1])}", text, re.M):
        raise ValueError(f"validate: reply is not for {BODIES[name][1]}")
    for pattern in _REQUIRED:
        if not pattern.search(text):
            raise ValueError(f"validate: header lacks {pattern.pattern!r}")
    site = _SITE.search(text)
    if not site:
        raise ValueError("validate: header lacks Center geodetic site")
    s_lon, s_lat, s_alt = map(float, site.groups())
    lon_err = abs((s_lon - lon + 180) % 360 - 180)
    if lon_err > 1e-4 or abs(s_lat - lat) > 1e-4 or abs(s_alt * 1000 - ELEV_M) > 1:
        raise ValueError(f"validate: reply site {site.groups()} is not ({lon}, {lat}, {ELEV_M} m)")
    if soe < 2 or [c.strip() for c in lines[soe - 2].split(",")] != COLUMNS:
        raise ValueError(f"validate: unexpected columns {lines[soe - 2].strip()!r}")
    data = lines[soe + 1 : eoe]
    if len(data) != n:
        raise ValueError(f"validate: expected {n} rows, got {len(data)}")
    out = np.empty((n, 2))
    for k, line in enumerate(data):
        cells = [c.strip() for c in line.split(",")]
        match = _TIME.fullmatch(cells[0])
        if len(cells) != len(COLUMNS) or not match:
            raise ValueError(f"validate: malformed row {line!r}")
        y, mon, d, h, mi = match.groups()
        if datetime(int(y), _MONTHS[mon], int(d), int(h), int(mi), tzinfo=UTC) != t0 + k * HOUR:
            raise ValueError(f"validate: row {k} timestamp {cells[0]}, expected {t0 + k * HOUR}")
        try:
            out[k] = float(cells[3]), float(cells[4])
        except ValueError as exc:
            raise ValueError(f"validate: non-numeric value in row {line!r}") from exc
    if not np.isfinite(out).all() or (out[:, 0] < 0).any() or (out[:, 0] >= 360).any():
        raise ValueError("validate: azimuth outside [0, 360) or non-finite value")
    if (np.abs(out[:, 1]) > 90).any():
        raise ValueError("validate: elevation outside [-90, 90]")
    return out


def azel_from_subpoints(lat, lon, radius_m, sub_lat, sub_lon, dist_km) -> np.ndarray:
    """Topocentric [az, el] degrees from Moon-fixed sub-points + distances (the ENG-2 method)."""
    phi, lam = math.radians(lat), math.radians(lon)
    up = np.array([math.cos(phi) * math.cos(lam), math.cos(phi) * math.sin(lam), math.sin(phi)])
    east = np.array([-math.sin(lam), math.cos(lam), 0.0])
    north = np.cross(up, east)
    b_lat, b_lon = np.radians(sub_lat), np.radians(sub_lon)
    body = np.stack(
        [np.cos(b_lat) * np.cos(b_lon), np.cos(b_lat) * np.sin(b_lon), np.sin(b_lat)], axis=1
    ) * (np.asarray(dist_km, dtype=np.float64)[:, None] * 1000.0)
    v = body - up * (radius_m + ELEV_M)  # parallax: from the site, not the Moon's centre
    v /= np.linalg.norm(v, axis=1)[:, None]
    az = np.degrees(np.arctan2(v @ east, v @ north)) % 360.0
    el = np.degrees(np.arcsin(np.clip(v @ up, -1.0, 1.0)))
    return np.stack([az, el], axis=1)


def residual_deg(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Great-circle angle between [az, el] directions, degrees."""
    az1, el1, az2, el2 = (np.radians(x) for x in (a[:, 0], a[:, 1], b[:, 0], b[:, 1]))
    c = np.sin(el1) * np.sin(el2) + np.cos(el1) * np.cos(el2) * np.cos(az1 - az2)
    return np.degrees(np.arccos(np.clip(c, -1.0, 1.0)))


def check(lat: float, sun: np.ndarray, earth: np.ndarray) -> None:
    """Raise ValueError unless elevations fit the physical envelope at this latitude."""
    colat = 90 - abs(lat)
    for name, azel, sub_max in (("sun", sun, SUN_LAT_MAX), ("earth", earth, EARTH_LAT_MAX)):
        peak = np.abs(azel[:, 1]).max()
        if peak > colat + sub_max + MARGIN_DEG:
            raise ValueError(f"validate: |{name}_el| {peak:.3f} > {colat + sub_max + MARGIN_DEG}")


def _iso(t: datetime) -> str:
    return t.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def site_samples(t0: datetime, sun: np.ndarray, earth: np.ndarray) -> list[dict]:
    return [
        {
            "t_iso": _iso(t0 + k * HOUR),
            "sun_az": float(sun[k, 0]),
            "sun_el": float(sun[k, 1]),
            "earth_az": float(earth[k, 0]),
            "earth_el": float(earth[k, 1]),
        }
        for k in range(len(sun))
    ]


def run(cfg: Config, *, session=None, sleep=time.sleep) -> None:
    owned = session is None
    counter = horizons._Counter(requests.Session() if owned else session)
    cache = cfg.paths.cache / "horizons"
    out_dir = cfg.paths.out / "validation"
    worst = 0.0
    try:

        def get(p, validate):
            before = counter.count
            body = cached_get(
                horizons.API_URL,
                cache,
                params=p,
                session=counter,
                backoff=2.0,
                sleep=sleep,
                validate=validate,
            )
            if counter.count > before:
                sleep(horizons.PAUSE_S)  # sequential and polite: pause after each live request
            return body

        geo = {}
        for t0 in WINDOWS:
            stop = t0 + (WINDOW_HOURS - 1) * HOUR
            p = horizons.params(t0, stop)
            body = get(p, lambda b, t0=t0: horizons.parse(b, t0, WINDOW_HOURS))
            geo[t0] = horizons.parse(body, t0, WINDOW_HOURS), horizons.request_url(t0, stop)
        for site_id, region in cfg.regions.items():
            lat, lon = region.lat, region.lon
            samples, urls = [], []
            for t0 in WINDOWS:
                stop = t0 + (WINDOW_HOURS - 1) * HOUR
                azel = {}
                for name in BODIES:
                    p = params(name, lat, lon, t0, stop)
                    validate = partial(
                        parse_azel, name=name, lat=lat, lon=lon, t0=t0, n=WINDOW_HOURS
                    )
                    azel[name] = validate(get(p, validate))
                    urls.append(requests.Request("GET", horizons.API_URL, params=p).prepare().url)
                check(lat, azel["sun"], azel["earth"])
                rows, geo_url = geo[t0]
                for name, cols in (("sun", (0, 1, 2)), ("earth", (3, 4, 5))):
                    mine = azel_from_subpoints(lat, lon, cfg.moon_radius_m, *rows[:, cols].T)
                    res = residual_deg(mine, azel[name])
                    worst = max(worst, res.max())
                    print(
                        f"validate: {site_id} {_iso(t0)[:10]} {name}: max residual "
                        f"{res.max():.5f} deg, mean {res.mean():.5f} (ephem vs topocentric)"
                    )
                    if res.max() > MAX_RESIDUAL_DEG:
                        raise ValueError(
                            f"validate: {site_id} {name} residual {res.max():.4f} deg"
                            f" > {MAX_RESIDUAL_DEG}"
                        )
                urls.append(geo_url)
                samples += site_samples(t0, azel["sun"], azel["earth"])
            doc = {
                "schema_version": 1,
                "generated_at": _iso(datetime.now(UTC)),
                "source_urls": list(dict.fromkeys(urls)),
                "site_id": site_id,
                "lat": lat,
                "lon": lon,
                "elev_m": ELEV_M,
                "samples": samples,
            }
            schemas.validate("validation", doc)
            out_dir.mkdir(parents=True, exist_ok=True)
            path = out_dir / f"{site_id}.json"
            path.write_text(json.dumps(doc, indent=1, allow_nan=False) + "\n")
            print(f"validate: wrote {path} ({len(samples)} samples)")
    finally:
        if owned:
            counter.inner.close()
    print(f"validate: worst residual {worst:.5f} deg (limit {MAX_RESIDUAL_DEG})")
