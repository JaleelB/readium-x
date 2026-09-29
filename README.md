# ReadiumX

[![Twitter Follow](https://img.shields.io/twitter/follow/JaleelB?style=social)](https://twitter.com/jal_eelll)
[![GitHub Repo stars](https://img.shields.io/github/stars/JaleelB/readium-x?style=social)](https://github.com/JaleelB/readium-x/stargazers)

https://github.com/user-attachments/assets/1c3a5138-0fc7-43e9-b0a2-761e70f9c83c

<h3 align="center">ReadiumX</h3>

<p align="center">
    The open-source tool that provides access to premium Medium articles without the paywall
    <br />
    <a href="https://readiumx.com"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="#introduction"><strong>Introduction</strong></a> ·
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#contributing"><strong>Contributing</strong></a>
</p>

## Introduction

ReadiumX is an open source tool that provides access to premium Medium articles without the paywall, allowing you to bookmark, and manage your reading experience across any device

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [TursoDB](https://turso.tech/) – database
- [Clerk](https://clerk.com/) – auth and auth emails
- [DrizzleORM](https://orm.drizzle.team/) – ORM
- [TipTap](https://www.tiptap.dev/) – editor
- [Shadcn](https://ui.shadcn.com/) – component library
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) – deployments and article extraction cache

## Features

- Access Premium Articles: Bypass paywalls to access content freely.
- Bookmarking System: Save your favorite articles for later reading.
- Progress Tracking: Automatically saves your reading progress to resume where you left off.
- Reading History Management: View and manage your reading history with options to delete records.

## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/JaleelB/readium-x.git
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Copy the `.env.example` to `.env.local` and update the variables.

   ```bash
   cp .env.example .env.local
   ```

4. Start the normal Next.js development server

   ```bash
   pnpm run dev
   ```

   This runs at `http://localhost:3156`. In this mode, Cloudflare bindings are
   simulated through OpenNext's local dev bridge when available. If the
   `READIUMX_ARTICLE_CACHE` binding is not available, scraping still works; it
   simply skips the server-side KV cache and uses the existing client session
   cache.

5. Push the database schema

   ```bash
   pnpm run db:push
   ```

6. To test the app in the Cloudflare Workers runtime locally, copy
   `.dev.vars.example` to `.dev.vars`, fill in the values, then run:

   ```bash
   cp .dev.vars.example .dev.vars
   pnpm preview
   ```

   `pnpm preview` builds the OpenNext worker and starts Wrangler, usually at
   `http://localhost:8787`. This is the mode to use when you specifically want
   to verify the Cloudflare KV cache behavior before deployment.

## Cloudflare Deployment

ReadiumX deploys to Cloudflare Workers through OpenNext.

1. Create separate remote KV namespaces for production and preview:

   ```bash
   pnpm wrangler kv namespace create readiumx-article-cache
   pnpm wrangler kv namespace create readiumx-article-cache-preview
   ```

   These commands create the real Cloudflare KV namespaces. They require
   `wrangler login` locally or `CLOUDFLARE_API_TOKEN` in CI. For day-to-day
   `pnpm dev`, you do not need to run them first; they are required before
   deploying or testing against real Cloudflare resources.

2. Put the generated namespace IDs into `wrangler.jsonc` for the
   `READIUMX_ARTICLE_CACHE` binding. Keep the production namespace as `id` and
   the preview namespace as `preview_id`. If Wrangler offers to add the binding
   for you, use `READIUMX_ARTICLE_CACHE` as the binding name; the app does not
   read lowercase binding names.

3. Add the application variables and secrets from `.dev.vars.example` to Cloudflare Workers.

4. Add these GitHub repository secrets for deployment:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`

5. Preview or deploy:

   ```bash
   pnpm preview
   pnpm deploy
   ```

### Worker CPU and Clerk

Public files in `public/` (`robots.txt`, `sitemap.xml`, manifests) are served by
Workers Static Assets because `wrangler.jsonc` sets `assets.run_worker_first`
to `false`. Leave that `false`. `worker.ts` is a second line of defense for
those paths, and it 404s scanner probes (`.php`, `.env`, `wp-login`, …) before
Next.js or Clerk load. It does not block crawlers by User-Agent.

Clerk stays installed. Middleware only runs on auth, account, article,
bookmark, and history routes. The homepage does not call `auth()`, so anonymous
and crawler traffic does not enter the handshake flow.

Production Clerk keys cannot be set from this repo. In the Cloudflare Worker
secrets for `readiumx.com`, set:

- `CLERK_SECRET_KEY` to a live key (`sk_live_...`)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to the matching live key (`pk_live_...`)

Clerk decides development vs production from the publishable key: anything
other than `pk_live_` is a development instance. Cookieless document GETs then
redirect into the handshake, and a failed handshake token throws from
`handleTokenVerificationErrorInDevelopment` (HTTP 500) on every route that
still runs middleware (`/signin`, `/account`, …). `sk_test_` paired with
`pk_live_` is also wrong — signature checks fail. The worker logs a warning
when the production host is using non-live keys.
Redeploy after changing `NEXT_PUBLIC_*` values so the client bundle picks them
up; Worker secrets alone do not rewrite the already-built client script.

There is no HTTP→HTTPS or www→apex redirect in the app. Both `readiumx.com` and
`www.readiumx.com` are attached as Worker custom domains, so each host invokes
the Worker once. Cloudflare's "Always Use HTTPS" runs before the Worker and
does not double-execute it. If you want a single host, add a Cloudflare
Redirect Rule (Bulk Redirects or Single Redirects), not a redirect inside
middleware — a middleware redirect spends Worker CPU twice.

Optional follow-up, not required for this fix: remove Clerk only if accounts,
bookmarks, and history are going away. The app still uses it for sign-in,
protected pages, and the Clerk webhook.

### Setting up Google Provider

If you want google login, you'll need to setup a google project and create some keys:

1. https://console.cloud.google.com/apis/credentials
2. create a new project
3. setup oauth consent screen
4. create credentials - oauth client id
5. for authorized javascript origins

- http://localhost:3000
- https://your-domain.com

6. Authorized redirect URIs

- http://localhost:3000/api/login/google/callback
- https://your-domain.com/api/login/google/callback

7. Set your google id and secret inside of .env

- **GOOGLE_CLIENT_ID**
- **GOOGLE_CLIENT_SECRET**

### Setting up Github Provider

If you want github login, you'll need to setup a github project and create some keys:

1. https://github.com/settings/developers
2. Create a new OAuth App
3. Create an application for the for local development:
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/login/github/callback
4. Create an application for the for production:
   - Homepage URL: https://your-domain.com
   - Authorization callback URL: https://your-domain.com/api/login/github/callback

## Contributing

Contributions are welcome! Please open an issue if you have any questions or suggestions. Your contributions will be acknowledged. See the [contributing guide](./CONTRIBUTING.md) for more information.

## License

Licensed under the MIT License. Check the [LICENSE](./LICENSE.md) file for details.
