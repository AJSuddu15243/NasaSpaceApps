"""PIPE-5: slope (Horn), aspect, crater depth, roughness on synthetic surfaces; grid file layout."""

import json
import math
from dataclasses import replace
from types import MappingProxyType

import numpy as np
import pytest
import rasterio
from rasterio.transform import from_origin

from lunar_pipeline import coords, schemas
from lunar_pipeline.config import Region, load_config
from lunar_pipeline.terrain import layers, pgda, tiles

CELL = 80.0


def plane(a, b, n=40, x0=0.0, y0=0.0):
    xs = x0 + CELL * np.arange(n)
    ys = y0 + CELL * np.arange(n)
    return a * xs[None, :] + b * ys[:, None]


def test_horn_is_exact_on_a_plane():
    gx, gy = layers.horn_gradient(plane(0.03, -0.05), CELL)
    assert gx.shape == (38, 38)
    np.testing.assert_allclose(gx, 0.03, atol=1e-12)
    np.testing.assert_allclose(gy, -0.05, atol=1e-12)
    slope = layers.slope_deg(gx, gy)
    np.testing.assert_allclose(slope, math.degrees(math.atan(math.hypot(0.03, 0.05))))


def test_roughness_is_zero_on_a_plane_and_positive_on_bumps():
    gx, gy = layers.horn_gradient(plane(0.1, 0.0), CELL)
    assert np.allclose(layers.window_std(layers.slope_deg(gx, gy), 5), 0)
    rng = np.random.default_rng(0)
    gx, gy = layers.horn_gradient(rng.normal(0, 5, (40, 40)), CELL)
    assert (layers.window_std(layers.slope_deg(gx, gy), 5) > 0).all()


def test_local_relief_on_plane_and_bowl():
    relief = layers.local_relief(plane(0.1, -0.07), CELL, 500.0)
    assert relief.shape == (40 - 14, 40 - 14)
    np.testing.assert_allclose(relief, 0, atol=1e-9)  # slope is not crater depth
    r = np.hypot(*np.meshgrid(CELL * (np.arange(41) - 20), CELL * (np.arange(41) - 20)))
    bowl = np.where(r < 300, -200.0, 0.0)
    assert layers.local_relief(bowl, CELL, 500.0)[13, 13] == pytest.approx(200.0)
    # The same bowl on a 5.7 deg tilt keeps its depth.
    tilted = bowl + plane(0.1, 0.0, 41)
    assert layers.local_relief(tilted, CELL, 500.0)[13, 13] == pytest.approx(200.0)


@pytest.mark.parametrize(
    "x,y,a,b,expect",
    [
        (0.0, 50_000.0, 0.0, 0.1, 180.0),  # on 0 E, north is +y; rising north faces south
        (0.0, 50_000.0, 0.1, 0.0, 270.0),  # on 0 E, east is +x; rising east faces west
        (50_000.0, 0.0, 0.1, 0.0, 180.0),  # on 90 E, north is +x
        (0.0, -50_000.0, 0.0, 0.1, 0.0),  # on 180 E, north is -y; rising +y faces north
    ],
)
def test_aspect_on_known_meridians(x, y, a, b, expect):
    got = float(layers.aspect_deg(np.array(a), np.array(b), np.array(x), np.array(y)))
    assert got == pytest.approx(expect, abs=1e-9)


def test_aspect_agrees_with_coords_bearing():
    # Step 1 m downhill on the map, convert both ends to lat/lon, compare the bearing.
    x, y, gx, gy = -38_000.0, 90_501.0, 0.02, -0.07
    asp = float(layers.aspect_deg(np.array(gx), np.array(gy), np.array(x), np.array(y)))
    g = math.hypot(gx, gy)
    lat1, lon1 = (math.radians(v) for v in coords.to_latlon(x, y))
    lat2, lon2 = (math.radians(v) for v in coords.to_latlon(x - gx / g, y - gy / g))
    dl = lon2 - lon1
    bearing = math.degrees(
        math.atan2(
            math.sin(dl) * math.cos(lat2),
            math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dl),
        )
    )
    assert (bearing - asp + 180) % 360 - 180 == pytest.approx(0, abs=1e-3)


def test_flat_aspect_is_zero():
    assert float(layers.aspect_deg(np.array(0.0), np.array(0.0), np.array(1.0), np.array(1.0))) == 0


