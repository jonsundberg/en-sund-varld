import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://en-sund-varld.se',
  output: 'hybrid',
  adapter: vercel(),
});
