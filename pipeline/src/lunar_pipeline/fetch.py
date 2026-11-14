"""Sequential HTTP helpers; streamed downloads never publish before SHA-256 verification."""

import hashlib
import json
import math
import re
import time
from pathlib import Path

import requests

CHUNK_SIZE = 1024 * 1024


def _get(session, url, *, retries, backoff, sleep, **kwargs):
    for attempt in range(retries + 1):
        response = None
        try:
            response = session.get(url, timeout=(10, 60), **kwargs)
            response.raise_for_status()
            return response
        except requests.RequestException as exc:
            if response is not None:
                response.close()
            status = getattr(getattr(exc, "response", None), "status_code", None)
            if attempt == retries or (status is not None and status != 429 and status < 500):
                raise
            sleep(backoff * 2**attempt)
    raise AssertionError("unreachable")


def _options(retries, backoff):
    if type(retries) is not int or retries < 0 or not math.isfinite(backoff) or backoff < 0:
        raise ValueError("retries and backoff must be nonnegative")


def cached_get(
    url, cache_dir, *, params=None, session=None, retries=3, backoff=0.5, sleep=time.sleep
) -> bytes:
    """Cache small API responses by prepared URL (including encoded query parameters)."""
    _options(retries, backoff)
    key_url = requests.Request("GET", url, params=params).prepare().url
    cache = Path(cache_dir) / (hashlib.sha256(key_url.encode()).hexdigest() + ".cache")
    if cache.exists():
        return cache.read_bytes()
    client = session or requests.Session()
    try:
        with _get(
            client, url, params=params, retries=retries, backoff=backoff, sleep=sleep
        ) as response:
            body = response.content
        cache.parent.mkdir(parents=True, exist_ok=True)
        partial = cache.with_suffix(".part")
        partial.write_bytes(body)
        partial.replace(cache)
        return body
    finally:
        if session is None:
            client.close()


def _digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def download(url, path, sha256, *, session=None, retries=3, backoff=0.5, sleep=time.sleep) -> Path:
    """Resume a matching .part file; retain interruptions, discard checksum failures.

    The adjacent .part.json binds partial bytes to URL and expected digest. A server
    ignoring Range restarts the file. Callers supply the authoritative SHA-256.
    """
    _options(retries, backoff)
    if not isinstance(sha256, str) or not re.fullmatch(r"[0-9a-fA-F]{64}", sha256):
        raise ValueError("sha256: expected 64 hex digits")
    sha256 = sha256.lower()
    path = Path(path)
    if path.exists() and _digest(path) == sha256:
        return path
    path.parent.mkdir(parents=True, exist_ok=True)
    partial = path.with_name(path.name + ".part")
    identity = partial.with_name(partial.name + ".json")
    expected_identity = {"url": url, "sha256": sha256}
    try:
        same = json.loads(identity.read_text()) == expected_identity
    except (OSError, ValueError):
        same = False
    if not same:
        partial.unlink(missing_ok=True)
    identity.write_text(json.dumps(expected_identity))
    # A completed transfer may have been interrupted just before promotion.
    if partial.exists() and _digest(partial) == sha256:
        partial.replace(path)
        identity.unlink()
        return path
    client = session or requests.Session()
    try:
        for attempt in range(retries + 1):
            offset = partial.stat().st_size if partial.exists() else 0
            headers = {"Accept-Encoding": "identity"}
            if offset:
                headers["Range"] = f"bytes={offset}-"
            try:
                with _get(
                    client,
                    url,
                    headers=headers,
                    stream=True,
                    retries=0,
                    backoff=backoff,
                    sleep=sleep,
                ) as response:
                    if response.headers.get("Content-Encoding", "identity") != "identity":
                        raise ValueError("Content-Encoding: expected identity")
                    total = None
                    if response.status_code == 206:
                        match = re.fullmatch(
                            r"bytes (\d+)-(\d+)/(\d+)", response.headers.get("Content-Range", "")
                        )
                        if not match:
                            raise ValueError("Content-Range: missing or invalid")
                        start, end, total = map(int, match.groups())
                        if start != offset or end < start or end + 1 != total:
                            raise ValueError("Content-Range: inconsistent resume range")
                        mode = "ab"
                    elif response.status_code == 200:
                        offset = 0
                        mode = "wb"
                    else:
                        raise ValueError(f"unexpected download status: {response.status_code}")
                    received = 0
                    with partial.open(mode) as stream:
                        for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                            stream.write(chunk)
                            received += len(chunk)
                    length = response.headers.get("Content-Length")
                    if (length is not None and received != int(length)) or (
                        total is not None and offset + received != total
                    ):
                        raise requests.ConnectionError("incomplete response body")
                break
            except requests.RequestException as exc:
                status = getattr(getattr(exc, "response", None), "status_code", None)
                if attempt == retries or (status is not None and status != 429 and status < 500):
                    raise
                sleep(backoff * 2**attempt)
        if _digest(partial) != sha256:
            partial.unlink()
            identity.unlink(missing_ok=True)
            raise ValueError("sha256: checksum mismatch")
        partial.replace(path)
        identity.unlink()
        return path
    finally:
        if session is None:
            client.close()
