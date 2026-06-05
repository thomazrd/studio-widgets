import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'CalculadoraWidget',
      formats: ['iife'],
      fileName: () => 'build.js',
    },
    rollupOptions: {
      output: {
        entryFileNames: 'build.js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
