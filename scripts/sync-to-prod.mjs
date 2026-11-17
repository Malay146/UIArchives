#!/usr/bin/env node
// Copies archive items approved locally to production, media first.
//
//   npm run dev                      # in another terminal (serves local media)
//   node scripts/sync-to-prod.mjs    # or --dry-run to only report
//
// An item is "the same" when section + dedupe_key match. For every local
// approved item that production lacks (or has as pending/rejected):
//   1. every /media/<key> it references is copied from the local dev server
//      into the production KV namespace (with its content type), and checked;
//   2. only then is the row inserted, or its status set to approved.
// Rows never reach production without their media, so cards can't go blank.
// Pages are cached per deploy, so run go-live.sh afterwards (it calls this).
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DRY = process.argv.includes("--dry-run");
const LOCAL = process.env.BASE || "http://localhost:3001";
const SITE = "https://uiarchives.com";
const DB_NAME = "uiarchives";
const KV_TITLE = "uiarchives-media";
const D1_DIR = ".cloudflare/state/v3/d1/miniflare-D1DatabaseObject";

const cf = (args) => execFileSync("npx", ["cf", ...args], { encoding: "utf8", maxBuffer: 64 << 20 });
const json = (s) => JSON.parse(s.slice(s.search(/[[{]/), Math.max(s.lastIndexOf("]"), s.lastIndexOf("}")) + 1));
const sqlite = (db, sql) => JSON.parse(execFileSync("sqlite3", ["-json", db, sql], { encoding: "utf8", maxBuffer: 64 << 20 }) || "[]");

const localDb = readdirSync(D1_DIR).filter((f) => f.endsWith(".sqlite") && f !== "metadata.sqlite").map((f) => join(D1_DIR, f))[0];
if (!localDb || !existsSync(localDb)) throw new Error("Local D1 database not found — run the dev server once.");

try {
  await fetch(LOCAL, { method: "HEAD" });
} catch {
  console.error(`Start the dev server first (npm run dev) — media is read from ${LOCAL}.`);
  process.exit(1);
}

const dbId = json(cf(["d1", "list"])).find((d) => d.name === DB_NAME)?.uuid;
const kvList = json(cf(["kv", "namespaces", "list"]));
const kvId = (Array.isArray(kvList) ? kvList : kvList.result ?? []).find((n) => n.title === KV_TITLE)?.id;
if (!dbId || !kvId) throw new Error("Production D1 or KV namespace not found.");

const remoteRows = (sql) => json(cf(["d1", "query", dbId, "--sql", sql]))[0].results;

const local = sqlite(localDb, "SELECT * FROM items WHERE status = 'approved'");
const remote = new Map(remoteRows("SELECT id, section, dedupe_key, status FROM items").map((r) => [`${r.section}|${r.dedupe_key}`, r]));
const remoteIds = new Set([...remote.values()].map((r) => r.id));

// Every approved item gets its media checked (repairs earlier gaps too);
// rows are only written for items production doesn't have as approved.
const todo = local;
const needsRow = (r) => remote.get(`${r.section}|${r.dedupe_key}`)?.status !== "approved";
console.log(`${local.filter(needsRow).length} approved item(s) to sync; checking media for all ${local.length}.`);

const tmp = mkdtempSync(join(tmpdir(), "uia-media-"));
const COLS = ["id", "section", "status", "source", "origin", "data", "dedupe_key", "submitter_name", "submitter_email", "review_note", "created_at", "reviewed_at"];
let synced = 0;

for (const row of todo) {
  const keys = [...new Set([...row.data.matchAll(/\/media\/([^"\\\s]+)/g)].map((m) => m[1]))];
  const label = `${row.section} ${JSON.parse(row.data).title ?? row.id}`;
  let mediaOk = true;

  for (const key of keys) {
    const live = await fetch(`${SITE}/media/${key}`, { method: "HEAD" });
    if (live.ok) continue;
    const res = await fetch(`${LOCAL}/media/${key}`);
    if (!res.ok) { console.error(`  ✗ ${label}: local media missing (${key})`); mediaOk = false; break; }
    const type = (res.headers.get("content-type") ?? "application/octet-stream").split(";")[0];
    const file = join(tmp, key.replaceAll("/", "_"));
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    if (!DRY) cf(["kv", "keys", "put", key, "--namespace-id", kvId, "--file", file, "--metadata", JSON.stringify({ contentType: type })]);
    console.log(`  ↑ ${label}: ${key}`);
  }
  if (!mediaOk) continue; // never publish a row whose media didn't make it
  if (!needsRow(row)) continue;

  const existing = remote.get(`${row.section}|${row.dedupe_key}`);
  if (!DRY) {
    if (existing) {
      remoteRows(`UPDATE items SET status = 'approved', data = '${row.data.replaceAll("'", "''")}', reviewed_at = ${row.reviewed_at ?? Date.now()} WHERE id = '${existing.id}'`);
    } else {
      if (remoteIds.has(row.id)) { console.error(`  ✗ ${label}: id already used in production`); continue; }
      const params = [];
      const vals = COLS.map((c) => (row[c] === null || row[c] === undefined ? "NULL" : (params.push(String(row[c])), "?")));
      const batch = join(tmp, "row.json");
      writeFileSync(batch, JSON.stringify([{ sql: `INSERT INTO items (${COLS.join(",")}) VALUES (${vals.join(",")})`, params }]));
      cf(["d1", "query", dbId, "--batch", `@${batch}`]);
    }
  }
  synced++;
  console.log(`  ✓ ${label} (${keys.length} media)`);
}

console.log(`${DRY ? "Would sync" : "Synced"} ${synced} item(s). Redeploy (bash scripts/go-live.sh) so cached pages pick them up.`);
