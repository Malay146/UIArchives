import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import { SESSION_COOKIE, cookieOptions, createSession, getAdmin, sameOrigin, sign, unsign } from "@/lib/server/auth";
import { registrationOptions, verifyRegistration } from "@/lib/server/passkeys";
import { sendEmailCode, verifyEmailCode } from "@/lib/server/email-code";

const CHALLENGE_COOKIE = "uia_wa_reg";
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

/**
 * Register a passkey. Allowed with a code emailed to ADMIN_EMAIL, or while
 * already signed in (to add another device).
 *  POST { step: "send-code" }                 → emails a 6-digit code
 *  POST { step: "options", code }            → WebAuthn creation options
 *  POST { step: "verify", response, label }   → stores the passkey, signs in
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Bad origin.", 403);
  const body = (await req.json().catch(() => ({}))) as {
    step?: string; code?: string; response?: RegistrationResponseJSON; label?: string;
  };
  const jar = await cookies();

  if (body.step === "send-code") {
    const r = await sendEmailCode();
    return r.ok ? NextResponse.json({ ok: true }) : fail(r.error, r.status);
  }

  if (body.step === "options") {
    if (!(await getAdmin()) && !(await verifyEmailCode(body.code))) return fail("That code isn't right or has expired.", 401);
    const options = await registrationOptions(req);
    const res = NextResponse.json(options);
    res.cookies.set(CHALLENGE_COOKIE, await sign(`reg:${options.challenge}`, 5 * 60_000), cookieOptions(req, 300));
    return res;
  }

  if (body.step === "verify" && body.response) {
    const signed = await unsign(jar.get(CHALLENGE_COOKIE)?.value);
    if (!signed?.startsWith("reg:")) return fail("Setup expired — start again.", 401);
    const ok = await verifyRegistration(req, body.response, signed.slice(4), body.label || "Passkey").catch(() => false);
    if (!ok) return fail("That passkey couldn't be verified.", 401);
    const session = await createSession();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, session.value, cookieOptions(req, session.maxAge));
    res.cookies.delete({ name: CHALLENGE_COOKIE, path: "/" });
    return res;
  }

  return fail("Bad request.");
}
