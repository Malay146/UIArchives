import { env } from "@/lib/server/env";
import { createItem, logRun } from "@/lib/server/db";
import { enrich } from "@/lib/server/enrich";
import { SECTION_SCHEMAS, isSectionKey, validate, MIN_SKILL_STARS } from "@/lib/section-schemas";

/**
 * For the scheduled Claude agent (and any trusted script): add candidates to
 * the review queue. Bearer-token protected. Nothing is ever published here —
 * every item lands as `pending`.
 *
 * POST { origin: "claude", items: [{ section, data }] }  (max 25 per call)
 */
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!env.INGEST_TOKEN || token.length < 32 || token !== env.INGEST_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as { origin?: string; items?: { section?: string; data?: Record<string, unknown> }[] } | null;
  const items = (body?.items ?? []).slice(0, 25);
  const origin = String(body?.origin ?? "claude").slice(0, 40);

  const results: { section: string; status: "queued" | "duplicate" | "invalid"; error?: string }[] = [];
  for (const it of items) {
    if (!isSectionKey(it.section) || !it.data) {
      results.push({ section: String(it.section), status: "invalid", error: "Unknown section or missing data" });
      continue;
    }
    const schema = SECTION_SCHEMAS[it.section];
    // Automation may omit fields a person will set during review (style, colour…).
    const { data, errors } = validate({ ...schema, fields: schema.fields.map((f) => ({ ...f, required: f.key === schema.dedupeField })) }, it.data, {
      hasFile: { image: !!it.data.image, video: !!it.data.video },
    });
    if (errors.length) {
      results.push({ section: it.section, status: "invalid", error: errors[0] });
      continue;
    }
    for (const k of ["image", "video", "poster"]) if (typeof it.data[k] === "string") data[k] = it.data[k] as string;
    const enriched = await enrich(it.section, data, crypto.randomUUID().slice(0, 8));
    if (it.section === "skills" && Number(enriched.stars ?? 0) < MIN_SKILL_STARS) {
      results.push({ section: it.section, status: "invalid", error: `Skills need ${MIN_SKILL_STARS.toLocaleString("en-US")}+ GitHub stars` });
      continue;
    }
    // Never queue an item whose media couldn't be fetched: it would publish
    // as an empty tile. The caller can simply send it again.
    const missing =
      (it.section === "app-icons" && !enriched.image) ||
      (it.section === "og-images" && !enriched.image) ||
      (it.section === "designs" && !enriched.video);
    if (missing) {
      results.push({ section: it.section, status: "invalid", error: "Couldn't fetch its media right now. Try again." });
      continue;
    }
    const created = await createItem({ section: it.section, data: enriched, source: "automation", origin });
    results.push({ section: it.section, status: created ? "queued" : "duplicate" });
  }
  await logRun(origin, items.length, results.filter((r) => r.status === "queued").length).catch(() => {});
  return Response.json({ results });
}
