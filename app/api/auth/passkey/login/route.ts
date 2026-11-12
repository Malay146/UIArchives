import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server";
import { SESSION_COOKIE, cookieOptions, createSession, sameOrigin, sign, unsign } from "@/lib/server/auth";
import { authenticationOptions, hasAnyPasskey, rpFor, verifyAuthentication } from "@/lib/server/passkeys";

const CHALLENGE_COOKIE = "uia_wa_auth";
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

/**
 *  POST { step: "options" }            → WebAuthn request options
 *  POST { step: "verify", response }   → verifies, sets the session cookie
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Bad origin.", 403);
  const body = (await req.json().catch(() => ({}))) as { step?: string; response?: AuthenticationResponseJSON };

  if (body.step === "options") {
    if (!(await hasAnyPasskey(rpFor(req).rpID))) return fail("No passkey set up on this domain yet.", 404);
    const options = await authenticationOptions(req);
    const res = NextResponse.json(options);
    res.cookies.set(CHALLENGE_COOKIE, await sign(`auth:${options.challenge}`, 5 * 60_000), cookieOptions(req, 300));
    return res;
  }

  if (body.step === "verify" && body.response) {
    const signed = await unsign((await cookies()).get(CHALLENGE_COOKIE)?.value);
    if (!signed?.startsWith("auth:")) return fail("Sign-in expired — try again.", 401);
    const ok = await verifyAuthentication(req, body.response, signed.slice(5)).catch(() => false);
    if (!ok) return fail("That passkey isn't recognised here.", 401);
    const session = await createSession();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, session.value, cookieOptions(req, session.maxAge));
    res.cookies.delete({ name: CHALLENGE_COOKIE, path: "/" });
    return res;
  }

  return fail("Bad request.");
}
