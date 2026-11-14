// Validates a parsed JSON value against one contract: the JSON Schema first, then the cross-field rules
// that JSON Schema cannot express. Used by the tests and by validate-data.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export const SCHEMA_DIR = join(import.meta.dirname, '../schemas');
const SHARED = 'common';

const schemas = readdirSync(SCHEMA_DIR)
  .filter((file) => file.endsWith('.schema.json'))
  .map((file) => JSON.parse(readFileSync(join(SCHEMA_DIR, file), 'utf8')));

/** Every contract kind, i.e. every schema except the shared definitions. */
export const KINDS = schemas.map((schema) => schema.$id.replace('.schema.json', '')).filter((kind) => kind !== SHARED);

const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true, schemas });
addFormats(ajv);

export const ITEMSIZE = { uint8: 1, int16: 2, uint16: 2, float32: 4 };

/** Cross-field rules for a grid header that already passed its schema. */
function checkGrid(grid) {
  const failures = [];
  const fail = (rule, path, message) => failures.push({ rule, path, message });
  const cells = grid.nx * grid.ny;

  const missing = grid.layers.filter((name) => !(name in grid.layer_info));
  const extra = Object.keys(grid.layer_info).filter((name) => !grid.layers.includes(name));
  if (missing.length || extra.length) {
    fail('grid.layer_info_keys', '/layer_info', `keys must equal layers (missing: ${missing}; extra: ${extra})`);
    return failures;
  }
  if (grid.layer_info.mask && grid.layer_info.mask.components !== grid.bins) {
    fail('grid.mask_components', '/layer_info/mask/components', `must equal bins (${grid.bins})`);
  }
  let offset = 0;
  for (const name of grid.layers) {
    const layer = grid.layer_info[name];
    const expected = cells * layer.components * ITEMSIZE[layer.dtype];
    if (layer.byte_length !== expected) {
      fail('grid.byte_length', `/layer_info/${name}/byte_length`, `must be nx * ny * components * itemsize = ${expected}`);
    }
    if (layer.byte_offset !== offset) {
      fail('grid.byte_offset', `/layer_info/${name}/byte_offset`, `must be ${offset}: layers are contiguous in the order of layers`);
    }
    offset = layer.byte_offset + layer.byte_length;
  }
  return failures;
}

/** Site ids name files (masks/{id}.json), so they must be unique. */
function checkSites(sites) {
  const ids = sites.map((site) => site.id);
  return ids.flatMap((id, i) => (ids.indexOf(id) === i ? [] : [{ rule: 'sites.unique_id', path: `/${i}/id`, message: `"${id}" is used more than once` }]));
}

const CHECKS = { grid: checkGrid, sites: checkSites };

/**
 * @param {string} kind one of KINDS
 * @param {unknown} data parsed JSON
 * @returns {{ rule: string, path: string, message: string }[]} empty when valid. `rule` is the JSON Schema
 *   keyword that failed, or a cross-field rule id such as "grid.byte_length"; `path` is a JSON pointer.
 */
export function validate(kind, data) {
  const check = ajv.getSchema(`${kind}.schema.json`);
  if (!check || kind === SHARED) throw new Error(`unknown contract kind: ${kind}`);
  if (!check(data)) {
    return check.errors.map((error) => ({ rule: error.keyword, path: error.instancePath, message: error.message ?? '' }));
  }
  return CHECKS[kind]?.(data) ?? [];
}

/** Byte length a valid header declares for its sibling .bin, keyed by the kinds that have one. */
export const BIN_BYTES = {
  ephem: (header) => header.n * header.fields.length * ITEMSIZE[header.dtype],
  tile: (header) => header.nx * header.ny * ITEMSIZE[header.dtype],
  grid: (header) => header.layers.reduce((sum, name) => sum + header.layer_info[name].byte_length, 0),
};
