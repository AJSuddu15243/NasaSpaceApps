from datetime import UTC, datetime, timedelta
from pathlib import Path

import numpy as np
import pytest

from lunar_pipeline import horizons
from lunar_pipeline.fetch import cached_get

FIXTURES = Path(__file__).parent / "fixtures"
GOOD = (FIXTURES / "horizons_2026-01-02T12_48h.txt").read_bytes()
ERROR = (FIXTURES / "horizons_error_bad_time.txt").read_bytes()
T0 = datetime(2026, 1, 2, 12, tzinfo=UTC)
T_END = T0 + timedelta(hours=47)


class Response:
    def __init__(self, body):
        self.content = body
        self.status_code = 200

    def raise_for_status(self):
        pass

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass


class Transport:
    def __init__(self, *bodies):
        self.bodies = iter(bodies)
        self.calls = 0

    def get(self, url, **kwargs):
        self.calls += 1
        return Response(next(self.bodies))


def check_48(body):
    horizons.parse(body, T0, 48)


def test_parse_real_fixture_values_order_and_units():
    rows = horizons.parse(GOOD, T0, 48)
    assert rows.shape == (48, 6) and rows.dtype == np.float64
    assert horizons.FIELDS == (
        "sun_lat",
        "sun_lon",
        "sun_dist_km",
        "earth_lat",
        "earth_lon",
        "earth_dist_km",
    )
    # First fixture row: ObsSub 1.575024,-6.249592; SunSub 14.331650,-1.321392;
    # r 0.985649598895 AU; delta 0.00241085240698 AU.
    expected = [-1.321392, 14.331650, 0.985649598895 * 149_597_870.7]
    expected += [-6.249592, 1.575024, 0.00241085240698 * 149_597_870.7]
    np.testing.assert_allclose(rows[0], expected, rtol=0, atol=1e-9)
    # Raw Horizons longitudes stay in [0, 360); sun_lon crosses 0 at 2026-01-03 17:00 UT.
    assert rows[29, 1] == pytest.approx(359.683126)


def test_parse_rejects_error_reply():
    with pytest.raises(ValueError, match=r"\$\$SOE"):
        horizons.parse(ERROR, T0, 48)


def test_parse_rejects_undecodable_body():
    with pytest.raises(ValueError):
        horizons.parse(b"\xff" + GOOD, T0, 48)


def test_parse_rejects_wrong_row_count():
    with pytest.raises(ValueError, match="rows"):
        horizons.parse(GOOD, T0, 49)


def test_parse_rejects_timestamp_gap():
    with pytest.raises(ValueError, match="timestamp"):
        horizons.parse(GOOD.replace(b"2026-Jan-03 08:00", b"2026-Jan-03 08:01"), T0, 48)
    with pytest.raises(ValueError, match="timestamp"):
        horizons.parse(GOOD, T0 + timedelta(hours=1), 48)


def test_parse_rejects_other_frame_or_longitude_sign():
    with pytest.raises(ValueError, match="MOON_ME"):
        horizons.parse(GOOD.replace(b": MOON_ME ", b": IAU_MOON"), T0, 48)
    with pytest.raises(ValueError, match="MOON_ME"):
        horizons.parse(
            GOOD.replace(b"MOON_ME                         {East", b"MOON_ME {West"), T0, 48
        )


def test_parse_rejects_changed_columns_and_nonnumeric_values():
    with pytest.raises(ValueError, match="columns"):
        horizons.parse(GOOD.replace(b"ObsSub-LON, ObsSub-LAT", b"ObsSub-LAT, ObsSub-LON"), T0, 48)
    with pytest.raises(ValueError, match="value"):
        horizons.parse(GOOD.replace(b"  14.331650,", b"  n.a.,"), T0, 48)


def test_year_chunks_cover_range_once():
    start = datetime(2026, 1, 1, tzinfo=UTC)
    end = datetime(2030, 12, 31, 23, tzinfo=UTC)
    chunks = horizons.year_chunks(start, end)
    assert [a.year for a, _ in chunks] == [2026, 2027, 2028, 2029, 2030]
    assert chunks[0][0] == start and chunks[-1][1] == end
    for (_, stop), (nxt, _) in zip(chunks, chunks[1:], strict=False):
        assert nxt - stop == timedelta(hours=1)
    assert sum(horizons.row_count(a, b) for a, b in chunks) == 43_824
    assert horizons.row_count(*chunks[2]) == 8784  # 2028 is a leap year


def test_request_url_names_the_documented_quantities():
    url = horizons.request_url(T0, T_END)
    assert url.startswith("https://ssd.jpl.nasa.gov/api/horizons.api?")
    for part in (
        "COMMAND=%27301%27",
        "CENTER=%27500%40399%27",
        "QUANTITIES=%2714%2C15%2C19%2C20%27",
    ):
        assert part in url


def test_cached_get_never_caches_invalid_body(tmp_path):
    transport = Transport(ERROR)
    with pytest.raises(ValueError):
        cached_get(horizons.API_URL, tmp_path, session=transport, validate=check_48)
    assert not list(tmp_path.iterdir())


def test_cached_get_replaces_invalid_cached_body(tmp_path):
    cached_get(horizons.API_URL, tmp_path, session=Transport(ERROR))  # legacy unvalidated cache
    transport = Transport(GOOD)
    assert cached_get(horizons.API_URL, tmp_path, session=transport, validate=check_48) == GOOD
    assert cached_get(horizons.API_URL, tmp_path, session=transport, validate=check_48) == GOOD
    assert transport.calls == 1


def test_fetch_all_caches_and_counts_requests(tmp_path):
    transport = Transport(GOOD)
    pauses = []
    rows, urls, requests = horizons.fetch_all(
        T0, T_END, tmp_path, session=transport, sleep=pauses.append
    )
    assert rows.shape == (48, 6) and requests == 1 and urls == [horizons.request_url(T0, T_END)]
    assert pauses == []  # no pause after the last chunk
    rows2, _, requests2 = horizons.fetch_all(T0, T_END, tmp_path, session=Transport())
    assert requests2 == 0 and np.array_equal(rows, rows2)


def test_fetch_all_pauses_only_between_network_requests(tmp_path):
    # Two one-row chunks across a year boundary, built from real fixture rows.
    head, rest = GOOD.split(b"$$SOE\n")
    _, tail = rest.split(b"$$EOE")
    first = rest.split(b"\n")[0].replace(b"2026-Jan-02 12:00", b"2026-Dec-31 23:00")
    second = rest.split(b"\n")[0].replace(b"2026-Jan-02 12:00", b"2027-Jan-01 00:00")
    bodies = [head + b"$$SOE\n" + row + b"\n$$EOE" + tail for row in (first, second)]
    start = datetime(2026, 12, 31, 23, tzinfo=UTC)
    pauses = []
    _, _, requests = horizons.fetch_all(
        start, start + timedelta(hours=1), tmp_path, session=Transport(*bodies), sleep=pauses.append
    )
    assert requests == 2 and pauses == [horizons.PAUSE_S]
