import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { target: 'es2022' },
  server: {
    proxy: {
      // Dev only: forwards the scenarios API to the local server/ package.
      '/api': 'http://localhost:8787',
    },
  },
});
