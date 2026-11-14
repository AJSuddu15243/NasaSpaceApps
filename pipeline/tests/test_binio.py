import json
import struct

import numpy as np
import pytest

from lunar_pipeline.binio import REQUIRED, read_array, write_array


@pytest.fixture
def header():
    return dict(
        schema_version="1.0",
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
