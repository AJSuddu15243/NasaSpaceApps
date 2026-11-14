// Generates web/src/contracts/<kind>.ts and index.ts from the schemas.
// Usage: node src/gen.mjs          write the files
//        node src/gen.mjs --check  exit 1 if the files on disk differ from what would be written
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { compileFromFile } from 'json-schema-to-typescript';
import { KINDS, SCHEMA_DIR } from './validate.mjs';

const OUT_DIR = join(import.meta.dirname, '../../web/src/contracts');
const banner = (source) =>
  `/* GENERATED from contracts/schemas/${source} by \`pnpm gen\` in contracts/. DO NOT EDIT: change the schema, then regenerate. */`;

async function generate() {
  const files = new Map();
  const declared = new Map(); // exported type name -> { kind whose file index.ts re-exports it from, declaration }
  for (const kind of [...KINDS].sort()) {
    const source = `${kind}.schema.json`;
    const text = await compileFromFile(join(SCHEMA_DIR, source), {
      cwd: SCHEMA_DIR,
      bannerComment: banner(source),
      additionalProperties: false,
      unreachableDefinitions: true,
      ignoreMinAndMaxItems: true, // plain arrays, not 360-element tuples; lengths are enforced by the schema
    });
    files.set(`${kind}.ts`, text);
    // Types from common.schema.json are emitted into every file that references them. index.ts exports each
    // name once, from the first file, and generation fails if two files declare a name differently.
    for (const chunk of text.split(/^(?=export )/m).slice(1)) {
      const declaration = chunk.replace(/\/\*\*(?:(?!\*\/)[\s\S])*\*\/\s*$/, '').trim();
      const name = declaration.match(/^export (?:interface|type) (\w+)/)[1];
      const first = declared.get(name);
      if (first && first.declaration !== declaration) {
        throw new Error(`type ${name} is declared differently in ${first.kind}.ts and ${kind}.ts; rename one schema title`);
      }
      if (!first) declared.set(name, { kind, declaration });
    }
  }
  const lines = [...KINDS].sort().map((kind) => {
    const names = [...declared].filter(([, d]) => d.kind === kind).map(([name]) => name).sort();
    return `export type { ${names.join(', ')} } from './${kind}';`;
  });
  files.set('index.ts', `${banner('*.schema.json')}\n\n${lines.join('\n')}\n`);
  return files;
}

const files = await generate();
const onDisk = existsSync(OUT_DIR) ? readdirSync(OUT_DIR) : [];
const extra = onDisk.filter((name) => !files.has(name));

if (process.argv.includes('--check')) {
  const stale = [...files].filter(([name, text]) => !onDisk.includes(name) || readFileSync(join(OUT_DIR, name), 'utf8') !== text).map(([name]) => name);
  for (const name of stale) console.error(`STALE web/src/contracts/${name}`);
  for (const name of extra) console.error(`UNEXPECTED web/src/contracts/${name} (not generated)`);
  if (stale.length || extra.length) {
    console.error('Generated types are out of date. Run `pnpm gen` in contracts/ and commit the result.');
    process.exit(1);
  }
  console.log(`check: ${files.size} generated files are up to date`);
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const name of extra) rmSync(join(OUT_DIR, name));
  for (const [name, text] of files) writeFileSync(join(OUT_DIR, name), text);
  console.log(`gen: wrote ${files.size} files to web/src/contracts/`);
}
