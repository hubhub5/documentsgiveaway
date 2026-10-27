import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';

export default defineConfig({
  site: site.url,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
