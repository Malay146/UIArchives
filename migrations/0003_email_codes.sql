-- One-time codes emailed to the owner to authorise adding a passkey.
-- Only one live code at a time (id = 'owner').
CREATE TABLE IF NOT EXISTS email_codes (
  id TEXT PRIMARY KEY,
  hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  sent_at INTEGER NOT NULL,
  tries INTEGER NOT NULL DEFAULT 0
);
