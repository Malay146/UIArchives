"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * One IntersectionObserver per option set, shared by every element that
 * uses it, so a page of hundreds of tiles costs a handful of observers, not
 * hundreds.
 */
type Listener = (entry: IntersectionObserverEntry) => void;
const observers = new Map<string, { io: IntersectionObserver; listeners: Map<Element, Listener> }>();

function observe(el: Element, opts: { rootMargin?: string; threshold?: number }, fn: Listener) {
  const key = `${opts.rootMargin ?? "0px"}|${opts.threshold ?? 0}`;
  let o = observers.get(key);
  if (!o) {
    const listeners = new Map<Element, Listener>();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => listeners.get(e.target)?.(e)),
      { rootMargin: opts.rootMargin, threshold: opts.threshold },
    );
    o = { io, listeners };
    observers.set(key, o);
  }
  o.listeners.set(el, fn);
  o.io.observe(el);
  return () => {
    o.listeners.delete(el);
    o.io.unobserve(el);
  };
}

/**
 * Whether `ref` is within `rootMargin` of the viewport (and, with a
 * threshold, at least that fraction visible). With `once`, it stays true
 * after the first hit — for "start loading when it gets close".
 */
export function useInView(
  ref: RefObject<Element | null>,
  { rootMargin, threshold, once = false }: { rootMargin?: string; threshold?: number; once?: boolean } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    let stop = () => {};
    stop = observe(el, { rootMargin, threshold }, (e) => {
      const hit = e.isIntersecting && e.intersectionRatio >= (threshold ?? 0);
      setInView(hit);
      if (hit && once) stop();
    });
    return () => stop();
  }, [ref, rootMargin, threshold, once]);
  return inView;
}

/** Phones and tablets: no hover, so motion has to start some other way. */
export function canHover() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Respect reduced motion and data saver: show the still, let a tap open the video. */
export function shouldAutoplay() {
  if (typeof window === "undefined") return false;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !saveData && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
