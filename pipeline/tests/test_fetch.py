import hashlib
import json

import pytest
import requests

from lunar_pipeline.fetch import cached_get, download

URL = "https://example.test/terrain"
BODY = b"abcdef"
SHA = hashlib.sha256(BODY).hexdigest()


class Response:
    def __init__(self, body=BODY, status=200, headers=None, interrupted=False):
        self.content = body
        self.status_code = status
        self.headers = headers or {}
        self.interrupted = interrupted
        self.closed = False

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.HTTPError(response=self)

    def iter_content(self, chunk_size):
        assert chunk_size <= 1024 * 1024
        yield self.content
        if self.interrupted:
            raise requests.ConnectionError("interrupted")

    def close(self):
        self.closed = True

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


class Transport:
    def __init__(self, *responses):
        self.responses = iter(responses)
        self.calls = []

    def get(self, url, **kwargs):
        self.calls.append((url, kwargs))
        return next(self.responses)


def seed(path, data=b"abc", url=URL):
    path.with_name(path.name + ".part").write_bytes(data)
    path.with_name(path.name + ".part.json").write_text(json.dumps({"url": url, "sha256": SHA}))


def test_cache_cannot_mix_query_parameters(tmp_path):
    transport = Transport(Response(b"one"), Response(b"two"))
    assert cached_get(URL, tmp_path, params={"q": 1}, session=transport) == b"one"
    assert cached_get(URL, tmp_path, params={"q": 1}, session=transport) == b"one"
    assert cached_get(URL, tmp_path, params={"q": 2}, session=transport) == b"two"
    assert len(transport.calls) == 2


def test_transient_failure_retries_and_closes_response(tmp_path):
    failed = Response(status=503)
    transport = Transport(failed, Response())
    delays = []
    assert cached_get(URL, tmp_path, session=transport, sleep=delays.append) == BODY
    assert delays == [0.5]
    assert failed.closed


def test_permanent_failure_does_not_retry(tmp_path):
    transport = Transport(Response(status=404))
    with pytest.raises(requests.HTTPError):
        cached_get(URL, tmp_path, session=transport)
    assert len(transport.calls) == 1
    assert not list(tmp_path.iterdir())


@pytest.mark.parametrize("ignored", [False, True])
def test_resume_cannot_duplicate_prefix_when_server_ignores_range(tmp_path, ignored):
    path = tmp_path / "dem.tif"
    seed(path)
    response = Response() if ignored else Response(b"def", 206, {"Content-Range": "bytes 3-5/6"})
    transport = Transport(response)
    download(URL, path, SHA, session=transport)
    assert path.read_bytes() == BODY
    assert transport.calls[0][1]["headers"]["Range"] == "bytes=3-"
    assert transport.calls[0][1]["stream"] is True
    assert response.closed


@pytest.mark.parametrize("range_header", ["bytes 0-2/6", "bytes 3-4/6", "bytes 3-5/*", ""])
def test_wrong_range_is_rejected_before_append(tmp_path, range_header):
    path = tmp_path / "dem.tif"
    seed(path)
    with pytest.raises(ValueError, match="Content-Range"):
        download(
            URL,
            path,
            SHA,
            session=Transport(Response(b"def", 206, {"Content-Range": range_header})),
        )
    assert not path.exists()
    assert path.with_name("dem.tif.part").read_bytes() == b"abc"


def test_bad_checksum_cannot_replace_existing_file(tmp_path):
    path = tmp_path / "dem.tif"
    path.write_bytes(b"old")
    with pytest.raises(ValueError, match="checksum"):
        download(URL, path, SHA, session=Transport(Response(b"corrupt")))
    assert path.read_bytes() == b"old"
    assert not path.with_name("dem.tif.part").exists()


def test_interrupted_transfer_resumes_without_publishing_partial(tmp_path):
    path = tmp_path / "dem.tif"
    with pytest.raises(requests.ConnectionError):
        download(URL, path, SHA, retries=0, session=Transport(Response(b"abc", interrupted=True)))
    assert not path.exists()
    response = Response(b"def", 206, {"Content-Range": "bytes 3-5/6"})
    download(URL, path, SHA, session=Transport(response))
    assert path.read_bytes() == BODY


def test_short_transfer_retries_from_actual_byte_offset(tmp_path):
    path = tmp_path / "dem.tif"
    transport = Transport(
        Response(b"abc", headers={"Content-Length": "6"}),
        Response(b"def", 206, {"Content-Range": "bytes 3-5/6"}),
    )
    download(URL, path, SHA, session=transport, sleep=lambda _: None)
    assert path.read_bytes() == BODY
    assert transport.calls[1][1]["headers"]["Range"] == "bytes=3-"


def test_partial_from_other_url_cannot_be_resumed(tmp_path):
    path = tmp_path / "dem.tif"
    seed(path, url="https://other.test")
    transport = Transport(Response())
    download(URL, path, SHA, session=transport)
    assert "Range" not in transport.calls[0][1]["headers"]


def test_verified_destination_never_contacts_transport(tmp_path):
    path = tmp_path / "dem.tif"
    path.write_bytes(BODY)
    transport = Transport()
    assert download(URL, path, SHA, session=transport) == path
    assert transport.calls == []


def test_retry_exhaustion_does_not_cache_error_body(tmp_path):
    transport = Transport(Response(status=503), Response(status=503), Response(status=503))
    delays = []
    with pytest.raises(requests.HTTPError):
        cached_get(URL, tmp_path, session=transport, retries=2, sleep=delays.append)
    assert delays == [0.5, 1.0]
    assert not list(tmp_path.iterdir())


def test_compressed_response_cannot_corrupt_byte_offsets(tmp_path):
    path = tmp_path / "dem.tif"
    with pytest.raises(ValueError, match="Content-Encoding"):
        download(URL, path, SHA, session=Transport(Response(headers={"Content-Encoding": "gzip"})))
    assert not path.exists()


def test_fully_received_partial_promotes_without_unsatisfiable_range(tmp_path):
    path = tmp_path / "dem.tif"
    seed(path, BODY)
    transport = Transport()
    download(URL, path, SHA, session=transport)
    assert path.read_bytes() == BODY
    assert transport.calls == []
