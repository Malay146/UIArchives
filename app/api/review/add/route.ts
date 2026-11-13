import { getAdmin, sameOrigin } from "@/lib/server/auth";
import { createItem } from "@/lib/server/db";
import { enrich } from "@/lib/server/enrich";
import { SECTION_SCHEMAS, dedupeKey } from "@/lib/section-schemas";

/**
 * Admin-only quick add: paste a link, the section is inferred (X post →
 * Designs, App Store → App Icons, GitHub → Skills, anything else → Resources),
 * details are filled from official sources, and it lands in the queue.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await getAdmin())) return Response.json({ error: "Sign in first." }, { status: 401 });
  const { url } = ((await req.json().catch(() => ({}))) ?? {}) as { url?: string };
  let u: URL;
  try {
    u = new URL(String(url));
  } catch {
    return Response.json({ error: "Paste a full link." }, { status: 400 });
  }
  const key = dedupeKey(u.href);
  const section = key.startsWith("x:") ? "designs" : key.startsWith("appstore:") ? "app-icons" : u.hostname === "github.com" ? "skills" : "resources";
  const field = SECTION_SCHEMAS[section].dedupeField;
  const data = await enrich(section, { [field]: u.href }, crypto.randomUUID().slice(0, 8));
  const item = await createItem({ section, data, source: "automation", origin: "manual" });
  if (!item) return Response.json({ error: "Already in the archive or the queue." }, { status: 409 });
  return Response.json({ ok: true, item });
}
