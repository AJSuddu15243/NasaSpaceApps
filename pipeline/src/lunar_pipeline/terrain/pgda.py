"""PIPE-3: PGDA LOLA 80 m south-pole DEM: pinned download, metadata report, physics checks.

Frames/units: south polar stereographic metres (IAU 30135, sphere R = 1737400 m), heights in
metres, MOON_ME / DE421 (PGDA product page). Windowed reads only; never load the whole raster.
"""

import math
from pathlib import Path

import numpy as np
import rasterio
from rasterio.warp import transform as warp_transform
from rasterio.windows import Window

from lunar_pipeline import fetch as http
from lunar_pipeline.config import Config

URL = "https://pgda.gsfc.nasa.gov/data/LOLA_20mpp/LDEM_80S_80MPP_ADJ.TIF"
PRODUCT_URL = "https://pgda.gsfc.nasa.gov/products/90"
FILENAME = "LDEM_80S_80MPP_ADJ.TIF"
# Trust-on-first-use pin: PGDA publishes no checksum. Streamed once on PINNED_ON, opened as a
# 7600 x 7600 float32 COG, then committed here; every later download must match it.
SHA256 = "82030dcbdd7c4bb0c7d858e9b4b293b9f2cda5a543ba31ec0f42784bd6beee5a"
SIZE_BYTES = 189_158_392
PINNED_ON = "2026-11-14"

SHACKLETON = (-89.67, 129.8)  # lat, lon (deg); ~21 km diameter


def fetch(cfg: Config) -> Path:
    """Download (or re-verify) the pinned DEM into cfg.paths.raw."""
    path = cfg.paths.raw / FILENAME
    state = "already present, verifying SHA-256" if path.exists() else "downloading"
    print(f"terrain-fetch: {FILENAME} {state} ({URL})")
    http.download(URL, path, SHA256)
    size = path.stat().st_size
    if size != SIZE_BYTES:
        raise ValueError(f"{path}: size {size} != pinned {SIZE_BYTES}")
    return path


def _geo(ds):
    return ds.crs.geodetic_crs


def _to_xy(ds, lat, lon):
    xs, ys = warp_transform(_geo(ds), ds.crs, [lon], [lat])
    return xs[0], ys[0]


def _lon_at(ds, x, y):
    lons, _ = warp_transform(ds.crs, _geo(ds), [x], [y])
    return lons[0]


def locate(ds, lat, lon):
    """(row, col) of the pixel containing (lat, lon), or None if outside the raster."""
    row, col = ds.index(*_to_xy(ds, lat, lon), op=math.floor)
    return (row, col) if 0 <= row < ds.height and 0 <= col < ds.width else None


def _finite(values, nodata):
    values = np.asarray(values, dtype=np.float64)
    keep = np.isfinite(values)
    if nodata is not None and not math.isnan(nodata):
        keep &= values != nodata
    return values[keep]


def disk_minmax(ds, lat, lon, *, r_in_m, r_out_m):
    """Min/max height of pixel centres with r_in <= distance (m, projected) <= r_out."""
    cx, cy = _to_xy(ds, lat, lon)
    rx, ry = abs(ds.res[0]), abs(ds.res[1])
    r0, c0 = ds.index(cx - r_out_m, cy + r_out_m, op=math.floor)
    r1, c1 = ds.index(cx + r_out_m, cy - r_out_m, op=math.floor)
    r0, c0, r1, c1 = max(r0, 0), max(c0, 0), min(r1, ds.height - 1), min(c1, ds.width - 1)
    win = Window(c0, r0, c1 - c0 + 1, r1 - r0 + 1)
    data = ds.read(1, window=win)
    cols = ds.xy(r0, c0)[0] + rx * np.arange(win.width)
    rows = ds.xy(r0, c0)[1] - ry * np.arange(win.height)
    dist = np.hypot(cols[None, :] - cx, rows[:, None] - cy)
    vals = _finite(data[(dist >= r_in_m) & (dist <= r_out_m)], ds.nodata)
    if vals.size == 0:
        raise ValueError(f"no valid pixels within {r_out_m} m of ({lat}, {lon})")
    return float(vals.min()), float(vals.max())


def _stream_minmax(ds):
    lo, hi, nan = math.inf, -math.inf, 0
    for _, win in ds.block_windows(1):
        block = ds.read(1, window=win)
        nan += int(np.count_nonzero(~np.isfinite(block)))
        vals = _finite(block, ds.nodata)
        if vals.size:
            lo, hi = min(lo, float(vals.min())), max(hi, float(vals.max()))
    return lo, hi, nan


