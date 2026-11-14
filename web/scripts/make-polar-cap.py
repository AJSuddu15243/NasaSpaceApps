#!/usr/bin/env python3
"""Bake the LOLA south-pole DEM (PIPE-3) into a normal-map texture for the landing Moon.

Usage (from the repo root, after `cd pipeline && make terrain-fetch`):
    python web/scripts/make-polar-cap.py pipeline/data/raw/LDEM_80S_80MPP_ADJ.TIF [--size 2048]

Writes web/public/textures/moon/south-cap-normal-<size>.jpg and adds it to manifest.json.
The texture covers the DEM's own polar-stereographic square (x, y in [-304 km, 304 km], +x toward 90 E,
+y toward 0 E, row 0 = +y edge; see pipeline/notes/pipe-3.md). RGB = grid-frame normal (x, y, up) * 0.5 + 0.5.
The shader turns the grid frame into local east/north, so the moving Sun lights real LOLA relief.
Only a decimated, area-averaged read is made; the full 231 MB band is never loaded.
"""
import argparse
import json
from pathlib import Path

import numpy as np
import rasterio
from PIL import Image
from rasterio.enums import Resampling

R_M = 1_737_400.0
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "textures" / "moon"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("dem", type=Path)
    ap.add_argument("--size", type=int, default=2048)
    ap.add_argument("--out-dir", type=Path, default=OUT_DIR)
    args = ap.parse_args()

    with rasterio.open(args.dem) as src:
        left, bottom, right, top = src.bounds
        assert abs(left + right) < 1 and abs(top + bottom) < 1, "expected a pole-centred square grid"
        half = right
        z = src.read(1, out_shape=(args.size, args.size), resampling=Resampling.average).astype(np.float64)
    if not np.isfinite(z).all():
        raise SystemExit("DEM has non-finite heights after decimation; refusing to bake a texture")
    px = 2 * half / args.size
    # Grid frame: +x = column direction, +y = up the image (row 0 is +y).
    dz_dcol = np.gradient(z, axis=1) / px
    dz_drow = np.gradient(z, axis=0) / px
    gx, gy = -dz_dcol, dz_drow  # -dz/dx, -dz/dy (rows run toward -y)
    n = np.stack([gx, gy, np.ones_like(z)], axis=-1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    rgb = np.clip((n * 0.5 + 0.5) * 255 + 0.5, 0, 255).astype(np.uint8)

    out_dir = args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)
    name = f"south-cap-normal-{args.size}.jpg"
    Image.fromarray(rgb).save(out_dir / name, quality=92, optimize=True)

    manifest_path = out_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    manifest["capNormal"] = f"/textures/moon/{name}"
    manifest["capHalfWidthM"] = half
    manifest["capSource"] = "LOLA LDEM_80S_80MPP_ADJ (NASA PGDA product 90), heights above the 1737.4 km sphere"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    slope = np.degrees(np.arccos(n[..., 2]))
    print(f"wrote {name}: {args.size}px, {px:.0f} m/px, height {z.min():.0f}..{z.max():.0f} m, "
          f"median slope {np.median(slope):.1f} deg, 99th pct {np.percentile(slope, 99):.1f} deg")


if __name__ == "__main__":
    main()
