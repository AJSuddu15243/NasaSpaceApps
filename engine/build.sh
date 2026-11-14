#!/usr/bin/env bash
# Builds the engine to WASM into web/src/engine/pkg (committed, per SPEC). Run from anywhere.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../web/src/engine/pkg
wasm-pack build --release --target web --out-dir "$OUT"  # wasm-opt -O is wasm-pack's release default
rm -f "$OUT/.gitignore"  # wasm-pack ignores everything by default; we commit pkg/
WASM="$OUT/lunar_engine_bg.wasm"
BYTES=$(wc -c < "$WASM")
LIMIT=$((1536 * 1024))  # docs/QUALITY.md: WASM under 1.5 MB
echo "wasm: $BYTES bytes (limit $LIMIT)"
[ "$BYTES" -le "$LIMIT" ] || { echo "FAIL: wasm over 1.5 MB budget" >&2; exit 1; }
