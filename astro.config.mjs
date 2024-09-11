// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
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