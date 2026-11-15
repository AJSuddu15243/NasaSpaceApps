"""Stable CLI registry; downstream issues implement only their own run(cfg) modules."""

import argparse
from importlib import import_module

from .config import ConfigError, load_config

COMMANDS = {
    "ephem": ("ephem", "Build hourly Moon-fixed ephemerides (PIPE-2)"),
    "terrain-fetch": ("terrain.trek", "Fetch terrain with PGDA fallback (PIPE-3)"),
    "tiles": ("terrain.tiles", "Crop and resample terrain tiles (PIPE-4)"),
    "layers": ("terrain.layers", "Build terrain and rock layers (PIPE-5, PIPE-6)"),
    "science": ("terrain.science", "Append long-term illumination, PSR and ice favorability grids"),
    "masks": ("masks", "Build terrain horizon masks (PIPE-8)"),
    "validate": ("validate", "Validate against Horizons (PIPE-7)"),
    "imagery": ("terrain.imagery", "Prepare surface imagery (PIPE-10)"),
    "package": ("package", "Package outputs with manifest and budget (PIPE-9)"),
}


def main(argv=None) -> None:
    parser = argparse.ArgumentParser(description="Offline lunar data pipeline (MOON_ME, UTC)")
    parser.add_argument("--config", help="YAML config path; defaults to pipeline/config.yaml")
    subs = parser.add_subparsers(dest="command", required=True)
    for name, (_, description) in COMMANDS.items():
        sub = subs.add_parser(name, help=description, description=description)
        sub.add_argument("--config", default=argparse.SUPPRESS, help="YAML config path")
    sub = subs.add_parser("all", help="Run all stages sequentially")
    sub.add_argument("--config", default=argparse.SUPPRESS, help="YAML config path")
    args = parser.parse_args(argv)
    try:
        cfg = load_config(args.config)
    except (ConfigError, OSError) as exc:
        parser.error(str(exc))
    names = COMMANDS if args.command == "all" else [args.command]
    for name in names:
        module, _ = COMMANDS[name]
        import_module(f"lunar_pipeline.{module}").run(cfg)


if __name__ == "__main__":
    main()
