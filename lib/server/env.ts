import { env as workerEnv } from "cloudflare:workers";

/** The Worker's bindings (see cloudflare.config.ts). Server-only. */
export type Env = {
  DB: D1Database;
  MEDIA: KVNamespace;
  SITE_URL: string;
  ADMIN_EMAIL?: string;
  MAIL_FROM: string;
  SESSION_SECRET?: string;
  INGEST_TOKEN?: string;
  /** Gmail address and app password for sending email over SMTP. */
  SMTP_USER?: string;
  SMTP_PASS?: string;
  GITHUB_TOKEN?: string;
  TURNSTILE_SECRET_KEY?: string;
  /** Present only if Cloudflare Email Sending (Workers Paid) is enabled. */
  EMAIL?: { send(message: Record<string, unknown>): Promise<{ messageId: string }> };
};

/**
 * Secrets that haven't been provided yet are deployed as the placeholder
 * "not-set" (a new Worker must receive every declared secret at once).
 * Treat that placeholder exactly like a missing value.
 */
const PLACEHOLDER = "not-set";
export const env = new Proxy(workerEnv as unknown as Env, {
  get(target, key) {
    const v = Reflect.get(target, key);
    return v === PLACEHOLDER ? undefined : v;
  },
}) as Env;

/** Required secret, with a clear message when it hasn't been set yet. */
export function need<K extends keyof Env>(key: K): NonNullable<Env[K]> {
  const v = env[key];
  if (!v) throw new Error(`Missing ${String(key)} — add it by re-running: bash scripts/go-live.sh`);
  return v as NonNullable<Env[K]>;
}
