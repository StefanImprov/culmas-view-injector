import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

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
        entryFileNames: 'culmas-widget.js'
      }
    },
    outDir: 'public/widget',
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