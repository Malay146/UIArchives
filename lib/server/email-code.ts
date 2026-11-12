import { env } from "./env";
import { b64url, same } from "./auth";
import { layout, sendMail } from "./email";

/**
 * Passkey setup is authorised by a 6-digit code emailed to ADMIN_EMAIL.
 * One live code at a time, stored hashed in D1, valid 10 minutes, 5 tries,
 * and a new one can be requested at most once a minute.
 */
const TTL_MS = 10 * 60_000;
const RESEND_MS = 60_000;
const MAX_TRIES = 5;
const ID = "owner";

type Row = { hash: string; expires_at: number; sent_at: number; tries: number };

async function hash(code: string) {
  const data = new TextEncoder().encode(`${env.SESSION_SECRET}:email-code:${code}`);
  return b64url(await crypto.subtle.digest("SHA-256", data));
}

/** "a•••••4@gmail.com" — shown on the page so you know where to look. */
export function maskedAdminEmail() {
  const email = env.ADMIN_EMAIL;
  if (!email) return null;
  const [user, domain] = email.split("@");
  return `${user[0]}${"•".repeat(Math.max(user.length - 2, 1))}${user.length > 1 ? user.at(-1) : ""}@${domain}`;
}

export async function sendEmailCode(): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const to = env.ADMIN_EMAIL;
  if (!to) return { ok: false, error: "No admin email is configured.", status: 500 };

  const now = Date.now();
  const last = await env.DB.prepare("SELECT sent_at FROM email_codes WHERE id = ?").bind(ID).first<{ sent_at: number }>();
  if (last && now - last.sent_at < RESEND_MS) return { ok: false, error: "A code was just sent — wait a minute.", status: 429 };

  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  await env.DB.prepare(
    `INSERT INTO email_codes (id, hash, expires_at, sent_at, tries) VALUES (?, ?, ?, ?, 0)
     ON CONFLICT(id) DO UPDATE SET hash = excluded.hash, expires_at = excluded.expires_at, sent_at = excluded.sent_at, tries = 0`,
  ).bind(ID, await hash(code), now + TTL_MS, now).run();

  const sent = await sendMail({
    to,
    subject: `${code} is your UIArchives sign-in code`,
    text: `Your code to set up a passkey for UIArchives review: ${code}\n\nIt expires in 10 minutes. If you didn't ask for it, ignore this email.`,
    html: layout(`Your code: ${code}`, [
      "Enter it on the review page to set up a passkey on this device.",
      "It expires in 10 minutes. If you didn't ask for it, ignore this email.",
    ]),
  });
  if (!sent) return { ok: false, error: "The email couldn't be sent.", status: 502 };
  return { ok: true };
}

/** Checks the code and burns it on success. */
export async function verifyEmailCode(input: unknown): Promise<boolean> {
  if (typeof input !== "string") return false;
  const code = input.replace(/\D/g, "");
  if (code.length !== 6) return false;

  const row = await env.DB.prepare("SELECT hash, expires_at, sent_at, tries FROM email_codes WHERE id = ?").bind(ID).first<Row>();
  if (!row || row.expires_at < Date.now() || row.tries >= MAX_TRIES) return false;

  if (!same(await hash(code), row.hash)) {
    await env.DB.prepare("UPDATE email_codes SET tries = tries + 1 WHERE id = ?").bind(ID).run();
    return false;
  }
  // Expire it (keep sent_at so the resend cooldown still applies).
  await env.DB.prepare("UPDATE email_codes SET expires_at = 0 WHERE id = ?").bind(ID).run();
  return true;
}
