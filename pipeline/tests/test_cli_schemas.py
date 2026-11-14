import json
import warnings

import jsonschema
import pytest

from lunar_pipeline import ephem, schemas, validate
from lunar_pipeline.__main__ import COMMANDS, main
from lunar_pipeline.config import REPO_ROOT

# Implemented network stages are replaced by an offline marker; their own tests cover them.
IMPLEMENTED = {
    "terrain-fetch": "terrain.trek",
    "tiles": "terrain.tiles",
    "layers": "terrain.layers",
    "masks": "masks",
    "imagery": "terrain.imagery",
    "package": "package",
}


@pytest.fixture
def offline_stages(monkeypatch):
    from importlib import import_module

    for command, module in IMPLEMENTED.items():
        stub = lambda cfg, command=command: print(f"{command}: dispatched")  # noqa: E731
        monkeypatch.setattr(import_module(f"lunar_pipeline.{module}"), "run", stub)


@pytest.fixture(autouse=True)
def offline_ephem(monkeypatch):
    """ephem (PIPE-2) and validate (PIPE-7) need Horizons; CLI tests only prove dispatch."""
    monkeypatch.setattr(ephem, "run", lambda cfg: print("ephem: dispatched"))
    monkeypatch.setattr(validate, "run", lambda cfg: print("validate: dispatched"))


@pytest.mark.parametrize("command", [*COMMANDS, "all"])
def test_registered_command_cannot_be_unreachable(command, offline_stages, capsys):
    main([command])
    lines = capsys.readouterr().out.splitlines()
    expected = list(COMMANDS) if command == "all" else [command]
    assert [line.split(":")[0] for line in lines] == expected
    dispatched = {*IMPLEMENTED, "ephem", "validate"}
    for line in lines:
        command = line.split(":")[0]
        if command in dispatched:
            assert line.endswith(": dispatched")
        else:
            assert "not implemented yet (PIPE-" in line


def test_help_cannot_hide_commands(capsys):
    with pytest.raises(SystemExit, match="0"):
        main(["--help"])
    output = capsys.readouterr().out
    assert all(name in output for name in COMMANDS)
    assert "--config" in output


@pytest.mark.parametrize("before", [True, False])
def test_config_flag_works_on_either_side_of_command(before, capsys):
    flags = ["--config", str(REPO_ROOT / "pipeline/config.yaml")]
    main(flags + ["ephem"] if before else ["ephem"] + flags)
    assert "ephem: dispatched" in capsys.readouterr().out


def test_missing_schema_warns_once_but_new_schema_is_not_skipped(tmp_path, monkeypatch):
    monkeypatch.setattr(schemas, "SCHEMA_DIR", tmp_path)
    monkeypatch.setattr(schemas, "_warned", set())
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        schemas.validate("ephem", {})
        schemas.validate("ephem", {})
    assert len(caught) == 1
    (tmp_path / "ephem.schema.json").write_text(json.dumps({"type": "integer"}))
    with pytest.raises(jsonschema.ValidationError):
        schemas.validate("ephem", {})
    schemas.validate("ephem", 1)


def test_schema_name_cannot_escape_contract_directory():
    with pytest.raises(ValueError, match="kind"):
        schemas.validate("../secret", {})


def test_all_cannot_reorder_stages_or_omit_imagery(offline_stages, capsys):
    main(["all"])
    assert [line.split(":")[0] for line in capsys.readouterr().out.splitlines()] == [
        "ephem",
        "terrain-fetch",
        "tiles",
        "layers",
        "masks",
        "validate",
        "imagery",
        "package",
    ]


def test_broken_unrelated_module_cannot_prevent_tiles(offline_stages, monkeypatch, capsys):
    from lunar_pipeline import __main__ as cli

    real_import = cli.import_module

    def broken_ephem(name):
        if name == "lunar_pipeline.ephem":
            raise ImportError("broken ephemeris dependency")
        return real_import(name)

    monkeypatch.setattr(cli, "import_module", broken_ephem)
    main(["tiles"])
    assert "tiles: dispatched" in capsys.readouterr().out


def test_schema_remote_reference_cannot_fetch_network(tmp_path, monkeypatch):
    monkeypatch.setattr(schemas, "SCHEMA_DIR", tmp_path)
    (tmp_path / "remote.schema.json").write_text('{"$ref": "https://example.test/schema"}')
    from referencing.exceptions import Unresolvable

    with pytest.raises(Unresolvable):
        schemas.validate("remote", {})


def test_local_schema_reference_resolves_sibling_definitions(tmp_path, monkeypatch):
    monkeypatch.setattr(schemas, "SCHEMA_DIR", tmp_path)
    (tmp_path / "common.schema.json").write_text(
        json.dumps(
            {
                "$schema": "https://json-schema.org/draft/2020-12/schema",
                "$id": "common.schema.json",
                "$defs": {"positive": {"type": "integer", "minimum": 1}},
            }
        )
    )
    (tmp_path / "root.schema.json").write_text(
        json.dumps(
            {
                "$schema": "https://json-schema.org/draft/2020-12/schema",
                "$id": "root.schema.json",
                "type": "object",
                "properties": {"value": {"$ref": "common.schema.json#/$defs/positive"}},
            }
        )
    )
    schemas.validate("root", {"value": 1})
    with pytest.raises(jsonschema.ValidationError):
        schemas.validate("root", {"value": 0})


@pytest.mark.parametrize(
    "fmt,valid,invalid",
    [
        ("date-time", "2026-11-14T00:00:00Z", "2026-99-99T00:00:00Z"),
        ("uri", "https://example.test/source", "not a URI"),
    ],
)
def test_declared_formats_are_enforced(tmp_path, monkeypatch, fmt, valid, invalid):
    monkeypatch.setattr(schemas, "SCHEMA_DIR", tmp_path)
    (tmp_path / "checked.schema.json").write_text(
        json.dumps(
            {
                "$schema": "https://json-schema.org/draft/2020-12/schema",
                "type": "string",
                "format": fmt,
            }
        )
    )
    schemas.validate("checked", valid)
    with pytest.raises(jsonschema.ValidationError):
        schemas.validate("checked", invalid)


FND_EXAMPLES = REPO_ROOT / "contracts/examples/valid"


@pytest.mark.skipif(not FND_EXAMPLES.is_dir(), reason="FND-1 contracts not present")
@pytest.mark.parametrize("fixture", sorted(FND_EXAMPLES.glob("*.json")), ids=lambda p: p.stem)
def test_fnd_contract_fixtures_are_accepted(fixture):
    schemas.validate(fixture.stem, json.loads(fixture.read_text()))
