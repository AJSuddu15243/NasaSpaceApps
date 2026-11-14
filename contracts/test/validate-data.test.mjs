import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { validateDataDir } from '../src/validate-data.mjs';

const examples = join(import.meta.dirname, '../examples/valid');
const example = (kind) => JSON.parse(readFileSync(join(examples, `${kind}.json`), 'utf8'));

let root;
const put = (rel, kind) => {
  mkdirSync(join(root, rel, '..'), { recursive: true });
  cpSync(join(examples, `${kind}.json`), join(root, rel));
};
const putBin = (rel, bytes) => writeFileSync(join(root, rel), new Uint8Array(bytes));

// A complete data folder built from the valid examples, with .bin files of the size each header declares.
function buildDataDir(prefix = '') {
  const grid = example('grid');
  const tile = example('tile');
  put(`${prefix}sites.json`, 'sites');
  put(`${prefix}manifest.json`, 'manifest');
  put(`${prefix}masks/${example('site-mask').id}.json`, 'site-mask');
  put(`${prefix}validation/${example('validation').site_id}.json`, 'validation');
  put(`${prefix}ephem.json`, 'ephem');
  putBin(`${prefix}ephem.bin`, example('ephem').n * 24);
  put(`${prefix}grid/${grid.region}.json`, 'grid');
  putBin(`${prefix}grid/${grid.region}.bin`, grid.layers.reduce((sum, name) => sum + grid.layer_info[name].byte_length, 0));
  put(`${prefix}tiles/${tile.region}_240m.json`, 'tile');
  putBin(`${prefix}tiles/${tile.region}_240m.bin`, tile.nx * tile.ny * 4);
}

beforeEach(() => { root = mkdtempSync(join(tmpdir(), 'contracts-data-')); });
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('validateDataDir', () => {
  it('passes with a notice when the folder does not exist', () => {
    const result = validateDataDir(join(root, 'missing'));
    expect(result.errors).toEqual([]);
    expect(result.notice).toMatch(/does not exist/);
  });

  it('accepts a complete folder, including the same layout under mock/', () => {
    buildDataDir();
    buildDataDir('mock/');
    const result = validateDataDir(root);
    expect(result.errors).toEqual([]);
    expect(result.checked).toBe(20);
  });

  it.each([
    ['ephem.bin', /ephem\.bin: 47 bytes, header declares 48/],
    ['grid/demo.bin', /grid\/demo\.bin: \d+ bytes, header declares \d+/],
    ['tiles/demo_240m.bin', /tiles\/demo_240m\.bin: 23 bytes, header declares 24/],
  ])('rejects %s one byte short', (rel, message) => {
    buildDataDir();
    putBin(rel, readFileSync(join(root, rel)).length - 1);
    expect(validateDataDir(root).errors).toEqual([expect.stringMatching(message)]);
  });

  it('rejects a header whose .bin is missing and a .bin without a header', () => {
    buildDataDir();
    rmSync(join(root, 'ephem.bin'));
    putBin('grid/orphan.bin', 4);
    expect(validateDataDir(root).errors).toEqual([
      expect.stringMatching(/ephem\.json: ephem\.bin is missing/),
      expect.stringMatching(/grid\/orphan\.bin: no header/),
    ]);
  });

  it('rejects a .json that matches no contract path', () => {
    buildDataDir();
    put('mock/extra/sites.json', 'sites');
    expect(validateDataDir(root).errors).toEqual([expect.stringMatching(/mock\/extra\/sites\.json: no contract/)]);
  });

  it('rejects a file whose id differs from its file name', () => {
    buildDataDir();
    put('masks/another-site.json', 'site-mask');
    expect(validateDataDir(root).errors).toEqual([expect.stringMatching(/masks\/another-site\.json: id .* does not match the file name/)]);
  });

  it('reports schema failures with the path and rule', () => {
    buildDataDir();
    writeFileSync(join(root, 'ephem.json'), JSON.stringify({ ...example('ephem'), dtype: 'float64' }));
    expect(validateDataDir(root).errors).toEqual([expect.stringMatching(/ephem\.json: \/dtype const/)]);
  });

  it('ignores files that are neither .json nor .bin and counts them', () => {
    buildDataDir();
    putBin('texture.png', 8);
    const result = validateDataDir(root);
    expect(result.errors).toEqual([]);
    expect(result.ignored).toEqual(['texture.png']);
  });
});
