import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.jsx',
      name: 'ChecklistApp',
      formats: ['iife'],
      fileName: () => 'build.js'
    },
    rollupOptions: {
      output: {
        extend: true
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
