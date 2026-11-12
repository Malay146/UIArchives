import { cookies } from "next/headers";
import { env } from "./env";

/**
 * Review access is passkey-only (see lib/server/passkeys.ts). After a passkey
 * verifies, the browser gets an HMAC-signed session cookie — no third-party
 * auth service, no password.
 */
export const SESSION_COOKIE = "uia_session";
const SESSION_DAYS = 14;
const OWNER = "owner";

const enc = new TextEncoder();
export const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf instanceof Uint8Array ? buf : new Uint8Array(buf))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function hmac(value: string) {
  const secret = env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET");
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(value)));
}

/** Constant-time string comparison. */
export function same(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Signed, expiring token: `<value>.<exp>.<sig>`. */
export async function sign(value: string, ttlMs: number) {
  const exp = Date.now() + ttlMs;
  return `${value}.${exp}.${await hmac(`${value}.${exp}`)}`;
}

export async function unsign(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  const j = token.lastIndexOf(".", i - 1);
  if (i < 0 || j < 0) return null;
  const value = token.slice(0, j);
  const exp = token.slice(j + 1, i);
  if (Number(exp) < Date.now()) return null;
  try {
    return same(token.slice(i + 1), await hmac(`${value}.${exp}`)) ? value : null;
  } catch {
    return null;
  }
}

export async function createSession() {
  return { value: await sign(OWNER, SESSION_DAYS * 864e5), maxAge: SESSION_DAYS * 86400 };
}

/** "owner" when the visitor holds a valid session, otherwise null. */
export async function getAdmin(): Promise<string | null> {
  const v = await unsign((await cookies()).get(SESSION_COOKIE)?.value);
  return v === OWNER ? OWNER : null;
}

export async function ipHash(ip: string) {
  return (await hmac(`ip:${ip}`)).slice(0, 24);
}

/** Same-origin check for state-changing requests. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  return !origin || new URL(origin).host === new URL(req.url).host;
}

export const cookieOptions = (req: Request, maxAge: number) => ({
  httpOnly: true,
  secure: new URL(req.url).protocol === "https:",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});
