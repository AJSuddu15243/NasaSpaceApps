import numpy as np

from lunar_pipeline.terrain.science import block_mean


def test_block_mean_averages_source_pixels_into_cells():
    # 160 m grid, 2 x 2 cells centred at (0, 0), (160, 0), (0, 160), (160, 160).
    px = np.array([-50.0, 50.0, 150.0, 200.0, 10.0, 300.0])
    py = np.array([0.0, 10.0, 0.0, 0.0, 170.0, 500.0])  # last point is outside the grid
    vals = np.array([0.0, 1.0, 0.5, np.nan, 1.0, 9.0])
    out = block_mean(vals, px, py, 0.0, 0.0, 160.0, 2, 2)
    assert out.shape == (2, 2)
    assert out[0, 0] == 0.5  # mean of 0 and 1
    assert out[0, 1] == 0.5  # NaN source ignored
    assert out[1, 0] == 1.0  # row grows with +y
    assert np.isnan(out[1, 1])  # no source pixel


def test_north_up_source_cannot_silently_flip_target_rows():
    from rasterio.io import MemoryFile
    from rasterio.transform import from_origin

    from lunar_pipeline.terrain.science import resample

    with MemoryFile() as mem:
        with mem.open(
            driver="GTiff",
            width=4,
            height=4,
            count=1,
            dtype="int16",
            transform=from_origin(-80, 240, 80, 80),
            nodata=-999,
        ) as ds:
            ds.write(
                np.array(
                    [[8, 8, 6, 6], [8, 8, 6, 6], [2, 2, -999, -999], [2, 2, -999, -999]],
                    dtype="int16",
                ),
                1,
            )
            ds.scales = (0.1,)
            ds.offsets = (0.05,)
            out = resample(ds, 0, 0, 160, 2, 2)
            assert np.isclose(out[0, 0], 0.25)
            assert np.isclose(out[1, 0], 0.85)
            assert np.isclose(out[1, 1], 0.65)
            assert np.isnan(out[0, 1])


def test_ice_reprojection_does_not_invent_favorability_for_nodata():
    from rasterio.io import MemoryFile
    from rasterio.transform import from_origin

    from lunar_pipeline.terrain.science import TARGET_CRS, resample_ice

    with MemoryFile() as mem:
        with mem.open(
            driver="GTiff",
            width=2,
            height=2,
            count=1,
            dtype="float32",
            transform=from_origin(-80, 240, 160, 160),
            crs=TARGET_CRS,
            nodata=-9999,
        ) as ds:
            ds.write(np.array([[0.8, 0.6], [0.2, -9999]], dtype="float32"), 1)
            out = resample_ice(ds, 0, 0, 160, 2, 2)
            assert np.isclose(out[0, 0], 0.2)
            assert np.isclose(out[1, 0], 0.8)
            assert out[0, 1] == -9999
