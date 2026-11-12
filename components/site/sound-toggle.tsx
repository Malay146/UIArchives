"use client";

import { useEffect, useState } from "react";
import { VolumeGlyph18, VolumeXmarkGlyph18 } from "@/components/icons";
import { isSoundOn, onSoundChange, play, setSoundOn } from "@/lib/sound";

export function SoundToggle() {
  const [on, setOn] = useState<boolean | null>(null);

  useEffect(() => {
    setOn(isSoundOn());
    return onSoundChange(setOn);
  }, []);

  const toggle = () => {
    const next = !on;
    setSoundOn(next);
    // Turning sound on confirms with the click itself.
    // The switch confirms itself in the voice it just turned on.
    if (next) play("toggle-on", { force: true });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      // Handled here, so the global listener never doubles it up.
      data-sound="none"
      aria-pressed={on ?? true}
      aria-label={on === false ? "Turn interface sounds on" : "Turn interface sounds off"}
      className="press -m-2 grid size-8 place-items-center text-fg-2 transition-colors hover:text-fg"
    >
      {on === false ? (
        <VolumeXmarkGlyph18 aria-hidden="true" className="size-[15px]" />
      ) : (
        <VolumeGlyph18 aria-hidden="true" className="size-[15px]" />
      )}
    </button>
  );
}
