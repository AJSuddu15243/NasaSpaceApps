"""PIPE-8: run the engine's native horizon mask builder (ENG-3, engine/src/bin/masks.rs) per region.

Per config region the builder writes masks/{id}.json (360 bins) for every site inside the region's
near tile, and the 64-bin `mask` layer of every cell into grid/{region}.bin/.json. Sites come from
config regions (the bin is std-only, so it reads JSON, not YAML), with lat/lon passed through
verbatim. Must run after `layers`, which rewrites the grid without the mask; the bin skips a region
whose outputs are newer than its inputs. Observer height 2 m above the DEM (docs/METHODS.md).
"""

import json
import subprocess

from lunar_pipeline import schemas
from lunar_pipeline.config import REPO_ROOT, Config

OBSERVER_M = 2.0


def command(cfg: Config, name: str, sites) -> list[str]:
    out, t = cfg.paths.out, cfg.terrain
    return [
        *("cargo", "run", "--release", "--quiet", "--bin", "masks"),
        *("--manifest-path", str(REPO_ROOT / "engine/Cargo.toml"), "--"),
        *("--region", name, "--sites", str(sites), "--out", str(out)),
        *("--near", str(out / "tiles" / f"{name}_{t.near_field_m:g}m.json")),
        *("--far", str(cfg.paths.raw.parent / "tiles" / f"{name}_{t.far_field_m:g}m.json")),
        *("--grid", str(out / "grid" / f"{name}.json")),
        *("--max-km", f"{t.max_distance_km:g}", "--observer-m", f"{OBSERVER_M:g}"),
    ]


def run(cfg: Config) -> None:
    if (cfg.masks.site_bins, cfg.masks.grid_bins) != (360, 64):
        raise ValueError("masks: the builder writes 360 site bins and 64 grid bins (schema consts)")
    sites = cfg.paths.cache / "masks" / "sites.json"
    text = json.dumps([{"id": n, "lat": r.lat, "lon": r.lon} for n, r in cfg.regions.items()])
    # Rewrite only on change: its mtime is an input of the bin's up-to-date check.
    if not sites.exists() or sites.read_text() != text:
        sites.parent.mkdir(parents=True, exist_ok=True)
        sites.write_text(text)
    for name in cfg.regions:
        subprocess.run(command(cfg, name, sites), check=True)
        schemas.validate("grid", json.loads((cfg.paths.out / "grid" / f"{name}.json").read_text()))
        mask = cfg.paths.out / "masks" / f"{name}.json"
        if mask.exists():
            schemas.validate("site-mask", json.loads(mask.read_text()))
