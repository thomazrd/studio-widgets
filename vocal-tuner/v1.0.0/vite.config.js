import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'VocalTuner',
      formats: ['iife'],
      fileName: () => 'vocal-tuner.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
