import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.js',
      name: 'ImageSearchWidget',
      formats: ['iife'],
      fileName: () => 'build.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name;
        }
      }
    }
  }
});
