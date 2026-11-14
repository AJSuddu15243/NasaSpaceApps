#!/usr/bin/env bash
# Builds the engine to WASM into web/src/engine/pkg (committed, per SPEC). Run from anywhere.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../web/src/engine/pkg
# Strip machine paths (username, checkout dir) from panic strings so every machine emits the same bytes.
# CARGO_ENCODED_RUSTFLAGS (0x1f-separated) survives spaces in paths; it replaces any RUSTFLAGS.
SEP=$'\x1f'
export CARGO_ENCODED_RUSTFLAGS="--remap-path-prefix=${CARGO_HOME:-$HOME/.cargo}=/cargo${SEP}--remap-path-prefix=$(cd .. && pwd)=/repo"
wasm-pack build --release --target web --out-dir "$OUT"  # wasm-opt -O is wasm-pack's release default
rm -f "$OUT/.gitignore"  # wasm-pack ignores everything by default; we commit pkg/
WASM="$OUT/lunar_engine_bg.wasm"
BYTES=$(wc -c < "$WASM")
LIMIT=$((1536 * 1024))  # docs/QUALITY.md: WASM under 1.5 MB
echo "wasm: $BYTES bytes (limit $LIMIT)"
[ "$BYTES" -le "$LIMIT" ] || { echo "FAIL: wasm over 1.5 MB budget" >&2; exit 1; }
