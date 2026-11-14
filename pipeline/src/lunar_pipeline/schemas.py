"""Validate shared contracts when FND-1 supplies them; missing schemas warn once."""

import json
import re
import warnings

import jsonschema
from referencing import Registry
from referencing.exceptions import NoSuchResource

from .config import REPO_ROOT

SCHEMA_DIR = REPO_ROOT / "contracts/schemas"
_warned = set()


def _no_network(uri):
    raise NoSuchResource(ref=uri)


def validate(kind: str, obj) -> None:
    if not re.fullmatch(r"[a-z][a-z0-9_-]*", kind):
        raise ValueError("kind: expected schema basename")
    path = SCHEMA_DIR / f"{kind}.schema.json"
    if not path.exists():
        if kind not in _warned:
            warnings.warn(f"Missing schema: {path}; validation skipped", UserWarning, stacklevel=2)
            _warned.add(kind)
        return
    schema = json.loads(path.read_text())
    cls = jsonschema.validators.validator_for(schema)
    cls.check_schema(schema)
    cls(schema, registry=Registry(retrieve=_no_network)).validate(obj)
