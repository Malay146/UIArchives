-- The Motion section is now Designs. Rebuild `items` without the section
-- CHECK constraint (sections are validated in lib/section-schemas.ts, so a
-- future rename needs no table rebuild) and move existing rows across.
CREATE TABLE items_new (
  id               TEXT PRIMARY KEY,
  section          TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  source           TEXT NOT NULL CHECK (source IN ('submission', 'automation')),
  origin           TEXT,
  data             TEXT NOT NULL,
  dedupe_key       TEXT NOT NULL,
  submitter_name   TEXT,
  submitter_email  TEXT,
  review_note      TEXT,
  created_at       INTEGER NOT NULL,
  reviewed_at      INTEGER
);

INSERT INTO items_new
SELECT id, CASE section WHEN 'motion' THEN 'designs' ELSE section END, status, source, origin, data,
       dedupe_key, submitter_name, submitter_email, review_note, created_at, reviewed_at
FROM items;

DROP TABLE items;
ALTER TABLE items_new RENAME TO items;

CREATE UNIQUE INDEX items_section_dedupe ON items (section, dedupe_key);
CREATE INDEX items_status_section ON items (status, section, created_at DESC);
