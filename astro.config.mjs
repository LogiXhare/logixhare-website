// @ts-check
import { defineConfig } from 'astro/config';

// BASE_PATH is set to '/staging' only for the CI staging-preview build, so that
// generated asset URLs (CSS/JS/images) resolve under https://logixhare.com/staging/
// instead of site root. Production builds get the default '/' (unset env var).
const base = process.env.BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://logixhare.com',
  base,
  output: 'static',
});
