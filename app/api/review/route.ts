import { env } from "@/lib/server/env";
import { getAdmin, sameOrigin } from "@/lib/server/auth";
import { findsDuplicate, getItem, reviewItem } from "@/lib/server/db";
import { storeRemote } from "@/lib/server/media";
import { resourceMedia } from "@/lib/server/enrich";
import { layout, sendMail } from "@/lib/server/email";
import { SECTION_SCHEMAS, validate } from "@/lib/section-schemas";

const fail = (error: string, status = 400) => Response.json({ error }, { status });

/**
 * Approve or reject an item. On approval the (possibly edited) data is
 * validated against the section, remote artwork is copied into storage (KV) so it can
 * never break, and the submitter is emailed either way.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Bad origin.", 403);
  if (!(await getAdmin())) return fail("Sign in first.", 401);

  const body = (await req.json().catch(() => null)) as
    | { id?: string; action?: "approve" | "reject"; data?: Record<string, unknown>; note?: string }
    | null;
  if (!body?.id || (body.action !== "approve" && body.action !== "reject")) return fail("Bad request.");

  const item = await getItem(body.id);
  if (!item) return fail("Not found.", 404);
  const schema = SECTION_SCHEMAS[item.section];
  const note = body.note?.trim().slice(0, 600) || null;

  let data = item.data;
  if (body.action === "approve") {
    const merged = { ...item.data, ...(body.data ?? {}) };
    const hasFile = Object.fromEntries(schema.fields.filter((f) => f.type === "file").map((f) => [f.key, !!merged[f.key]]));
    const { data: clean, errors } = validate(schema, merged, { hasFile });
    if (errors.length) return fail(errors[0]);
    // Keep extra enrichment fields (poster, pageTitle, …) that aren't form fields.
    data = { ...item.data, ...clean };
    // Every published design says why it's worth studying.
    if (item.section === "designs" && !String(data.note ?? "").trim()) {
      return fail("Add “Why it works” before approving — every design shows it.");
    }
    // Never publish the same thing twice: it may have landed in the data files
    // or been approved under another entry since it was queued, or been edited here.
    if (await findsDuplicate(item.section, data, item.id)) {
      return fail(`This ${schema.noun} is already in the archive or another entry in the queue. Reject it instead.`, 409);
    }
    // Resources: make sure the logo and preview were fetched (older or hand-added entries).
    if (item.section === "resources" && (!data.logo || !data.image)) {
      Object.assign(data, await resourceMedia(data, item.id).catch(() => ({})));
    }
    for (const k of ["image"]) {
      const v = data[k];
      if (typeof v === "string" && /^https?:\/\//.test(v)) {
        data[k] = await storeRemote(`${item.section}/${item.id}`, v).catch(() => v);
      }
    }
  }

  const updated = await reviewItem(item.id, body.action === "approve" ? "approved" : "rejected", data, note);

  // Email the submitter once, on the first decision — not again if it's changed later.
  if (item.submitter_email && item.status === "pending") {
    const title = String(data[schema.titleField] ?? "your submission");
    const name = item.submitter_name ?? "there";
    if (body.action === "approve") {
      await sendMail({
        to: item.submitter_email,
        subject: `“${title}” is now in UIArchives`,
        text: `Hi ${name},\n\nGood news — “${title}” was approved and is now live in the ${schema.label} section.${note ? `\n\nNote: ${note}` : ""}\n\n${env.SITE_URL}${schema.key === "resources" ? "/" : `/${schema.key}`}\n\nThank you for contributing.\n— UIArchives`,
        html: layout(`“${title}” is live.`, [
          `Good news — your ${schema.noun} was approved and is now in the ${schema.label} section.`,
          ...(note ? [note] : []),
          "Thank you for contributing.",
        ], { href: `${env.SITE_URL}${schema.key === "resources" ? "/" : `/${schema.key}`}`, label: `View ${schema.label}` }),
      });
    } else {
      await sendMail({
        to: item.submitter_email,
        subject: `About your submission: “${title}”`,
        text: `Hi ${name},\n\nThanks for sending “${title}”. After review, it isn't a fit for UIArchives right now.${note ? `\n\nWhy: ${note}` : ""}\n\nYou're welcome to submit something else any time.\n— UIArchives`,
        html: layout(`Thanks for sending “${title}”.`, [
          "After review, it isn't a fit for the archive right now.",
          ...(note ? [`Why: ${note}`] : []),
          "You're welcome to submit something else any time.",
        ]),
      });
    }
  }

  return Response.json({ ok: true, item: updated });
}
