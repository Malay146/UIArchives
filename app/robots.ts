import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/private/"], // Common private routes
    },
    sitemap: "https://uiarchives.com/sitemap.xml",
  };
}
