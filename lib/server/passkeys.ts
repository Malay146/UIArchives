import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type { AuthenticationResponseJSON, RegistrationResponseJSON } from "@simplewebauthn/server";
import { env } from "./env";
import { b64url } from "./auth";

/**
 * WebAuthn for the single owner. The relying party is the current host, so a
 * passkey made on the workers.dev address must be re-made once the site moves
 * to its own domain (a code emailed to the owner allows that).
 */
type Row = { id: string; public_key: string; counter: number; transports: string | null };

export const rpFor = (req: Request) => {
  const u = new URL(req.url);
  return { rpID: u.hostname, origin: u.origin };
};

const fromB64url = (s: string) => {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};

export async function passkeysFor(rpID: string) {
  const { results } = await env.DB.prepare("SELECT id, public_key, counter, transports FROM passkeys WHERE rp_id = ?")
    .bind(rpID).all<Row>();
  return results;
}

export async function hasAnyPasskey(rpID: string) {
  return (await passkeysFor(rpID)).length > 0;
}

export async function registrationOptions(req: Request) {
  const { rpID } = rpFor(req);
  const existing = await passkeysFor(rpID);
  return generateRegistrationOptions({
    rpName: "UIArchives Review",
    rpID,
    userName: "owner",
    userDisplayName: "UIArchives owner",
    userID: new TextEncoder().encode("uiarchives-owner"),
    attestationType: "none",
    excludeCredentials: existing.map((p) => ({ id: p.id, transports: p.transports ? JSON.parse(p.transports) : undefined })),
    authenticatorSelection: { residentKey: "required", userVerification: "required" },
  });
}

export async function verifyRegistration(req: Request, response: RegistrationResponseJSON, challenge: string, label: string) {
  const { rpID, origin } = rpFor(req);
  const v = await verifyRegistrationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });
  if (!v.verified) return false;
  const c = v.registrationInfo.credential;
  await env.DB.prepare(
    "INSERT INTO passkeys (id, public_key, counter, transports, rp_id, label, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(c.id, b64url(c.publicKey), c.counter, JSON.stringify(c.transports ?? []), rpID, label.slice(0, 60), Date.now())
    .run();
  return true;
}

export async function authenticationOptions(req: Request) {
  const { rpID } = rpFor(req);
  // Discoverable credentials: the device offers its passkey, no list needed.
  return generateAuthenticationOptions({ rpID, userVerification: "required" });
}

export async function verifyAuthentication(req: Request, response: AuthenticationResponseJSON, challenge: string) {
  const { rpID, origin } = rpFor(req);
  const row = await env.DB.prepare("SELECT id, public_key, counter, transports FROM passkeys WHERE id = ? AND rp_id = ?")
    .bind(response.id, rpID).first<Row>();
  if (!row) return false;
  const v = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
    credential: {
      id: row.id,
      publicKey: fromB64url(row.public_key),
      counter: row.counter,
      transports: row.transports ? JSON.parse(row.transports) : undefined,
    },
  });
  if (!v.verified) return false;
  await env.DB.prepare("UPDATE passkeys SET counter = ?, last_used_at = ? WHERE id = ?")
    .bind(v.authenticationInfo.newCounter, Date.now(), row.id).run();
  return true;
}
