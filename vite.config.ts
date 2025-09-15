import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync } from "fs";

process.env.ROLLUP_SKIP_NODEJS_NATIVE = '1';

// Custom plugin to copy simple widget to public directory
const copySimpleWidgetPlugin = () => ({
  name: 'copy-simple-widget',
  buildStart() {
    // Copy the simple widget to public directory for development serving
    try {
      copyFileSync(
        path.resolve(__dirname, 'src/widget/simple-widget.js'),
        path.resolve(__dirname, 'public/simple-widget.js')
      );
      console.log('✓ Copied simple-widget.js to public directory');
    } catch (error: any) {
      console.warn('Failed to copy simple-widget.js:', error.message);
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => (process.env.ROLLUP_SKIP_NODEJS_NATIVE='1', process.env.ROLLUP_DISABLE_NODEJS_NATIVE='1', {
  base: command === 'build' ? '/culmas-view-injector/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    command === 'serve' && mode === 'development' && componentTagger(),
    copySimpleWidgetPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
