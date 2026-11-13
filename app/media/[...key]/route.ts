import { env } from "@/lib/server/env";
import type { MediaMeta } from "@/lib/server/media";

/** Cloudflare's per-data-centre cache (absent in some local runtimes). */
const edge = () => (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;

/**
 * Serves stored media with long-lived caching. Media keys are content-
 * addressed and never change, so the whole file is kept in the edge cache
 * near the reader after the first request; later requests (including the
 * byte ranges Safari asks for before it plays a video) skip KV entirely.
 */
export async function GET(req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  if (!/^[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\.(png|jpg|webp|gif|mp4|webm)$/i.test(key)) {
    return new Response("Not found", { status: 404 });
  }

  const cache = edge();
  const cacheKey = new Request(new URL(`/media/${key}`, req.url).toString());
  if (cache) {
    // The cache answers Range requests from a stored full response itself.
    const hit = await cache.match(new Request(cacheKey.url, { headers: req.headers })).catch(() => undefined);
    if (hit) return hit;
  }

  const { value, metadata } = await env.MEDIA.getWithMetadata<MediaMeta>(key, { type: "arrayBuffer", cacheTtl: 86400 });
  if (!value) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "content-type": metadata?.contentType ?? "application/octet-stream",
    "cache-control": "public, max-age=31536000, immutable",
    "accept-ranges": "bytes",
  });

  if (cache) {
    const full = new Headers(headers);
    full.set("content-length", String(value.byteLength));
    await cache.put(cacheKey, new Response(value.slice(0), { headers: full })).catch(() => {});
  }

  const size = value.byteLength;
  const range = req.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (range) {
    let start = range[1] ? Number(range[1]) : size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(size - 1, end);
    if (start > end) return new Response(null, { status: 416, headers: { "content-range": `bytes */${size}` } });
    headers.set("content-range", `bytes ${start}-${end}/${size}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(value.slice(start, end + 1), { status: 206, headers });
  }
  headers.set("content-length", String(size));
  return new Response(value, { headers });
}
