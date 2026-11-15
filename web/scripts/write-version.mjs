import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

// Public provenance only: never serialize the environment into a browser asset.
const commit = process.env.VERCEL_GIT_COMMIT_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Missing valid build commit');
writeFileSync(new URL('../dist/version.json', import.meta.url), JSON.stringify({ commit }) + '\n');
