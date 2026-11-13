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
  user?: { name: string; screen_name: string };
  mediaDetails?: { type: string; media_url_https: string; video_info?: { variants: XVariant[] } }[];
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
    video: mp4?.url,
    poster: media?.media_url_https,
  };
}

/* ---------- App Store ---------- */

type AppLookup = { results: { trackName: string; artistName: string; primaryGenreName: string; artworkUrl512: string; trackViewUrl: string; kind: string }[] };

export async function appStore(link: string) {
  const id = link.match(/id(\d+)/)?.[1];
  if (!id) return null;
  const r = await json<AppLookup>(`https://itunes.apple.com/lookup?id=${id}`);
  const app = r?.results?.[0];
  if (!app) return null;
  return {
    name: app.trackName,
    developer: app.artistName,
    category: app.primaryGenreName,
    artwork: app.artworkUrl512.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/, "/1024x1024bb.webp"),
    link: app.trackViewUrl.split("?")[0],
    platform: app.kind === "mac-software" ? ["macOS"] : ["iOS"],
  };
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
    return {
      title: meta("og:title") ?? title,
      description: meta("description") ?? meta("og:description"),
      image: image ? new URL(image, r.url).href : undefined,
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
      fill("title", x.text.replace(/https:\/\/t\.co\/\S+/g, "").trim().slice(0, 80));
      if (!d.video && x.video) d.video = x.video; // streamed from X's CDN, credited and linked
      if (x.poster) fill("poster", x.poster);
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

  if (section === "resources" && d.url) {
    const m = await pageMeta(String(d.url));
    fill("description", m?.description);
  }

  if (section === "skills" && d.repo) {
    const r = await githubRepo(String(d.repo));
    if (r) {
      fill("description", r.description);
      fill("authorName", r.owner.login);
      fill("topics", r.topics?.slice(0, 5));
      fill("install", `npx skills add ${r.full_name}`);
      fill("name", r.full_name.split("/")[1]);
    }
  }
  return d;
}
