# LogiXhare Technologies — Company Website

The marketing site at [logixhare.com](https://logixhare.com): services, industries,
ventures, and the documentation for Tidegard. Static Astro build, no client framework.

Built and deployed by GitHub Actions over SFTP. The host, the deploy account and its
key are repository secrets (`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`) and are
deliberately not named here.

## Local development

```
npm install
npm run dev        # dev server
npm run build      # static build into dist/ (109 pages)
npm run preview    # serve the built output
```

Node 22, matching CI. Dependencies are `astro` and `@astrojs/sitemap` only — there
are no devDependencies and no UI framework.

## Structure

```
src/pages/        routes; a file here is a URL
src/data/         the site's content, as typed TS modules
src/components/   Header, Footer, cards, icons; src/components/lx/ holds the
                  page-section pieces (PageIntro, Steps, Faq, Art, …)
src/layouts/      BaseLayout (every page) and DocsLayout (Tidegard docs)
src/styles/       global.css (design tokens, base elements) and pages.css
src/lib/url.ts    link and asset helper — see the staging note below
public/           images and static files, served unhashed
```

Routes: `index`, `services` (plus `services/[id]`), `industries` (plus
`industries/[slug]`), `ventures` (plus `ventures/[slug]`), `technologies`,
`how-we-work`, `about`, `contact`, and `tidegard` — which carries 22 documentation
pages under `tidegard/docs/` and 52 problem-type pages under `tidegard/problems/`.

The problem-type pages come from `src/data/tidegard-problems.ts`, which is itself
generated from the Tidegard repository's `docs/api/error-codes.md`. Regenerate it from
there rather than editing it by hand, so the API and its documentation cannot drift
apart.

Content is data, not markup: the industry and venture lists, the navigation, the
company details and the Tidegard docs index all live in `src/data/` (`industries.ts`,
`ventures.ts`, `nav.ts`, `company.ts`, `tidegard-docs.ts`, …). Edit those rather than
the page templates when you are changing what the site says.

## Theming

Colours, spacing and shadows are CSS custom properties declared in
`src/styles/global.css`. Light is the default — a lime page ground with the logo's
indigo as the accent — and dark redefines the same tokens under
`:root[data-theme='dark']`.

`prefers-color-scheme` is deliberately **not** consulted: the default is a brand
decision rather than an OS one. Dark is reached through the header toggle, the choice
is kept in `localStorage` under `lx-theme`, and `BaseLayout` stamps `data-theme` on
`<html>` before first paint so the page never flashes the wrong theme.

Style components through the tokens; a colour written as a literal will be wrong in
one of the two themes. The isometric icon chips are the deliberate exception and keep
one set of values in both themes, because the artwork carries fixed face tones. Type
is Manrope for display and body, JetBrains Mono for labels and data.

## Two things that will catch you out

**Internal links and `public/` assets must go through `src/lib/url.ts`.** Pull
request builds are served from `https://logixhare.com/staging/`, so a literal
`"/logo.jpg"` or `"/services/"` resolves against the domain root and 404s there.
Astro rewrites the asset URLs it generates itself, but not strings you write in
`href` or `src`.

**Replacing a file in `public/` in place needs `ASSET_VERSION` bumped**, in
`src/lib/url.ts`. Those filenames are not content-hashed and the host serves them
with a ten-year `max-age`, so a browser that has seen the old file keeps showing it.

Contact details live in exactly two places: the `contactCards` array in
`src/components/Footer.astro`, which every page inherits, and `contactMethods` plus
the meta description in `src/pages/contact.astro`.

## Workflow

- **Pull requests** build with `BASE_PATH=/staging` and deploy to
  `https://logixhare.com/staging/`; a comment with the preview link is posted on the
  PR automatically.
- **Merges to `main`** build and deploy to production. The deploy mirrors `dist/`
  over the web root and deletes anything not in the build, so the live site is always
  exactly what `main` produces.

The sitemap is generated only on the production build, and `public/robots.txt`
disallows `/staging/` — a preview that is a byte-for-byte copy of the live site
should not compete with it in search results.

## Deploy credentials

CI signs in with an SFTP account restricted by OpenSSH to this site's web root, so a
leaked key reaches nothing else on the host. The host, the account and the key are
held as the repository secrets named above and are never committed. Rotating the key
means replacing `SSH_PRIVATE_KEY` here and the matching public key in the account's
`authorized_keys`.
