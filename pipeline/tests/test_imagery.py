"""PIPE-10: tile-index math, mosaic/crop orientation, size cap and run() on synthetic Trek tiles."""

import json
import math
import warnings
from dataclasses import replace

import numpy as np
import pytest
import requests
from rasterio.errors import NotGeoreferencedWarning
from rasterio.io import MemoryFile

from lunar_pipeline import schemas
from lunar_pipeline.config import Region, load_config
from lunar_pipeline.terrain import imagery

PX11 = imagery.pixel_m(11)
SPAN11 = PX11 * imagery.TILE_PX


def png(grey, alpha=None):
    bands = [grey] if alpha is None else [grey, alpha]
    with warnings.catch_warnings(), MemoryFile() as mem:
        warnings.simplefilter("ignore", NotGeoreferencedWarning)
        with mem.open(
            driver="PNG", width=grey.shape[1], height=grey.shape[0], count=len(bands), dtype="uint8"
        ) as ds:
            ds.write(np.stack(bands))
        return mem.read()


class Response:
    def __init__(self, body, status=200):
        self.content, self.status_code = body, status

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.HTTPError(response=self)

    def close(self):
        pass

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass


class Trek:
    """Fake transport: tile (row, col) is a constant grey (row * 7 + col) % 250 + 1, or 404."""

    def __init__(self, missing=()):
        self.missing, self.calls = set(missing), []

    def get(self, url, **kwargs):
        self.calls.append(url)
        level, row, col = (int(v) for v in url.removesuffix(".png").split("/")[-3:])
        assert level == imagery.LEVEL
        if (row, col) in self.missing:
            return Response(b"<html>404</html>", 404)
        value = (row * 7 + col) % 250 + 1
        return Response(png(np.full((256, 256), value, np.uint8)))


def test_tile_matrix_matches_capabilities():
    # ScaleDenominator * 0.28 mm from WMTSCapabilities.xml, levels 0 and 11.
    assert imagery.pixel_m(0) == pytest.approx(3.0578404017857101e07 * 0.00028)
    assert imagery.pixel_m(11) == pytest.approx(1.4930861336844288e04 * 0.00028)


def test_extent_matches_pipe4_near_field_tile():
    # PR #88 malapert-massif_80m.json: x0 -10440, y0 111560 (cell centres), 250 x 250 @ 80 m.
    x_min, x_max, y_min, y_max = imagery.extent(-85.9948, -0.23578)
    assert (x_min, y_min) == (-10440 - 40, 111560 - 40)
    assert (x_max - x_min, y_max - y_min) == (20000, 20000)


def test_tile_range_covers_extent_exactly():
    # An extent on tile edges needs exactly those tiles; one metre more needs one more.
    x0 = imagery.ORIGIN_X + 1000 * SPAN11
    y1 = imagery.ORIGIN_Y - 900 * SPAN11
    ext = (x0, x0 + 2 * SPAN11, y1 - 3 * SPAN11, y1)
    assert imagery.tile_range(*ext) == (900, 902, 1000, 1001)
    grown = (ext[0] - 1, ext[1] + 1, ext[2] - 1, ext[3] + 1)
    assert imagery.tile_range(*grown) == (899, 903, 999, 1002)


def test_tile_range_for_malapert_is_the_tile_we_fetched_live():
    # curl'd 2026-11-14: 11/910/1023 is the tile holding Malapert's centre (x -500, y 121500).
    row0, row1, col0, col1 = imagery.tile_range(*imagery.extent(-85.9948, -0.23578))
    assert row0 <= 910 <= row1 and col0 <= 1023 <= col1
    assert (row1 - row0 + 1, col1 - col0 + 1) == (19, 19)


def test_decode_turns_transparent_pixels_into_nodata():
    grey = np.full((256, 256), 9, np.uint8)
    alpha = np.full((256, 256), 255, np.uint8)
    alpha[0, :] = 0
    out = imagery.decode(png(grey, alpha))
    assert (out[0] == imagery.NODATA).all() and (out[1:] == 9).all()


