import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'GoogleSheetsClone',
      formats: ['iife'],
      fileName: () => 'build.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
