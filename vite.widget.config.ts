import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Ensure no native Node.js modules
process.env.ROLLUP_SKIP_NODEJS_NATIVE = '1';
process.env.ROLLUP_DISABLE_NODEJS_NATIVE = '1';

// Widget-specific build configuration
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget/widget.tsx'),
      name: 'CulmasWidget',
      fileName: 'culmas-widget',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        entryFileNames: 'culmas-widget.js',
        assetFileNames: 'culmas-widget.css',
        format: 'umd'
      }
    },
    outDir: 'dist/widget',
    cssCodeSplit: false,
    minify: false, // Keep readable for debugging
    sourcemap: true, // Add source maps for debugging
    target: 'es2015'
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});