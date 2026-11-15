"""PIPE-4: crop the PGDA DEM into raw float32 height tiles + JSON header (contract `tile`).

Per config region: a far-field tile (+-(max_distance_km + FAR_MARGIN_M) at far_field_m) for the
native mask builder, kept pipeline-only in pipeline/data/tiles/ (about 7.5 MB each), and a
near-field tile (+-NEAR_HALF_M at near_field_m) shipped to web/public/data/tiles/ for the 3D patch.
"""

from datetime import UTC, datetime
from pathlib import Path

import numpy as np
import rasterio
from rasterio.windows import Window

from lunar_pipeline import coords, schemas
from lunar_pipeline.binio import write_array
from lunar_pipeline.config import Config
from lunar_pipeline.terrain import pgda

# Heatmap cells sit up to ~14 km (grid corner) from the tile centre; without the margin their rays
# stop at the tile edge after ~139 km instead of max_distance_km.
FAR_MARGIN_M = 15_000
NEAR_HALF_M = 10_000  # agreed with Ananth 2026-11-14: +-10 km, 250 x 250 cells at 80 m


def cut(ds, cx, cy, half_m, cell_m):
    """Heights around (cx, cy) as (tile, x0, y0); rows grow with +y, cells are block means.

    The window snaps to source pixel edges so the output grid is reproducible; it never
    resamples across a pixel boundary.
    """
    src = abs(ds.res[0])
    factor = round(cell_m / src)
    if factor < 1 or factor * src != cell_m or abs(ds.res[1]) != src:
        raise ValueError(f"cell_m {cell_m}: must be an integer multiple of the {src} m source")
    n = round(2 * half_m / cell_m) * factor  # source pixels per side
    left, top = ds.bounds.left, ds.bounds.top
    col0 = round((cx - left) / src - n / 2)
    row0 = round((top - cy) / src - n / 2)
    if col0 < 0 or row0 < 0 or col0 + n > ds.width or row0 + n > ds.height:
        raise ValueError(f"tile at ({cx:.0f}, {cy:.0f}) m +-{half_m} m leaves the DEM extent")
    data = ds.read(1, window=Window(col0, row0, n, n)).astype(np.float64)
    if not np.isfinite(data).all():
        raise ValueError(f"tile at ({cx:.0f}, {cy:.0f}) m has nodata pixels")
    m = n // factor
    tile = data.reshape(m, factor, m, factor).mean(axis=(1, 3))
    # DEM row 0 is the top (+y); the tile contract has row growing with +y.
    tile = np.flipud(tile).astype(np.float32)
    x0 = left + col0 * src + cell_m / 2
    y0 = top - (row0 + n) * src + cell_m / 2
    return tile, x0, y0


def _write(path: Path, tile, x0, y0, cell_m, name, region, generated_at):
    header = {
        "schema_version": 1,
        "generated_at": generated_at,
        "source_urls": [pgda.URL, pgda.PRODUCT_URL, region.source_url],
        "region": name,
        "crs": "polar-stereo-south",
        "crs_params": {"lat_0": -90, "lon_0": 0, "radius_m": coords.RADIUS_M},
        "x0": x0,
        "y0": y0,
        "cell_m": cell_m,
        "nx": tile.shape[1],
        "ny": tile.shape[0],
        "dtype": "float32",
        "units": "m",
        "nodata": None,
        "height_reference_radius_m": coords.RADIUS_M,
    }
    schemas.validate("tile", header)
    write_array(path, tile, header)
    print(
        f"tiles: {path} {tile.shape[1]}x{tile.shape[0]} @ {cell_m:g} m, "
        f"{tile.min():.0f}..{tile.max():.0f} m"
    )


def run(cfg: Config) -> None:
    dem = cfg.paths.raw / pgda.FILENAME
    if not dem.exists():
        raise FileNotFoundError(f"{dem}: run `make terrain-fetch` first")
    if cfg.moon_radius_m != coords.RADIUS_M:
        raise ValueError(f"moon_radius_m {cfg.moon_radius_m} != DEM sphere {coords.RADIUS_M}")
    generated_at = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    far_dir = cfg.paths.raw.parent / "tiles"
    near_dir = cfg.paths.out / "tiles"
    far = cfg.terrain.far_field_m
    near = cfg.terrain.near_field_m
    with rasterio.open(dem) as ds:
        for name, region in cfg.regions.items():
            cx, cy = (float(v) for v in coords.to_xy(region.lat, region.lon))
            for out, half, cell in (
                (far_dir, cfg.terrain.max_distance_km * 1000 + FAR_MARGIN_M, far),
                (near_dir, NEAR_HALF_M, near),
            ):
                tile, x0, y0 = cut(ds, cx, cy, half, cell)
                _write(
                    out / f"{name}_{cell:g}m.bin", tile, x0, y0, cell, name, region, generated_at
                )
