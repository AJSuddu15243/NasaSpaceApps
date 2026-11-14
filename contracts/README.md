# contracts/ — the source of truth for every shared file and type

Every file or value that crosses a workstream boundary (pipeline → engine → web) is defined here once, as
JSON Schema 2020-12. TypeScript types in `web/src/contracts/` are generated from the schemas. If this folder
and any other document disagree, this folder wins.

```
contracts/
├── schemas/      <kind>.schema.json, plus common.schema.json (shared definitions)
├── examples/     valid/<kind>.json and invalid/<kind>.<broken-rule>.json (+ rules.json: the expected failure)
├── src/          validate.mjs (schema + cross-field rules), gen.mjs, validate-data.mjs
└── test/         vitest; no network
```

## Commands (run in `contracts/`, after `pnpm install`)
| Command | What it does |
|---|---|
| `pnpm test` | Every valid example passes; every invalid one fails for the rule in its name; `validate-data` behaviour |
| `pnpm gen` | Regenerates `web/src/contracts/*.ts` and `index.ts` (never edit those by hand) |
| `pnpm check` | Fails if the generated types are stale or a hand-written file sits in `web/src/contracts/` |
| `pnpm validate-data [dir]` | Validates every file under `web/public/data/` (and `mock/`) and each `.bin`'s length |
| `pnpm typecheck` | `tsc --noEmit --strict` over the generated types |

Web code imports types with `import type { SiteMask, Metrics } from '<path to>/contracts'`.

## Path → schema
Paths are relative to `web/public/data/`. The same layout is accepted under `web/public/data/mock/`.
Any other `.json` or `.bin` in the folder fails `validate-data`; other file types are ignored.

| Path | Schema | Binary next to it |
|---|---|---|
| `sites.json` | `sites` | none |
| `masks/{site_id}.json` | `site-mask` (`id` = file name) | none |
| `ephem.json` | `ephem` | `ephem.bin`, `n * 24` bytes |
| `grid/{region}.json` | `grid` (`region` = file name) | `grid/{region}.bin`, sum of `layer_info[*].byte_length` |
| `tiles/{region}_{res}m.json` | `tile` (`region` and `cell_m` determine the file name) | same name `.bin`, `nx * ny * 4` bytes |
| `validation/{site_id}.json` | `validation` (`site_id` = file name) | none |
| `manifest.json` | `manifest` | none |
| (not a file) | `engine-api`: `Params`, `Weights`, `Metrics`, `Area` | **PROPOSED**, see below |

## Conventions
- **Envelope.** Every generated file has `schema_version` (integer, 1), `generated_at` (UTC ISO 8601 ending
  in `Z`) and `source_urls`. `schema_version` is one number shared by all kinds, stored in every file. Two exceptions: `sites.json` is hand-curated, so it stays the bare array SPEC
  defines and cites a `source_url` per site; `manifest.json` cites `source_urls` per file.
- **Units.** Degrees for every angle. Metres for every length, except ephemeris distances, which are
  kilometres (`sun_dist_km`, `earth_dist_km`, and `max_distance_km` in a site mask). Kelvin, hours.
- **Frame.** Moon-fixed mean-Earth frame (MOON_ME). Latitude in [-90, 90]. Longitude east-positive in
  [-180, 180); 180 is written as -180.
- **Heights** (`elev_m`, tile values) are metres above the 1737400 m sphere.
- **Azimuth** is clockwise from local north, in [0, 360). **Elevation** is the angle above the local
  horizontal plane (perpendicular to the radial through the site). No refraction.
- **Site mask.** `mask_deg[i]` is the terrain horizon elevation at azimuth `i * (360 / bins)`; `bins` equals
  `mask_deg.length` and is 360.
- **Ephemeris table.** `ephem.bin` is `n` rows × 6 float32, row-major, columns in the order of `fields`; row
  `k` is `t0_iso + k * step_hours`. `sun_lat`/`sun_lon` are the sub-solar point and `earth_lat`/`earth_lon`
  the sub-Earth point.
- **Binary data** is little-endian.
- **Projection** (grids, tiles, `Area.x_m`/`y_m`): south polar stereographic on a 1737400 m sphere, true scale
  at the pole. With `rho = 2 R tan(pi/4 + lat/2)`: `x = rho sin(lon)`, `y = rho cos(lon)`. +y points along
  longitude 0, +x along longitude 90° E. A test checks this formula against the example `Area`. PIPE-4
  confirms it against the LOLA GeoTIFF's own projection metadata before producing tiles.
- **Raster axes** are defined in exactly one place, the `x0` definition in `schemas/common.schema.json`:
  `x0`, `y0` are the projected coordinates of the CENTRE of cell (col 0, row 0); col grows with +x, row
  grows with +y; `index = row * nx + col`.
- **Grid layers.** `layers` lists the layers present, in file order, back to back from byte 0. `layer_info`
  has one entry per layer: physical value = stored × `scale` + `offset`; the element for cell `i`, component
  `c` is at `byte_offset + (i * components + c) * itemsize`; `nodata` is a STORED value. The `mask` layer is
  int16 with scale 0.01 deg and `components = bins = 64`. A layer with no data (rock, until a source is
  confirmed) is left out of `layers`. Scalar layers have one component: slope uses `deg`, elevation and
  crater depth use `m`, and rock uses `fraction`.

## Gotchas for whoever produces these files
- A north-up GeoTIFF has row 0 at the largest y. This contract has row 0 at the smallest y, so flip the rows
  (PIPE-4 confirms the GeoTIFF's own axis directions and transform from its metadata first).
- Casting a longitude just below 180 to float32 can round it to exactly 180.0. Wrap to [-180, 180) after
  the cast, not before.
- The mask layer costs 128 bytes per cell, so the 25 MB data budget holds about 190,000 grid cells in total.
- `nodata` cannot be NaN (not valid JSON). Use a sentinel such as -32768, or `null` when no cell is missing.
- JSON Schema cannot compare two fields. The rules that need that (unique site ids; grid `layer_info` keys
  = `layers`, mask `components` = `bins`, `byte_length`, contiguous `byte_offset`) and the `.bin` lengths are
  checked by
  `src/validate.mjs` and `pnpm validate-data`, not by the schema alone. A Python `jsonschema` check on its
  own misses them.

## engine-api is PROPOSED
`engine-api.schema.json` (`Params`, `Weights`, `Metrics`, `Area`) needs sign-off from the engine and web
owners. Open questions are listed in the FND-1 pull request. Do not treat it as frozen until they agree.

## How to change a contract
1. Edit the schema. If files written to the old schema would no longer pass, bump `schema_version` in
   `common.schema.json`.
2. Update `examples/valid/`, and add or fix an `examples/invalid/` file (plus its line in `rules.json`) for
   each new rule. One broken rule per invalid file, named after the rule.
3. Run `pnpm gen && pnpm test && pnpm check && pnpm validate-data && pnpm typecheck`.
4. Update the "File contracts" section of `SPEC.md` in the same PR if a path or kind changed.
5. Tell the owners of the pipeline, engine and web workstreams in the PR, and get their approval.
