// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// BASE_PATH is set to '/staging' only for the CI staging-preview build, so that
// generated asset URLs (CSS/JS/images) resolve under https://logixhare.com/staging/
// instead of site root. Production builds get the default '/' (unset env var).
const base = process.env.BASE_PATH || '/';

// The staging build would otherwise emit a sitemap full of
// https://logixhare.com/staging/... URLs. robots.txt already disallows that
// path, and a sitemap is an explicit invitation to index — the two should not
// contradict each other.
const isStaging = base !== '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://logixhare.com',
  base,
  output: 'static',
  integrations: [
    // Generated from the routes that actually build, rather than written by
    // hand: a static list goes stale the first time a page is added and nobody
    // remembers the file exists.
    ...(isStaging
      ? []
      : [
          sitemap({
            changefreq: 'monthly',
            lastmod: new Date(),
          }),
        ]),
  ],
});
