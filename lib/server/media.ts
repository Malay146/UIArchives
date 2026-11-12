import { env } from "./env";

/**
 * Media lives in Workers KV (free tier: 1 GB, values up to 25 MB, no payment
 * method needed). Keys look like `<section>/<id>/<random>.<ext>`; the content
 * type travels as KV metadata. Served by app/media/[...key]/route.ts.
 */
const EXT: Record<string, string> = {
  "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif",
  "video/mp4": "mp4", "video/webm": "webm",
};

/** KV's hard limit is 25 MiB per value; stay comfortably under it. */
const KV_MAX = 24 * 1024 * 1024;

export type MediaMeta = { contentType: string };

export const mediaUrl = (key: string) => `/media/${key}`;

async function put(prefix: string, type: string, body: ArrayBuffer) {
  if (body.byteLength > KV_MAX) throw new Error("File too large");
  const key = `${prefix}/${crypto.randomUUID().slice(0, 8)}.${EXT[type]}`;
  await env.MEDIA.put(key, body, { metadata: { contentType: type } satisfies MediaMeta });
  return mediaUrl(key);
}

export async function putFile(prefix: string, file: File) {
  if (!EXT[file.type]) throw new Error(`Unsupported media type ${file.type}`);
  return put(prefix, file.type, await file.arrayBuffer());
}

/** Copy a remote image (App Store artwork, og:image) into storage. Size-capped. */
export async function storeRemote(prefix: string, url: string, maxMb = 6) {
  const res = await fetch(url, { headers: { "user-agent": "UIArchivesBot/1.0 (+https://uiarchives.com)" } });
  if (!res.ok) throw new Error(`Fetch ${res.status} for ${url}`);
  const type = (res.headers.get("content-type") ?? "").split(";")[0];
  if (!EXT[type]) throw new Error(`Unsupported media type ${type}`);
  const len = Number(res.headers.get("content-length") ?? 0);
  if (len > maxMb * 1024 * 1024) throw new Error("File too large");
  const body = await res.arrayBuffer();
  if (body.byteLength > maxMb * 1024 * 1024) throw new Error("File too large");
  return put(prefix, type, body);
}
