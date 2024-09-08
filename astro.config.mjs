// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), db()],
  output: 'server', 
  server: {
    // @ts-ignore
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
      }
    }
  }
});