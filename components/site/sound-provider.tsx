"use client";

import { useEffect } from "react";
import { audioReady, play, unlockAudio, type SoundName } from "@/lib/sound";

const PRESSABLE =
  'a[href], button:not(:disabled), [role="button"], [role="option"], summary, label[for], [data-sound]';

/**
 * Which voice an element speaks with:
 *  - data-sound="…" wins (tick, toggle-on, toggle-off, open, close, none);
 *  - things that open a dialog → "open";
 *  - toggles (aria-pressed) → "toggle-on" / "toggle-off" for the state they move to;
 *  - everything else → "tick".
 */
function voiceFor(e: Event): SoundName | null {
  const el = (e.target as Element | null)?.closest<HTMLElement>(PRESSABLE);
  if (!el || el.closest("[data-sound='none']")) return null;
  if (el.getAttribute("aria-disabled") === "true") return null;
  const explicit = el.dataset.sound as SoundName | undefined;
  if (explicit) return explicit;
  if (el.getAttribute("aria-haspopup") === "dialog") return "open";
  const pressed = el.getAttribute("aria-pressed");
  if (pressed === "true") return "toggle-off";
  if (pressed === "false") return "toggle-on";
  return "tick";
}

/**
 * One listener for the whole site. Once audio is running, sounds play on
 * press (pointerdown) so they land with the visual press. Before that — the
 * first interaction, which Safari insists on — they play on `click`.
 * Keyboard activations stay silent. A short guard prevents doubles.
 */
export function SoundProvider() {
  useEffect(() => {
    let lastPress = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || !e.isPrimary || !audioReady()) return;
      const v = voiceFor(e);
      if (!v) return;
      play(v);
      lastPress = performance.now();
    };

    const onClick = (e: MouseEvent) => {
      unlockAudio();
      if (e.detail === 0) return; // keyboard-activated
      if (performance.now() - lastPress < 700) return;
      const v = voiceFor(e);
      if (v) play(v);
    };

    const unlock = () => unlockAudio();

    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("touchend", unlock, { capture: true });
    document.addEventListener("keydown", unlock, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, { capture: true });
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("touchend", unlock, { capture: true });
      document.removeEventListener("keydown", unlock, { capture: true });
    };
  }, []);

  return null;
}
