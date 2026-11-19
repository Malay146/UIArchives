"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/** Public site key of the "UIArchives submit form" widget (uiarchives.com). */
const SITE_KEY = "0x4AAAAAAGIhdVVPt6l2Wat5";
/** Cloudflare's always-pass test key, for localhost and preview hosts. */
const TEST_KEY = "1x00000000000000000000AA";
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loading: Promise<void> | null = null;
const loadScript = () =>
  (loading ??= new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve();
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  }));

export type TurnstileHandle = { reset: () => void };

/**
 * Cloudflare Turnstile spam check. Renders inside the form, where it adds the
 * hidden `cf-turnstile-response` field that /api/submit verifies.
 */
export const Turnstile = forwardRef<TurnstileHandle>(function Turnstile(_, ref) {
  const el = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({ reset: () => id.current && window.turnstile?.reset(id.current) }), []);

  useEffect(() => {
    let cancelled = false;
    const host = window.location.hostname;
    const sitekey = host === "uiarchives.com" || host === "www.uiarchives.com" ? SITE_KEY : TEST_KEY;
    loadScript()
      .then(() => {
        if (cancelled || !el.current || !window.turnstile) return;
        id.current = window.turnstile.render(el.current, { sitekey, theme: "auto", size: "flexible" });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (id.current) window.turnstile?.remove(id.current);
      id.current = null;
    };
  }, []);

  return <div ref={el} className="min-h-[65px]" />;
});
