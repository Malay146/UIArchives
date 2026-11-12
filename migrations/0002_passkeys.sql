-- Passkeys (WebAuthn) for signing in to /review. Public keys only — the
-- private key never leaves the owner's device.
CREATE TABLE passkeys (
  id          TEXT PRIMARY KEY,      -- credential id (base64url)
  public_key  TEXT NOT NULL,         -- COSE public key (base64url)
  counter     INTEGER NOT NULL DEFAULT 0,
  transports  TEXT,                  -- JSON array
  rp_id       TEXT NOT NULL,         -- the domain it was registered on
  label       TEXT,
  created_at  INTEGER NOT NULL,
  last_used_at INTEGER
);
