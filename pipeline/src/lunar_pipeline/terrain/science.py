"""Science layers: long-term Sun / Earth visibility and permanent shadow -> grid/{region}.

Source: PGDA product 69, "Lunar Polar Illumination" (Mazarico et al. 2011, Icarus 211, 1066),
LOLA GDR 60 m/px south polar stereographic (R = 1737.4 km, same projection as the LDEM). Values
average the 18.6-year precession cycle at hourly steps, NOT a specific date; date-specific values
are the engine's job.

Each 160 m grid cell gets the mean of the 60 m source pixels whose centres fall inside it, so
`psr` is the fraction of the cell permanently shadowed (cold trap; water ice can be stable).
Appends sun_avg, earth_avg, psr to the grid/{region}.bin written by `layers` (run that first).
"""

import json
from pathlib import Path

import numpy as np
import rasterio
from rasterio.crs import CRS
from rasterio.transform import from_origin
from rasterio.warp import Resampling, reproject
from rasterio.windows import Window

from lunar_pipeline import fetch as http
from lunar_pipeline import schemas
from lunar_pipeline.config import Config

TARGET_CRS = CRS.from_string("+proj=stere +lat_0=-90 +lat_ts=-90 +lon_0=0 +R=1737400 +units=m")
ICE_URL = "https://planetarymaps.usgs.gov/mosaic/Lunar_Research/IceFavorabilityIndex/Moon_IceFavorabilityIndex_90S000E_591mp.tif"
ICE_SHA = "50632bafb4b78855f515791ecb6f08c65708458eb2ab2b209befd199c3947a6e"
ICE_NOTE = (
    "Cannon & Britt 2020 ice favorability model, native 591 m; "
    "nearest-neighbour reprojection, not measured ice abundance"
)
PRODUCT_URL = "https://pgda.gsfc.nasa.gov/products/69"
BASE = "https://pgda.gsfc.nasa.gov/data/MoonIllumination/"
# name -> (file, pinned SHA-256 (trust on first use, 2026-11-14), note)
SOURCES = {
    "sun_avg": (
        "AVGVISIB_85S_060M_201608.TIF",
        "ccf67d4f39e0a970c111196da7d6551ffcf50d075470b93067fb3904c0b05806",
        "Average fraction of time the Sun is visible over the 18.6-year cycle (Mazarico 2011)",
    ),
    "earth_avg": (
        "AVGVISIB_85S_060M_201608_EARTH.TIF",
        "d71dc5adfff653e0e924e0a4cbf03795b996caa30b4ace3d5843a70a5ab2f3d2",
        "Average fraction of time the Earth is visible: direct-to-Earth radio proxy, "
        "no link budget",
    ),
    "psr": (
        "LPSR_85S_060M_201608.TIF",
        "e9544c081dd4e36f079e92bc3a376d0913857a61a4a53c209175c081762de43c",
        "Fraction of the cell permanently shadowed (cold trap; water ice can be stable)",
    ),
}
SCIENCE_LAYERS = tuple(SOURCES)


def fetch(cfg: Config) -> dict[str, Path]:
    paths = {}
    for name, (file, sha, _) in SOURCES.items():
        path = cfg.paths.raw / file
        http.download(BASE + file, path, sha)
        paths[name] = path
    return paths


def block_mean(values, px, py, x0, y0, cell_m, nx, ny):
    """Mean of source values (finite only) per grid cell; px/py are source pixel centres (m).

    Grid cell (row, col) is centred at (x0 + col * cell_m, y0 + row * cell_m). Cells with no finite
    source pixel are NaN.
    """
    col = np.floor((px - (x0 - cell_m / 2)) / cell_m).astype(np.int64)
    row = np.floor((py - (y0 - cell_m / 2)) / cell_m).astype(np.int64)
    keep = (col >= 0) & (col < nx) & (row >= 0) & (row < ny) & np.isfinite(values)
    idx = row[keep] * nx + col[keep]
    total = np.bincount(idx, weights=values[keep], minlength=nx * ny)
    count = np.bincount(idx, minlength=nx * ny)
    with np.errstate(invalid="ignore", divide="ignore"):
        out = np.where(count > 0, total / np.maximum(count, 1), np.nan)
    return out.reshape(ny, nx)


def resample(ds, x0, y0, cell_m, nx, ny):
    """Read the window covering the grid and average onto it (scale/offset applied)."""
    left, top = x0 - cell_m / 2, y0 + (ny - 0.5) * cell_m
    right, bottom = x0 + (nx - 0.5) * cell_m, y0 - cell_m / 2
    r0, c0 = ds.index(left, top)
    r1, c1 = ds.index(right, bottom)
    ra, rb, ca, cb = min(r0, r1), max(r0, r1), min(c0, c1), max(c0, c1)
    r0, c0 = max(ra - 1, 0), max(ca - 1, 0)
    r1, c1 = min(rb + 2, ds.height), min(cb + 2, ds.width)
    if r1 <= r0 or c1 <= c0:
        return np.full((ny, nx), np.nan, dtype=np.float32)
    win = Window(c0, r0, c1 - c0, r1 - r0)
    raw = ds.read(1, window=win).astype(np.float32)
    if ds.nodata is not None:
        raw[raw == ds.nodata] = np.nan
    vals = raw * ds.scales[0] + ds.offsets[0]
    rows, cols = np.meshgrid(np.arange(r0, r1), np.arange(c0, c1), indexing="ij")
    xs, ys = rasterio.transform.xy(ds.transform, rows.ravel(), cols.ravel())
    return block_mean(vals.ravel(), np.asarray(xs), np.asarray(ys), x0, y0, cell_m, nx, ny)


