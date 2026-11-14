"""PIPE-3: terrain-fetch. Moon Trek / QuickMap serve rendered tiles, not numeric heights for an
extent (see pipeline/README.md "Terrain sources"), so analysis terrain comes from PGDA LOLA."""

from lunar_pipeline.config import Config
from lunar_pipeline.terrain import pgda


def run(cfg: Config) -> None:
    path = pgda.fetch(cfg)
    pgda.describe(path)
    pgda.check(path, cfg)
    print(f"terrain-fetch: verified {path}")
