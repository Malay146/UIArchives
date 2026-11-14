/**
 * PostHog settings shared by the browser, the Worker proxy and server events.
 *
 * The project key is public by design (it can only send events, never read
 * them), so it is inlined at build time from NEXT_PUBLIC_POSTHOG_KEY in .env.
 * Without it, analytics is switched off everywhere and nothing is sent.
 */
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";

/**
 * Sent with every event. The PostHog project can be shared with other
 * sites, so filter or break down by `site = uiarchives` to see only this one.
 */
export const SITE_TAG = "uiarchives";

/** The reviewer's PostHog id, namespaced so it never merges with another site's users. */
export const REVIEWER_ID = "uiarchives-reviewer";

/** "us" or "eu" — the region your PostHog project lives in. */
const REGION = (process.env.NEXT_PUBLIC_POSTHOG_REGION ?? "us").toLowerCase() === "eu" ? "eu" : "us";

/** Where events are sent from the server and where the proxy forwards to. */
export const POSTHOG_API_HOST = `https://${REGION}.i.posthog.com`;
export const POSTHOG_ASSETS_HOST = `https://${REGION}-assets.i.posthog.com`;
/** The PostHog app itself (used for links from the toolbar). */
export const POSTHOG_UI_HOST = `https://${REGION}.posthog.com`;

/**
 * Same-origin path the browser talks to. The Worker forwards it to PostHog,
 * so ad blockers that drop requests to posthog.com don't drop our events.
 */
export const POSTHOG_PROXY_PATH = "/_ph";
