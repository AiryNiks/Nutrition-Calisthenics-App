import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Serve from the repo subpath on GitHub Pages; root path during local dev.
  base: process.env.GITHUB_ACTIONS ? '/Nutrition-Calisthenics-App/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
});
