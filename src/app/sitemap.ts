import type { MetadataRoute } from "next";
import { COLLEGES } from "@/lib/colleges";
import { getAllProgramSlugs } from "@/lib/program-data";
import { getAllBranchSlugs } from "@/lib/branch-data";
import { getAllPairSlugs } from "@/lib/comparison-pairs";
import { getAllCitySlugs } from "@/lib/city-data";
import { getAllRankBandSlugs } from "@/lib/rank-band-data";
import { NEWS_ITEMS } from "@/lib/news";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
const NOW = new Date().toISOString();

/*
 * Single flat sitemap served at /sitemap.xml.
 *
 * Why not split via generateSitemaps()?
 *   - Next.js 16's generateSitemaps output does NOT auto-expose a sitemap
 *     index at /sitemap.xml (verified 2026-04-18: returns 404). Google
 *     Search Console requires a single submittable URL.
 *   - The site's total URL count is comfortably under the 50,000-URL limit
 *     per sitemap (ballpark ~4,500), so splitting buys nothing.
 *
 * If URL count ever approaches 50k, switch to a route handler at
 * /sitemap.xml that emits a <sitemapindex> pointing at sub-sitemaps
 * hand-rolled at /sitemap/[section].xml — not at the file-based metadata
 * convention, to avoid the build-time route conflict we hit before.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static top-level pages
  entries.push(
    { url: BASE, changeFrequency: "weekly", priority: 1.0, lastModified: NOW },
    { url: `${BASE}/colleges`, changeFrequency: "weekly", priority: 0.9, lastModified: NOW },
    { url: `${BASE}/branches`, changeFrequency: "weekly", priority: 0.8, lastModified: NOW },
    { url: `${BASE}/universities`, changeFrequency: "monthly", priority: 0.8, lastModified: NOW },
    { url: `${BASE}/eapcet`, changeFrequency: "monthly", priority: 0.8, lastModified: NOW },
    { url: `${BASE}/news`, changeFrequency: "daily", priority: 0.8, lastModified: NOW },
    { url: `${BASE}/compare`, changeFrequency: "monthly", priority: 0.6, lastModified: NOW },
    { url: `${BASE}/best-colleges`, changeFrequency: "monthly", priority: 0.8, lastModified: NOW },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4, lastModified: NOW },
  );

  // Branch landing pages
  for (const slug of getAllBranchSlugs()) {
    entries.push({
      url: `${BASE}/branches/${slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: NOW,
    });
  }

  // Program landing pages
  for (const slug of getAllProgramSlugs()) {
    entries.push({
      url: `${BASE}/programs/${slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: NOW,
    });
  }

  // College profile pages + their sub-pages
  for (const c of COLLEGES) {
    const base = `${BASE}/colleges/${c.slug}`;
    entries.push(
      { url: base, changeFrequency: "monthly", priority: 0.7, lastModified: NOW },
      { url: `${base}/placement`, changeFrequency: "monthly", priority: 0.65, lastModified: NOW },
      { url: `${base}/fees`, changeFrequency: "monthly", priority: 0.65, lastModified: NOW },
      { url: `${base}/cutoff`, changeFrequency: "monthly", priority: 0.65, lastModified: NOW },
      { url: `${base}/admission`, changeFrequency: "monthly", priority: 0.65, lastModified: NOW },
    );
  }

  // Comparison pair pages
  for (const pair of getAllPairSlugs()) {
    entries.push({
      url: `${BASE}/compare/${pair}`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: NOW,
    });
  }

  // City best-colleges landing pages
  for (const city of getAllCitySlugs()) {
    entries.push({
      url: `${BASE}/best-colleges/${city}`,
      changeFrequency: "monthly",
      priority: 0.75,
      lastModified: NOW,
    });
  }

  // News permalink pages (one URL per news item). Each is a server-
  // rendered NewsArticle page eligible for Top Stories. Higher priority
  // for high-priority items, lastModified set from the item date so
  // Google sees freshness cues directly.
  for (const n of NEWS_ITEMS) {
    entries.push({
      url: `${BASE}/news/${n.id}`,
      changeFrequency: n.priority === "high" ? "daily" : "weekly",
      priority: n.priority === "high" ? 0.85 : n.priority === "medium" ? 0.7 : 0.5,
      lastModified: `${n.date}T09:00:00+05:30`,
    });
  }

  // EAPCET rank-band landing pages (rank × branch × state combinations).
  // High-intent counselling-season search surface — bumped priority since
  // these target specific query patterns that the predictor itself can't
  // rank for (Googlebot doesn't fill in forms).
  for (const slug of getAllRankBandSlugs()) {
    entries.push({
      url: `${BASE}/eapcet/rank/${slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: NOW,
    });
  }

  return entries;
}
