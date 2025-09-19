import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/embed/embed.tsx'),
      name: 'CulmasEmbed',
      fileName: () => 'culmas-embed',
      formats: ['umd']
    },
    outDir: 'dist/embed',
    rollupOptions: {
      external: [],           // bundle React inside to avoid host deps
      output: {
        globals: {},
        entryFileNames: 'culmas-embed.js',
      }
    },
    cssCodeSplit: false,
    minify: 'terser'
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  define: { 'process.env.NODE_ENV': '"production"' }
});