# LogiXhare Technologies — Company Website

Static site (Astro), built and deployed by GitHub Actions over SFTP. The host, the deploy
account and its key are repository secrets (`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`) and
are deliberately not named here.

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

CI signs in with an SFTP account restricted by OpenSSH to this site's web root, so a leaked
key reaches nothing else on the host. The host, the account and the key are held as the
repository secrets named above and are never committed. Rotating the key means replacing
`SSH_PRIVATE_KEY` here and the matching public key in the account's `authorized_keys`.
