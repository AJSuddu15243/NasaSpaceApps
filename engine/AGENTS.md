# engine/: agent guide (Rust engine, owner: Ananth)

Read the root `Agent.md` and `SPEC.md` first. This file adds the rules for `engine/` only.
Coordinate with Ananth before changing the engine API or the native/WASM boundary.

## What this folder does
One Rust crate, two outputs:
- **WASM library** (`src/lib.rs`) → built into `web/src/engine/pkg/` (committed, per SPEC). The app imports it from there.
- **Native `masks` bin** (`src/bin/masks.rs`) → horizon mask builder run offline by the pipeline. Never shipped.
  Until ENG-3 lands it exits with code 1 on purpose.

```
engine/
├── rust-toolchain.toml   # pinned stable + wasm32 target: same compiler, same .wasm bytes everywhere
├── Cargo.toml            # deps: wasm-bindgen, js-sys, serde, serde_json
├── build.sh              # wasm-pack release build (wasm-opt -O) → ../web/src/engine/pkg, fails over 1.5 MB
└── src/
    ├── lib.rs            # pure Rust API (tested natively) + thin #[wasm_bindgen] exports
    ├── contracts.rs      # boundary structs copied from FND-1 (#65); contracts/schemas/ wins if they differ
    └── bin/masks.rs      # native mask builder (ENG-3)
```

## Commands
| Task | Command (from `engine/`) |
|---|---|
| Test | `cargo test` |
| Lint (CI gate) | `cargo clippy --all-targets -- -D warnings` and `cargo clippy --target wasm32-unknown-unknown -- -D warnings` |
| Build WASM | `./build.sh` (needs `wasm-pack`: `brew install wasm-pack`) |
| Masks (from `pipeline/`) | `cargo run --release --manifest-path ../engine/Cargo.toml --bin masks` |

## Rules
- **Objects cross the boundary as JSON** (`from_js` / `to_js` in `lib.rs`): serde_json enforces the contract
  exactly (unknown or missing fields rejected, `None` → `null`). **Bulk data crosses as typed arrays.**
- **Determinism:** fixed loop order, no fast-math, no unseeded randomness, f64 accumulation. Don't change
  `rust-toolchain.toml` or `[profile.release]` without rebuilding `pkg/` and noting the new `.wasm` hash in the PR.
- **Only rebuild `pkg/` in engine PRs**, so binary merge conflicts stay rare.
- Range checks (e.g. weights ≥ 0) are not enforced by serde; each function validates its own inputs.
- Algorithm designs: `.agent/GREEDY.md` (scoring + greedy top-N, decisions agreed with Ananth).
