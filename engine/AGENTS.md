# engine/: agent guide (Rust engine, owner: Ananth)

Read the root `Agent.md` and `SPEC.md` first. This file adds the rules for `engine/` only.
Coordinate with Ananth before changing the engine API or the native/WASM boundary.

## What this folder does
One Rust crate, two outputs:
- **WASM library** (`src/lib.rs`) → built into `web/src/engine/pkg/` (committed, per SPEC). The app imports it from there.
- **Native `masks` bin** (`src/bin/masks.rs`) → horizon mask builder run offline by the pipeline. Never shipped.

```
engine/
├── rust-toolchain.toml   # pinned 1.100.0 + wasm32: same compiler, same .wasm bytes everywhere
├── Cargo.toml            # deps: wasm-bindgen, js-sys, serde, serde_json
├── build.sh              # wasm-pack release build → ../web/src/engine/pkg, remaps home/repo paths, fails over 1.5 MB
├── src/
│   ├── lib.rs            # pure Rust API (tested natively) + thin #[wasm_bindgen] exports (*_js)
│   ├── contracts.rs      # boundary structs; contracts/schemas/ wins if they differ
│   ├── constants.rs      # R_M, AU, S0, albedo, emissivity, sigma, T_FLOOR_K
│   ├── geometry.rs       # polar stereo, ENU frames, topocentric Sun/Earth az/el (ENG-2)
│   ├── mask.rs           # horizon mask core on the 1737.4 km sphere (ENG-3)
│   ├── grid.rs           # grid layer stack decode/write (contract `grid`)
│   ├── metrics.rs        # solar lit fraction, eclipse, DTE, window metrics, site_track (ENG-4)
│   ├── thermal.rs        # radiative-equilibrium temperature (ENG-5)
│   ├── score.rs          # cell factors, grid_fracs, scores_from_fracs + battery gate, psr_flags (ENG-6)
│   ├── greedy.rs         # window means, top-N areas, nearby better spot (ENG-7)
│   ├── hash.rs           # FNV-1a 64 determinism hash (ENG-8)
│   └── bin/masks.rs      # native mask builder CLI (ENG-3)
└── tests/                # geometry_validation (vs Horizons), golden (hash regression), grid_real
```

## Commands
| Task | Command (from `engine/`) |
|---|---|
| Test | `cargo test` |
| Format (CI gate) | `cargo fmt --check` |
| Lint (CI gate) | `cargo clippy --all-targets -- -D warnings` and `cargo clippy --target wasm32-unknown-unknown -- -D warnings` |
| Build WASM | `./build.sh` (needs `wasm-pack` 0.15.1). Never plain `wasm-pack build`: it skips the path remap and changes the bytes |
| Masks (from `pipeline/`) | `make masks` (always after `layers`; then `make package`) |

CI (`.github/workflows/ci.yml`, job `engine`) runs fmt, both clippy gates, tests and `./build.sh`, then diffs `pkg/`
against the fresh build. The pkg diff is **non-blocking** until Linux and macOS builds are shown to give the same bytes.

### Masks CLI
```
masks --region R --near N.json --far F.json --grid G.json --sites S.json --out DATA_DIR
      [--max-km 150] [--observer-m 2] [--force]
```
Writes `DATA_DIR/masks/{id}.json` (360 bins) for every site inside the near tile and the 64-bin `mask` layer of
every grid cell into `G.json/.bin`. `pipeline/src/lunar_pipeline/masks.py` builds `S.json` from `config.yaml` and
shells out to it per region. Skips a region whose outputs are newer than its inputs unless `--force`. The
observer height and reach are CLI flags only (not stored in the file); method notes in `docs/METHODS.md`.

## Determinism hash (ENG-8)
- FNV-1a 64 over little-endian result bytes, prefixed by `hash::ENGINE_TAG` (crate version + engine-api schema
  version). Bumping either changes every golden on purpose.
- Floats are canonical: every NaN → one quiet NaN, -0.0 → +0.0. `None` hashes as byte 0, `Some(x)` as 1 then x.
- Hash results in a fixed order (site order, then step order). Never hash a `HashMap` iteration.
- `quantize_ephem` snaps Astronomy Engine angles to a 2^-13 deg grid before they enter WASM (SPEC guardrail 2;
  1e-7 rad is below the f32 ulp). The shipped Horizons table needs no quantizing.

### Golden re-baseline
- **The WASM goldens are the reference** (`web/src/engine/engine.test.ts`, node `initSync` on `pkg/`). The
  native goldens (`tests/golden.rs`) are a regression check on this toolchain and machine only.
- Both inputs are real data (masks + Horizons `ephem.bin`), never the constant mock ephem.
- A failing golden prints the new hash. Paste it in and say in the PR why the numbers moved. An unexplained
  change is a bug.

## No libm
Trig uses Rust `std` (`f64::sin`, etc.), not `libm`. On wasm32 the std functions compile in from the pinned
toolchain, so the WASM bytes, and the hash, match on every browser. Native results can differ in the last bits
from WASM, which is why native goldens are machine-local. Do not add `libm` or fast-math without Ananth.

## Using the engine from the web app
- `web/src/engine/index.ts` is the synchronous facade on main-thread WASM (`site_metrics`, `siteExtras`,
  `siteTrack`, `outputHash`, plus `gridFracs`, `gridScores`, `topAreas`, `nearbyBetter` and the other grid
  wrappers). `demo-*` sites stay on `mock.ts`.
- `web/src/engine/pool.ts` is the Web Worker pool for heavy grid work: `compileEngine()` compiles the WASM once,
  `createPool()` starts `poolSize()` workers (1..4), each running `initSync` on that module. Use
  `pool.set(key, value)` once to broadcast big inputs (ephem, grid) and pass `ref(key)` in args. `pool.call(fn, args)`
  dispatches least-busy, and `pool.latest(channel, fn, args)` drops stale slider results (it does not cancel
  work already running). `fn` is a pkg export name. Protocol types live in `protocol.ts`.

## Rules
- **Objects cross the boundary as JSON** (`from_js` / `to_js` in `lib.rs`): serde_json enforces the contract
  exactly (unknown or missing fields rejected, `None` → `null`). **Bulk data crosses as typed arrays.**
- **Determinism:** fixed loop order, no fast-math, no unseeded randomness, f64 accumulation. Don't change
  `rust-toolchain.toml` or `[profile.release]` without rebuilding `pkg/` and noting the new `.wasm` hash in the PR.
- **Only rebuild `pkg/` in engine PRs**, so binary merge conflicts stay rare.
- Range checks (e.g. weights ≥ 0) are not enforced by serde; each function validates its own inputs.
- Algorithm designs: `.agent/GREEDY.md` (scoring + greedy top-N, decisions agreed with Ananth).
