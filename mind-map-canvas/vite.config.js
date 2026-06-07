import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'MindMapCanvas',
      formats: ['iife'],
      fileName: () => 'build.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [cssInjectedByJsPlugin()],
});