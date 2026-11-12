/**
 * Scrapes each resource's real icon from its own website and stores a
 * normalised 128px WebP in public/logos, plus how it should be framed.
 *
 *   npx tsx scripts/fetch-logos.ts            # only missing logos
 *   npx tsx scripts/fetch-logos.ts --force    # refetch everything
 *   npx tsx scripts/fetch-logos.ts --socials  # refetch people only
 *
 * Products: apple-touch-icon → SVG icon → largest PNG icon →
 * web manifest icon → /favicon.ico → Google's favicon service.
 * People (Socials): their X profile picture, via unavatar.io.
 */
import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import puppeteer, { type Page } from "puppeteer";
import { cardData } from "../data/cardData";
import { isSocial, logoKey, primaryHref, xHandle } from "../types/resource";

const OUT_DIR = path.join(process.cwd(), "public/logos");
const MANIFEST = path.join(process.cwd(), "data/logos.json");
const FORCE = process.argv.includes("--force");
const SOCIALS = process.argv.includes("--socials");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";

export type LogoInfo = {
  src: string;
  /** "tile": opaque artwork that should fill the frame edge to edge.
   *  "glyph": a mark on transparency that needs padding and a backdrop. */
  mode: "tile" | "glyph";
  /** Backdrop for glyphs: light glyphs sit on dark, dark glyphs on light. */
  tone: "light" | "dark";
  /** People get round avatars, products keep square marks. */
  shape?: "circle";
  from: string;
};

type Candidate = { url: string; score: number; from: string };

async function get(url: string, ms = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "user-agent": UA, accept: "*/*" },
    });
  } finally {
    clearTimeout(t);
  }
}

function sizeOf(sizes?: string) {
  const m = sizes?.match(/(\d+)x(\d+)/);
  return m ? Number(m[1]) : 0;
}

async function candidates(site: string): Promise<Candidate[]> {
  const list: Candidate[] = [];
  let base = site;
  try {
    const res = await get(site);
    base = res.url || site;
    const $ = cheerio.load(await res.text());

    $("link[rel]").each((_, el) => {
      const rel = ($(el).attr("rel") || "").toLowerCase();
      const href = $(el).attr("href");
      if (!href || href.startsWith("data:")) return;
      const url = new URL(href, base).href;
      const size = sizeOf($(el).attr("sizes"));
      const type = ($(el).attr("type") || "").toLowerCase();
      if (rel.includes("apple-touch-icon")) {
        list.push({ url, score: 400 + size, from: "apple-touch-icon" });
      } else if (rel.split(/\s+/).includes("icon")) {
        const svg = type.includes("svg") || /\.svg(\?|$)/i.test(url);
        if ($(el).attr("media")?.includes("dark")) return; // prefer light-scheme art
        list.push({ url, score: svg ? 350 : 100 + size, from: svg ? "svg icon" : "icon" });
      }
    });

    const manifest = $('link[rel="manifest"]').attr("href");
    if (manifest) {
      try {
        const mUrl = new URL(manifest, base).href;
        const m = (await (await get(mUrl)).json()) as { icons?: { src?: string; sizes?: string; purpose?: string }[] };
        for (const icon of m.icons ?? []) {
          if (!icon.src || icon.purpose?.includes("monochrome")) continue;
          list.push({
            url: new URL(icon.src, mUrl).href,
            score: 150 + Math.min(sizeOf(icon.sizes), 256),
            from: "manifest",
          });
        }
      } catch {}
    }
  } catch {}

  const origin = new URL(base).origin;
  list.push({ url: `${origin}/apple-touch-icon.png`, score: 60, from: "/apple-touch-icon.png" });
  list.push({ url: `${origin}/favicon.ico`, score: 50, from: "/favicon.ico" });
  list.push({
    url: `https://www.google.com/s2/favicons?domain=${new URL(base).hostname}&sz=128`,
    score: 0,
    from: "google",
  });
  return list.sort((a, b) => b.score - a.score);
}

