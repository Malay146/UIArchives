import { env } from "@/lib/server/env";
import type { MediaMeta } from "@/lib/server/media";

/**
 * Serves stored media from KV with long-lived caching. Supports byte ranges,
 * which Safari requires before it will play a video.
 */
export async function GET(req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  if (!/^[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\.(png|jpg|webp|gif|mp4|webm)$/i.test(key)) {
    return new Response("Not found", { status: 404 });
  }
  const { value, metadata } = await env.MEDIA.getWithMetadata<MediaMeta>(key, "arrayBuffer");
  if (!value) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "content-type": metadata?.contentType ?? "application/octet-stream",
    "cache-control": "public, max-age=31536000, immutable",
    "accept-ranges": "bytes",
  });

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
