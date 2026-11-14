#!/usr/bin/env bash
# Upgrade the landing/globe Moon map to NASA SVS CGI Moon Kit LROC colour (public domain, https://svs.gsfc.nasa.gov/4720).
# Run on a Mac (uses sips) or any machine with ImageMagick:  bash web/scripts/fetch-moon-textures.sh
set -euo pipefail
cd "$(dirname "$0")/../public/textures/moon"
SRC="https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_4k.tif"
curl -fL --retry 3 -o /tmp/lroc_color_poles_4k.tif "$SRC"
if command -v sips >/dev/null; then
  sips -s format jpeg -s formatOptions 88 /tmp/lroc_color_poles_4k.tif --out lroc-color-4k.jpg >/dev/null
else
  magick /tmp/lroc_color_poles_4k.tif -depth 8 -quality 88 lroc-color-4k.jpg
fi
python3 - <<'PY'
import json, pathlib
p = pathlib.Path("manifest.json"); m = json.loads(p.read_text())
m["color"] = "/textures/moon/lroc-color-4k.jpg"
m["credit"] = "Moon map: NASA SVS CGI Moon Kit, LROC colour (NASA/GSFC/Arizona State University)."
p.write_text(json.dumps(m, indent=2) + "\n")
PY
ls -lh lroc-color-4k.jpg && echo "manifest.json now points at the LROC map. Commit both files."
