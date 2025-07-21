import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://unamiradaalarte.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    })
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Ignore TypeScript unused variable warnings
          if (warning.code === 'TS6133') return;
          warn(warning);
        }
      }
    }
  }
});