import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
  // viteSingleFile inlines all JS + CSS into a single dist/index.html, so the
  // built app runs by double-clicking the file (file://) with no server and no
  // ES-module CORS issues. It also deploys fine to any static host.
  plugins: [react(), viteSingleFile()],
  // Relative paths so the one external asset (favicon) resolves from disk too.
  base: './',
});
