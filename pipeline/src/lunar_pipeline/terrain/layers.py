"""PIPE-5: terrain factor layers -> grid/{region}.bin + .json (contract `grid`).

Computed at the DEM's 80 m from a window with MARGIN_PX extra pixels per side (so edge windows are
complete), cropped to the near-field footprint (+-tiles.NEAR_HALF_M), then aggregated 2 x 2 into
heatmap_cell_m (160 m) cells. Choices agreed with Ananth 2026-11-14: grid +-10 km @ 160 m;
crater radius 500 m; roughness window 5 x 5; slope = max of the 2 x 2 (conservative for the hard
slope limit), other layers = mean; aspect from the mean gradient. The mask layer is PIPE-8's.
PIPE-6: rock = clip(roughness_deg / ROCK_REF_DEG, 0, 1), a proxy flagged in the header.
"""

import json
from datetime import UTC, datetime

import numpy as np
import rasterio
from numpy.lib.stride_tricks import sliding_window_view

from lunar_pipeline import coords, schemas
from lunar_pipeline.config import Config
from lunar_pipeline.terrain import pgda, tiles

CRATER_RADIUS_M = 500.0
ROUGHNESS_WINDOW = 5
MARGIN_PX = 8  # >= ceil(500 / 80) for crater depth, and >= 1 (Horn) + 2 (roughness)
LAYERS = ("slope_deg", "aspect_deg", "elev_m", "crater_depth_m", "roughness_deg", "rock")
# shortcut: rock is DEM roughness, not rocks (no rock-abundance or boulder raster covers 85-90 S),
# swap in a measured layer once one exists (pipeline/README.md "Rock distribution").
# 5 deg ~ the pooled 99th percentile of 160 m roughness over the three regions (median 0.9-1.1 deg,
# p99 3.8-5.3 deg on PGDA 80 m) and half the 10 deg slope limit; fixed so regions compare.
ROCK_REF_DEG = 5.0
ROCK_NOTE = (
    "Proxy, not measured rocks: DEM roughness (std-dev of 80 m slope over 5 x 5) / 5 deg, "
    "clipped to [0, 1]; no rock-abundance or boulder map covers 85-90 S"
)


def horn_gradient(z, cell_m):
    """(dz/dx, dz/dy) by Horn's 3x3 method on rows growing with +y; output loses 1 px per side."""

    def rows(dr):
        return z[1 + dr : z.shape[0] - 1 + dr]

    def cols(a, dc):
        return a[:, 1 + dc : a.shape[1] - 1 + dc]

    up, mid, down = rows(1), rows(0), rows(-1)
    gx = (cols(up, 1) + 2 * cols(mid, 1) + cols(down, 1)) - (
        cols(up, -1) + 2 * cols(mid, -1) + cols(down, -1)
    )
    gy = (cols(up, -1) + 2 * cols(up, 0) + cols(up, 1)) - (
        cols(down, -1) + 2 * cols(down, 0) + cols(down, 1)
    )
    return gx / (8 * cell_m), gy / (8 * cell_m)


def slope_deg(gx, gy):
    return np.degrees(np.arctan(np.hypot(gx, gy)))


def aspect_deg(gx, gy, x, y):
    """Downhill compass direction, clockwise from local north, at projected (x, y) in metres.

    Local north is radially away from the pole, east is 90 deg clockwise of it on this map
    (x = rho sin lon, y = rho cos lon). Flat cells (zero gradient) get 0.
    """
    rho = np.hypot(x, y)
    safe = np.where(rho > 0, rho, 1.0)
    nx = np.where(rho > 0, x / safe, 0.0)  # unit local-north vector; the pole picks +y
    ny = np.where(rho > 0, y / safe, 1.0)
    north = -(gx * nx + gy * ny)
    east = -(gx * ny - gy * nx)
    return np.where((gx == 0) & (gy == 0), 0.0, np.degrees(np.arctan2(east, north)) % 360.0)


def local_relief(z, cell_m, radius_m):
    """Detrended relief: max - min, within a disk of radius_m, of z minus its least-squares plane.

    Removing the plane keeps regional slope out of crater depth (a tilted plane gives 0).
    Output loses ceil(radius / cell) px per side.
    """
    r = int(np.ceil(radius_m / cell_m))
    off = np.arange(-r, r + 1) * cell_m
    dy, dx = np.meshgrid(off, off, indexing="ij")  # window axis 0 is rows (+y), axis 1 cols (+x)
    disk = np.hypot(dx, dy) <= radius_m
    dx, dy = dx[disk], dy[disk]
    vals = sliding_window_view(z, (2 * r + 1, 2 * r + 1))[..., disk]
    # The disk is symmetric, so the plane fit decouples: mean, then one slope per axis.
    resid = (
        vals
        - vals.mean(axis=-1, keepdims=True)
        - (vals @ dx / (dx @ dx))[..., None] * dx
        - (vals @ dy / (dy @ dy))[..., None] * dy
    )
    return resid.max(axis=-1) - resid.min(axis=-1)


def window_std(a, n):
    """Population std-dev over an n x n window; output loses n // 2 px per side."""
    return sliding_window_view(a, (n, n)).std(axis=(2, 3))


def rock_proxy(roughness_deg):
    """Roughness (deg) -> rock factor in [0, 1]; 1 at and above ROCK_REF_DEG."""
    return np.clip(roughness_deg / ROCK_REF_DEG, 0.0, 1.0)


