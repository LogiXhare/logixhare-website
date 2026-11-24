/**
 * Prefixes an internal path with Astro's configured `base`.
 *
 * Astro rewrites asset URLs it generates itself (bundled CSS/JS, <Image>),
 * but it does NOT touch literal strings in `href`/`src`. On the staging
 * preview the site is served from /staging/, so a bare "/logo.jpg" or
 * "/services/" resolves against the domain root and 404s. Every internal
 * link and public/ asset reference must go through this.
 *
 * Production (base '/') returns the path unchanged.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/**
 * The host serves public/ files with a ten-year max-age, and public/ names are
 * not hashed, so a browser that saw the old logo keeps showing it. Images get
 * this version appended; bump it whenever a file in public/ is replaced in place.
 */
export const ASSET_VERSION = '20261125';
const VERSIONED = /\.(png|jpe?g|svg|webp|gif|ico)$/i;

export function url(path: string): string {
  if (!path.startsWith('/')) return path;
  const v = VERSIONED.test(path) ? `?v=${ASSET_VERSION}` : '';
  return `${BASE}${path}${v}` || '/';
}
