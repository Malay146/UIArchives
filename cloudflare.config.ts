import { bindings, defineConfig, defineWorker, triggers } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "uiarchives",
    // vinext's request handler plus a `scheduled` handler for automation.
    entrypoint: "./worker/index.ts",
    compatibilityDate: "2026-11-12",
    // Served on the apex and www (the zone is on Cloudflare DNS).
    domains: ["uiarchives.com", "www.uiarchives.com"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    triggers: [
      // Steady official sources (App Store, GitHub, Hacker News) every 6 hours.
      triggers.scheduled({ schedule: "0 */6 * * *" }),
    ],
    env: {
      ASSETS: bindings.assets(),

      // Review queue, submissions and everything approved.
      DB: bindings.d1({ name: "uiarchives" }),
      // Uploaded images and short videos, served from /media/*. Workers KV:
      // free (1 GB, no payment method), created automatically on deploy.
      MEDIA: bindings.kv(),

      SITE_URL: bindings.text("https://uiarchives.com"),
      // Used only if Cloudflare Email Sending (EMAIL binding) is added later.
      MAIL_FROM: bindings.text("UIArchives <hello@uiarchives.com>"),
      // Where "new submission" notifications go.
      ADMIN_EMAIL: bindings.secret(),

      // /review sign-in is passkey-only. This one-time code lets you register
      // a passkey (e.g. Touch ID) on a domain the first time.
      // Signs the review session cookie and hashes submitter IPs.
      SESSION_SECRET: bindings.secret(),
      // Bearer token the Claude automation uses to add candidates.
      INGEST_TOKEN: bindings.secret(),
      // Email via your Gmail: address + app password (free, ~500/day).
      SMTP_USER: bindings.secret(),
      SMTP_PASS: bindings.secret(),
      // Optional: GitHub token raises API limits for the skills/resources crawl.
      GITHUB_TOKEN: bindings.secret(),
      // Optional: Cloudflare Turnstile spam check on the public forms.
      TURNSTILE_SECRET_KEY: bindings.secret(),
    },
  }),
});
