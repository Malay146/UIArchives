import { env } from "./env";

type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string };

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Plain, readable HTML that matches the site: one column, black on white. */
export function layout(title: string, paragraphs: string[], cta?: { href: string; label: string }) {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px;color:#525252">${escape(p)}</p>`).join("");
  const button = cta
    ? `<p style="margin:24px 0 0"><a href="${cta.href}" style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:9px 14px;border-radius:6px;font-weight:500">${escape(cta.label)}</a></p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#fff">
<div style="max-width:520px;margin:0 auto;padding:40px 24px;font:14px/1.6 -apple-system,BlinkMacSystemFont,'Geist',sans-serif;color:#0a0a0a">
<p style="margin:0 0 28px;font-weight:500">UIArchives</p>
<p style="margin:0 0 14px;font-weight:500">${escape(title)}</p>${body}${button}
<p style="margin:36px 0 0;color:#8a8a8a;font-size:12px">An archive for people who make interfaces · uiarchives.com</p>
</div></body></html>`;
}

/**
 * Send one transactional email through your Gmail (SMTP over TLS from the
 * Worker), or Cloudflare Email Sending if the EMAIL binding is ever added.
 * Never throws: a failed email must not fail the action that triggered it.
 * Gmail always sends as the authenticated address, so that's the From.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  try {
    if (env.EMAIL) {
      await env.EMAIL.send({ from: env.MAIL_FROM, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html, replyTo: mail.replyTo });
      return true;
    }
    if (env.SMTP_USER && env.SMTP_PASS) {
      const { WorkerMailer } = await import("worker-mailer");
      await WorkerMailer.send(
        {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          credentials: { username: env.SMTP_USER, password: env.SMTP_PASS.replace(/\s+/g, "") },
          authType: "plain",
        },
        {
          from: { name: "UIArchives", email: env.SMTP_USER },
          to: mail.to,
          reply: mail.replyTo,
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
        },
      );
      return true;
    }
    console.log("[email:not-configured]", mail.to, mail.subject);
    return false;
  } catch (e) {
    console.error("[email:error]", e);
    return false;
  }
}