/** Rasterise any image the browser can decode into a 128px WebP + analysis. */
async function render(page: Page, dataUrl: string) {
  return page.evaluate(async (src: string) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const N = 128;
    const c = document.createElement("canvas");
    c.width = c.height = N;
    const g = c.getContext("2d")!;
    const w = img.naturalWidth || N;
    const h = img.naturalHeight || N;
    if (w < 16 || h < 16) throw new Error("too small");
    const s = Math.min(N / w, N / h);
    g.imageSmoothingQuality = "high";
    g.drawImage(img, (N - w * s) / 2, (N - h * s) / 2, w * s, h * s);

    const { data } = g.getImageData(0, 0, N, N);
    let minX = N, minY = N, maxX = -1, maxY = -1, opaque = 0, lum = 0, lumN = 0;
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const i = (y * N + x) * 4;
        const a = data[i + 3];
        if (a > 24) {
          minX = Math.min(minX, x); maxX = Math.max(maxX, x);
          minY = Math.min(minY, y); maxY = Math.max(maxY, y);
          if (a > 200) opaque++;
          const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          lum += l * (a / 255); lumN += a / 255;
        }
      }
    if (maxX < 0) throw new Error("empty");

    // Crop to the visible artwork so every logo is framed consistently.
    const bw = maxX - minX + 1, bh = maxY - minY + 1;
    const side = Math.max(bw, bh);
    const out = document.createElement("canvas");
    out.width = out.height = N;
    const o = out.getContext("2d")!;
    o.imageSmoothingQuality = "high";
    o.drawImage(c, minX - (side - bw) / 2, minY - (side - bh) / 2, side, side, 0, 0, N, N);

    // A tile is opaque artwork filling (nearly) its whole square.
    const fill = opaque / (side * side);
    const square = Math.min(bw, bh) / side > 0.9;
    return {
      webp: out.toDataURL("image/webp", 0.9),
      mode: square && fill > 0.86 ? "tile" : "glyph",
      tone: lumN && lum / lumN > 0.72 ? "light" : "dark",
    };
  }, dataUrl);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  let manifest: Record<string, LogoInfo> = {};
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  } catch {}

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("about:blank");

  const queue = cardData.filter((c) =>
    SOCIALS ? isSocial(c) : FORCE || !manifest[logoKey(c)],
  );
  console.log(`Fetching ${queue.length} of ${cardData.length} logos…`);

  const CONCURRENCY = 6;
  let done = 0;
  const work = async (card: (typeof cardData)[number]) => {
    const key = logoKey(card);
    const social = isSocial(card);
    const handle = xHandle(card.links?.twitter).slice(1);
    const site = primaryHref(card);
    if (!social && site === "#") return;
    const list: Candidate[] = social
      ? handle
        ? [
            { url: `https://unavatar.io/x/${handle}?fallback=false`, score: 1, from: "x avatar" },
            { url: `https://unavatar.io/twitter/${handle}?fallback=false`, score: 0, from: "x avatar" },
          ]
        : []
      : await candidates(site);
    for (const cand of list) {
      try {
        const res = await get(cand.url);
        if (!res.ok) continue;
        const type = res.headers.get("content-type") || "";
        if (type.includes("text/html")) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 100) continue;
        const mime = /svg/.test(type) || /\.svg(\?|$)/i.test(cand.url)
          ? "image/svg+xml"
          : type.split(";")[0] || "image/png";
        const result = await render(page, `data:${mime};base64,${buf.toString("base64")}`);
        const file = `${key}.webp`;
        await fs.writeFile(path.join(OUT_DIR, file), Buffer.from(result.webp.split(",")[1], "base64"));
        manifest[key] = {
          src: `/logos/${file}`,
          // Avatars are photos: always fill the frame.
          mode: social ? "tile" : (result.mode as LogoInfo["mode"]),
          tone: result.tone as LogoInfo["tone"],
          ...(social ? { shape: "circle" as const } : {}),
          from: cand.from,
        };
        console.log(`${String(++done).padStart(3)}  ${card.title.padEnd(28)} ${result.mode.padEnd(5)} ${result.tone.padEnd(5)} ${cand.from}`);
        return;
      } catch {}
    }
    console.log(`  ✗  ${card.title} — no usable icon`);
  };

  for (let i = 0; i < queue.length; i += CONCURRENCY) {
    await Promise.all(queue.slice(i, i + CONCURRENCY).map(work));
  }

  await browser.close();
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(sorted).length} entries to data/logos.json`);
}

main();
