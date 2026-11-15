import { defineConfig } from 'vite';
export default defineConfig({
  build: { target: 'es2022' },
  server: {
    proxy: {
      // Dev only: forwards the scenarios API to the local server/ package.
      '/api': 'http://localhost:8787',
    },
  },
});
