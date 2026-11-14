"use client";

import posthog from "posthog-js";
import { useEffect, useRef } from "react";
import { REVIEWER_ID } from "@/lib/analytics-config";

/**
 * Every custom event the site sends, in one place, so names stay consistent
 * in PostHog. Clicks, pageviews, page leaves, rage clicks, web vitals, errors
 * and session replays are captured automatically on top of these.
 */
export type AnalyticsEvent =
  | "outbound_click" // a link to another site
  | "search" // a search box settled on a query
  | "filter_toggled"
  | "copied" // anything copied with a copy button
  | "theme_changed"
  | "sound_changed"
  | "command_menu_opened"
  | "command_menu_selected"
  | "resource_opened" // resource drawer opened
  | "submission_sent"
  | "submission_failed"
  | "review_decision"
  | "review_added";

/**
 * Calls made before PostHog starts (child effects run before the root
 * Analytics component's) wait here. Capped so a visit with analytics off
 * never piles up.
 */
const waiting: (() => void)[] = [];
function whenReady(fn: () => void) {
  if (typeof window === "undefined") return;
  if (posthog.__loaded) fn();
  else if (waiting.length < 50) waiting.push(fn);
}
/** Called once by <Analytics /> right after PostHog starts. */
export function flushWaiting() {
  waiting.splice(0).forEach((fn) => fn());
}

/** Send an event. Safe to call anywhere, including before PostHog loads. */
export function track(event: AnalyticsEvent, props?: Record<string, unknown>) {
  whenReady(() => posthog.capture(event, props));
}

/**
 * Mark this browser as the site's reviewer. Their visits get a person
 * profile flagged `is_reviewer`, so they can be filtered out of the real
 * numbers in PostHog (Settings → Filter out internal and test users).
 */
export function identifyReviewer() {
  whenReady(() => {
    if (posthog.get_distinct_id() !== REVIEWER_ID) posthog.identify(REVIEWER_ID, { is_reviewer: true, site: "uiarchives" });
  });
}

/**
 * Report a search once the person stops typing, not on every keystroke.
 * Searches with no results are the ones worth reading: they show what's missing.
 */
export function useSearchTracking(surface: string, query: string, results: number) {
  const last = useRef("");
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || q === last.current) return;
    const t = setTimeout(() => {
      last.current = q;
      track("search", { surface, query: q, results, has_results: results > 0 });
    }, 1200);
    return () => clearTimeout(t);
  }, [surface, query, results]);
}
