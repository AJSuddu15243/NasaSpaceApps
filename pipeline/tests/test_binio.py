import json
import struct

import numpy as np
import pytest

from lunar_pipeline import schemas
from lunar_pipeline.binio import REQUIRED, read_array, write_array
from lunar_pipeline.config import REPO_ROOT


@pytest.fixture
def header():
    return dict(
        schema_version=1,
        generated_at="2026-11-14T00:00:00Z",
        source_urls=["https://example.test/dem"],
        dtype="float32",
        shape=[2, 2],
        units="m",
    )


def test_endian_or_order_error_cannot_hide_in_roundtrip(tmp_path, header):
    path = tmp_path / "tile.bin"
    array = np.array([[1, 2], [3, 4]], dtype=">f4").T
    write_array(path, array, header)
    assert path.read_bytes() == struct.pack("<4f", 1, 3, 2, 4)
    result, actual = read_array(path)
    np.testing.assert_array_equal(result, [[1, 3], [2, 4]])
    assert actual == header


@pytest.mark.parametrize("key", sorted(REQUIRED))
def test_missing_provenance_cannot_create_payload(tmp_path, header, key):
    del header[key]
    path = tmp_path / "x.bin"
    with pytest.raises(ValueError, match=key):
        write_array(path, np.ones((2, 2), dtype="f4"), header)
    assert not path.exists()


@pytest.mark.parametrize("extra", [b"", b"12345678901234567"])
def test_truncated_or_extra_payload_cannot_be_reshaped(tmp_path, header, extra):
    path = tmp_path / "x.bin"
    write_array(path, np.ones((2, 2), dtype="f4"), header)
    path.write_bytes(extra)
    with pytest.raises(ValueError, match="byte count"):
        read_array(path)


@pytest.mark.parametrize(
    "key,value",
    [
        ("shape", [4]),
        ("dtype", "float64"),
        ("shape", [True, 4]),
        ("units", ""),
        ("generated_at", "2026-01-01T00:00"),
    ],
)
def test_invalid_header_cannot_describe_valid_array(tmp_path, header, key, value):
    header[key] = value
    with pytest.raises(ValueError, match=key):
        write_array(tmp_path / "x.bin", np.ones((2, 2), dtype="f4"), header)


def test_untrusted_read_header_is_validated(tmp_path, header):
    path = tmp_path / "x.bin"
    path.write_bytes(b"0" * 16)
    header["dtype"] = "object"
    path.with_suffix(".json").write_text(json.dumps(header))
    with pytest.raises(ValueError, match="dtype"):
        read_array(path)


def test_nonfinite_terrain_cannot_be_written(tmp_path, header):
    with pytest.raises(ValueError, match="nonfinite"):
        write_array(tmp_path / "x.bin", np.full((2, 2), np.nan, dtype="f4"), header)


@pytest.mark.parametrize("shape", [[], [0, 2]])
def test_scalar_and_empty_shapes_do_not_invent_elements(tmp_path, header, shape):
    header["shape"] = shape
    array = np.ones(shape, dtype="f4")
    path = tmp_path / "x.bin"
    write_array(path, array, header)
    result, _ = read_array(path)
    assert result.shape == tuple(shape)
    assert path.stat().st_size == array.size * 4


def test_invalid_values_do_not_destroy_previous_output(tmp_path, header):
    path = tmp_path / "x.bin"
    path.write_bytes(b"previous")
    with pytest.raises(ValueError, match="nonfinite"):
        write_array(path, np.full((2, 2), np.inf, dtype="f4"), header)
    assert path.read_bytes() == b"previous"


def test_null_dtype_cannot_silently_default_to_float64(tmp_path, header):
    header["dtype"] = None
    with pytest.raises(ValueError, match="dtype"):
        write_array(tmp_path / "x.bin", np.ones((2, 2), dtype="f8"), header)


EPHEM_HEADER = {
    "schema_version": 1,
    "generated_at": "2026-11-14T12:00:00Z",
    "source_urls": ["https://ssd.jpl.nasa.gov/api/horizons.api"],
    "t0_iso": "2026-01-01T00:00:00Z",
    "step_hours": 1,
    "n": 2,
    "fields": [
        "sun_lat",
        "sun_lon",
        "sun_dist_km",
        "earth_lat",
        "earth_lon",
        "earth_dist_km",
    ],
    "dtype": "float32",
}

TILE_HEADER = {
    "schema_version": 1,
    "generated_at": "2026-11-14T12:00:00Z",
    "source_urls": ["https://pgda.gsfc.nasa.gov/data/LOLA_20mpp/LDEM_80S_80MPP_ADJ.TIF"],
    "region": "demo",
    "crs": "polar-stereo-south",
    "crs_params": {"lat_0": -90, "lon_0": 0, "radius_m": 1737400},
    "x0": -240,
    "y0": 14880,
    "cell_m": 240,
    "nx": 3,
    "ny": 2,
    "dtype": "float32",
    "units": "m",
    "nodata": -32768,
    "height_reference_radius_m": 1737400,
}


