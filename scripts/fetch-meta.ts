/**
 * Saves each resource's own self-description (page title, meta description
 * and headline) to data/site-meta.json, so the detail drawer can show what a
 * site says about itself. Sites that block plain requests are retried in a
 * real headless browser.
 *
 *   npx tsx scripts/fetch-meta.ts          # only missing entries
 *   npx tsx scripts/fetch-meta.ts --force  # refresh everything
 */
import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { resources } from "../lib/resources";
import { isSocial, logoKey } from "../types/resource";

const OUT = path.join(process.cwd(), "data/site-meta.json");
const FORCE = process.argv.includes("--force");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";

export type SiteMeta = {
  title: string;
  description: string;
  headline: string;
  checked: string;
};

const clean = (s?: string | null) =>
  (s ?? "").replace(/\s+/g, " ").replace(/​/g, "").trim();

function parse(html: string): Omit<SiteMeta, "checked"> {
  const $ = cheerio.load(html);
  // Line breaks inside headings would otherwise glue words together.
  $("br").replaceWith(" ");
  $("h1 *").each((_, el) => {
    $(el).append(" ");
  });
  const meta = (sel: string) => clean($(sel).attr("content"));
  return {
    title: clean($("title").first().text()).slice(0, 160),
    description: (
      meta('meta[name="description"]') ||
      meta('meta[property="og:description"]') ||
      meta('meta[name="twitter:description"]')
    ).slice(0, 400),
    headline: clean($("h1").first().text()).slice(0, 160),
  };
}

const blocked = (m: Omit<SiteMeta, "checked">) =>
  !m.description ||
  /just a moment|attention required|security checkpoint|access denied/i.test(m.title);

async function main() {
  let store: Record<string, SiteMeta> = {};
  try {
    store = JSON.parse(await fs.readFile(OUT, "utf8"));
  } catch {}

  const queue = resources.filter(
    (r) => !isSocial(r) && r.links?.website && (FORCE || !store[logoKey(r)]),
  );
  console.log(`Reading ${queue.length} sites…`);
  const today = new Date().toISOString().slice(0, 10);
  const retry: typeof queue = [];

  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (queue.length) {
        const r = queue.shift()!;
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 12000);
          const res = await fetch(r.links!.website!, {
            signal: ctrl.signal,
            headers: { "user-agent": UA, "accept-language": "en" },
          });
          clearTimeout(t);
          const m = parse(await res.text());
          if (!res.ok || blocked(m)) retry.push(r);
          else store[logoKey(r)] = { ...m, checked: today };
        } catch {
          retry.push(r);
        }
      }
    }),
  );

  if (retry.length) {
    console.log(`Retrying ${retry.length} in a browser…`);
    const browser = await puppeteer.launch();
    for (const r of retry) {
      const page = await browser.newPage();
      await page.setUserAgent(UA);
      try {
        await page.goto(r.links!.website!, { waitUntil: "domcontentloaded", timeout: 30000 });
        await new Promise((res) => setTimeout(res, 3000));
        const m = parse(await page.content());
        if (!blocked(m)) store[logoKey(r)] = { ...m, checked: today };
        else console.log(`  ✗ ${r.title} — blocked`);
      } catch {
        console.log(`  ✗ ${r.title} — unreachable`);
      }
      await page.close();
    }
    await browser.close();
  }

  const sorted = Object.fromEntries(Object.entries(store).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(OUT, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Saved ${Object.keys(sorted).length} entries to data/site-meta.json`);
}

main();
