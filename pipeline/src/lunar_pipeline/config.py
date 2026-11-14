"""Strict immutable configuration; paths are relative to the source repository root."""

import math
from collections.abc import Mapping
from dataclasses import dataclass, fields
from datetime import datetime, timedelta
from pathlib import Path
from types import MappingProxyType

import yaml

REPO_ROOT = Path(__file__).resolve().parents[3]


class ConfigError(ValueError):
    """Invalid configuration, with the offending key in the message."""


def utc_datetime(value: str, key: str) -> datetime:
    try:
        if not isinstance(value, str) or "T" not in value:
            raise ValueError
        result = datetime.fromisoformat(value)
        if result.utcoffset() != timedelta(0):
            raise ValueError
        return result
    except ValueError as exc:
        raise ConfigError(f"{key}: expected UTC ISO 8601 timestamp") from exc


@dataclass(frozen=True)
class Ephemeris:
    start: datetime
    end: datetime
    step_hours: int


@dataclass(frozen=True)
class Terrain:
    far_field_m: float
    near_field_m: float
    heatmap_cell_m: float
    max_distance_km: float


@dataclass(frozen=True)
class Masks:
    site_bins: int
    grid_bins: int


@dataclass(frozen=True)
class Paths:
    raw: Path
    cache: Path
    out: Path


@dataclass(frozen=True)
class Region:
    lat: float
    lon: float
    source_url: str
    confirmed: bool


@dataclass(frozen=True)
class Config:
    moon_radius_m: float
    ephemeris: Ephemeris
    terrain: Terrain
    masks: Masks
    data_budget_mb: float
    paths: Paths
    regions: Mapping[str, Region]


def _keys(value, cls, prefix):
    if not isinstance(value, dict):
        raise ConfigError(f"{prefix or 'config'}: expected mapping")
    expected = {f.name for f in fields(cls)}
    for key in sorted(expected - value.keys()):
        raise ConfigError(f"{prefix}{key}: missing key")
    for key in value.keys() - expected:
        raise ConfigError(f"{prefix}{key}: unknown key")
    return value


def _number(value, key, *, integer=False, positive=True):
    valid = type(value) is int if integer else type(value) in (int, float)
    if not valid or not math.isfinite(value) or (positive and value <= 0):
        raise ConfigError(f"{key}: expected {'positive ' if positive else ''}finite number")
    return value


class _UniqueLoader(yaml.SafeLoader):
    """Reject duplicate YAML keys instead of silently overwriting values."""


def _mapping(loader, node):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node)
        if key in result:
            raise ConfigError(f"{key}: duplicate key")
        result[key] = loader.construct_object(value_node)
    return result


_UniqueLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, _mapping)


def load_config(path: str | Path | None = None) -> Config:
    with Path(path or REPO_ROOT / "pipeline/config.yaml").open() as stream:
        raw = _keys(yaml.load(stream, Loader=_UniqueLoader), Config, "")
    ep = _keys(raw["ephemeris"], Ephemeris, "ephemeris.")
    ephem = Ephemeris(
        utc_datetime(ep["start"], "ephemeris.start"),
        utc_datetime(ep["end"], "ephemeris.end"),
        _number(ep["step_hours"], "ephemeris.step_hours", integer=True),
    )
    if ephem.end <= ephem.start:
        raise ConfigError("ephemeris.end: must follow start")
    groups = {}
    for name, cls in (("terrain", Terrain), ("masks", Masks)):
        values = _keys(raw[name], cls, name + ".")
        groups[name] = cls(
            **{k: _number(v, f"{name}.{k}", integer=cls is Masks) for k, v in values.items()}
        )
    paths = _keys(raw["paths"], Paths, "paths.")
    for key, value in paths.items():
        if not isinstance(value, str) or not value.strip():
            raise ConfigError(f"paths.{key}: expected nonempty path")
    regions = raw["regions"]
    if not isinstance(regions, dict) or not regions:
        raise ConfigError("regions: expected nonempty mapping")
    parsed = {}
    for name, region in regions.items():
        if not isinstance(name, str) or not name:
            raise ConfigError("regions: expected nonempty region ID")
        prefix = f"regions.{name}."
        region = _keys(region, Region, prefix)
        for key, limit in (("lat", 90), ("lon", 180)):
            val = _number(region[key], prefix + key, positive=False)
            if not -limit <= val <= limit:
                raise ConfigError(f"{prefix}{key}: outside [-{limit}, {limit}]")
        if type(region["confirmed"]) is not bool:
            raise ConfigError(f"{prefix}confirmed: expected boolean")
        if not isinstance(region["source_url"], str) or not region["source_url"].startswith(
            ("https://", "http://")
        ):
            raise ConfigError(f"{prefix}source_url: expected HTTP(S) URL")
        parsed[name] = Region(**region)
    return Config(
        _number(raw["moon_radius_m"], "moon_radius_m"),
        ephem,
        groups["terrain"],
        groups["masks"],
        _number(raw["data_budget_mb"], "data_budget_mb"),
        Paths(**{k: (REPO_ROOT / v).resolve() for k, v in paths.items()}),
        MappingProxyType(parsed),
    )
