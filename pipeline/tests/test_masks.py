"""PIPE-8 masks stage: bin argv, the bin-count guard, sites.json rewrite-on-change."""

import os
from dataclasses import replace

import pytest

from lunar_pipeline import masks
from lunar_pipeline.config import load_config


@pytest.fixture
def cfg(tmp_path):
    base = load_config()
    raw, cache, out = tmp_path / "raw" / "dem", tmp_path / "cache", tmp_path / "out"
    paths = replace(base.paths, raw=raw, cache=cache, out=out)
    return replace(base, paths=paths)


def test_command_argv(cfg, tmp_path):
    argv = masks.command(cfg, "haworth", tmp_path / "s.json")
    flags = dict(zip(argv, argv[1:], strict=False))
    t = cfg.terrain
    assert argv[:6] == ["cargo", "run", "--release", "--quiet", "--bin", "masks"]
    assert flags["--region"] == "haworth"
    assert flags["--sites"] == str(tmp_path / "s.json")
    assert flags["--out"] == str(tmp_path / "out")
    assert flags["--near"] == str(tmp_path / "out" / "tiles" / f"haworth_{t.near_field_m:g}m.json")
    assert flags["--far"] == str(tmp_path / "raw" / "tiles" / f"haworth_{t.far_field_m:g}m.json")
    assert flags["--grid"] == str(tmp_path / "out" / "grid" / "haworth.json")
    assert flags["--max-km"] == f"{t.max_distance_km:g}"
    assert flags["--observer-m"] == "2"


def test_run_rejects_other_bin_counts(cfg):
    with pytest.raises(ValueError, match="360 site bins"):
        masks.run(replace(cfg, masks=replace(cfg.masks, site_bins=180)))


def test_unchanged_sites_json_keeps_its_mtime(cfg, monkeypatch):
    calls = []
    monkeypatch.setattr(masks.subprocess, "run", lambda argv, check: calls.append(argv))
    monkeypatch.setattr(masks.schemas, "validate", lambda kind, doc: None)
    grid = cfg.paths.out / "grid"
    grid.mkdir(parents=True)
    for name in cfg.regions:
        (grid / f"{name}.json").write_text("{}")
    masks.run(cfg)
    sites = cfg.paths.cache / "masks" / "sites.json"
    os.utime(sites, (1_000_000, 1_000_000))
    masks.run(cfg)
    assert sites.stat().st_mtime == 1_000_000
    assert len(calls) == 2 * len(cfg.regions)
