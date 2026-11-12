"use client";

import { useState } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { Button } from "@/components/ui/button";

/**
 * Passkey sign-in for /review. First time on a device: a 6-digit code is
 * emailed to the owner, then this device's passkey (Touch ID, Face ID,
 * Windows Hello or a security key) is registered. After that, one tap signs in.
 */
export function PasskeySignIn({ hasPasskey, email }: { hasPasskey: boolean; email: string | null }) {
  const [mode, setMode] = useState<"signin" | "setup">(hasPasskey ? "signin" : "setup");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (url: string, body: unknown) => {
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as { error?: string } & Record<string, unknown>;
    if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
    return data;
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      window.location.reload();
    } catch (e) {
      const msg = (e as Error).message;
      setError(/NotAllowed|abort|timed out/i.test(msg) ? "Cancelled." : msg);
    } finally {
      setBusy(false);
    }
  };

  const signIn = () =>
    run(async () => {
      const options = await post("/api/auth/passkey/login", { step: "options" });
      const response = await startAuthentication({ optionsJSON: options as never });
      await post("/api/auth/passkey/login", { step: "verify", response });
    });

  const sendCode = async () => {
    setBusy(true);
    setError(null);
    try {
      await post("/api/auth/passkey/register", { step: "send-code" });
      setSent(true);
      setCode("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const register = () =>
    run(async () => {
      const options = await post("/api/auth/passkey/register", { step: "options", code });
      const response = await startRegistration({ optionsJSON: options as never });
      const label = /Mac/.test(navigator.userAgent) ? "Mac" : /iPhone|iPad/.test(navigator.userAgent) ? "iPhone" : "Device";
      await post("/api/auth/passkey/register", { step: "verify", response, label });
    });

  return (
    <div className="w-full max-w-[320px]">
      <h1 className="font-medium">Review</h1>
      <p className="mt-1 text-fg-2">This page is private.</p>

      {mode === "signin" ? (
        <>
          <Button onClick={signIn} disabled={busy} className="mt-8 h-9 w-full">
            {busy ? "Waiting for your passkey…" : "Sign in with passkey"}
          </Button>
          <button type="button" onClick={() => setMode("setup")} className="link mt-4 text-[13px] text-fg-3 hover:text-fg">
            Set up this device instead
          </button>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (sent) register();
            else sendCode();
          }}
          className="mt-8 flex flex-col gap-3"
        >
          {sent ? (
            <label className="flex flex-col gap-1">
              <span className="text-fg-2">Code sent to {email ?? "your email"}</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="000000"
                className="border-0 border-b border-line-strong bg-transparent py-2 font-mono text-[15px] tracking-[0.3em] outline-none placeholder:text-fg-3 focus:border-fg"
              />
            </label>
          ) : (
            <p className="text-fg-2">We'll email a 6-digit code to {email ?? "the owner"}.</p>
          )}
          <Button type="submit" disabled={busy || (sent && code.length !== 6)} className="h-9 w-full">
            {busy ? (sent ? "Waiting for your passkey…" : "Sending…") : sent ? "Create passkey" : "Email me a code"}
          </Button>
          {sent && (
            <button type="button" onClick={sendCode} disabled={busy} className="link text-left text-[13px] text-fg-3 hover:text-fg">
              Send a new code
            </button>
          )}
          {hasPasskey && (
            <button type="button" onClick={() => setMode("signin")} className="link text-left text-[13px] text-fg-3 hover:text-fg">
              I already have a passkey
            </button>
          )}
        </form>
      )}
      <p className="mt-4 min-h-5 text-[13px]" aria-live="polite">
        {error ? `× ${error}` : ""}
      </p>
    </div>
  );
}
