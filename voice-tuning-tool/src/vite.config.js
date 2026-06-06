import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [cssInjectedByJsPlugin()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/main.js',
      name: 'VoiceTuningWidget',
      formats: ['iife'],
      fileName: () => 'build.js'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
