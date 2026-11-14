"""PIPE-10: LROC NAC south-pole imagery textures for the 3D patch (contract `imagery`).

Source: Moon Trek WMTS layer LRO_NAC_AvgMosaic_SPole855_1mp (LMMP/USGS, 1 m/px mosaic to 85.5 S).
Its FGDC metadata states the same projection as the PGDA DEM: polar stereographic, central meridian
0, standard parallel -90 (true scale at the pole), sphere R = 1737400 m. Trek's deepest tile level
(11) is 4.18 m/px; the 20 km patch is averaged down to at most MAX_PX pixels per side.

Per config region: imagery/{region}.webp (greyscale encoded as RGB; row 0 = y_min, rows grow
with +y like every raster in common.schema.json) plus imagery/{region}.json (extent, pixel
size, citations).
"""

import json
import math
import warnings
from datetime import UTC, datetime
from pathlib import Path

import numpy as np
import rasterio
import requests
from rasterio.errors import NotGeoreferencedWarning
from rasterio.io import MemoryFile
from rasterio.transform import from_origin
from rasterio.warp import Resampling, reproject

from lunar_pipeline import fetch, schemas
from lunar_pipeline.config import Config

LAYER = "LRO_NAC_AvgMosaic_SPole855_1mp"
BASE_URL = f"https://trek.nasa.gov/tiles/Moon/SP/{LAYER}/1.0.0"
CAPABILITIES_URL = f"{BASE_URL}/WMTSCapabilities.xml"
TILE_URL = f"{BASE_URL}/default/default028mm/{{level}}/{{row}}/{{col}}.png"
METADATA_URL = f"https://trek.nasa.gov/moon/TrekWS/rest/cat/metadata/fgdc/html?label={LAYER}"
ATTRIBUTION = (
    "LRO LROC NAC Image Mosaic, S Pole, Avg Merge (LRO_NAC_AvgMosaic_SPole85.5_1mp): "
    "NASA/GSFC/Arizona State University (LROC), USGS / NASA Lunar Mapping and Modeling Project; "
    "tiles via NASA Moon Trek (trek.nasa.gov)"
)

# WMTSCapabilities.xml, TileMatrixSet default028mm (verified 2026-11-14): level 0 is 2 x 1 tiles of
# 256 px, TopLeftCorner (-1095930, 1095930) m, 8561.953125 m/px; each level halves the pixel.
ORIGIN_X, ORIGIN_Y = -1_095_930.0, 1_095_930.0
TILE_PX = 256
LEVEL = 11  # deepest level served (4.18 m/px); level 12 returns HTTP 404
NODATA = 0  # mosaic nodata value (FGDC Supplemental_Information); also missing / transparent tiles

MAX_PX = 4096  # Ananth 2026-11-14: <= 4096 x 4096, <= 4 MB per texture, <= 6 MB all imagery
MAX_BYTES = 4_000_000
TOTAL_BYTES = 6_000_000
QUALITIES = (85, 75, 65, 55, 45)

# Same DEM grid as PIPE-4 near-field tiles (tiles.cut): +-10 km, snapped to 80 m DEM pixel edges.
NEAR_HALF_M = 10_000
DEM_LEFT_M, DEM_TOP_M, DEM_PIX_M = -304_000.0, 304_000.0, 80.0
CRS = "+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +R=1737400 +units=m +no_defs"
RADIUS_M = 1_737_400.0


def pixel_m(level: int) -> float:
    return 2 * ORIGIN_Y / (TILE_PX * 2**level)


def to_xy(lat, lon):
    # shortcut: duplicates coords.to_xy from PIPE-4 (PR #88), switch to it once that merges.
    rho = 2 * RADIUS_M * math.tan(math.pi / 4 + math.radians(lat) / 2)
    return rho * math.sin(math.radians(lon)), rho * math.cos(math.radians(lon))


def extent(lat, lon, half_m=NEAR_HALF_M):
    """(x_min, x_max, y_min, y_max) in metres: the near-field tile footprint (pixel edges)."""
    cx, cy = to_xy(lat, lon)
    n = round(2 * half_m / DEM_PIX_M)
    col0 = round((cx - DEM_LEFT_M) / DEM_PIX_M - n / 2)
    row0 = round((DEM_TOP_M - cy) / DEM_PIX_M - n / 2)
    x_min = DEM_LEFT_M + col0 * DEM_PIX_M
    y_max = DEM_TOP_M - row0 * DEM_PIX_M
    return x_min, x_min + n * DEM_PIX_M, y_max - n * DEM_PIX_M, y_max


