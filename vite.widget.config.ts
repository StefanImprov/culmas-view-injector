import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
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
        assetFileNames: 'culmas-widget.css'
      }
    },
    outDir: 'dist/widget',
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});