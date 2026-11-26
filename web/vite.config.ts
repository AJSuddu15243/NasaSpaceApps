import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
function assetHashes() {
  const hashes: Record<string, string> = {};
  const walk = (dir: string, url: string) => {
    for (const file of readdirSync(dir, { withFileTypes: true })) {
      if (file.isDirectory()) walk(join(dir, file.name), `${url}/${file.name}`);
      else hashes[`${url}/${file.name}`] = createHash('sha256').update(readFileSync(join(dir, file.name))).digest('hex');
    }
  };
  for (const dir of ['data', 'textures']) walk(fileURLToPath(new URL(`./public/${dir}`, import.meta.url)), `/${dir}`);
  return hashes;
}
export default defineConfig(({ command }) => {
 const hashes = command === 'build' ? assetHashes() : {};
 return {
  define: { __ASSET_HASHES__: JSON.stringify(hashes), __ASSET_REVISION__: JSON.stringify(createHash('sha256').update(JSON.stringify(hashes)).digest('hex').slice(0, 16)) },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { target: 'es2022' },
  server: {
    proxy: {
      // Preserve the browser origin for Solgaleo's same-origin check; the API binds IPv4 loopback.
      '/api': { target: 'http://127.0.0.1:8787', changeOrigin: false },
    },
  },
}; });
