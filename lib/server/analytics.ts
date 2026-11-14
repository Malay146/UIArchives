import { cookies } from "next/headers";
import { POSTHOG_API_HOST, POSTHOG_KEY, REVIEWER_ID, SITE_TAG } from "@/lib/analytics-config";

/**
 * Server-side PostHog events: things that only the server knows happened
 * (a submission was stored, an item was approved, automation queued items).
 *
 * When the request came from a browser that PostHog already knows, the event
 * is tied to that same visitor, so a submission shows up in their journey.
 * Never send emails or names here.
 */
export async function captureServer(event: string, properties: Record<string, unknown> = {}, distinctId?: string) {
  if (!POSTHOG_KEY) return;
  const id = distinctId ?? (await visitorId()) ?? "uiarchives-server";
  try {
    await fetch(`${POSTHOG_API_HOST}/i/v0/e/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        distinct_id: id,
        timestamp: new Date().toISOString(),
        properties: {
          ...properties,
          site: SITE_TAG,
          $lib: "uiarchives-server",
          // Person profiles only for the identified reviewer, like the browser.
          $process_person_profile: id === REVIEWER_ID,
        },
      }),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // Analytics must never break a request.
  }
}

/** The visitor's PostHog id from their cookie, if the request has one. */
async function visitorId(): Promise<string | undefined> {
  try {
    const raw = (await cookies()).get(`ph_${POSTHOG_KEY}_posthog`)?.value;
    if (!raw) return undefined;
    const id = (JSON.parse(decodeURIComponent(raw)) as { distinct_id?: unknown }).distinct_id;
    return typeof id === "string" && id ? id : undefined;
  } catch {
    return undefined;
  }
}
