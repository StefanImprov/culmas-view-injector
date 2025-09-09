import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
process.env.ROLLUP_SKIP_NODEJS_NATIVE = '1';
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
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
