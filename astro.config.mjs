// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://pipbypip.pages.dev',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  // No UI framework on purpose. The interactive pieces are small enough to be
  // plain JavaScript, which keeps lesson pages fast on a phone.
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
