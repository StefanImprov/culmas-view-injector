#!/usr/bin/env node

// Build script to create the React widget bundle
import { build } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Widget build configuration
const widgetConfig = {
  plugins: [
    // Import react plugin dynamically
    (await import('@vitejs/plugin-react')).default()
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget/widget.tsx'),
      name: 'CulmasWidget',
      fileName: 'culmas-widget',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        entryFileNames: 'culmas-widget.js',
        assetFileNames: 'culmas-widget.css'
      }
    },
    outDir: 'dist/widget',
    cssCodeSplit: false,
    minify: false, // Keep unminified for development
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
};

console.log('Building React widget...');

try {
  await build(widgetConfig);
  console.log('✓ React widget built successfully!');
} catch (error) {
  console.error('Failed to build React widget:', error);
  process.exit(1);
}