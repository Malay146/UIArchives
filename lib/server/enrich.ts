import { env } from "./env";
import { storeRemote } from "./media";
import type { ItemData, SectionKey } from "@/lib/section-schemas";

/**
 * Fill in what can be looked up from official, public sources so submitters
 * (and automation) only provide what a person has to judge:
 *  - X posts: maker and video via X's public embed data (what embeds use);
 *  - App Store: name, developer, category and 1024px artwork via Apple's lookup API;
 *  - web pages: og:image, title and description from the page itself;
 *  - GitHub: description, owner and topics via the REST API.
 */
const UA = "UIArchivesBot/1.0 (+https://uiarchives.com)";

async function json<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const r = await fetch(url, { ...init, headers: { "user-agent": UA, ...(init?.headers ?? {}) } });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

/* ---------- X (public embed data) ---------- */

type XVariant = { content_type: string; url: string; bitrate?: number };
type XTweet = {
  text?: string;
  created_at?: string;
  user?: { name: string; screen_name: string; profile_image_url_https?: string };
  mediaDetails?: { type: string; media_url_https: string; original_info?: { width: number; height: number }; video_info?: { variants: XVariant[]; duration_millis?: number } }[];
};

/** The token embeds use for a status id (same scheme as Vercel's react-tweet). */
const xToken = (id: string) => ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");

export async function xPost(url: string) {
  const id = url.match(/status\/(\d+)/)?.[1];
  if (!id) return null;
  const t = await json<XTweet>(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${xToken(id)}`);
  if (!t?.user) return null;
  const media = t.mediaDetails?.find((m) => m.type === "video" || m.type === "animated_gif");
  const mp4 = media?.video_info?.variants
    .filter((v) => v.content_type === "video/mp4")
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))
    // Highest quality that stays light enough for a gallery.
    .find((v) => (v.bitrate ?? 0) <= 2_200_000);
  return {
    authorName: t.user.name,
    authorHandle: `@${t.user.screen_name}`,
    text: t.text ?? "",
    postedAt: t.created_at ? new Date(t.created_at).toISOString().slice(0, 10) : undefined,
    // Full-size avatar rather than the 48 px "_normal" one.
    avatar: t.user.profile_image_url_https?.replace("_normal.", "_400x400."),
    video: mp4?.url,
    poster: media?.media_url_https,
    durationMs: media?.video_info?.duration_millis,
    width: media?.original_info?.width,
    height: media?.original_info?.height,
  };
}

/* ---------- App Store ---------- */

type AppLookup = { results: { trackName: string; artistName: string; primaryGenreName: string; artworkUrl512: string; trackViewUrl: string; kind: string }[] };

/** Why the last App Store lookup failed (status or error), for intake messages. */
export let appStoreError = "";

export async function appStore(link: string) {
  const id = link.match(/id(\d+)/)?.[1];
  if (!id) return null;
  // Ask the link's own storefront first (some apps only exist there), then the
  // default one; Apple occasionally refuses a request, so each gets one retry.
  const country = link.match(/apps\.apple\.com\/([a-z]{2})\//)?.[1];
  const urls = [
    ...(country ? [`https://itunes.apple.com/lookup?id=${id}&country=${country}`] : []),
    `https://itunes.apple.com/lookup?id=${id}`,
  ];
  let app: AppLookup["results"][number] | undefined;
  for (const url of urls) {
    for (let attempt = 0; attempt < 2 && !app; attempt++) {
      if (attempt) await new Promise((r) => setTimeout(r, 600));
      try {
        const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
        if (r.ok) app = ((await r.json()) as AppLookup).results?.[0];
        appStoreError = r.ok ? (app ? "" : "no result") : `HTTP ${r.status}`;
      } catch (e) {
        appStoreError = e instanceof Error ? e.message : "fetch failed";
      }
    }
    if (app) break;
  }
  if (!app) return appStorePage(id, country ?? "us");
  return {
    name: app.trackName,
    developer: app.artistName,
    category: app.primaryGenreName,
    artwork: app.artworkUrl512.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/, "/1024x1024bb.webp"),
    link: app.trackViewUrl.split("?")[0],
    platform: app.kind === "mac-software" ? ["macOS"] : ["iOS"],
  };
}