def tile_range(x_min, x_max, y_min, y_max, level=LEVEL):
    """Inclusive (row0, row1, col0, col1) of WMTS tiles covering the extent; rows grow with -y."""
    span = pixel_m(level) * TILE_PX
    col0 = math.floor((x_min - ORIGIN_X) / span)
    col1 = math.ceil((x_max - ORIGIN_X) / span) - 1
    row0 = math.floor((ORIGIN_Y - y_max) / span)
    row1 = math.ceil((ORIGIN_Y - y_min) / span) - 1
    return row0, row1, col0, col1


def _png(body: bytes) -> None:
    if not body.startswith(b"\x89PNG\r\n\x1a\n"):
        raise ValueError("not a PNG tile")


def decode(body: bytes) -> np.ndarray:
    """Grey uint8 tile; transparent pixels become NODATA."""
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", NotGeoreferencedWarning)
        with MemoryFile(body) as mem, mem.open() as ds:
            data = ds.read()
    grey = data[0]
    if data.shape[0] in (2, 4):  # grey+alpha or RGBA
        grey = np.where(data[-1] > 0, grey, NODATA)
    if grey.shape != (TILE_PX, TILE_PX):
        raise ValueError(f"tile shape {grey.shape}: expected {TILE_PX} x {TILE_PX}")
    return grey


def get_tile(level, row, col, cache_dir, session):
    """Tile bytes, or None where Trek has no tile (HTTP 404: outside the mosaic)."""
    url = TILE_URL.format(level=level, row=row, col=col)
    try:
        return fetch.cached_get(url, cache_dir, session=session, validate=_png)
    except requests.HTTPError as exc:
        if getattr(exc.response, "status_code", None) == 404:
            return None
        raise


def mosaic(ext, cache_dir, session, level=LEVEL):
    """(grey array, rasterio transform) of every tile covering ext, row 0 at the top (+y)."""
    row0, row1, col0, col1 = tile_range(*ext, level=level)
    out = np.full(((row1 - row0 + 1) * TILE_PX, (col1 - col0 + 1) * TILE_PX), NODATA, np.uint8)
    for row in range(row0, row1 + 1):
        for col in range(col0, col1 + 1):
            body = get_tile(level, row, col, cache_dir, session)
            if body is not None:
                r, c = (row - row0) * TILE_PX, (col - col0) * TILE_PX
                out[r : r + TILE_PX, c : c + TILE_PX] = decode(body)
    span = pixel_m(level) * TILE_PX
    px = pixel_m(level)
    return out, from_origin(ORIGIN_X + col0 * span, ORIGIN_Y - row0 * span, px, px)


def crop(src, src_transform, ext, src_pixel_m, max_px=None):
    """Average src onto the extent at native resolution capped at max_px; row 0 = y_min."""
    max_px = max_px or MAX_PX
    x_min, x_max, y_min, y_max = ext
    width = min(max_px, math.ceil((x_max - x_min) / src_pixel_m - 1e-9))
    height = min(max_px, math.ceil((y_max - y_min) / src_pixel_m - 1e-9))
    dst = np.zeros((height, width), np.float32)
    dst_transform = from_origin(x_min, y_max, (x_max - x_min) / width, (y_max - y_min) / height)
    reproject(
        src.astype(np.float32),
        dst,
        src_transform=src_transform,
        src_crs=CRS,
        dst_transform=dst_transform,
        dst_crs=CRS,
        src_nodata=NODATA,
        dst_nodata=NODATA,
        resampling=Resampling.average,
    )
    valid = dst > 0
    # A valid average must not round to the nodata value.
    grey = np.where(valid, np.clip(np.rint(dst), 1, 255), NODATA).astype(np.uint8)
    return np.flipud(grey)  # dst row 0 is y_max (north-up); the contract wants row 0 = y_min


def fill_nodata(grey: np.ndarray) -> np.ndarray:
    """Grow valid pixels into NODATA gaps: each pass sets them to the mean of valid 4-neighbours.

    Lossy WebP cannot keep an exact nodata value, so the shipped texture has none.
    shortcut: a gap gets a blur of its rim, not real imagery (28-263 px per region in Nov 2026);
    upgrade to a lossless format with alpha if gaps grow beyond a few pixels.
    """
    out = grey.astype(np.float32)
    valid = grey != NODATA
    if not valid.any():
        raise ValueError("no valid imagery to fill from")
    while not valid.all():
        total = np.zeros_like(out)
        count = np.zeros_like(out)
        for axis, shift in ((0, 1), (0, -1), (1, 1), (1, -1)):
            nb = np.roll(valid, shift, axis)
            edge = [slice(None)] * 2
            edge[axis] = 0 if shift == 1 else -1
            nb[tuple(edge)] = False  # no wrap-around
            total += np.where(nb, np.roll(out, shift, axis), 0)
            count += nb
        grow = ~valid & (count > 0)
        out[grow] = total[grow] / count[grow]
        valid = valid | grow
    return np.clip(np.rint(out), 1, 255).astype(np.uint8)


