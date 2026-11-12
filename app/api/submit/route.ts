import { env } from "@/lib/server/env";
import { createItem } from "@/lib/server/db";
import { ipHash } from "@/lib/server/auth";
import { enrich } from "@/lib/server/enrich";
import { putFile } from "@/lib/server/media";
import { layout, sendMail } from "@/lib/server/email";
import { SECTION_SCHEMAS, isSectionKey, validate } from "@/lib/section-schemas";

const LIMIT_PER_HOUR = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const fail = (error: string, status = 400) => Response.json({ error }, { status });

/** Public submissions for every section. Everything lands as `pending`. */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Couldn't read the form.");
  }

  // Honeypot: real people never see or fill this field.
  if (String(form.get("company") ?? "")) return Response.json({ ok: true });

  const section = form.get("section");
  if (!isSectionKey(section)) return fail("Unknown section.");
  const schema = SECTION_SCHEMAS[section];

  const name = String(form.get("submitterName") ?? "").trim().slice(0, 80);
  const email = String(form.get("submitterEmail") ?? "").trim().slice(0, 160);
  if (!name) return fail("Please add your name.");
  if (!EMAIL_RE.test(email)) return fail("Please add a valid email — we'll write when it's reviewed.");

  // Optional Cloudflare Turnstile.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = String(form.get("cf-turnstile-response") ?? "");
    const check = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: req.headers.get("cf-connecting-ip") ?? "" }),
    }).then((r) => r.json() as Promise<{ success: boolean }>).catch(() => ({ success: false }));
    if (!check.success) return fail("Spam check failed. Please try again.");
  }

  // Rate limit by hashed IP.
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const hash = await ipHash(ip);
  const hourAgo = Date.now() - 3600_000;
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM submit_attempts WHERE ip_hash = ? AND created_at > ?")
    .bind(hash, hourAgo).first<{ n: number }>();
  if ((recent?.n ?? 0) >= LIMIT_PER_HOUR) return fail("That's a lot of submissions — please try again in an hour.", 429);
  await env.DB.prepare("INSERT INTO submit_attempts (ip_hash, created_at) VALUES (?, ?)").bind(hash, Date.now()).run();

  // Fields (multiselects arrive as repeated keys).
  const input: Record<string, unknown> = {};
  const hasFile: Record<string, boolean> = {};
  for (const f of schema.fields) {
    if (f.type === "file") {
      const file = form.get(f.key);
      if (file instanceof File && file.size > 0) {
        if (f.accept && !f.accept.split(",").includes(file.type)) return fail(`${f.label} must be ${f.accept.replace(/\w+\//g, "").toUpperCase()}.`);
        if (f.maxMb && file.size > f.maxMb * 1024 * 1024) return fail(`${f.label} must be under ${f.maxMb} MB.`);
        hasFile[f.key] = true;
      }
    } else if (f.type === "multiselect") {
      input[f.key] = form.getAll(f.key).map(String);
    } else {
      input[f.key] = form.get(f.key);
    }
  }
  const { data, errors } = validate(schema, input, { hasFile });
  if (errors.length) return fail(errors[0]);

  // Store uploads, then fill blanks from official sources.
  const id = crypto.randomUUID().slice(0, 8);
  for (const f of schema.fields) {
    if (f.type === "file" && hasFile[f.key]) data[f.key] = await putFile(`${section}/${id}`, form.get(f.key) as File);
  }
  const enriched = await enrich(section, data, id);

  const item = await createItem({ section, data: enriched, source: "submission", submitterName: name, submitterEmail: email });
  if (!item) return fail(`This ${schema.noun} is already in the archive or under review.`, 409);

  const title = String(enriched[schema.titleField] ?? "your submission");
  await Promise.all([
    sendMail({
      to: email,
      subject: `We got your ${schema.noun}: ${title}`,
      text: `Hi ${name},\n\nThanks for sending “${title}” to UIArchives. Every submission is reviewed by hand — we'll email you as soon as it's been looked at.\n\n— UIArchives`,
      html: layout(`Thanks, ${name}.`, [
        `We received “${title}”. Every submission is reviewed by hand, and we'll email you as soon as it's been looked at.`,
      ]),
    }),
    env.ADMIN_EMAIL
      ? sendMail({
          to: env.ADMIN_EMAIL,
          replyTo: email,
          subject: `New ${schema.noun} to review: ${title}`,
          text: `${name} <${email}> submitted “${title}”.\n\nReview: ${env.SITE_URL}/review`,
          html: layout(`New ${schema.noun} to review`, [`${name} submitted “${title}”.`], { href: `${env.SITE_URL}/review`, label: "Open review" }),
        })
      : Promise.resolve(false),
  ]);

  return Response.json({ ok: true });
}
