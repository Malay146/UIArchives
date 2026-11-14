import app from "vinext/server/fetch-handler";
import { runAutomation } from "../lib/server/automation";
import { POSTHOG_API_HOST, POSTHOG_ASSETS_HOST, POSTHOG_PROXY_PATH } from "../lib/analytics-config";

/**
 * Forwards /_ph/* to PostHog. Analytics then goes to our own domain, so
 * privacy blockers that drop requests to posthog.com don't drop real visits.
 */
async function proxyPostHog(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.slice(POSTHOG_PROXY_PATH.length) || "/";
  const upstream = new URL(path + url.search, path.startsWith("/static/") || path.startsWith("/array/") ? POSTHOG_ASSETS_HOST : POSTHOG_API_HOST);
  const headers = new Headers(req.headers);
  headers.delete("cookie");
  headers.set("host", upstream.host);
  // Lets PostHog resolve the visitor's country and city from their real IP.
  const ip = req.headers.get("cf-connecting-ip");
  if (ip) headers.set("x-forwarded-for", ip);
  return fetch(upstream, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    redirect: "manual",
  });
}

/**
 * The Worker: vinext serves the site; `scheduled` runs the automation that
 * gathers new candidates into the review queue.
 */
export default {
  ...app,
  async fetch(req: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(req.url);
    if (url.pathname === POSTHOG_PROXY_PATH || url.pathname.startsWith(`${POSTHOG_PROXY_PATH}/`)) {
      return proxyPostHog(req, url);
    }
    return app.fetch(req, env, ctx);
  },
  async scheduled(controller: ScheduledController, _env: unknown, ctx: ExecutionContext) {
    ctx.waitUntil(runAutomation(controller.cron));
  },
};
