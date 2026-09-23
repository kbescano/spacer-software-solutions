import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

// Single-page site today — add a row here if a route is ever split out
// (e.g. a dedicated /work or /contact page).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
