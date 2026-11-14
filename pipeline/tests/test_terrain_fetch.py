"""PIPE-3: describe/locate on a synthetic polar-stereographic GeoTIFF; offline fetch wiring."""

import math
from dataclasses import replace

import numpy as np
import pytest
import rasterio
from rasterio.transform import from_origin

from lunar_pipeline import fetch
from lunar_pipeline.config import load_config
from lunar_pipeline.terrain import pgda, trek

R = 1737400.0
CRS = "+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +R=1737400 +units=m +no_defs"
N, PIX = 21, 1000.0  # 21 x 21 km, pole at the centre of pixel (10, 10)


@pytest.fixture
def tif(tmp_path):
    path = tmp_path / "synthetic.tif"
    data = np.arange(N * N, dtype=np.float32).reshape(N, N) - 200.0
    data[0, 0] = -9999.0
    with rasterio.open(
        path,
        "w",
        driver="GTiff",
        width=N,
        height=N,
        count=1,
        dtype="float32",
        crs=CRS,
        transform=from_origin(-N / 2 * PIX, N / 2 * PIX, PIX, PIX),
        nodata=-9999.0,
        tiled=True,
        blockxsize=16,
        blockysize=16,  # 21 px forces partial edge blocks in streaming stats
    ) as ds:
        ds.write(data, 1)
        ds.update_tags(1, UNITS="m")
    return path


def test_describe_reads_geometry_and_values_from_metadata(tif, capsys):
    info = pgda.describe(tif)
    assert (info["width"], info["height"]) == (N, N)
    assert info["pixel_size_m"] == (PIX, PIX)
    assert info["extent_m"] == (-10500.0, -10500.0, 10500.0, 10500.0)
    assert info["dtype"] == "float32" and info["nodata"] == -9999.0
    assert info["scales"] == (1.0,) and info["offsets"] == (0.0,)
    assert info["radius_m"] == R
    # South polar stereographic, lon_0 = 0: +y points to 0 E, +x to 90 E.
    assert info["lon_plus_x_deg"] == pytest.approx(90.0)
    assert info["lon_plus_y_deg"] == pytest.approx(0.0)
    # Streaming min/max skip nodata: values -199..240 (cell 0 is nodata).
    assert (info["min_m"], info["max_m"]) == (-199.0, 240.0)
    assert "PROJCRS" in info["crs_wkt"] or "PROJCS" in info["crs_wkt"]
    assert "lon_plus_x_deg" in capsys.readouterr().out


def test_locate_maps_lat_lon_to_pixel(tif):
    with rasterio.open(tif) as ds:
        assert pgda.locate(ds, -90.0, 0.0) == (10, 10)
        # 5 km along +x (90 E): rho = 2 R tan(colat / 2) = 5000 m.
        lat = -90.0 + math.degrees(2 * math.atan(5000.0 / (2 * R)))
        assert pgda.locate(ds, lat, 90.0) == (10, 15)
        assert pgda.locate(ds, lat, 0.0) == (5, 10)  # +y is up, rows count down
        assert pgda.locate(ds, -80.0, 0.0) is None  # ~304 km out, outside the 21 km raster


def test_window_stats_ignore_nodata(tif):
    with rasterio.open(tif) as ds:
        lo, hi = pgda.disk_minmax(ds, -90.0, 0.0, r_in_m=0.0, r_out_m=1200.0)
    # Pixel centres within 1.2 km of the pole: centre plus 4 edge neighbours (value = index - 200).
    assert (lo, hi) == (220.0 - N - 200.0, 220.0 + N - 200.0)


def test_terrain_fetch_downloads_pinned_file_into_raw(monkeypatch, tmp_path, capsys):
    cfg = load_config()
    cfg = replace(cfg, paths=replace(cfg.paths, raw=tmp_path))
    calls = []

    def fake_download(url, path, sha256):
        calls.append((url, path, sha256))
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(b"x" * pgda.SIZE_BYTES)
        return path

    monkeypatch.setattr(fetch, "download", fake_download)
    monkeypatch.setattr(pgda, "describe", lambda path: {})
    monkeypatch.setattr(pgda, "check", lambda path, cfg: {})
    trek.run(cfg)
    assert calls == [(pgda.URL, tmp_path / pgda.FILENAME, pgda.SHA256)]
    assert "downloading" in capsys.readouterr().out
    trek.run(cfg)
    assert "already present" in capsys.readouterr().out


def test_size_mismatch_is_an_error(monkeypatch, tmp_path):
    def short_download(url, path, sha256):
        path.write_bytes(b"x")
        return path

    monkeypatch.setattr(fetch, "download", short_download)
    cfg = load_config()
    with pytest.raises(ValueError, match="size"):
        pgda.fetch(replace(cfg, paths=replace(cfg.paths, raw=tmp_path)))


def test_pin_is_well_formed():
    assert len(pgda.SHA256) == 64 and int(pgda.SHA256, 16) >= 0
    assert pgda.URL.startswith("https://pgda.gsfc.nasa.gov/") and pgda.URL.endswith(pgda.FILENAME)