def _crop(a, k):
    return a[k : a.shape[0] - k, k : a.shape[1] - k] if k else a


def _blocks(a, f):
    m = a.shape[0] // f
    return a.reshape(m, f, a.shape[1] // f, f)


def compute(z, x0, y0, src_m, cell_m):
    """Layers for the interior of z (MARGIN_PX cropped per side), aggregated to cell_m.

    z rows grow with +y, (x0, y0) is the centre of z[0, 0]. Returns ({name: float32 array},
    grid x0, grid y0).
    """
    f = round(cell_m / src_m)
    if f * src_m != cell_m:
        raise ValueError(f"cell_m {cell_m}: must be an integer multiple of {src_m} m")
    gx, gy = horn_gradient(z, src_m)  # margin 1
    slope = slope_deg(gx, gy)
    rough = window_std(slope, ROUGHNESS_WINDOW)  # margin 1 + 2
    relief = local_relief(z, src_m, CRATER_RADIUS_M)
    rr = int(np.ceil(CRATER_RADIUS_M / src_m))
    k = MARGIN_PX
    inner = {
        "elev": _crop(z, k),
        "gx": _crop(gx, k - 1),
        "gy": _crop(gy, k - 1),
        "slope": _crop(slope, k - 1),
        "rough": _crop(rough, k - 1 - ROUGHNESS_WINDOW // 2),
        "relief": _crop(relief, k - rr),
    }
    shape = inner["elev"].shape
    if any(v.shape != shape for v in inner.values()) or shape[0] % f or shape[1] % f:
        raise ValueError(f"layer shapes disagree or are not a multiple of {f}: {shape}")
    gx0, gy0 = x0 + k * src_m + (cell_m - src_m) / 2, y0 + k * src_m + (cell_m - src_m) / 2
    mean = {n: _blocks(v, f).mean(axis=(1, 3)) for n, v in inner.items()}
    ny, nx = mean["elev"].shape
    cx = gx0 + cell_m * np.arange(nx)[None, :]
    cy = gy0 + cell_m * np.arange(ny)[:, None]
    out = {
        "slope_deg": _blocks(inner["slope"], f).max(axis=(1, 3)),
        "aspect_deg": aspect_deg(mean["gx"], mean["gy"], cx, cy),
        "elev_m": mean["elev"],
        "crater_depth_m": mean["relief"],
        "roughness_deg": mean["rough"],
        "rock": rock_proxy(mean["rough"]),
    }
    return {n: v.astype(np.float32) for n, v in out.items()}, gx0, gy0


def write_grid(path, layers, header):
    """Layers back to back as little-endian float32 in LAYERS order; header gets layer_info."""
    info, chunks, offset = {}, [], 0
    for name in LAYERS:
        data = np.ascontiguousarray(layers[name], dtype="<f4")
        if not np.isfinite(data).all():
            raise ValueError(f"{name}: nonfinite values")
        units = "fraction" if name == "rock" else "m" if name.endswith("_m") else "deg"
        info[name] = {
            "dtype": "float32",
            "scale": 1,
            "offset": 0,
            "units": units,
            "components": 1,
            "nodata": None,
            "byte_offset": offset,
            "byte_length": data.nbytes,
        }
        if name == "rock":
            info[name] |= {"proxy": True, "note": ROCK_NOTE}
        chunks.append(data.tobytes())
        offset += data.nbytes
    header = {**header, "layers": list(LAYERS), "layer_info": info}
    schemas.validate("grid", header)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b"".join(chunks))
    path.with_suffix(".json").write_text(json.dumps(header, indent=2, allow_nan=False) + "\n")


def run(cfg: Config) -> None:
    dem = cfg.paths.raw / pgda.FILENAME
    if not dem.exists():
        raise FileNotFoundError(f"{dem}: run `make terrain-fetch` first")
    src_m, cell_m = cfg.terrain.near_field_m, cfg.terrain.heatmap_cell_m
    generated_at = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    with rasterio.open(dem) as ds:
        for name, region in cfg.regions.items():
            cx, cy = (float(v) for v in coords.to_xy(region.lat, region.lon))
            z, x0, y0 = tiles.cut(ds, cx, cy, tiles.NEAR_HALF_M + MARGIN_PX * src_m, src_m)
            layers, gx0, gy0 = compute(z.astype(np.float64), x0, y0, src_m, cell_m)
            ny, nx = layers["elev_m"].shape
            header = {
                "schema_version": 1,
                "generated_at": generated_at,
                "source_urls": [pgda.URL, pgda.PRODUCT_URL, region.source_url],
                "region": name,
                "crs": "polar-stereo-south",
                "crs_params": {"lat_0": -90, "lon_0": 0, "radius_m": coords.RADIUS_M},
                "x0": gx0,
                "y0": gy0,
                "cell_m": cell_m,
                "nx": nx,
                "ny": ny,
                "bins": cfg.masks.grid_bins,
            }
            write_grid(cfg.paths.out / "grid" / f"{name}.bin", layers, header)
            s, d, r = layers["slope_deg"], layers["crater_depth_m"], layers["rock"]
            print(
                f"layers: {name} {nx}x{ny} @ {cell_m:g} m; slope {s.min():.1f}..{s.max():.1f} deg "
                f"({(s <= 10).mean():.0%} <= 10 deg), crater depth {d.min():.0f}..{d.max():.0f} m, "
                f"rock proxy min/mean/max {r.min():.2f}/{r.mean():.2f}/{r.max():.2f}"
            )
