"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { POSTHOG_KEY, POSTHOG_PROXY_PATH, POSTHOG_UI_HOST, SITE_TAG } from "@/lib/analytics-config";
import { flushWaiting, track } from "@/lib/analytics";
import { getTheme, onThemeChange } from "@/lib/theme";
import { isSoundOn, onSoundChange } from "@/lib/sound";

/**
 * Starts PostHog once per visit. Everything automatic is switched on here:
 * pageviews (including client-side navigation), page leaves and time on page,
 * clicks and form submits (autocapture), rage and dead clicks, heatmaps,
 * scroll depth, web vitals, JavaScript errors and session replay (replay
 * itself is switched on in the PostHog project settings).
 *
 * Local development is skipped unless NEXT_PUBLIC_POSTHOG_DEV=1, so testing
 * never muddies the real numbers.
 */
export function Analytics() {
  useEffect(() => {
    if (!POSTHOG_KEY || posthog.__loaded) return;
    const local = /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
    if (local && process.env.NEXT_PUBLIC_POSTHOG_DEV !== "1") return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_PROXY_PATH,
      ui_host: POSTHOG_UI_HOST,
      defaults: "2026-08-30",
      // Anonymous visitors still count as unique users; only signed-in
      // reviewers get a person profile (cheaper, and nothing personal kept).
      person_profiles: "identified_only",
      capture_pageview: "history_change",
      capture_pageleave: true,
      autocapture: true,
      rageclick: true,
      capture_dead_clicks: true,
      enable_heatmaps: true,
      capture_performance: { web_vitals: true, network_timing: true },
      capture_exceptions: true,
      session_recording: {
        // Form fields (names, emails on the submit form) never leave the browser.
        maskAllInputs: true,
      },
      debug: local,
    });

    // Attached to every event, so any chart can be split by them.
    posthog.register({ site: SITE_TAG, theme: getTheme(), sound: isSoundOn() ? "on" : "off" });
    // Both fire only on a real change (header toggle or command menu).
    const offTheme = onThemeChange((t) => {
      posthog.register({ theme: t });
      track("theme_changed", { theme: t });
    });
    const offSound = onSoundChange((on) => {
      posthog.register({ sound: on ? "on" : "off" });
      track("sound_changed", { sound: on ? "on" : "off" });
    });
    flushWaiting();

    // Links to other sites: which resources people actually go and visit.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol) || url.host === location.host) return;
      track("outbound_click", {
        url: url.href,
        domain: url.hostname.replace(/^www\./, ""),
        text: (a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 120),
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    // Middle-click opens in a new tab without firing "click".
    const onAux = (e: MouseEvent) => e.button === 1 && onClick(e);
    document.addEventListener("auxclick", onAux, { capture: true });

    return () => {
      offTheme();
      offSound();
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onAux, { capture: true });
    };
  }, []);

  return null;
}
