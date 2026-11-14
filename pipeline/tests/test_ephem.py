from datetime import UTC, datetime, timedelta
from pathlib import Path

import numpy as np
import pytest

from lunar_pipeline import ephem, horizons, schemas

GOOD = (Path(__file__).parent / "fixtures/horizons_2026-01-02T12_48h.txt").read_bytes()
T0 = datetime(2026, 1, 2, 12, tzinfo=UTC)


def table():
    return ephem.to_table(horizons.parse(GOOD, T0, 48))


def test_wrap_lon_is_float32_in_half_open_range():
    raw = np.array([0.0, 179.9999999, 180.0, 359.683126, 359.99999999, 1.575024])
    out = ephem.wrap_lon(raw)
    assert out.dtype == np.float32
    assert (out >= -180).all() and (out < 180).all()
    assert out[1] == np.float32(-180.0)  # 179.9999999 rounds to 180.0 in float32
    assert out[2] == np.float32(-180.0)
    assert out[3] == pytest.approx(-0.316874, abs=1e-5)
    assert abs(out[4]) < 1e-6


def test_to_table_is_float32_contract_order_with_wrapped_longitudes():
    t = table()
    assert t.dtype == np.float32 and t.shape == (48, 6)
    assert t[29, 1] == pytest.approx(-0.316874, abs=1e-5)  # sun_lon after crossing 0
    assert t[0, 4] == pytest.approx(1.575024, abs=1e-5)  # earth_lon


def test_check_passes_on_real_fixture_and_finds_full_moon():
    stats = ephem.check(table(), T0, 48)
    # USNO full moon 2026-01-03 10:03 UT; nearest Sun/Earth sub-point approach must be within 3 h.
    assert abs(stats["full_moon_offset_h"]) <= 3
    assert -0.52 <= stats["sun_lon_step_min"] <= stats["sun_lon_step_max"] <= -0.50


@pytest.mark.parametrize(
    ("column", "edit", "message"),
    [
        (1, lambda c: -c, "sun_lon"),  # sign flip: longitude would increase
        (3, lambda c: c - 1.0, "earth_lat"),  # -6.25 - 1 breaks the 6.9 deg libration limit
        (4, lambda c: c + 7.0, "earth_lon"),
        (0, lambda c: c * 2, "sun_lat"),
        (5, lambda c: c * 1.2, "earth_dist_km"),
        (2, lambda c: c * 1.1, "sun_dist_km"),
    ],
)
def test_check_rejects_unphysical_values(column, edit, message):
    t = table()
    t[:, column] = edit(t[:, column])
    with pytest.raises(ValueError, match=message):
        ephem.check(t, T0, 48)


def test_check_rejects_inconsistent_distances():
    # Each distance stays in its own envelope, but together they put Earth 1.468e8 km from the Sun.
    t = table()
    t[:, 2] -= 300_000
    with pytest.raises(ValueError, match="Earth-Sun"):
        ephem.check(t, T0, 48)


def test_check_rejects_jump_nan_and_wrong_count():
    t = table()
    t[10:, 3] += 0.2
    with pytest.raises(ValueError, match="earth_lat"):
        ephem.check(t, T0, 48)
    t = table()
    t[5, 2] = np.nan
    with pytest.raises(ValueError, match="NaN"):
        ephem.check(t, T0, 48)
    with pytest.raises(ValueError, match="rows"):
        ephem.check(table(), T0, 49)


def test_check_rejects_full_moon_mismatch():
    # Same physical table labelled 12 h later: the closest approach no longer matches USNO.
    with pytest.raises(ValueError, match="full moon"):
        ephem.check(table(), T0 - timedelta(hours=12), 48)


def test_header_matches_contract():
    header = ephem.make_header(T0, 48, ["https://ssd.jpl.nasa.gov/api/horizons.api?x=1"])
    assert set(header) == {
        "schema_version",
        "generated_at",
        "source_urls",
        "t0_iso",
        "step_hours",
        "n",
        "fields",
        "dtype",
    }
    assert header["schema_version"] == 1 and header["t0_iso"] == "2026-01-02T12:00:00Z"
    schemas.validate("ephem", header)
