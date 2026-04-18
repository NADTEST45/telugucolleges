import type { MetadataRoute } from "next";
import { COLLEGES } from "@/lib/colleges";
import { getAllProgramSlugs } from "@/lib/program-data";
import { getAllBranchSlugs } from "@/lib/branch-data";
import { getAllPairSlugs } from "@/lib/comparison-pairs";
import { getAllCitySlugs } from "@/lib/city-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
const NOW = new Date().toISOString();

/*
 * Sitemap index — splits into separate sitemaps per section so Google can
 * crawl each independently. Next.js auto-generates the sitemap index at
 * /sitemap.xml pointing to /sitemap/0.xml, /sitemap/1.xml, etc.
 *
 * Sections:
 *   0 = static + branches + programs
 *   1 = college profile pages (841)
 *   2 = college /placement sub-pages (841)
 *   3 = college /fees sub-pages (841)
 *   4 = college /cutoff sub-pages (841)
 *   5 = college /admission sub-pages (841)
 *   6 = comparison pair pages + city pages
 */

export async function generateSitemaps() {
  return [
    { id: 0 },  // static + branches + programs
    { id: 1 },  // college profiles
    { id: 2 },  // /placement
    { id: 3 },  // /fees
    { id: 4 },  // /cutoff
    { id: 5 },  // /admission
    { id: 6 },  // comparisons + cities
  ];
}

export default async function sitemap({ id }: { id: number | string }): Promise<MetadataRoute.Sitemap> {
  // Next.js 16 passes `id` as a string from the URL (e.g. "0", "1"), so a
  // strict numeric switch never matches and every sub-sitemap returns empty.
  // Coerce to a number so the cases below work for both runtime shapes.
  const sectionId = Number(id);
  switch (sectionId) {
    // ── Static pages + branches + programs ──
    case 0:
      return [
        { url: BASE, changeFrequency: "weekly", priority: 1.0, lastModified: NOW },
        { url: `${BASE}/colleges`, changeFrequency: "weekly", priority: 0.9, lastModified: NOW },
        { url: `${BASE}/branches`, changeFrequency: "weekly", priority: 0.8, lastModified: NOW },
        { url: `${BASE}/eapcet`, changeFrequency: "monthly", priority: 0.8, lastModified: NOW },
        { url: `${BASE}/news`, changeFrequency: "daily", priority: 0.8, lastModified: NOW },
        { url: `${BASE}/compare`, changeFrequency: "monthly", priority: 0.6, lastModified: NOW },
        { url: `${BASE}/best-colleges`, changeFrequency: "monthly", priority: 0.8, lastModified: NOW },
        { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4, lastModified: NOW },
        ...getAllBranchSlugs().map(slug => ({
          url: `${BASE}/branches/${slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.7,
          lastModified: NOW,
        })),
        ...getAllProgramSlugs().map(slug => ({
          url: `${BASE}/programs/${slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.5,
          lastModified: NOW,
        })),
      ];

    // ── College profile pages ──
    case 1:
      return COLLEGES.map(c => ({
        url: `${BASE}/colleges/${c.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: NOW,
      }));

    // ── College /placement sub-pages ──
    case 2:
      return COLLEGES.map(c => ({
        url: `${BASE}/colleges/${c.slug}/placement`,
        changeFrequency: "monthly" as const,
        priority: 0.65,
        lastModified: NOW,
      }));

    // ── College /fees sub-pages ──
    case 3:
      return COLLEGES.map(c => ({
        url: `${BASE}/colleges/${c.slug}/fees`,
        changeFrequency: "monthly" as const,
        priority: 0.65,
        lastModified: NOW,
      }));

    // ── College /cutoff sub-pages ──
    case 4:
      return COLLEGES.map(c => ({
        url: `${BASE}/colleges/${c.slug}/cutoff`,
        changeFrequency: "monthly" as const,
        priority: 0.65,
        lastModified: NOW,
      }));

    // ── College /admission sub-pages ──
    case 5:
      return COLLEGES.map(c => ({
        url: `${BASE}/colleges/${c.slug}/admission`,
        changeFrequency: "monthly" as const,
        priority: 0.65,
        lastModified: NOW,
      }));

    // ── Comparison pages + City pages ──
    case 6:
      return [
        ...getAllPairSlugs().map(pair => ({
          url: `${BASE}/compare/${pair}`,
          changeFrequency: "monthly" as const,
          priority: 0.6,
          lastModified: NOW,
        })),
        ...getAllCitySlugs().map(city => ({
          url: `${BASE}/best-colleges/${city}`,
          changeFrequency: "monthly" as const,
          priority: 0.75,
          lastModified: NOW,
        })),
      ];

    default:
      return [];
  }
}