/** "GameApplication" → "Games", "ProductivityApplication" → "Productivity". */
const CATEGORY: Record<string, string> = { GameApplication: "Games", PhotographyApplication: "Photo & Video", MultimediaApplication: "Photo & Video" };

/**
 * Fallback when the lookup API refuses us (it often answers 403 to requests
 * from Cloudflare): the App Store's own page carries the same facts as
 * structured data, and its icon URL can be asked for at 1024 px.
 */
async function appStorePage(id: string, country: string) {
  try {
    const link = `https://apps.apple.com/${country}/app/id${id}`;
    const r = await fetch(link, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow" });
    if (!r.ok) {
      appStoreError += `; page HTTP ${r.status}`;
      return null;
    }
    const html = await r.text();
    for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
      let j: { "@type"?: string; name?: string; image?: string; applicationCategory?: string; operatingSystem?: string; author?: { name?: string } };
      try {
        j = JSON.parse(m[1]);
      } catch {
        continue;
      }
      if (j["@type"] !== "SoftwareApplication" || !j.name || !j.image) continue;
      const cat = j.applicationCategory ?? "";
      appStoreError = "";
      return {
        name: j.name,
        developer: j.author?.name ?? "",
        category: CATEGORY[cat] ?? cat.replace(/Application$/, ""),
        artwork: j.image.replace(/\/\d+x\d+[a-z]*\.(jpg|png|webp)$/, "/1024x1024bb.webp"),
        link: r.url.split("?")[0] || link,
        platform: /macOS/i.test(j.operatingSystem ?? "") ? ["macOS"] : ["iOS"],
      };
    }
    appStoreError += "; page had no app data";
  } catch (e) {
    appStoreError += `; page ${e instanceof Error ? e.message : "failed"}`;
  }
  return null;
}

/* ---------- Web pages ---------- */

