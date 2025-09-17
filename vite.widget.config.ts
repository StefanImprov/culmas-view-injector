import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget/widget.tsx'),
      name: 'CulmasWidget',
      fileName: () => 'culmas-widget',
      formats: ['umd']
    },
    outDir: 'dist/widget',
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        entryFileNames: 'culmas-widget.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'culmas-widget.css';
          }
          return assetInfo.name || 'asset';
        }
      }
    },
    cssCodeSplit: false,
    minify: 'terser'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});