-- Everything that enters the archive — from the public submit forms or from
-- automation — lands here as `pending`, and only appears on the site once it
-- is approved on /review.
CREATE TABLE items (
  id               TEXT PRIMARY KEY,
  section          TEXT NOT NULL CHECK (section IN ('resources', 'motion', 'og-images', 'app-icons', 'skills')),
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  source           TEXT NOT NULL CHECK (source IN ('submission', 'automation')),
  -- Where automation found it: 'app-store', 'github', 'hacker-news', 'x', 'claude', …
  origin           TEXT,
  -- The section's fields as JSON (see lib/section-schemas.ts).
  data             TEXT NOT NULL,
  -- Normalised URL / store id, so the same thing is never queued twice.
  dedupe_key       TEXT NOT NULL,
  submitter_name   TEXT,
  submitter_email  TEXT,
  review_note      TEXT,
  created_at       INTEGER NOT NULL,
  reviewed_at      INTEGER
);

CREATE UNIQUE INDEX items_section_dedupe ON items (section, dedupe_key);
CREATE INDEX items_status_section ON items (status, section, created_at DESC);

-- Spam protection for the public forms: one row per submission attempt,
-- keyed by a salted hash of the IP (never the raw address).
CREATE TABLE submit_attempts (
  ip_hash     TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX submit_attempts_ip ON submit_attempts (ip_hash, created_at);

-- One row per automation run, for the review page's "last run" line.
CREATE TABLE automation_runs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at  INTEGER NOT NULL,
  source      TEXT NOT NULL,
  found       INTEGER NOT NULL DEFAULT 0,
  queued      INTEGER NOT NULL DEFAULT 0,
  error       TEXT
);
