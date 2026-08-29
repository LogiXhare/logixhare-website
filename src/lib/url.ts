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

export function url(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE}${path}` || '/';
}
