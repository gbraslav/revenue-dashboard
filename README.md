This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contact messages

A Formspree-style endpoint plus an inbox UI at `/messages`.

### Endpoint

`POST /api/messages` accepts `multipart/form-data`, `application/x-www-form-urlencoded`,
or JSON. Fields: `name`, `email`, `message` (required), `reason`, `_subject`, and
`_gotcha` (honeypot — filled submissions are accepted and discarded).

```bash
curl 'http://localhost:3000/api/messages' \
  -H 'Accept: application/json' \
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
