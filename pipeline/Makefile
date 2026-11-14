.DEFAULT_GOAL := all
.PHONY: setup ephem terrain terrain-fetch tiles layers masks validate imagery package all test lint
setup:
	uv sync --locked

ephem terrain-fetch tiles masks validate imagery package all:
	uv run --locked python -m lunar_pipeline $@

# layers rewrites grid/*.bin without the mask layer, so masks always runs right after it.
layers:
	uv run --locked python -m lunar_pipeline layers
	uv run --locked python -m lunar_pipeline masks

terrain:
	uv run --locked python -m lunar_pipeline terrain-fetch
	uv run --locked python -m lunar_pipeline tiles

test:
	uv run --locked pytest

lint:
	uv run --locked ruff check .
	uv run --locked ruff format --check .
