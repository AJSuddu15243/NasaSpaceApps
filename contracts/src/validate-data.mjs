// Validates every file under web/public/data/ (and the same layout under mock/) against its contract,
// checks each .bin's byte length against its JSON header, and each imagery sidecar's .webp and extent.
// Usage: node src/validate-data.mjs [data-dir]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BIN_BYTES, validate } from './validate.mjs';

const DEFAULT_DIR = join(import.meta.dirname, '../../web/public/data');

/**
 * Path (relative to the data folder or to mock/) -> contract kind. `idField` must equal the file name.
 * README.md repeats this table for people; keep the two in step.
 */
export const PATHS = [
  { pattern: /^sites\.json$/, kind: 'sites' },
  { pattern: /^masks\/[^/]+\.json$/, kind: 'site-mask', idField: 'id' },
  { pattern: /^ephem\.json$/, kind: 'ephem' },
  { pattern: /^grid\/[^/]+\.json$/, kind: 'grid', idField: 'region' },
  { pattern: /^tiles\/[^/]+\.json$/, kind: 'tile' },
  { pattern: /^validation\/[^/]+\.json$/, kind: 'validation', idField: 'site_id' },
  { pattern: /^imagery\/[^/]+\.json$/, kind: 'imagery', idField: 'region' },
  { pattern: /^manifest\.json$/, kind: 'manifest' },
];

const contractFor = (rel) => PATHS.find((entry) => entry.pattern.test(rel.replace(/^mock\//, '')));

/**
 * @param {string} dir data folder
 * @returns {{ checked: number, errors: string[], ignored: string[], notice?: string }}
 */
export function validateDataDir(dir = DEFAULT_DIR) {
  if (!existsSync(dir)) return { checked: 0, errors: [], ignored: [], notice: `${dir} does not exist yet; nothing to validate` };

  const files = readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .map((rel) => rel.split('\\').join('/'))
    .filter((rel) => statSync(join(dir, rel)).isFile())
    // shortcut: baked/ (engine grid_fracs cache, web/scripts/bake.ts) has no contract yet; its format lives in
    // web/src/features/heatmap/baked.ts and web vitest guards it. Add a `baked` schema if other tools read it.
    .filter((rel) => !rel.startsWith('baked/'))
    .sort();
  const errors = [];
  const ignored = [];
  let checked = 0;

  for (const rel of files) {
    if (rel.endsWith('.bin')) {
      checked += 1;
      const header = rel.replace(/\.bin$/, '.json');
      if (!files.includes(header) || !(contractFor(header)?.kind in BIN_BYTES)) errors.push(`${rel}: no header ${header} with a binary contract`);
      continue; // its length is checked when its header is validated
    }
    if (!rel.endsWith('.json')) {
      ignored.push(rel);
      continue;
    }
    checked += 1;
    const contract = contractFor(rel);
    if (!contract) {
      errors.push(`${rel}: no contract for this path (see the path table in contracts/README.md)`);
      continue;
    }
    let data;
    try {
      data = JSON.parse(readFileSync(join(dir, rel), 'utf8'));
    } catch (error) {
      errors.push(`${rel}: not valid JSON (${error.message})`);
      continue;
    }
    const failures = validate(contract.kind, data);
    errors.push(...failures.map((f) => `${rel}: ${f.path} ${f.rule}: ${f.message}`));
    if (failures.length) continue;

    if (contract.idField && data[contract.idField] !== basename(rel, '.json')) {
      errors.push(`${rel}: ${contract.idField} "${data[contract.idField]}" does not match the file name`);
    }
    if (contract.kind === 'tile') {
      const expected = `${data.region}_${data.cell_m}m.json`;
      if (basename(rel) !== expected) errors.push(`${rel}: tile file name must be ${expected}`);
    }
    if (contract.kind === 'imagery') {
      const webp = rel.replace(/\.json$/, '.webp');
      if (!existsSync(join(dir, webp))) errors.push(`${rel}: ${basename(webp)} is missing`);
      // 1 mm: pixel_m is a binary fraction in practice, so real sidecars match exactly.
      for (const [axis, size, lo, hi] of [['x', 'width', 'x_min', 'x_max'], ['y', 'height', 'y_min', 'y_max']]) {
        if (Math.abs(data.pixel_m * data[size] - (data[hi] - data[lo])) > 1e-3) {
          errors.push(`${rel}: pixel_m * ${size} = ${data.pixel_m * data[size]} but ${hi} - ${lo} = ${data[hi] - data[lo]} (${axis} extent)`);
        }
      }
      if (data.pixel_m < data.source_pixel_m) errors.push(`${rel}: pixel_m ${data.pixel_m} < source_pixel_m ${data.source_pixel_m} (upsampled)`);
    }
    if (!(contract.kind in BIN_BYTES)) continue;
    const declared = BIN_BYTES[contract.kind](data);
    const bin = rel.replace(/\.json$/, '.bin');
    if (!files.includes(bin)) {
      errors.push(`${rel}: ${basename(bin)} is missing`);
    } else if (statSync(join(dir, bin)).size !== declared) {
      errors.push(`${bin}: ${statSync(join(dir, bin)).size} bytes, header declares ${declared}`);
    }
  }
  return { checked, errors, ignored };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_DIR;
  const { checked, errors, ignored, notice } = validateDataDir(dir);
  if (notice) console.log(`notice: ${notice}`);
  for (const error of errors) console.error(`FAIL ${error}`);
  console.log(`validate-data: ${checked} files checked, ${errors.length} errors, ${ignored.length} ignored (not .json or .bin)`);
  process.exit(errors.length ? 1 : 0);
}
