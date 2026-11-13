import type { MetadataRoute } from "next";

/**
 * Open to search engines and to the AI search crawlers that decide whether
 * the site can be cited (ChatGPT, Claude, Perplexity). Private and utility
 * routes stay out of the index.
 */
const PRIVATE = ["/api/", "/review", "/cover/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // AI search / citation crawlers — explicitly welcome.
      { userAgent: ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"], allow: "/", disallow: PRIVATE },
    ],
    sitemap: "https://uiarchives.com/sitemap.xml",
    host: "https://uiarchives.com",
  };
}
