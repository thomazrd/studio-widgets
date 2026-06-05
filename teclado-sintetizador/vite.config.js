import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'TecladoSintetizador',
      formats: ['iife'],
      fileName: () => 'teclado-sintetizador.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
