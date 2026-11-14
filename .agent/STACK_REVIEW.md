# Tech Stack Review: Conceptual Gaps

> **Draft.** This is a desk check only; nothing has been tested yet. Items marked *(unverified)* need a quick test.

## Proposed stack
- **Sim and greedy ranking:** Rust, precompiled to `.wasm` (no compiling on the user's machine)
- **3D:** three.js, or React Three Fiber if we use React
- **Heatmaps and terrain:** custom GLSL shaders
- **UI:** React + Tailwind, minimal shadcn / kokonutUI / componentry / React Bits components
- **Terrain data:** Moon Trek / QuickMap
- **Sun and Earth positions:** NASA Horizons or astronomy-engine

**Verdict:** the stack works. The 4 must-fix items below break the plan as written; everything else can be fixed as we go.

## Must-fix
- **astronomy-engine can't place an observer on the Moon**
  - Its `Observer` type only works on Earth.
  - Fix: compute Moon→Sun and Moon→Earth vectors (`GeoVector(Sun)` minus `GeoMoon`), then rotate them into Moon surface coordinates with `RotationAxis(Body.Moon)`.
  - About 50 lines of math. This is the riskiest piece.
- **Computing the ephemeris in JS weakens the determinism claim**
  - JS `Math.sin` / `Math.cos` can differ in the last bits between browsers, so the sun direction can differ slightly.
  - Fix A: compute sun and Earth directions in Rust. Its math is compiled into the `.wasm`, so every browser gets identical bits.
  - Fix B: generate a sun/Earth table once and ship it as a file.
  - Keep astronomy-engine or Horizons for cross-checking only.
- **NASA Horizons can't be called from a browser at runtime**
  - It likely doesn't send the headers browsers need to allow the request *(unverified)*, and it's a network round-trip anyway.
  - Use it offline only, to build or validate the table.
- **QuickMap and Moon Trek are map viewers, not data feeds**
  - Use actual elevation files: the LOLA south pole elevation maps from NASA's PGDA site, or the ADC grids already in the repo.
  - Cut and downsample them offline into shipped tiles; the full files run to hundreds of MB.

## Architecture: decide before coding
- **Horizon masks need terrain far beyond the site**
  - Polar horizons are set by mountains 100+ km away, so a cropped landing area gives wrong sunlight results.
  - Compute masks offline with a native Rust build, using a coarse wide-area map plus the Moon's curvature, then ship them.
- **GLSL only colors pixels and never computes physics**
  - Different GPUs round floats differently, which would break determinism.
  - Physics stays in WASM; shaders just draw the numbers.
- **Rendering:** a low-resolution whole-Moon sphere plus high-resolution patches for each region. One high-res sphere won't fit on the GPU.
- **Threads:** WASM threads need two security headers (COOP/COEP) that GitHub Pages can't set. Use several Web Workers, each with its own WASM copy.
- **R3F or plain three.js: pick one now**
  - With React, keep sim data in refs, not React state, or every slider move re-renders the 3D scene.
  - Store the heatmap as `R16F` or plain 8-bit color values. `R32F` can't be smoothed on some devices, iPhones included.

## Scope: define or cut
- **"Thermal" is not the same as "% of time sunlit"**
  - A real thermal model is a separate project.
  - Call the feature "solar", or use measured Diviner temperature maps as a data layer.
- **The comms model only checks line of sight to Earth**
  - It ignores whether a Deep Space Network ground antenna is facing the Moon (usually true) and relay satellites.
  - List this as a stated assumption.
- **"Crowd" and "rock layer depth" have no known data source at the poles**
  - Crater depth can be derived from the elevation map.
  - Define the other two or drop them.
- **The challenge isn't verified**
  - The official Space Apps challenge statement hasn't been confirmed.
  - The ADC data was built for route finding, not site selection.

## Next decisions
- [ ] Sun and Earth positions: computed in Rust, or shipped as a table? (settles must-fix 1–3)
- [ ] R3F or plain three.js
- [ ] Terrain source: LOLA PGDA maps or the ADC grids
- [ ] Keep or cut "crowd" and "rock layer depth"
- [ ] Confirm the official challenge statement
