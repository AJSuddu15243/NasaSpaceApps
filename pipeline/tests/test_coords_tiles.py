"""PIPE-4: stereographic conversions on known points; tile cutting on a synthetic plane DEM."""

import json
import math
from dataclasses import replace
from types import MappingProxyType

import numpy as np
import pytest
import rasterio
from rasterio.transform import from_origin

from lunar_pipeline import coords, schemas
from lunar_pipeline.binio import read_array
from lunar_pipeline.config import Region, load_config
from lunar_pipeline.terrain import pgda, tiles

R = coords.RADIUS_M
CRS = "+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +R=1737400 +units=m +no_defs"
N, PIX = 120, 80.0
A, B, C = 0.01, -0.02, 1500.0  # plane z = A x + B y + C (m)


def test_pole_is_origin():
    x, y = coords.to_xy(-90.0, 123.0)
    assert abs(x) < 1e-6 and abs(y) < 1e-6
    assert coords.to_latlon(0.0, 0.0)[0] == -90.0


def test_85s_0e_lies_on_plus_y():
    x, y = coords.to_xy(-85.0, 0.0)
    assert abs(x) < 1e-6
    assert y == pytest.approx(2 * R * math.tan(math.radians(2.5)), abs=1e-6)  # 151.7 km


def test_axes_match_pgda_file():
    # +x is 90 E; 80 S is the DEM half-width 304.0 km (pipeline/notes/pipe-3.md).
    x, y = coords.to_xy(-80.0, 90.0)
    assert x == pytest.approx(304_000, abs=100) and abs(y) < 1e-6
    # Region centres measured through the file CRS with rasterio (notes/pipe-3.md).
    assert coords.to_xy(-86.7639, -22.777) == pytest.approx((-38000, 90501), abs=1)
    assert coords.to_xy(-85.9948, -0.23578) == pytest.approx((-500, 121500), abs=1)


def test_round_trip_and_vectorized():
    lat = np.array([-89.4632, -86.7639, -80.0, -85.0])
    lon = np.array([-137.49, -22.777, 179.9, 45.0])
    back_lat, back_lon = coords.to_latlon(*coords.to_xy(lat, lon))
    np.testing.assert_allclose(back_lat, lat, atol=1e-9)
    np.testing.assert_allclose(back_lon, lon, atol=1e-9)


def test_northern_hemisphere_is_rejected():
    with pytest.raises(ValueError, match="lat"):
        coords.to_xy(10.0, 0.0)


@pytest.fixture
def dem(tmp_path):
    path = tmp_path / pgda.FILENAME
    left = top = N / 2 * PIX
    xs = -left + PIX * (np.arange(N) + 0.5)
    ys = top - PIX * (np.arange(N) + 0.5)  # row 0 is the top, like the PGDA file
    data = (A * xs[None, :] + B * ys[:, None] + C).astype(np.float32)
    with rasterio.open(
        path,
        "w",
        driver="GTiff",
        width=N,
        height=N,
        count=1,
        dtype="float32",
        crs=CRS,
        transform=from_origin(-left, top, PIX, PIX),
    ) as ds:
        ds.write(data, 1)
    return path


def _plane_ok(tile, x0, y0, cell):
    rows, cols = np.indices(tile.shape)
    expect = A * (x0 + cols * cell) + B * (y0 + rows * cell) + C
    np.testing.assert_allclose(tile, expect, atol=1e-3)


@pytest.mark.parametrize("cell", [80.0, 240.0])
def test_cut_orientation_alignment_and_block_mean(dem, cell):
    with rasterio.open(dem) as ds:
        tile, x0, y0 = tiles.cut(ds, 400.0, -1000.0, 2400.0, cell)
    side = round(4800 / cell)
    assert tile.shape == (side, side) and tile.dtype == np.float32
    # Cell centres sit on the source pixel grid (or its 3x3 block centres).
    assert (x0 - cell / 2 + N / 2 * PIX) % PIX == 0
    assert (y0 - cell / 2 + N / 2 * PIX) % PIX == 0
    _plane_ok(tile, x0, y0, cell)


def test_rows_grow_with_plus_y(dem):
    with rasterio.open(dem) as ds:
        tile, _, _ = tiles.cut(ds, 0.0, 0.0, 800.0, 80.0)
    assert tile[-1, 0] - tile[0, 0] == pytest.approx(B * 80 * (tile.shape[0] - 1), abs=1e-3)


def test_cut_rejects_window_outside_dem(dem):
    with rasterio.open(dem) as ds, pytest.raises(ValueError, match="extent"):
        tiles.cut(ds, 4000.0, 0.0, 2400.0, 240.0)


def test_cut_rejects_non_multiple_cell(dem):
    with rasterio.open(dem) as ds, pytest.raises(ValueError, match="multiple"):
        tiles.cut(ds, 0.0, 0.0, 800.0, 100.0)


def test_cut_rejects_nodata(tmp_path):
    path = tmp_path / "nan.tif"
    data = np.zeros((N, N), np.float32)
    data[60, 60] = np.nan
    with rasterio.open(
        path,
        "w",
        driver="GTiff",
        width=N,
        height=N,
        count=1,
        dtype="float32",
        crs=CRS,
        transform=from_origin(-4800, 4800, PIX, PIX),
    ) as ds:
        ds.write(data, 1)
    with rasterio.open(path) as ds, pytest.raises(ValueError, match="nodata"):
        tiles.cut(ds, 0.0, 0.0, 800.0, 80.0)


def test_run_writes_far_pipeline_only_and_near_shipped(dem, tmp_path, monkeypatch, capsys):
    cfg = load_config()
    region = Region(lat=-89.99, lon=0.0, source_url="https://example.test/site", confirmed=False)
    raw, out = dem.parent / "raw", tmp_path / "out"
    raw.mkdir()
    dem.rename(raw / pgda.FILENAME)
    cfg = replace(
        cfg,
        terrain=replace(cfg.terrain, max_distance_km=2.16),
        paths=replace(cfg.paths, raw=raw, out=out),
        regions=MappingProxyType({"test-site": region}),
    )
    monkeypatch.setattr(tiles, "NEAR_HALF_M", 800)
    monkeypatch.setattr(tiles, "FAR_MARGIN_M", 240)  # far half-width = 2160 + 240 = 2400 m
    tiles.run(cfg)
    far, far_h = read_array(tmp_path / "tiles" / "test-site_240m.bin")
    near, near_h = read_array(out / "tiles" / "test-site_80m.bin")
    assert far.shape == (20, 20) and near.shape == (20, 20)
    for tile, h in ((far, far_h), (near, near_h)):
        schemas.validate("tile", h)
        assert h["region"] == "test-site" and h["units"] == "m" and h["nodata"] is None
        assert pgda.URL in h["source_urls"] and region.source_url in h["source_urls"]
        _plane_ok(np.asarray(tile), h["x0"], h["y0"], h["cell_m"])
    assert not (out / "tiles" / "test-site_240m.bin").exists()  # far field stays pipeline-only
    assert json.loads((out / "tiles" / "test-site_80m.json").read_text())["cell_m"] == 80


def test_run_needs_the_dem(tmp_path):
    cfg = load_config()
    cfg = replace(cfg, paths=replace(cfg.paths, raw=tmp_path))
    with pytest.raises(FileNotFoundError, match="terrain-fetch"):
        tiles.run(cfg)