def describe(path) -> dict:
    """Print and return the raster's own metadata; min/max streamed block by block."""
    with rasterio.open(path) as ds:
        b = ds.bounds
        crs = ds.crs.to_dict()
        lo, hi, nonfinite = _stream_minmax(ds)
        info = {
            "path": str(path),
            "crs_wkt": ds.crs.to_wkt(),
            "proj4": ds.crs.to_proj4(),
            "transform": tuple(ds.transform)[:6],
            "width": ds.width,
            "height": ds.height,
            "pixel_size_m": (abs(ds.res[0]), abs(ds.res[1])),
            "extent_m": (b.left, b.bottom, b.right, b.top),
            "dtype": ds.dtypes[0],
            "nodata": ds.nodata,
            "scales": tuple(ds.scales),
            "offsets": tuple(ds.offsets),
            "units": ds.units[0],
            "radius_m": crs.get("R", crs.get("a")),
            # Axis directions measured through the CRS, not assumed from its WKT AXIS labels.
            "lon_plus_x_deg": _lon_at(ds, 1000.0, 0.0),
            "lon_plus_y_deg": _lon_at(ds, 0.0, 1000.0),
            "block_shape": ds.block_shapes[0],
            "overviews": ds.overviews(1),
            "tags": ds.tags(),
            "band_tags": ds.tags(1),
            "min_m": lo,
            "max_m": hi,
            "nonfinite_pixels": nonfinite,
        }
    for key, value in info.items():
        print(f"describe: {key} = {value}")
    return info


def _require(ok, message):
    print(f"check: {'PASS' if ok else 'FAIL'} {message}")
    if not ok:
        raise ValueError(f"terrain check failed: {message}")


def check(path, cfg: Config) -> dict:
    """Physics sanity checks on the real DEM; any failure raises (no silent pass)."""
    out = {}
    with rasterio.open(path) as ds:
        half_km = (ds.bounds.right - ds.bounds.left) / 2000
        # Projected radius of 80 S: rho = 2 R tan(colatitude / 2).
        expect_km = 2 * cfg.moon_radius_m * math.tan(math.radians(10) / 2) / 1000
        _require(
            abs(half_km - expect_km) < 2, f"half-width {half_km:.1f} km, 80S {expect_km:.1f} km"
        )

        pole = locate(ds, -90.0, 0.0)
        pole_m = float(ds.read(1, window=Window(pole[1], pole[0], 1, 1))[0, 0])
        _require(math.isfinite(pole_m), f"pole pixel row/col {pole} elevation {pole_m:.1f} m")
        out["pole"] = (pole, pole_m)

        lat, lon = SHACKLETON
        centre = locate(ds, lat, lon)
        floor = disk_minmax(ds, lat, lon, r_in_m=0, r_out_m=4000)[0]
        rim = disk_minmax(ds, lat, lon, r_in_m=9000, r_out_m=12000)[1]
        _require(
            3000 < rim - floor < 5000,
            f"Shackleton centre row/col {centre}: floor {floor:.0f} m, rim {rim:.0f} m, "
            f"depth {rim - floor:.0f} m (expect ~4 km)",
        )
        out["shackleton"] = (centre, floor, rim)

        lo, hi, _ = _stream_minmax(ds)
        sample = ds.read(1, window=Window(ds.width // 2 - 32, ds.height // 2 - 32, 64, 64))
        integer_like = bool(np.all(np.mod(sample, 1) == 0))
        _require(
            -12000 < lo < -2000 < 2000 < hi < 12000 and not integer_like,
            f"range {lo:.1f}..{hi:.1f} m; central 64x64 all-integer (unscaled?): {integer_like}",
        )

        for name, region in cfg.regions.items():
            rc = locate(ds, region.lat, region.lon)
            _require(rc is not None, f"region {name} ({region.lat}, {region.lon}) inside raster")
            elev = float(ds.read(1, window=Window(rc[1], rc[0], 1, 1))[0, 0])
            x, y = _to_xy(ds, region.lat, region.lon)
            _require(
                math.isfinite(elev),
                f"region {name}: x {x:.0f} m, y {y:.0f} m, row/col {rc}, elevation {elev:.1f} m",
            )
            out[name] = (rc, elev)
    return out
