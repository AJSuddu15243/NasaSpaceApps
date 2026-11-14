"""JPL Horizons client: geocentric observer table of the Moon, parsed into ephem fields.

Quantities (manual https://ssd.jpl.nasa.gov/horizons/manual.html#obsquan, confirmed against the
column notes Horizons prints in each reply):
  14 ObsSub-LON/LAT  apparent sub-observer (sub-Earth) point, degrees
  15 SunSub-LON/LAT  apparent sub-solar point, degrees
  19 r               Sun range from the Moon centre, AU
  20 delta           Moon centre range from the observer (geocentre), AU
Frame: the reply header must say "MOON_ME {East-longitude positive}"; longitudes come in [0, 360).
"""

import math
import re
import time
from datetime import UTC, datetime, timedelta

import numpy as np
import requests

from .fetch import cached_get

API_URL = "https://ssd.jpl.nasa.gov/api/horizons.api"
AU_KM = 149_597_870.7  # Horizons header: "1 au= 149597870.700 km"
PAUSE_S = 1.0
HOUR = timedelta(hours=1)
FIELDS = ("sun_lat", "sun_lon", "sun_dist_km", "earth_lat", "earth_lon", "earth_dist_km")
COLUMNS = [
    "Date__(UT)__HR:MN",
    "",
    "",
    "ObsSub-LON",
    "ObsSub-LAT",
    "SunSub-LON",
    "SunSub-LAT",
    "r",
    "rdot",
    "delta",
    "deldot",
    "",
]
PARAMS = {
    "format": "text",
    "COMMAND": "'301'",
    "OBJ_DATA": "'NO'",
    "MAKE_EPHEM": "'YES'",
    "EPHEM_TYPE": "'OBSERVER'",
    "CENTER": "'500@399'",
    "STEP_SIZE": "'1 h'",
    "QUANTITIES": "'14,15,19,20'",
    "CSV_FORMAT": "'YES'",
    "ANG_FORMAT": "'DEG'",
    "EXTRA_PREC": "'YES'",
    "TIME_DIGITS": "'MINUTES'",
}
_FRAME = re.compile(r"^Target pole/equ\s*:\s*MOON_ME\s+\{East-longitude positive\}", re.M)
_TIME = re.compile(r"(\d{4})-([A-Z][a-z]{2})-(\d{2}) (\d{2}):(\d{2})")
_MONTHS = {
    m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())
}


def _horizons_time(t: datetime) -> str:
    return f"'{t.astimezone(UTC):%Y-%m-%d %H:%M}'"


def params(start: datetime, stop: datetime) -> dict:
    return {**PARAMS, "START_TIME": _horizons_time(start), "STOP_TIME": _horizons_time(stop)}


def request_url(start: datetime, stop: datetime) -> str:
    return requests.Request("GET", API_URL, params=params(start, stop)).prepare().url


def row_count(start: datetime, stop: datetime) -> int:
    """Inclusive number of hourly rows from start to stop."""
    return (stop - start) // HOUR + 1


def year_chunks(start: datetime, end: datetime) -> list[tuple[datetime, datetime]]:
    """Split an inclusive hourly range into one (start, stop) pair per calendar year."""
    if start.minute or start.second or start.microsecond or (end - start) % HOUR:
        raise ValueError("ephemeris: start and end must lie on a whole-hour grid")
    chunks = []
    t = start
    while t <= end:
        stop = min(end, datetime(t.year, 12, 31, 23, tzinfo=UTC))
        chunks.append((t, stop))
        t = stop + HOUR
    return chunks


def parse(body: bytes, t0: datetime, n: int) -> np.ndarray:
    """Return float64 (n, 6) rows in FIELDS order; distances in km, longitudes raw [0, 360)."""
    text = body.decode("utf-8")  # UnicodeDecodeError is a ValueError
    lines = text.splitlines()
    if lines.count("$$SOE") != 1 or lines.count("$$EOE") != 1:
        raise ValueError("horizons: reply lacks one $$SOE/$$EOE table (API error text?)")
    soe, eoe = lines.index("$$SOE"), lines.index("$$EOE")
    if not _FRAME.search(text):
        raise ValueError("horizons: header must say MOON_ME {East-longitude positive}")
    if soe < 2 or [c.strip() for c in lines[soe - 2].split(",")] != COLUMNS:
        raise ValueError(f"horizons: unexpected columns {lines[soe - 2].strip()!r}")
    data = lines[soe + 1 : eoe]
    if len(data) != n:
        raise ValueError(f"horizons: expected {n} rows, got {len(data)}")
    out = np.empty((n, 6))
    for k, line in enumerate(data):
        cells = [c.strip() for c in line.split(",")]
        match = _TIME.fullmatch(cells[0])
        if len(cells) != len(COLUMNS) or not match:
            raise ValueError(f"horizons: malformed row {line!r}")
        y, mon, d, h, mi = match.groups()
        t = datetime(int(y), _MONTHS[mon], int(d), int(h), int(mi), tzinfo=UTC)
        if t != t0 + k * HOUR:
            raise ValueError(f"horizons: row {k} timestamp {cells[0]}, expected {t0 + k * HOUR}")
        try:
            e_lon, e_lat, s_lon, s_lat, r_au, _, delta_au, _ = map(float, cells[3:11])
        except ValueError as exc:
            raise ValueError(f"horizons: non-numeric value in row {line!r}") from exc
        out[k] = (s_lat, s_lon, r_au * AU_KM, e_lat, e_lon, delta_au * AU_KM)
    if not all(math.isfinite(v) for v in out.flat):
        raise ValueError("horizons: non-finite value")
    return out


class _Counter:
    """Counts outgoing GET calls (including retries) so callers can prove a run was cache-only."""

    def __init__(self, inner):
        self.inner = inner
        self.count = 0

    def get(self, url, **kwargs):
        self.count += 1
        return self.inner.get(url, **kwargs)


def fetch_all(start, end, cache_dir, *, session=None, sleep=time.sleep):
    """Fetch [start, end] hourly, one cached request per calendar year, sequentially.

    Returns (float64 rows, request URLs, number of network requests made).
    """
    owned = session is None
    counter = _Counter(requests.Session() if owned else session)
    chunks = year_chunks(start, end)
    parts, urls = [], []
    try:
        for i, (a, b) in enumerate(chunks):
            n = row_count(a, b)
            before = counter.count
            body = cached_get(
                API_URL,
                cache_dir,
                params=params(a, b),
                session=counter,
                backoff=2.0,
                sleep=sleep,
                validate=lambda body, a=a, n=n: parse(body, a, n),
            )
            parts.append(parse(body, a, n))
            urls.append(request_url(a, b))
            if counter.count > before and i < len(chunks) - 1:
                sleep(PAUSE_S)
    finally:
        if owned:
            counter.inner.close()
    return np.concatenate(parts), urls, counter.count
