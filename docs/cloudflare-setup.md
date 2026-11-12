# Running UIArchives on Cloudflare

The site is a [vinext](https://github.com/cloudflare/vinext) app (Next.js API on
Vite) deployed as one Cloudflare Worker. Everything uses free plans and needs no
payment method: Workers Free, D1, Workers KV, Cron Triggers, and Gmail SMTP for email.

| Piece | What it does |
| --- | --- |
| Worker `uiarchives` | Serves the site on `uiarchives.com` and `www.uiarchives.com` (`cloudflare.config.ts`) |
| D1 `uiarchives` | Submissions, review queue, automation runs, passkeys, email codes (`migrations/`) |
| KV `MEDIA` | Uploaded and fetched images/videos, served at `/media/…` |
| Cron `0 */6 * * *` | Crawls App Store, GitHub and Hacker News into the review queue (`lib/server/automation.ts`) |
| Claude routine (daily) | Curates new items and posts them to `/api/ingest` (`automation/claude-curator.md`) |

## Deploy

```sh
npx cf auth login          # once
bash scripts/go-live.sh
```

`go-live.sh` does everything, and is safe to re-run:

1. Keeps secrets in `.cloudflare-secrets` (git-ignored). It generates
   `SESSION_SECRET` and `INGEST_TOKEN` once, and asks for the rest the first time.
2. Builds (`npm run build`).
3. Deploys with `npx cf deploy --prebuilt --secrets-file …`. Secrets you skipped are deployed
   as the placeholder `not-set`, which the code treats as missing.
4. Applies any new D1 migrations.

### Secrets

| Name | Required | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | yes (generated) | Signs session and challenge cookies |
| `INGEST_TOKEN` | yes (generated) | Bearer token for `/api/ingest` (≥ 32 chars) |
| `ADMIN_EMAIL` | yes | Owner's email: new-submission notices and passkey sign-in codes |
| `SMTP_USER` | yes | Gmail address that sends email |
| `SMTP_PASS` | yes | Gmail app password (Google Account → Security → App passwords) |
| `GITHUB_TOKEN` | optional | Higher GitHub API limits for the crawl and enrichment |
| `TURNSTILE_SECRET_KEY` | optional | Spam check on the public submit forms |

To change one later, edit `.cloudflare-secrets` and re-run `go-live.sh`, or run
`npx cf workers secrets update <NAME> --worker uiarchives`.

## Review access (`/review`)

Only the owner can open `/review`, and only with a passkey (Touch ID, Face ID,
Windows Hello or a security key).

- **First time on a device:** click *Email me a code*. A 6-digit code is sent to
  `ADMIN_EMAIL`. It expires in 10 minutes, allows 5 attempts, and you can request
  a new one once a minute. Enter the code, then create the passkey.
- **After that:** use *Sign in with passkey*. Sessions last 14 days.
- Passkeys are tied to the hostname, so a new domain needs a new passkey.

## Email

Email goes out over Gmail SMTP (`smtp.gmail.com:465`, `lib/server/email.ts`)
from the `SMTP_USER` address. If the Worker ever moves to Workers Paid, add
`EMAIL: bindings.sendEmail()` to `cloudflare.config.ts`. The code then uses
Cloudflare Email Sending instead.

## Domain and DNS

`uiarchives.com` uses Cloudflare nameservers. The custom domains are attached on
deploy, and the workers.dev address is turned off. The GoDaddy mail records
(MX, SPF, DMARC) were copied into the zone with `scripts/dns-records.sh`.

## Daily Claude curator

A Claude Code cloud routine runs daily and follows `automation/claude-curator.md`.
It posts to `https://uiarchives.com/api/ingest` with `INGEST_TOKEN`.
Manage it at https://claude.ai/code/routines.

## Local development

```sh
npm run dev            # http://localhost:3001, with D1, KV and cron running locally
```

Local secrets go in `.dev.vars` (git-ignored). Locally, emails are only logged to
the console unless SMTP credentials are set. To create the local tables, run the
SQL files in `migrations/` against the local database. The dev server's explorer
at `/cdn-cgi/local/explorer/api` accepts raw SQL. Trigger the cron with:

```sh
curl -X POST "http://localhost:3001/cdn-cgi/local/explorer/api/local/scheduled?worker=uiarchives" \
  -H "content-type: application/json" -d '{"cron":"0 */6 * * *"}'
```
