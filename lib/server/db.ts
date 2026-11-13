import { env } from "./env";
import { type ItemData, type SectionKey, SECTION_SCHEMAS, dedupeKey } from "@/lib/section-schemas";

import { identityFor, inStaticArchive, nameFor, norm } from "./dedupe";

export type ItemStatus = "pending" | "approved" | "rejected";

export type Item = {
  id: string;
  section: SectionKey;
  status: ItemStatus;
  source: "submission" | "automation";
  origin: string | null;
  data: ItemData;
  dedupe_key: string;
  submitter_name: string | null;
  submitter_email: string | null;
  review_note: string | null;
  created_at: number;
  reviewed_at: number | null;
};

type Row = Omit<Item, "data"> & { data: string };
const parse = (r: Row): Item => ({ ...r, data: JSON.parse(r.data) as ItemData });

const newId = () => crypto.randomUUID().replace(/-/g, "").slice(0, 16);

/**
 * Is this thing already on the site or in the queue? True when the built-in
 * data has it, or another row in the database (any status) shares its
 * identity — or, for resources, its name. `excludeId` skips the
 * row being reviewed, so it never clashes with itself.
 */
export async function findsDuplicate(section: SectionKey, data: ItemData, excludeId = ""): Promise<boolean> {
  if (inStaticArchive(section, data)) return true;
  const key = identityFor(section, data);
  if (!key) return false;
  const legacyKey = dedupeKey(String(data[SECTION_SCHEMAS[section].dedupeField] ?? ""));
  const clash = await env.DB.prepare("SELECT 1 FROM items WHERE section = ? AND dedupe_key IN (?, ?) AND id != ? LIMIT 1")
    .bind(section, key, legacyKey, excludeId)
    .first();
  if (clash) return true;
  const name = nameFor(section, data);
  if (name) {
    const field = SECTION_SCHEMAS[section].titleField;
    const { results } = await env.DB.prepare(`SELECT json_extract(data, '$.${field}') AS t FROM items WHERE section = ? AND id != ?`)
      .bind(section, excludeId)
      .all<{ t: string | null }>();
    if (results.some((r) => r.t && norm(r.t) === name)) return true;
  }
  return false;
}

/**
 * Queue a candidate. Returns null when it's a duplicate (see findsDuplicate)
 * or has nothing to identify it by.
 */
export async function createItem(input: {
  section: SectionKey;
  data: ItemData;
  source: Item["source"];
  origin?: string;
  submitterName?: string;
  submitterEmail?: string;
}): Promise<Item | null> {
  const key = identityFor(input.section, input.data);
  if (!key) return null;
  if (await findsDuplicate(input.section, input.data)) return null;
  const id = newId();
  const now = Date.now();
  const res = await env.DB.prepare(
    `INSERT INTO items (id, section, status, source, origin, data, dedupe_key, submitter_name, submitter_email, created_at)
     VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (section, dedupe_key) DO NOTHING`,
  )
    .bind(id, input.section, input.source, input.origin ?? null, JSON.stringify(input.data), key,
      input.submitterName ?? null, input.submitterEmail ?? null, now)
    .run();
  if (!res.meta.changes) return null;
  return getItem(id);
}

export async function getItem(id: string): Promise<Item | null> {
  const r = await env.DB.prepare("SELECT * FROM items WHERE id = ?").bind(id).first<Row>();
  return r ? parse(r) : null;
}

export async function listItems(status: ItemStatus, section?: SectionKey, limit = 200): Promise<Item[]> {
  const q = section
    ? env.DB.prepare("SELECT * FROM items WHERE status = ? AND section = ? ORDER BY created_at DESC LIMIT ?").bind(status, section, limit)
    : env.DB.prepare("SELECT * FROM items WHERE status = ? ORDER BY created_at DESC LIMIT ?").bind(status, limit);
  const { results } = await q.all<Row>();
  return results.map(parse);
}

export async function countByStatus(): Promise<Record<string, number>> {
  const { results } = await env.DB.prepare(
    "SELECT status || ':' || section AS k, COUNT(*) AS n FROM items GROUP BY status, section",
  ).all<{ k: string; n: number }>();
  return Object.fromEntries(results.map((r) => [r.k, r.n]));
}

export async function reviewItem(id: string, status: Exclude<ItemStatus, "pending">, data: ItemData | null, note: string | null) {
  // Keep the identity in step with edits made during review (e.g. a corrected link).
  const item = data ? await getItem(id) : null;
  const key = item && data ? identityFor(item.section, data) || null : null;
  await env.DB.prepare(
    "UPDATE items SET status = ?, data = COALESCE(?, data), dedupe_key = COALESCE(?, dedupe_key), review_note = ?, reviewed_at = ? WHERE id = ?",
  )
    .bind(status, data ? JSON.stringify(data) : null, key, note, Date.now(), id)
    .run();
  return getItem(id);
}

/** Approved items for a section, newest first — merged into the public pages. */
export async function approvedItems(section: SectionKey): Promise<Item[]> {
  try {
    return await listItems("approved", section, 5000);
  } catch {
    // Database not migrated yet (fresh deploy): the static archive still renders.
    return [];
  }
}

export async function logRun(source: string, found: number, queued: number, error?: string) {
  await env.DB.prepare("INSERT INTO automation_runs (started_at, source, found, queued, error) VALUES (?, ?, ?, ?, ?)")
    .bind(Date.now(), source, found, queued, error ?? null)
    .run();
}

export async function lastRuns(limit = 8) {
  const { results } = await env.DB.prepare("SELECT * FROM automation_runs ORDER BY started_at DESC LIMIT ?").bind(limit).all<{
    started_at: number; source: string; found: number; queued: number; error: string | null;
  }>();
  return results;
}
