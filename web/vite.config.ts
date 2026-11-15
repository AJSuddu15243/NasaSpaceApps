import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { target: 'es2022' },
  server: {
    proxy: {
      // Preserve the browser origin for Solgaleo's same-origin check; the API binds IPv4 loopback.
      '/api': { target: 'http://127.0.0.1:8787', changeOrigin: false },
    },
  },
});
