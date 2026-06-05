import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/main.js',
      name: 'MiroClone',
      formats: ['iife'],
      fileName: () => 'index.js'
    }
  }
});
