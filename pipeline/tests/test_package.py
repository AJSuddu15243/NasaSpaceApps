"""PIPE-9: manifest over shipped files, citations, size budget."""

import hashlib
import json
from dataclasses import replace

import pytest

from lunar_pipeline import package, schemas
from lunar_pipeline.config import load_config

A = "https://pgda.gsfc.nasa.gov/products/90"
B = "https://ssd.jpl.nasa.gov/api/horizons.api"


@pytest.fixture
def out(tmp_path):
    (tmp_path / "grid").mkdir()
    (tmp_path / "grid/r.bin").write_bytes(b"\x00" * 40)
    (tmp_path / "grid/r.json").write_text(json.dumps({"source_urls": [A]}))
    (tmp_path / "sites.json").write_text(
        json.dumps(
            [
                {"id": "a", "source_url": B},
                {"id": "b", "source_url": B},
                {"id": "c", "source_url": A},
            ]
        )
    )
    (tmp_path / "imagery.webp").write_bytes(b"RIFF....WEBP")
    (tmp_path / "imagery.json").write_text(json.dumps({"source_urls": [B]}))
    (tmp_path / ".DS_Store").write_bytes(b"junk")
    (tmp_path / "manifest.json").write_text("{}")  # stale manifest is replaced, never listed
    return tmp_path


def test_manifest_lists_files_with_hashes_and_sources(out):
    m = package.build(out, 10_000)
    schemas.validate("manifest", m)
    by_path = {f["path"]: f for f in m["files"]}
    assert list(by_path) == [
        "grid/r.bin",
        "grid/r.json",
        "imagery.json",
        "imagery.webp",
        "sites.json",
    ]
    assert by_path["grid/r.bin"]["bytes"] == 40
    assert by_path["grid/r.bin"]["sha256"] == hashlib.sha256(b"\x00" * 40).hexdigest()
    assert by_path["grid/r.bin"]["source_urls"] == [A]  # from the sibling header
    assert by_path["imagery.webp"]["source_urls"] == [B]
    assert by_path["sites.json"]["source_urls"] == [B, A]  # unique, first-seen order


def test_budget_fails_before_writing(out):
    with pytest.raises(ValueError, match="exceeds"):
        package.build(out, 50)


def test_uncited_file_fails(out):
    (out / "orphan.bin").write_bytes(b"1234")
    with pytest.raises(ValueError, match="orphan.bin: no source_urls"):
        package.build(out, 10_000)


def test_run_writes_manifest_and_is_idempotent(out, capsys):
    cfg = load_config()
    cfg = replace(cfg, paths=replace(cfg.paths, out=out))
    package.run(cfg)
    first = json.loads((out / "manifest.json").read_text())
    package.run(cfg)
    second = json.loads((out / "manifest.json").read_text())
    assert [f["path"] for f in first["files"]] == [f["path"] for f in second["files"]]
    assert first["files"] == second["files"]
    text = capsys.readouterr().out
    assert "5 files" in text and f"cite {A}" in text and f"cite {B}" in text
