/**
 * Interface sounds, synthesised with Web Audio — no files, no decode, no
 * latency. Three voices, each a single short event with no reverb or tail:
 *
 *   tick   — links, buttons, rows. A soft high click (~25ms).
 *   toggle — chips, switches. A clean sine blip; up a fourth when turning
 *            something on, down when turning it off.
 *   sheet  — drawers and the command menu. A quiet glide that rises on open
 *            and falls on close.
 *
 * Everything runs through one gentle low-pass and a master gain, so the
 * three sit together like a family and never get harsh.
 *
 * Safari rules apply: the AudioContext is created/resumed inside a user
 * gesture and unlocked with a silent sample in that same gesture.
 */

export type SoundName = "tick" | "toggle-on" | "toggle-off" | "open" | "close";

const MASTER = 0.9;
const STORAGE_KEY = "sound";
const listeners = new Set<(on: boolean) => void>();

let ctx: AudioContext | null = null;
let out: AudioNode | null = null;
let noise: AudioBuffer | null = null;
let unlocked = false;

/* ---------- preference ---------- */

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((fn) => fn(on));
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/* ---------- engine ---------- */

/** Create / resume the context. Must run inside a user gesture (Safari). */
export function unlockAudio() {
  if (typeof window === "undefined") return null;
  const AC: typeof AudioContext | undefined =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC({ latencyHint: "interactive" });
    } catch {
      return null;
    }
    // Shared chain: soft low-pass to keep everything warm, then master gain.
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 7000;
    lp.Q.value = 0.5;
    const master = ctx.createGain();
    master.gain.value = MASTER;
    lp.connect(master).connect(ctx.destination);
    out = lp;

    // A few milliseconds of noise, reused for the tick's texture.
    const len = Math.floor(ctx.sampleRate * 0.01);
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  }
  if (ctx.state !== "running") void ctx.resume?.().catch(() => {});
  if (!unlocked) {
    try {
      const s = ctx.createBufferSource();
      s.buffer = ctx.createBuffer(1, 1, 22050);
      s.connect(ctx.destination);
      s.start(0);
      unlocked = true;
    } catch {}
  }
  return ctx;
}

/** A single enveloped oscillator: fast attack, exponential decay, optional glide. */
function tone(
  c: AudioContext,
  { type, from, to, peak, attack, decay, at = 0 }: {
    type: OscillatorType;
    from: number;
    to?: number;
    peak: number;
    attack: number;
    decay: number;
    at?: number;
  },
) {
  const t = c.currentTime + 0.005 + at;
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + attack + decay * 0.6);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(peak, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  osc.connect(env).connect(out!);
  osc.start(t);
  osc.stop(t + attack + decay + 0.02);
}

const VOICES: Record<SoundName, (c: AudioContext) => void> = {
  // Soft high tick: a falling sine "body" plus a breath of band-passed noise.
  tick: (c) => {
    tone(c, { type: "sine", from: 2200, to: 1500, peak: 0.16, attack: 0.001, decay: 0.022 });
    if (noise) {
      const t = c.currentTime + 0.005;
      const src = c.createBufferSource();
      const bp = c.createBiquadFilter();
      const g = c.createGain();
      src.buffer = noise;
      bp.type = "bandpass";
      bp.frequency.value = 3200;
      bp.Q.value = 0.9;
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.008);
      src.connect(bp).connect(g).connect(out!);
      src.start(t);
    }
  },
  "toggle-on": (c) => tone(c, { type: "sine", from: 1318.5, peak: 0.11, attack: 0.002, decay: 0.05 }), // E6
  "toggle-off": (c) => tone(c, { type: "sine", from: 987.8, peak: 0.1, attack: 0.002, decay: 0.05 }), // B5
  open: (c) => tone(c, { type: "triangle", from: 520, to: 780, peak: 0.07, attack: 0.012, decay: 0.09 }),
  close: (c) => tone(c, { type: "triangle", from: 760, to: 500, peak: 0.06, attack: 0.008, decay: 0.08 }),
};

export function play(name: SoundName, { force = false } = {}) {
  if (typeof window === "undefined") return;
  if (!force && !isSoundOn()) return;
  const c = unlockAudio();
  if (!c || !out) return;
  try {
    VOICES[name](c);
  } catch {}
}

/** Kept for existing callers. */
export const playClick = (opts?: { force?: boolean }) => play("tick", opts);

/** True once the context is running — press-time playback is safe. */
export function audioReady() {
  return !!ctx && ctx.state === "running";
}
