"""C-order little-endian numeric arrays with mandatory provenance and units."""

import json
import math
from pathlib import Path

import numpy as np

from .config import utc_datetime

REQUIRED = {"schema_version", "generated_at", "source_urls", "dtype"}


def _units(header):
    if "units" not in header:
        raise ValueError("units: missing header field")
    if not isinstance(header["units"], str) or not header["units"].strip():
        raise ValueError("units: expected nonempty string")


def _positive_count(header, key):
    value = header[key]
    if type(value) is not int or value <= 0:
        raise ValueError(f"{key}: expected positive integer")
    return value


def _array_shape(header):
    if "shape" in header:
        _units(header)
        shape = header["shape"]
        if not isinstance(shape, list) or not all(type(n) is int and n >= 0 for n in shape):
            raise ValueError("shape: expected nonnegative integer dimensions")
        return tuple(shape)
    if "n" in header or "fields" in header:
        if "n" not in header or "fields" not in header:
            raise ValueError("ephemeris: n and fields must appear together")
        fields = header["fields"]
        if (
            not isinstance(fields, list)
            or not fields
            or not all(isinstance(field, str) for field in fields)
        ):
            raise ValueError("fields: expected nonempty string list")
        return _positive_count(header, "n"), len(fields)
    if "nx" in header or "ny" in header:
        if "nx" not in header or "ny" not in header:
            raise ValueError("tile: nx and ny must appear together")
        _units(header)
        return _positive_count(header, "ny"), _positive_count(header, "nx")
    raise ValueError("shape: missing header field")


def _metadata(header):
    if not isinstance(header, dict):
        raise ValueError("header: expected object")
    for key in sorted(REQUIRED - header.keys()):
        raise ValueError(f"{key}: missing header field")
    utc_datetime(header["generated_at"], "generated_at")
    if type(header["schema_version"]) is not int or header["schema_version"] != 1:
        raise ValueError("schema_version: expected integer 1")
    urls = header["source_urls"]
    if (
        not isinstance(urls, list)
        or not urls
        or not all(isinstance(u, str) and u.startswith(("https://", "http://")) for u in urls)
    ):
        raise ValueError("source_urls: expected nonempty HTTP(S) URL list")
    if not isinstance(header["dtype"], str):
        raise ValueError("dtype: expected numeric dtype name")
    dtype = np.dtype(header["dtype"])
    if dtype.kind not in "fiu" or dtype.fields or dtype.subdtype:
        raise ValueError("dtype: expected real numeric scalar dtype")
    return dtype.newbyteorder("<"), _array_shape(header)


def _paths(path):
    path = Path(path)
    if path.suffix != ".bin":
        raise ValueError("path: expected .bin suffix")
    return path, path.with_suffix(".json")


def write_array(path, array, header) -> None:
    """Write numeric array without casting precision; normalize byte order to little-endian."""
    binary, metadata = _paths(path)
    dtype, shape = _metadata(header)
    array = np.asarray(array)
    if array.shape != shape:
        raise ValueError("shape: header disagrees with array")
    if array.dtype.newbyteorder("<") != dtype:
        raise ValueError("dtype: header disagrees with array")
    normalized = {**header, "dtype": dtype.name}
    encoded = json.dumps(normalized, indent=2, allow_nan=False) + "\n"
    # Validate in bounded chunks before touching an existing destination.
    options = dict(
        flags=["external_loop", "buffered", "zerosize_ok"],
        op_dtypes=[dtype],
        order="C",
        buffersize=65536,
    )
    with np.nditer(array, **options) as chunks:
        for chunk in chunks:
            if not np.isfinite(chunk).all():
                raise ValueError("array: nonfinite values")
    binary.parent.mkdir(parents=True, exist_ok=True)
    with binary.open("wb") as stream:
        with np.nditer(array, **options) as chunks:
            for chunk in chunks:
                stream.write(chunk.tobytes())
    metadata.write_text(encoded)


def read_array(path):
    """Return (read-only memory-mapped array, header); reject truncated/extra payloads."""
    binary, metadata = _paths(path)
    header = json.loads(metadata.read_text())
    dtype, shape = _metadata(header)
    expected = math.prod(shape) * dtype.itemsize
    if binary.stat().st_size != expected:
        raise ValueError("shape: binary byte count disagrees with header")
    array = (
        np.memmap(binary, dtype=dtype, shape=shape, mode="r", order="C")
        if expected
        else (np.empty(shape, dtype=dtype))
    )
    return array, header