def test_compute_aggregates_and_keeps_steep_patch():
    n = 2 * layers.MARGIN_PX + 20
    z = plane(0.01, 0.0, n)
    z[n // 2, n // 2] += 100  # one sharp 80 m spike
    out, gx0, gy0 = layers.compute(z, 0.0, 0.0, CELL, 160.0)
    assert set(out) == set(layers.LAYERS) and out["elev_m"].shape == (10, 10)
    assert gx0 == gy0 == layers.MARGIN_PX * CELL + 40
    flat = math.degrees(math.atan(0.01))
    assert out["slope_deg"].min() == pytest.approx(flat, abs=1e-4)
    # Max, not mean, of the 2 x 2: the steepest 80 m slope survives aggregation.
    fine = layers.slope_deg(*layers.horn_gradient(z, CELL))
    k = layers.MARGIN_PX - 1
    fine = fine[k : fine.shape[0] - k, k : fine.shape[1] - k]
    assert out["slope_deg"].max() == pytest.approx(fine.max(), rel=1e-6)
    assert out["slope_deg"].max() > fine.reshape(10, 2, 10, 2).mean(axis=(1, 3)).max()
    # elev_m at a cell centre equals the plane there (mean of the 2 x 2 around it).
    np.testing.assert_allclose(out["elev_m"][0, 0], 0.01 * gx0, atol=1e-3)


def test_compute_rejects_non_multiple_cell():
    with pytest.raises(ValueError, match="multiple"):
        layers.compute(plane(0, 0, 36), 0, 0, CELL, 100.0)


def test_write_grid_layout_and_schema(tmp_path):
    lay = {n: np.full((3, 4), i, np.float32) for i, n in enumerate(layers.LAYERS)}
    header = {
        "schema_version": 1, "generated_at": "2026-11-14T00:00:00Z",
        "source_urls": [pgda.URL], "region": "r", "crs": "polar-stereo-south",
        "crs_params": {"lat_0": -90, "lon_0": 0, "radius_m": 1737400},
        "x0": 0.0, "y0": 0.0, "cell_m": 160.0, "nx": 4, "ny": 3, "bins": 64,
    }  # fmt: skip
    layers.write_grid(tmp_path / "r.bin", lay, header)
    h = json.loads((tmp_path / "r.json").read_text())
    schemas.validate("grid", h)
    raw = np.frombuffer((tmp_path / "r.bin").read_bytes(), "<f4")
    assert raw.size == 5 * 12
    for i, name in enumerate(layers.LAYERS):
        info = h["layer_info"][name]
        part = raw[info["byte_offset"] // 4 : (info["byte_offset"] + info["byte_length"]) // 4]
        assert (part == i).all()
    lay["slope_deg"][0, 0] = np.nan
    with pytest.raises(ValueError, match="nonfinite"):
        layers.write_grid(tmp_path / "bad.bin", lay, header)


def test_run_end_to_end(tmp_path, monkeypatch, capsys):
    n, pix = 120, 80.0
    left = n / 2 * pix
    xs = -left + pix * (np.arange(n) + 0.5)
    ys = left - pix * (np.arange(n) + 0.5)
    data = (0.02 * xs[None, :] + 0.0 * ys[:, None] + 500).astype(np.float32)
    raw = tmp_path / "raw"
    raw.mkdir()
    crs = "+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +R=1737400 +units=m +no_defs"
    with rasterio.open(
        raw / pgda.FILENAME, "w", driver="GTiff", width=n, height=n, count=1,
        dtype="float32", crs=crs, transform=from_origin(-left, left, pix, pix),
    ) as ds:  # fmt: skip
        ds.write(data, 1)
    cfg = load_config()
    region = Region(lat=-89.99, lon=0.0, source_url="https://example.test/s", confirmed=False)
    cfg = replace(
        cfg,
        paths=replace(cfg.paths, raw=raw, out=tmp_path / "out"),
        regions=MappingProxyType({"t": region}),
    )
    monkeypatch.setattr(tiles, "NEAR_HALF_M", 1600)
    layers.run(cfg)
    h = json.loads((tmp_path / "out/grid/t.json").read_text())
    schemas.validate("grid", h)
    assert (h["nx"], h["ny"], h["cell_m"], h["layers"]) == (20, 20, 160, list(layers.LAYERS))
    assert region.source_url in h["source_urls"]
    assert "slope 1.1..1.1 deg" in capsys.readouterr().out
