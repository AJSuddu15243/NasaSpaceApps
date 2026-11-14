from dataclasses import FrozenInstanceError
from datetime import timedelta

import pytest
import yaml

from lunar_pipeline.config import REPO_ROOT, ConfigError, load_config


@pytest.fixture
def raw():
    return yaml.safe_load((REPO_ROOT / "pipeline/config.yaml").read_text())


def save(tmp_path, raw):
    path = tmp_path / "config.yaml"
    path.write_text(yaml.safe_dump(raw))
    return path


def test_cwd_cannot_redirect_outputs(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    cfg = load_config()
    assert cfg.paths.raw == REPO_ROOT / "pipeline/data/raw"
    assert cfg.paths.cache == REPO_ROOT / "pipeline/data/cache"
    assert cfg.paths.out == REPO_ROOT / "web/public/data"
    assert (cfg.ephemeris.end - cfg.ephemeris.start) / timedelta(hours=1) + 1 == 43824
    assert cfg.moon_radius_m == 1737400
    assert cfg.terrain.far_field_m == 240
    assert cfg.terrain.near_field_m == 80
    assert cfg.terrain.heatmap_cell_m == 160
    assert cfg.terrain.max_distance_km == 150
    assert (cfg.masks.site_bins, cfg.masks.grid_bins) == (360, 64)
    assert cfg.data_budget_mb == 25
    with pytest.raises(FrozenInstanceError):
        cfg.moon_radius_m = 1
    with pytest.raises(TypeError):
        cfg.regions["fake"] = cfg.regions["haworth"]


@pytest.mark.parametrize("group", [None, "ephemeris", "terrain", "masks", "paths"])
@pytest.mark.parametrize("mode", ["missing", "unknown"])
def test_misspelled_keys_cannot_silently_default(raw, tmp_path, group, mode):
    obj = raw if group is None else raw[group]
    key = next(iter(obj)) if mode == "missing" else "typo"
    if mode == "missing":
        del obj[key]
    else:
        obj[key] = 1
    with pytest.raises(ConfigError, match=(group + "." if group else "") + key):
        load_config(save(tmp_path, raw))


@pytest.mark.parametrize("value", ["2026-01-01", "2026-01-01T00:00", "2026-01-01T00:00+01:00", 1])
def test_naive_or_non_utc_time_is_rejected(raw, tmp_path, value):
    raw["ephemeris"]["start"] = value
    with pytest.raises(ConfigError, match="ephemeris.start"):
        load_config(save(tmp_path, raw))


@pytest.mark.parametrize("value", [True, 0, -1, float("nan"), float("inf"), "240"])
def test_invalid_resolution_is_not_coerced(raw, tmp_path, value):
    raw["terrain"]["far_field_m"] = value
    with pytest.raises(ConfigError, match="terrain.far_field_m"):
        load_config(save(tmp_path, raw))


def test_nested_region_error_names_key(raw, tmp_path):
    raw["regions"]["haworth"]["lon"] = 181
    with pytest.raises(ConfigError, match="regions.haworth.lon"):
        load_config(save(tmp_path, raw))


def test_duplicate_yaml_key_cannot_overwrite_configuration(tmp_path):
    path = tmp_path / "bad.yaml"
    path.write_text("moon_radius_m: 1\nmoon_radius_m: 2\n")
    with pytest.raises(ConfigError, match="moon_radius_m: duplicate"):
        load_config(path)


def test_alternate_config_does_not_rebase_data_paths(raw, tmp_path):
    raw["moon_radius_m"] = 1234
    cfg = load_config(save(tmp_path, raw))
    assert cfg.moon_radius_m == 1234
    assert cfg.paths.raw == REPO_ROOT / "pipeline/data/raw"
