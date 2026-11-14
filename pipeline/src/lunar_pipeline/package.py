"""PIPE-9: manifest.json (contract `manifest`) over every shipped file + the 25 MB size budget.

Sources per file: a JSON's own `source_urls` (or the `source_url` of each entry, for sites.json);
any other file (.bin, imagery) takes them from the sibling `{stem}.json` header. A file without a
citation fails the run (pipeline/AGENTS.md: cite every source). The budget counts raw bytes;
Vercel compresses on the fly (decided with Ananth 2026-11-14: no precompressed .br files).
"""

import hashlib
import json
from datetime import UTC, datetime
from pathlib import Path

from lunar_pipeline import schemas
from lunar_pipeline.config import Config

MANIFEST = "manifest.json"


def _urls(doc):
    if isinstance(doc, dict) and isinstance(doc.get("source_urls"), list):
        return doc["source_urls"]
    if isinstance(doc, list):  # sites.json: one source_url per entry
        return list(
            dict.fromkeys(e["source_url"] for e in doc if isinstance(e, dict) and "source_url" in e)
        )
    return []


def sources(path: Path) -> list[str]:
    own = path if path.suffix == ".json" else path.with_suffix(".json")
    urls = _urls(json.loads(own.read_text())) if own.exists() else []
    if not urls:
        raise ValueError(f"{path}: no source_urls (in the file or a sibling {own.name})")
    return urls


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def shipped(out: Path) -> list[Path]:
    """Every file the site serves from out, excluding the manifest and dotfiles (.DS_Store)."""
    return sorted(
        p
        for p in out.rglob("*")
        if p.is_file()
        and p.relative_to(out).as_posix() != MANIFEST
        and not any(part.startswith(".") for part in p.relative_to(out).parts)
    )


def build(out: Path, budget_bytes: int) -> dict:
    files = shipped(out)
    manifest = {
        "schema_version": 1,
        "generated_at": datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "files": [
            {
                "path": p.relative_to(out).as_posix(),
                "bytes": p.stat().st_size,
                "sha256": sha256(p),
                "source_urls": sources(p),
            }
            for p in files
        ],
    }
    schemas.validate("manifest", manifest)
    # The manifest is shipped too, so its own bytes count against the budget.
    total = sum(f["bytes"] for f in manifest["files"]) + len(encode(manifest))
    if total > budget_bytes:
        largest = sorted(manifest["files"], key=lambda f: -f["bytes"])[:5]
        top = ", ".join(f"{f['path']} {f['bytes']:,}" for f in largest)
        raise ValueError(
            f"{out}: {total:,} bytes exceeds the {budget_bytes:,} budget; largest: {top}"
        )
    return manifest


def encode(manifest: dict) -> bytes:
    return (json.dumps(manifest, indent=2) + "\n").encode()


def run(cfg: Config) -> None:
    out = cfg.paths.out
    budget = int(cfg.data_budget_mb * 1_000_000)  # decimal MB: the stricter reading of "25 MB"
    manifest = build(out, budget)
    (out / MANIFEST).write_bytes(encode(manifest))
    total = sum(f["bytes"] for f in manifest["files"]) + (out / MANIFEST).stat().st_size
    cites = dict.fromkeys(u for f in manifest["files"] for u in f["source_urls"])
    print(
        f"package: {len(manifest['files'])} files, {total:,} / {budget:,} bytes "
        f"({total / budget:.0%} of budget), {len(cites)} distinct sources"
    )
    for url in cites:
        print(f"package: cite {url}")
