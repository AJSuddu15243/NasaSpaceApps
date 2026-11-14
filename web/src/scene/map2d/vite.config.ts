import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: { entry: 'index.ts', formats: ['es'], fileName: 'map2d' },
    rollupOptions: { external: ['three'] },
  },
});
