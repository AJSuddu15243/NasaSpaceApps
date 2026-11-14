import dataclasses
import json
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import numpy as np
import pytest

from lunar_pipeline import horizons, schemas, validate
from lunar_pipeline.config import Region, load_config

FIXTURES = Path(__file__).parent / "fixtures"
SUN = (FIXTURES / "validate_malapert_sun_2026-01-01_4h.txt").read_bytes()
EARTH = (FIXTURES / "validate_malapert_earth_2026-01-01_4h.txt").read_bytes()
GEO = (FIXTURES / "horizons_2026-01-01_4h.txt").read_bytes()
RIDGE_SUN = (FIXTURES / "validate_connecting-ridge_sun_2026-01-01_4h.txt").read_bytes()
ERROR = (FIXTURES / "horizons_error_bad_time.txt").read_bytes()
T0 = datetime(2026, 1, 1, tzinfo=UTC)
LAT, LON = -85.9948, -0.23578  # Malapert seed; header prints 359.76422 and "-5.80676E-13" km
R = 1_737_400.0


def azel(body=SUN, name="sun", lat=LAT, lon=LON, n=4):
    return validate.parse_azel(body, name, lat, lon, T0, n)


def from_ephem(name, lat=LAT, lon=LON, radius_m=R):
    rows = horizons.parse(GEO, T0, 4)
    cols = (0, 1, 2) if name == "sun" else (3, 4, 5)
    return validate.azel_from_subpoints(lat, lon, radius_m, *rows[:, cols].T)


def test_parse_real_fixture_values():
    np.testing.assert_allclose(azel()[0], [32.870166412, 4.712309328], rtol=0, atol=1e-9)
    np.testing.assert_allclose(azel(EARTH, "earth")[3], [359.181135872, 10.303392937], atol=1e-9)
    # Older header layout ("222.51, -89.4632, 0.0") parses too; -137.49 wraps to 222.51 E.
    assert azel(RIDGE_SUN, lat=-89.4632, lon=-137.49)[0, 1] == pytest.approx(0.817085045)


@pytest.mark.parametrize(
    ("body", "kwargs", "match"),
    [
        (ERROR, {}, r"\$\$SOE"),
        (SUN, {"name": "earth"}, "Earth"),  # body mix-up
        (SUN, {"lat": -86.7639}, "site"),  # reply for another site
        (SUN, {"lon": 0.23578}, "site"),  # longitude sign flip
        (SUN, {"n": 5}, "rows"),
        (SUN.replace(b"NO (AIRLESS)", b"YES"), {}, "AIRLESS"),
        (SUN.replace(b"MEAN_ME", b"IAU_MOON"), {}, "MEAN_ME"),
        (SUN.replace(b"1737.4, 1737.4, 1737.4", b"1738.1, 1738.1, 1736.0"), {}, "radii"),
        (SUN.replace(b"Azimuth_(a-app)", b"Azimuth_(r-app)"), {}, "columns"),
        (SUN.replace(b"2026-Jan-01 02:00", b"2026-Jan-01 02:30"), {}, "timestamp"),
        (SUN.replace(b"32.870166412", b"360.000000000"), {}, "azimuth"),
        (SUN.replace(b"4.712309328", b"nan"), {}, "azimuth|non-finite"),
    ],
)
def test_parse_rejects_bad_replies(body, kwargs, match):
    with pytest.raises(ValueError, match=match):
        azel(body, **kwargs)


def test_ephem_geometry_matches_topocentric_horizons():
    # The ENG-2 method on PIPE-2 sub-points agrees with Horizons far inside the 0.1 deg bar.
    assert validate.residual_deg(from_ephem("sun"), azel()).max() < 0.001
    assert validate.residual_deg(from_ephem("earth"), azel(EARTH, "earth")).max() < 0.01


def test_cross_check_is_sensitive_to_parallax_and_site():
    # Dropping Earth parallax (observer at the Moon's centre) is a ~0.26 deg error: must fail.
    no_parallax = validate.residual_deg(from_ephem("earth", radius_m=0.0), azel(EARTH, "earth"))
    assert no_parallax.min() > validate.MAX_RESIDUAL_DEG
    # Geometry for the wrong site (Haworth) must not pass against Malapert's reply.
    wrong = validate.residual_deg(from_ephem("sun", lat=-86.7639, lon=-22.777), azel())
    assert wrong.min() > validate.MAX_RESIDUAL_DEG


def test_residual_is_great_circle():
    a = np.array([[359.9, 10.0]])
    b = np.array([[0.1, 10.0]])  # 0.2 deg of azimuth across north, at 10 deg elevation
    assert validate.residual_deg(a, b)[0] == pytest.approx(0.2 * np.cos(np.radians(10)), rel=1e-4)


def test_check_enforces_elevation_envelope():
    sun, earth = azel(), azel(EARTH, "earth")
    validate.check(LAT, sun, earth)
    too_high = earth.copy()
    too_high[0, 1] = 90 - abs(LAT) + validate.EARTH_LAT_MAX + validate.MARGIN_DEG + 0.01
    with pytest.raises(ValueError, match="earth_el"):
        validate.check(LAT, sun, too_high)


class Transport:
    """Serves fixtures by request; counts calls like a requests.Session."""

    def __init__(self):
        self.calls = 0

    def get(self, url, params=None, **kwargs):
        self.calls += 1
        q = {k: v[0] for k, v in parse_qs(urlparse(url).query).items()} | (params or {})
        body = {"'10'": SUN, "'399'": EARTH, "'301'": GEO}[q["COMMAND"]]
        return Response(body)


class Response:
    def __init__(self, body):
        self.content, self.status_code = body, 200

    def raise_for_status(self):
        pass

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass


def test_run_writes_schema_valid_file_and_second_run_is_cache_only(tmp_path, monkeypatch):
    base = load_config()
    region = Region(
        lat=LAT, lon=LON, source_url=base.regions["malapert-massif"].source_url, confirmed=False
    )
    paths = dataclasses.replace(base.paths, cache=tmp_path / "cache", out=tmp_path / "out")
    cfg = dataclasses.replace(base, paths=paths, regions={"malapert-massif": region})
    monkeypatch.setattr(validate, "WINDOWS", (T0,))
    monkeypatch.setattr(validate, "WINDOW_HOURS", 4)
    transport, pauses = Transport(), []
    validate.run(cfg, session=transport, sleep=pauses.append)
    assert transport.calls == 3 and pauses == [horizons.PAUSE_S] * 3
    doc = json.loads((tmp_path / "out/validation/malapert-massif.json").read_text())
    schemas.validate("validation", doc)
    assert (doc["site_id"], doc["lat"], doc["lon"], doc["elev_m"]) == (
        "malapert-massif",
        LAT,
        LON,
        0,
    )
    assert [s["t_iso"] for s in doc["samples"]][:2] == [
        "2026-01-01T00:00:00Z",
        "2026-01-01T01:00:00Z",
    ]
    assert doc["samples"][0]["sun_az"] == pytest.approx(32.870166412)
    assert doc["samples"][3]["earth_el"] == pytest.approx(10.303392937)
    assert len(doc["source_urls"]) == 4
    assert doc["source_urls"][0] == region.source_url
    validate.run(cfg, session=transport, sleep=pauses.append)
    assert transport.calls == 3  # cached: no new requests, no pauses
