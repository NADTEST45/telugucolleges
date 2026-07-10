import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /api/og/* serves the per-page OpenGraph/Twitter share-card images
      // referenced in page metadata. It must stay crawlable so search engines
      // and social scrapers can fetch share images. The more specific allow
      // takes precedence over the broader /api/ disallow.
      allow: ["/", "/api/og/"],
      disallow: ["/admin", "/college-admin", "/marketing", "/account", "/login", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
