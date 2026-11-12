/**
 * Captures what a visitor actually lands on: a 1440×900 snapshot of each
 * resource's website, saved as WebP in public/snapshots, indexed in
 * data/snapshots.json. People (Socials) are skipped — they link to X.
 *
 *   npx tsx scripts/fetch-snapshots.ts           # only missing snapshots
 *   npx tsx scripts/fetch-snapshots.ts --force   # retake everything
 *   npx tsx scripts/fetch-snapshots.ts shadcn    # retake specific keys
 *   add --wait=9000 for slow, animation-heavy pages
 */
import fs from "node:fs/promises";
import path from "node:path";
import puppeteer, { type Browser } from "puppeteer";
import { resources } from "../lib/resources";
import { isSocial, logoKey } from "../types/resource";

const OUT_DIR = path.join(process.cwd(), "public/snapshots");
const INDEX = path.join(process.cwd(), "data/snapshots.json");
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = new Set(args.filter((a) => !a.startsWith("--")));
const W = 1440;
const H = 900;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

export type Snapshot = { src: string; width: number; height: number; checked: string };

const BLOCKED = /just a moment|attention required|security checkpoint|access denied|verify you are human|captcha/i;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const SETTLE = Number(args.find((a) => a.startsWith("--wait="))?.slice(7) ?? 3500);

/** Accept or hide cookie / consent banners so the page itself is visible. */
async function clearConsent(page: import("puppeteer").Page) {
  await page
    .evaluate(() => {
      const label = /^(accept( all)?( cookies)?|allow( all)?( cookies)?|agree|i agree|got it|ok(ay)?|continue|accept & close)$/i;
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("button, a[role=button], [role=button]"))) {
        const t = (el.innerText || "").trim();
        if (label.test(t)) {
          el.click();
          break;
        }
      }
      const sel = [
        "#onetrust-banner-sdk", "#onetrust-consent-sdk", "#CybotCookiebotDialog", ".cky-consent-container",
        "#usercentrics-root", ".osano-cm-window", "#truste-consent-track", ".fc-consent-root",
        "[id*=cookie-banner]", "[class*=cookie-banner]", "[class*=CookieBanner]", "[id*=cookie-consent]",
        "[class*=cookie-consent]", "[aria-label*=cookie i]", "[aria-label*=consent i]",
      ];
      document.querySelectorAll<HTMLElement>(sel.join(",")).forEach((el) => el.style.setProperty("display", "none", "important"));
    })
    .catch(() => {});
}

/**
 * Wait until the page has visibly finished arriving: finish every CSS / WAAPI
 * animation, then compare frames until two in a row match (JS-driven
 * entrances like Motion need real time). Endless loops give up after ~10s.
 */
async function settle(page: import("puppeteer").Page) {
  const finish = () =>
    page
      .evaluate(() => {
        for (const a of document.getAnimations()) {
          try {
            if (a.effect?.getTiming().iterations !== Infinity) a.finish();
          } catch {}
        }
      })
      .catch(() => {});
  await finish();
  let last = "";
  for (let i = 0; i < 8; i++) {
    await sleep(1200);
    await finish();
    const frame = Buffer.from(
      await page.screenshot({ type: "jpeg", quality: 40, encoding: "binary" }),
    ).toString("base64");
    if (frame === last) return;
    last = frame;
  }
}

async function capture(browser: Browser, url: string, file: string) {
  const page = await browser.newPage();
  try {
    await page.setUserAgent(UA);
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    // Reduced motion freezes most heroes at their first frame; --motion lets
    // pages that only draw after an entrance animation play it out.
    if (!args.includes("--motion")) {
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    }
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 }).catch(() => {});
    // Let hero animations and late fonts settle; give bot checks a chance to pass.
    for (let i = 0; i < 3; i++) {
      await sleep(i === 0 ? SETTLE : 6000);
      if (!BLOCKED.test(await page.title().catch(() => ""))) break;
    }
    if (BLOCKED.test(await page.title().catch(() => ""))) return false;
    // Error pages served to automated browsers are worse than no snapshot.
    const body = await page.evaluate(() => document.body?.innerText.slice(0, 3000) ?? "").catch(() => "");
    if (/^\s*forbidden|something went wrong|try these little browser tricks|enable javascript and cookies/i.test(body)) return false;
    await clearConsent(page);
    // Some pages wait for any interaction before painting.
    await page.mouse.move(W / 2, H / 2).catch(() => {});
    await page.evaluate(() => {
      window.scrollTo(0, 120);
      window.dispatchEvent(new Event("scroll"));
    }).catch(() => {});
    await sleep(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await settle(page);
    await page.screenshot({ path: file as `${string}.webp`, type: "webp", quality: 72 });
    return true;
  } catch {
    return false;
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  let index: Record<string, Snapshot> = {};
  try {
    index = JSON.parse(await fs.readFile(INDEX, "utf8"));
  } catch {}

  const queue = resources.filter((r) => {
    if (isSocial(r) || !r.links?.website) return false;
    const key = logoKey(r);
    if (ONLY.size) return ONLY.has(key);
    return FORCE || !index[key];
  });
  console.log(`Capturing ${queue.length} landing pages…`);

  const browser = await puppeteer.launch({
    // Software WebGL so shader- and canvas-heavy heroes actually render.
    args: ["--hide-scrollbars", "--lang=en-US", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const today = new Date().toISOString().slice(0, 10);
  let n = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (queue.length) {
        const r = queue.shift()!;
        const key = logoKey(r);
        const ok = await capture(browser, r.links!.website!, path.join(OUT_DIR, `${key}.webp`));
        if (ok) {
          index[key] = { src: `/snapshots/${key}.webp`, width: W, height: H, checked: today };
          console.log(`${String(++n).padStart(3)}  ${r.title}`);
        } else {
          console.log(`  ✗  ${r.title} — blocked or unreachable, keeping fallback image`);
        }
      }
    }),
  );
  await browser.close();

  const sorted = Object.fromEntries(Object.entries(index).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(INDEX, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Saved ${Object.keys(sorted).length} snapshots`);
}

main();
