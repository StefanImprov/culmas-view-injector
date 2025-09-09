import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
process.env.ROLLUP_SKIP_NODEJS_NATIVE = '1';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => (process.env.ROLLUP_SKIP_NODEJS_NATIVE='1', process.env.ROLLUP_DISABLE_NODEJS_NATIVE='1', {
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
