#!/usr/bin/env node
// Copies archive items from production into the local dev database, with
// their media. The reverse of sync-to-prod.mjs.
//
//   node scripts/pull-from-prod.mjs            # stop `npm run dev` first
//   node scripts/pull-from-prod.mjs --dry-run  # only report
//   node scripts/pull-from-prod.mjs --section app-icons   # one section only
//
// - The local D1 file is backed up first (<db>.sqlite.bak-<timestamp>).
// - Items match on section + dedupe_key (or id). Production wins: matching
//   local rows are replaced. Local-only rows are kept, never deleted.
// - Every /media/<key> the production rows reference that local KV lacks is
//   downloaded from uiarchives.com and stored in local KV with its type.
// Only the items table is pulled; passkeys, email codes and logs stay local.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DRY = process.argv.includes("--dry-run");
const SECTION = process.argv.includes("--section") ? process.argv[process.argv.indexOf("--section") + 1] : null;
if (SECTION !== null && !/^[a-z-]+$/.test(SECTION ?? "")) throw new Error("--section needs a name like app-icons");
const SITE = "https://uiarchives.com";
const DB_NAME = "uiarchives";
const LOCAL_KV = "MEDIA-uiarchives";
const D1_DIR = ".cloudflare/state/v3/d1/miniflare-D1DatabaseObject";
const COLS = ["id", "section", "status", "source", "origin", "data", "dedupe_key", "submitter_name", "submitter_email", "review_note", "created_at", "reviewed_at"];

const cf = (args) => execFileSync("npx", ["cf", ...args], { encoding: "utf8", maxBuffer: 256 << 20 });
const json = (s) => JSON.parse(s.slice(s.search(/[[{]/), Math.max(s.lastIndexOf("]"), s.lastIndexOf("}")) + 1));
const sqlite = (db, sql) => JSON.parse(execFileSync("sqlite3", ["-json", db, sql], { encoding: "utf8", maxBuffer: 256 << 20 }) || "[]");
const lit = (v) => (v === null || v === undefined ? "NULL" : typeof v === "number" ? String(v) : `'${String(v).replaceAll("'", "''")}'`);

const localDb = readdirSync(D1_DIR).filter((f) => f.endsWith(".sqlite") && f !== "metadata.sqlite").map((f) => join(D1_DIR, f))[0];
if (!localDb) throw new Error("Local D1 database not found — run the dev server once.");

const dbId = json(cf(["d1", "list"])).find((d) => d.name === DB_NAME)?.uuid;
if (!dbId) throw new Error("Production D1 database not found.");

const remote = json(cf(["d1", "query", dbId, "--sql", `SELECT ${COLS.join(",")} FROM items${SECTION ? ` WHERE section = '${SECTION}'` : ""}`]))[0].results;
const local = sqlite(localDb, "SELECT id, section, dedupe_key FROM items");
const byKey = new Map(local.map((r) => [`${r.section}|${r.dedupe_key}`, r.id]));
const localIds = new Set(local.map((r) => r.id));

const added = remote.filter((r) => !byKey.has(`${r.section}|${r.dedupe_key}`) && !localIds.has(r.id)).length;
console.log(`${SECTION ? `[${SECTION}] ` : ""}Production: ${remote.length} items. Local: ${local.length}. New locally: ${added}, replaced: ${remote.length - added}.`);

// ---------------------------------------------------------------- media
const tmp = mkdtempSync(join(tmpdir(), "uia-pull-"));
const listed = json(cf(["kv", "keys", "list", "--local", "--namespace-id", LOCAL_KV]));
const have = new Set((Array.isArray(listed) ? listed : listed.result ?? []).map((k) => k.name));
const keys = [...new Set(remote.flatMap((r) => [...r.data.matchAll(/\/media\/([^"\\\s]+)/g)].map((m) => m[1])))];
const missing = keys.filter((k) => !have.has(k));
console.log(`Media: ${keys.length} referenced, ${missing.length} missing locally.`);

let failed = 0;
for (const key of missing) {
  const res = await fetch(`${SITE}/media/${key}`);
  if (!res.ok) { console.error(`  ✗ ${key}: HTTP ${res.status} on production`); failed++; continue; }
  const type = (res.headers.get("content-type") ?? "application/octet-stream").split(";")[0];
  const file = join(tmp, key.replaceAll("/", "_"));
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  if (!DRY) cf(["kv", "keys", "put", key, "--local", "--namespace-id", LOCAL_KV, "--file", file, "--metadata", JSON.stringify({ contentType: type })]);
  console.log(`  ↓ ${key}`);
}

// ---------------------------------------------------------------- rows
if (DRY) {
  console.log("Dry run — nothing written.");
  process.exit(0);
}
const backup = `${localDb}.bak-${Date.now()}`;
copyFileSync(localDb, backup);
console.log(`Backed up local DB to ${backup}`);

const stmts = ["BEGIN;"];
for (const r of remote) {
  const localId = byKey.get(`${r.section}|${r.dedupe_key}`);
  if (localId) stmts.push(`DELETE FROM items WHERE id = ${lit(localId)};`);
  stmts.push(`DELETE FROM items WHERE id = ${lit(r.id)};`);
  stmts.push(`INSERT INTO items (${COLS.join(",")}) VALUES (${COLS.map((c) => lit(r[c])).join(",")});`);
}
stmts.push("COMMIT;");
execFileSync("sqlite3", [localDb], { input: stmts.join("\n"), maxBuffer: 256 << 20 });

const counts = sqlite(localDb, "SELECT status, count(*) n FROM items GROUP BY 1").map((r) => `${r.status} ${r.n}`).join(", ");
console.log(`Done. Local items now: ${counts}.${failed ? ` ${failed} media file(s) could not be fetched.` : ""}`);