@pytest.mark.parametrize(
    "header,shape",
    [(EPHEM_HEADER, (2, 6)), (TILE_HEADER, (2, 3))],
    ids=["ephem", "tile"],
)
def test_fnd_single_array_headers_roundtrip(tmp_path, header, shape):
    array = np.arange(np.prod(shape), dtype="float32").reshape(shape)
    path = tmp_path / "x.bin"
    write_array(path, array, header)
    written = json.loads(path.with_suffix(".json").read_text())
    assert written == header
    assert "shape" not in written
    assert ("units" in written) == ("units" in header)
    assert path.stat().st_size == array.size * 4
    assert path.read_bytes() == struct.pack(f"<{array.size}f", *array.reshape(-1).tolist())
    result, actual = read_array(path)
    assert result.shape == shape
    np.testing.assert_array_equal(result, array)
    assert actual == header


@pytest.mark.parametrize("version", [True, "1", "1.0", 0, 2])
def test_schema_version_must_be_integer_one(tmp_path, header, version):
    header["schema_version"] = version
    with pytest.raises(ValueError, match="schema_version"):
        write_array(tmp_path / "x.bin", np.ones((2, 2), dtype="f4"), header)


@pytest.mark.parametrize("key", ["shape", "units"])
def test_generic_header_still_requires_shape_and_units(tmp_path, header, key):
    del header[key]
    with pytest.raises(ValueError, match=key):
        write_array(tmp_path / "x.bin", np.ones((2, 2), dtype="f4"), header)


def _fnd_header(**overrides):
    header = {
        "schema_version": 1,
        "generated_at": "2026-11-14T12:00:00Z",
        "source_urls": ["https://example.test/source"],
        "dtype": "float32",
    }
    header.update(overrides)
    return header


_FIELDS = ["a", "b"]


@pytest.mark.parametrize(
    "header,match",
    [
        (_fnd_header(), "shape"),
        (_fnd_header(n=2), "ephemeris"),
        (_fnd_header(fields=_FIELDS), "ephemeris"),
        (_fnd_header(n=0, fields=_FIELDS), "n:"),
        (_fnd_header(n=-1, fields=_FIELDS), "n:"),
        (_fnd_header(n=True, fields=_FIELDS), "n:"),
        (_fnd_header(n="2", fields=_FIELDS), "n:"),
        (_fnd_header(n=2.0, fields=_FIELDS), "n:"),
        (_fnd_header(n=2, fields=[]), "fields"),
        (_fnd_header(n=2, fields="ab"), "fields"),
        (_fnd_header(n=2, fields=["a", 1]), "fields"),
        (_fnd_header(nx=3), "tile"),
        (_fnd_header(ny=2), "tile"),
        (_fnd_header(nx=0, ny=2, units="m"), "nx:"),
        (_fnd_header(nx=3, ny=-1, units="m"), "ny:"),
        (_fnd_header(nx=True, ny=2, units="m"), "nx:"),
        (_fnd_header(nx="3", ny=2, units="m"), "nx:"),
        (_fnd_header(nx=3.0, ny=2, units="m"), "nx:"),
        (_fnd_header(nx=3, ny=2), "units"),
    ],
    ids=[
        "no-descriptor",
        "n-without-fields",
        "fields-without-n",
        "n-zero",
        "n-negative",
        "n-bool",
        "n-string",
        "n-float",
        "fields-empty",
        "fields-string",
        "fields-nonstring",
        "nx-without-ny",
        "ny-without-nx",
        "nx-zero",
        "ny-negative",
        "nx-bool",
        "nx-string",
        "nx-float",
        "tile-missing-units",
    ],
)
def test_malformed_fnd_descriptors_cannot_describe_arrays(tmp_path, header, match):
    with pytest.raises(ValueError, match=match):
        write_array(tmp_path / "x.bin", np.ones((2, 6), dtype="f4"), header)
    assert not (tmp_path / "x.bin").exists()


FND_EXAMPLES = REPO_ROOT / "contracts/examples/valid"


@pytest.mark.skipif(not FND_EXAMPLES.is_dir(), reason="FND-1 contracts not present")
@pytest.mark.parametrize("kind", ["ephem", "tile"])
def test_fnd_array_headers_roundtrip_and_validate(tmp_path, kind):
    header = json.loads((FND_EXAMPLES / f"{kind}.json").read_text())
    if kind == "ephem":
        shape = (header["n"], len(header["fields"]))
    else:
        shape = (header["ny"], header["nx"])
    array = np.arange(np.prod(shape), dtype="float32").reshape(shape)
    path = tmp_path / f"{kind}.bin"
    write_array(path, array, header)
    result, actual = read_array(path)
    assert actual == header
    np.testing.assert_array_equal(result, array)
    schemas.validate(kind, actual)
