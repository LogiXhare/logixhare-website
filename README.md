# LogixHare Technologies — Company Website

Static site (Astro), auto-deployed via GitHub Actions to `earth.wetechi.com` (HestiaCP) over FTPS.

## Workflow

- **Pull requests** build and deploy to `https://logixhare.com/staging/` for review — a comment with the preview link is posted on the PR automatically.
- **Merges to `main`** build and deploy straight to production (`https://logixhare.com/`).

## Local development

```
npm install
npm run dev
```

## Structure

- Home, Services, About, Contact — content lives under `src/pages/`.
- Shared layout/branding tokens (navy `#152a4a`, teal `#2dc7c9`) in `src/layouts/` and `src/styles/`.

## Deploy credentials

CI uses a HestiaCP FTPS account (`wetechi_deploy`) scoped only to the `logixhare.com` web root — stored as repo secrets (`FTP_HOST`, `FTP_USER`, `FTP_PASS`), never committed.