def resample_ice(ds, x0, y0, cell_m, nx, ny):
    """Preserve coarse source values and nodata; never pretend 591 m data resolves 160 m detail."""
    out = np.full((ny, nx), -9999, dtype=np.float32)
    reproject(
        source=rasterio.band(ds, 1),
        destination=out,
        src_transform=ds.transform,
        src_crs=ds.crs,
        src_nodata=ds.nodata,
        dst_transform=from_origin(x0 - cell_m / 2, y0 + (ny - 0.5) * cell_m, cell_m, cell_m),
        dst_crs=TARGET_CRS,
        dst_nodata=-9999,
        resampling=Resampling.nearest,
    )
    return np.flipud(out).copy()


def append_layers(bin_path: Path, new: dict[str, np.ndarray], source_urls: list[str]):
    """Append float32 layers to an existing grid (replacing any earlier copy of the same names)."""
    json_path = bin_path.with_suffix(".json")
    header = json.loads(json_path.read_text())
    blob = bin_path.read_bytes()
    keep = [n for n in header["layers"] if n not in new]
    chunks, info, offset = [], {}, 0
    for name in keep:
        li = header["layer_info"][name]
        chunks.append(blob[li["byte_offset"] : li["byte_offset"] + li["byte_length"]])
        info[name] = {**li, "byte_offset": offset}
        offset += li["byte_length"]
    for name, arr in new.items():
        data = np.ascontiguousarray(arr, dtype="<f4")
        if data.shape != (header["ny"], header["nx"]):
            raise ValueError(f"{name}: shape {data.shape} != grid {header['ny']}x{header['nx']}")
        valid = data[data != -9999] if name == "ice_favorability" else data
        if np.any((valid < 0) | (valid > 1)):
            raise ValueError(f"{name}: values outside [0, 1]")
        if not np.isfinite(data).all():
            raise ValueError(f"{name}: nonfinite values (grid extends past 85 S coverage?)")
        info[name] = {
            "dtype": "float32",
            "scale": 1,
            "offset": 0,
            "units": "fraction",
            "components": 1,
            "nodata": -9999 if name == "ice_favorability" else None,
            "byte_offset": offset,
            "byte_length": data.nbytes,
            "note": ICE_NOTE if name == "ice_favorability" else SOURCES[name][2],
        }
        chunks.append(data.tobytes())
        offset += data.nbytes
    urls = list(dict.fromkeys([*header["source_urls"], *source_urls]))
    header = {**header, "source_urls": urls, "layers": [*keep, *new], "layer_info": info}
    schemas.validate("grid", header)
    bin_path.write_bytes(b"".join(chunks))
    json_path.write_text(json.dumps(header, indent=2, allow_nan=False) + "\n")


def run(cfg: Config) -> None:
    paths = fetch(cfg)
    ice_path = cfg.paths.raw / "Moon_IceFavorabilityIndex_90S000E_591mp.tif"
    http.download(ICE_URL, ice_path, ICE_SHA)
    urls = [PRODUCT_URL, *(BASE + f for f, _, _ in SOURCES.values()), ICE_URL]
    for region in cfg.regions:
        bin_path = cfg.paths.out / "grid" / f"{region}.bin"
        if not bin_path.exists():
            raise FileNotFoundError(f"{bin_path}: run `layers` first")
        h = json.loads(bin_path.with_suffix(".json").read_text())
        new = {}
        for name, path in paths.items():
            with rasterio.open(path) as ds:
                if ds.crs != TARGET_CRS:
                    raise ValueError(f"{name}: source CRS must match the target lunar projection")
                new[name] = resample(ds, h["x0"], h["y0"], h["cell_m"], h["nx"], h["ny"])
        with rasterio.open(ice_path) as ds:
            new["ice_favorability"] = resample_ice(
                ds, h["x0"], h["y0"], h["cell_m"], h["nx"], h["ny"]
            )
        append_layers(bin_path, new, urls)
        s, e, p = new["sun_avg"], new["earth_avg"], new["psr"]
        print(
            f"science: {region} sun_avg {s.min():.2f}..{s.max():.2f} (mean {s.mean():.2f}), "
            f"earth_avg {e.min():.2f}..{e.max():.2f}, psr area {p.mean():.1%}"
        )


if __name__ == "__main__":
    # Run after `layers`: uv run python -m lunar_pipeline.terrain.science
    from lunar_pipeline.config import load_config

    run(load_config())
