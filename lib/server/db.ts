import { env } from "./env";
import { type ItemData, type SectionKey, SECTION_SCHEMAS, dedupeKey } from "@/lib/section-schemas";

const normName = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "");
import { identityFor, inStaticArchive } from "./dedupe";

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
 * Queue a candidate. Returns null when the same thing (same section and
 * normalised URL / store id) is already queued, approved or rejected.
 */
export async function createItem(input: {
  section: SectionKey;
  data: ItemData;
  source: Item["source"];
  origin?: string;
  submitterName?: string;
  submitterEmail?: string;
}): Promise<Item | null> {
  // Never queue something the archive already has (built-in data files)…
  if (inStaticArchive(input.section, input.data)) return null;
  // …or anything already in the database, whatever its status (unique key).
  const key = identityFor(input.section, input.data);
  if (!key) return null;
  const legacyKey = dedupeKey(String(input.data[SECTION_SCHEMAS[input.section].dedupeField] ?? ""));
  const clash = await env.DB.prepare("SELECT 1 FROM items WHERE section = ? AND dedupe_key IN (?, ?) LIMIT 1")
    .bind(input.section, key, legacyKey)
    .first();
  if (clash) return null;
  // Resources: the same named product under a different link is still a duplicate.
  if (input.section === "resources") {
    const name = normName(String(input.data.title ?? ""));
    if (name) {
      const { results } = await env.DB.prepare("SELECT json_extract(data, '$.title') AS t FROM items WHERE section = 'resources'").all<{ t: string | null }>();
      if (results.some((r) => r.t && normName(r.t) === name)) return null;
    }
  }
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
  await env.DB.prepare(
    "UPDATE items SET status = ?, data = COALESCE(?, data), review_note = ?, reviewed_at = ? WHERE id = ?",
  )
    .bind(status, data ? JSON.stringify(data) : null, note, Date.now(), id)
    .run();
  return getItem(id);
}

/** Approved items for a section, newest first — merged into the public pages. */
export async function approvedItems(section: SectionKey): Promise<Item[]> {
  try {
    return await listItems("approved", section, 1000);
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
