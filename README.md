# Revenue Dashboard

An executive revenue dashboard built with [Next.js](https://nextjs.org) (App Router),
React, Tailwind CSS, and Recharts. Pages include the main dashboard, activities,
settings, and a contact-message inbox at `/messages`. Each chart/section is driven
by a dedicated API route under `app/api/` that currently returns static data —
response shapes are stable so a real database can be added later without frontend
changes.

Feature specs live in `_specs/`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/?token=&lt;your-token&gt;](http://localhost:3000/?token=%3Cyour-token%3E)
with the value of `SITE_ACCESS_TOKEN` from `.env.local` — the site is
token-protected and shows "Permission denied" without it
(see [Access protection](#access-protection) below).

Other commands:

```bash
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint
npx vitest run       # Unit tests (./test)
npx playwright test  # E2E tests (./e2e)
```

## Access protection

The entire site (all pages and API routes) is gated by a shared access token,
enforced in `proxy.ts`. Requests without a valid token get `403 Permission denied`
— an HTML page for page requests, JSON for `/api/*`.

### Setup

Set `SITE_ACCESS_TOKEN` in `.env.local` (gitignored):

```bash
echo "SITE_ACCESS_TOKEN=$(openssl rand -hex 32)" >> .env.local
```

The same variable is configured on Vercel (Production and Preview) as a sensitive
env var:

```bash
printf '%s' "<token>" | vercel env add SITE_ACCESS_TOKEN production
printf '%s' "<token>" | vercel env add SITE_ACCESS_TOKEN preview
```

### How it works

- Visit any page once with `?token=<value>`. If it matches, the proxy sets an
  httpOnly `site_access_token` cookie (30 days) and redirects to the clean URL.
- Subsequent requests are allowed by the cookie; everyone else gets `403`.
- Tokens are compared via SHA-256 digests rather than raw strings to avoid
  leaking the token through response-timing differences.
- Fail-closed: if `SITE_ACCESS_TOKEN` is unset, every request is denied.
- Static assets (`_next/static`, `_next/image`, `favicon.ico`) are not gated.

Quick login from the project root:

```bash
open "http://localhost:3000/?token=$(grep '^SITE_ACCESS_TOKEN=' .env.local | cut -d= -f2)"
```

Env vars apply only to new deployments — after changing the token on Vercel,
redeploy for it to take effect.

## Contact messages

A Formspree-style endpoint plus an inbox UI at `/messages`.

### Endpoint

`POST /api/messages` accepts `multipart/form-data`, `application/x-www-form-urlencoded`,
or JSON. Fields: `name`, `email`, `message` (required), `reason`, `_subject`, and
`_gotcha` (honeypot — filled submissions are accepted and discarded).

```bash
curl 'http://localhost:3000/api/messages' \
  -H 'Accept: application/json' \
  -H 'Cookie: site_access_token=<token>' \
  --form-string 'name=Gabby' \
  --form-string 'email=gabby@arnica.io' \
  --form-string 'reason=general' \
  --form-string 'message=Does the contact form deliver?' \
  --form-string '_subject=Contact Form'
```

Returns `201 {"ok":true,"id":"..."}`, or `422 {"ok":false,"errors":[...]}` on validation failure.

Read back with `GET /api/messages` (summaries, newest first) and
`GET /api/messages/:id` (full message), and remove one with
`DELETE /api/messages/:id` (idempotent; unknown ids still return `200`).

### Storage

One JSON file per message, so concurrent submissions can't overwrite each other.

- **Local dev** — `data/messages/<id>.json` (gitignored).
- **Vercel** — the filesystem is read-only, so `lib/messages-store.ts` switches to
  Vercel Blob as soon as `BLOB_READ_WRITE_TOKEN` or `BLOB_STORE_ID` is present.

Provision the store once, then pull the env vars:

```bash
vercel blob create-store revenue-dashboard-messages --access private
vercel env pull .env.local
```

Set `BLOB_ACCESS=public` if the store was created public; it defaults to `private`.

## Deploy on Vercel

The project is linked to the `revenue-dashboard` project on Vercel. Deploy with:

```bash
vercel          # preview deployment
vercel --prod   # production
```

Remember that `SITE_ACCESS_TOKEN` (and the Blob env vars, if used) must be set
in the target environment or the site will deny all requests.
