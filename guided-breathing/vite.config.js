import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'GuidedBreathingWidget',
      fileName: () => 'guided-breathing.js',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        extend: true
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false
  }
});
