import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://uiarchives.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    // Add future routes here as your site grows
    // { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8 },
    // { url: `${baseUrl}/components`, lastModified: new Date(), priority: 0.9 },
  ];
}