def encode_webp(grey: np.ndarray, max_bytes: int) -> tuple[bytes, int]:
    """Lossy WebP at the highest quality in QUALITIES that fits max_bytes."""
    rgb = np.stack([grey] * 3)  # GDAL's WEBP driver needs 3 or 4 bands
    for quality in QUALITIES:
        with (
            warnings.catch_warnings(),
            rasterio.Env(GDAL_PAM_ENABLED="NO"),
            MemoryFile() as mem,
        ):
            warnings.simplefilter("ignore", NotGeoreferencedWarning)
            with mem.open(
                driver="WEBP",
                width=grey.shape[1],
                height=grey.shape[0],
                count=3,
                dtype="uint8",
                QUALITY=quality,
            ) as ds:
                ds.write(rgb)
            body = mem.read()
        if len(body) <= max_bytes:
            return body, quality
    raise ValueError(f"WebP is {len(body)} bytes at quality {quality}, over {max_bytes}")


def header(name, ext, grey, quality, generated_at):
    x_min, x_max, y_min, y_max = ext
    return {
        "schema_version": 1,
        "generated_at": generated_at,
        "source_urls": [BASE_URL + "/default/default028mm/", CAPABILITIES_URL, METADATA_URL],
        "attribution": ATTRIBUTION,
        "region": name,
        "crs": "polar-stereo-south",
        "crs_params": {"lat_0": -90, "lon_0": 0, "radius_m": RADIUS_M},
        "x_min": x_min,
        "x_max": x_max,
        "y_min": y_min,
        "y_max": y_max,
        "pixel_m": (x_max - x_min) / grey.shape[1],
        "width": grey.shape[1],
        "height": grey.shape[0],
        "format": "webp",
        "row0": "y_min",
        "nodata": None,  # gaps filled (fill_nodata); lossy WebP cannot keep an exact nodata value
        "webp_quality": quality,
        "source_level": LEVEL,
        "source_pixel_m": pixel_m(LEVEL),
    }


def build(name, region, out_dir: Path, cache_dir, session, max_bytes, generated_at):
    ext = extent(region.lat, region.lon)
    src, transform = mosaic(ext, cache_dir, session)
    grey = crop(src, transform, ext, pixel_m(LEVEL))
    if not (grey != NODATA).any():
        raise ValueError(f"{name}: no imagery inside {ext}")
    gaps = int((grey == NODATA).sum())
    grey = fill_nodata(grey)
    body, quality = encode_webp(grey, max_bytes)
    head = header(name, ext, grey, quality, generated_at)
    schemas.validate("imagery", head)
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / f"{name}.webp").write_bytes(body)
    (out_dir / f"{name}.json").write_text(json.dumps(head, indent=2) + "\n")
    print(
        f"imagery: {out_dir / name}.webp {grey.shape[1]}x{grey.shape[0]} "
        f"@ {head['pixel_m']:.3f} m, "
        f"{len(body):,} bytes (q{quality}), {gaps} nodata px filled"
    )
    return len(body)


def run(cfg: Config, session=None) -> None:
    if cfg.moon_radius_m != RADIUS_M:
        raise ValueError(f"moon_radius_m {cfg.moon_radius_m} != mosaic sphere {RADIUS_M}")
    max_bytes = min(MAX_BYTES, TOTAL_BYTES // max(1, len(cfg.regions)))
    generated_at = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    client = session or requests.Session()
    try:
        total = sum(
            build(
                name,
                region,
                cfg.paths.out / "imagery",
                cfg.paths.cache / "trek",
                client,
                max_bytes,
                generated_at,
            )
            for name, region in cfg.regions.items()
        )
    finally:
        if session is None:
            client.close()
    if total > TOTAL_BYTES:
        raise ValueError(f"imagery total {total} bytes over {TOTAL_BYTES}")
    print(f"imagery: {len(cfg.regions)} textures, {total:,} bytes total")