export async function pageMeta(url: string) {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow" });
    if (!r.ok) return null;
    const html = (await r.text()).slice(0, 200_000);
    const meta = (p: string) =>
      html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${p}["'][^>]+content=["']([^"']+)`, "i"))?.[1] ??
      html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${p}["']`, "i"))?.[1];
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
    const image = meta("og:image") ?? meta("twitter:image");
    // Icons, best first: apple-touch-icon (large PNG), then the largest <link rel=icon> PNG.
    const icons = [...html.matchAll(/<link[^>]+>/gi)]
      .map((m) => m[0])
      .filter((tag) => /rel=["'][^"']*icon[^"']*["']/i.test(tag))
      .map((tag) => {
        const href = tag.match(/href=["']([^"']+)/i)?.[1];
        const size = Number(tag.match(/sizes=["'](\d+)/i)?.[1] ?? 0);
        const apple = /apple-touch-icon/i.test(tag);
        return href ? { href: new URL(href, r.url).href, score: (apple ? 1000 : 0) + size } : null;
      })
      .filter((x): x is { href: string; score: number } => !!x && !/\.svg(\?|$)/i.test(x.href))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.href);
    return {
      title: meta("og:title") ?? title,
      description: meta("description") ?? meta("og:description"),
      image: image ? new URL(image, r.url).href : undefined,
      icons,
      host: new URL(r.url).hostname,
    };
  } catch {
    return null;
  }
}

/* ---------- GitHub ---------- */

type Repo = { full_name: string; description: string | null; owner: { login: string }; topics?: string[]; html_url: string; stargazers_count: number };

export async function githubRepo(url: string) {
  const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!m) return null;
  return json<Repo>(`https://api.github.com/repos/${m[1]}/${m[2].replace(/\.git$/, "")}`, {
    headers: env.GITHUB_TOKEN ? { authorization: `Bearer ${env.GITHUB_TOKEN}` } : {},
  });
}

/**
 * A resource's logo, preview image and the site's own headline/description,
 * copied into storage so they never break. Fills only what's missing.
 *  - People (X profiles): their X profile picture as the logo.
 *  - Sites: apple-touch-icon → largest PNG icon → Google's favicon service.
 *  - Preview: the site's og:image.
 */
export async function resourceMedia(data: ItemData, id: string): Promise<ItemData> {
  const out: ItemData = {};
  const url = String(data.url ?? "");
  if (!url) return out;
  const handle = url.match(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/([^/?#]+)/i)?.[1];

  if (handle) {
    if (!data.logo) {
      out.logo = await storeRemote(`resources/${id}`, `https://unavatar.io/x/${handle}?fallback=false`).catch(() => undefined);
    }
    return out;
  }

  const m = await pageMeta(url);
  if (m) {
    if (!data.description && m.description) out.description = m.description;
    if (!data.headline && m.title) out.headline = m.title;
    if (!data.metaDescription && m.description) out.metaDescription = m.description;
    if (!data.image && m.image) out.image = await storeRemote(`resources/${id}`, m.image).catch(() => undefined);
  }
  if (!data.logo) {
    const host = m?.host ?? new URL(url).hostname;
    const candidates = [...(m?.icons ?? []), `https://www.google.com/s2/favicons?domain=${host}&sz=128`];
    for (const src of candidates) {
      const stored = await storeRemote(`resources/${id}`, src, 2).catch(() => undefined);
      if (stored) {
        out.logo = stored;
        break;
      }
    }
  }
  return out;
}

/* ---------- Per section ---------- */

/** Fill blanks from the sources above; never overwrites what a person typed. */
export async function enrich(section: SectionKey, data: ItemData, id: string): Promise<ItemData> {
  const d = { ...data };
  const fill = (k: string, v: unknown) => {
    if ((d[k] === undefined || d[k] === "" || (Array.isArray(d[k]) && !d[k]!.length)) && v) d[k] = v as string;
  };

  if (section === "designs" && d.post) {
    const x = await xPost(String(d.post));
    if (x) {
      fill("authorName", x.authorName);
      fill("authorHandle", x.authorHandle);
      const caption = x.text.replace(/https:\/\/t\.co\/\S+/g, "").trim();
      fill("title", caption.slice(0, 80));
      fill("caption", caption);
      fill("postedAt", x.postedAt);
      if (x.durationMs) fill("durationMs", String(x.durationMs));
      if (x.width && x.height) {
        fill("width", String(x.width));
        fill("height", String(x.height));
      }
      // X's CDN refuses playback embedded on other sites, so keep our own copy
      // (credited and linked to the post). Fall back to X's URL if copying fails.
      if (!d.video && x.video) d.video = await storeRemote(`designs/${id}`, x.video, 20).catch(() => x.video);
      if (!d.poster && x.poster) d.poster = await storeRemote(`designs/${id}`, x.poster).catch(() => x.poster);
      if (!d.authorAvatar && x.avatar) d.authorAvatar = await storeRemote(`designs/${id}`, x.avatar).catch(() => x.avatar);
    }
  }

  if (section === "app-icons" && d.link) {
    const a = await appStore(String(d.link));
    if (a) {
      fill("name", a.name);
      fill("developer", a.developer);
      fill("category", a.category);
      fill("platform", a.platform);
      d.link = a.link;
      if (!d.image) d.image = await storeRemote(`app-icons/${id}`, a.artwork).catch(() => a.artwork);
    }
  }

  if (section === "og-images" && d.url && !d.image) {
    const m = await pageMeta(String(d.url));
    if (m?.image) d.image = await storeRemote(`og-images/${id}`, m.image).catch(() => m.image!);
    fill("pageTitle", m?.title);
    fill("pageDescription", m?.description);
  }

  if (section === "resources" && d.url) Object.assign(d, await resourceMedia(d, id));

  if (section === "skills" && d.repo) {
    const r = await githubRepo(String(d.repo));
    if (r) {
      fill("description", r.description);
      fill("authorName", r.owner.login);
      fill("topics", r.topics?.slice(0, 5));
      fill("install", `npx skills add ${r.full_name}`);
      fill("name", r.full_name.split("/")[1]);
      d.stars = String(r.stargazers_count);
    }
  }
  return d;
}