def test_mosaic_and_crop_put_north_up_and_east_right(tmp_path):
    # Extent = 2 x 2 tiles at native pixel size, so crop is a pure copy.
    x0 = imagery.ORIGIN_X + 1000 * SPAN11
    y1 = imagery.ORIGIN_Y - 900 * SPAN11
    ext = (x0, x0 + 2 * SPAN11, y1 - 2 * SPAN11, y1)
    src, transform = imagery.mosaic(ext, tmp_path, Trek(missing={(901, 1001)}))
    out = imagery.crop(src, transform, ext, PX11)
    assert out.shape == (512, 512)
    value = lambda r, c: (r * 7 + c) % 250 + 1  # noqa: E731
    assert out[0, 0] == value(900, 1000)  # row 0 = y_max (+y, towards 0 E)
    assert out[0, -1] == value(900, 1001)  # columns grow with +x (90 E)
    assert out[-1, 0] == value(901, 1000)
    assert out[-1, -1] == imagery.NODATA  # 404 tile stays nodata


def test_crop_caps_size_and_averages_without_upsampling(tmp_path):
    x0 = imagery.ORIGIN_X + 1000 * SPAN11
    y1 = imagery.ORIGIN_Y - 900 * SPAN11
    ext = (x0, x0 + 2 * SPAN11, y1 - 2 * SPAN11, y1)
    src, transform = imagery.mosaic(ext, tmp_path, Trek())
    out = imagery.crop(src, transform, ext, PX11, max_px=128)  # 4 source px per output px
    assert out.shape == (128, 128)
    assert out[0, 0] == (900 * 7 + 1000) % 250 + 1
    # Never upsampled: a 100 px extent at native size gives 100 px even with a larger cap.
    small = (x0, x0 + 100 * PX11, y1 - 100 * PX11, y1)
    assert imagery.crop(src, transform, small, PX11).shape == (100, 100)


def test_webp_size_cap_steps_quality_then_fails():
    rng = np.random.default_rng(0)
    noise = rng.integers(1, 256, (512, 512), dtype=np.uint8)
    body, quality = imagery.encode_webp(noise, 10**7)
    assert body[:4] == b"RIFF" and body[8:12] == b"WEBP"
    assert quality == imagery.QUALITIES[0]
    smallest, q = imagery.encode_webp(noise, len(body) - 1)
    assert q < quality and len(smallest) < len(body)
    with pytest.raises(ValueError, match="over"):
        imagery.encode_webp(noise, 1000)


def test_run_writes_schema_valid_sidecar_and_webp(tmp_path, monkeypatch):
    monkeypatch.setattr(imagery, "MAX_PX", 64)
    cfg = load_config()
    region = Region(lat=-85.9948, lon=-0.23578, source_url="https://example.test", confirmed=False)
    cfg = replace(
        cfg,
        regions={"demo": region},
        paths=replace(cfg.paths, out=tmp_path / "out", cache=tmp_path / "cache"),
    )
    trek = Trek()
    imagery.run(cfg, session=trek)
    head = json.loads((tmp_path / "out/imagery/demo.json").read_text())
    schemas.validate("imagery", head)
    assert head["source_urls"][0].startswith("https://trek.nasa.gov/tiles/Moon/SP/")
    assert (head["width"], head["height"], head["row0"]) == (64, 64, "y_max")
    assert head["pixel_m"] == pytest.approx(20000 / 64)
    assert head["pixel_m"] >= head["source_pixel_m"]
    assert (head["x_min"], head["y_min"]) == (-10480, 111520)
    webp = (tmp_path / "out/imagery/demo.webp").read_bytes()
    assert webp[8:12] == b"WEBP"
    with MemoryFile(webp) as mem, mem.open() as ds:
        assert (ds.width, ds.height, ds.count) == (64, 64, 3)
    calls = len(trek.calls)
    assert calls == math.prod(
        (b - a + 1)
        for a, b in np.reshape(imagery.tile_range(*imagery.extent(-85.9948, -0.23578)), (2, 2))
    )
    imagery.run(cfg, session=trek)  # second run is served from the cache
    assert len(trek.calls) == calls
