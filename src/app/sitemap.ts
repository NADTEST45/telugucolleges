import type { MetadataRoute } from "next";
import { COLLEGES } from "@/lib/colleges";
import { getAllProgramSlugs } from "@/lib/program-data";
import { getAllBranchSlugs } from "@/lib/branch-data";
import { getAllPairSlugs } from "@/lib/comparison-pairs";
import { getAllCitySlugs } from "@/lib/city-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.vercel.app";
const NOW = new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1.0, lastModified: NOW },
    { url: `${BASE}/colleges`, changeFrequency: "weekly", priority: 0.9, lastModified: NOW },
    { url: `${BASE}/branches`, changeFrequency: "weekly", priority: 0.8, lastModified: NOW },
    { url: `${BASE}/eapcet`, changeFrequency: "monthly", priority: 0.8, lastModified: NOW },
    { url: `${BASE}/news`, changeFrequency: "daily", priority: 0.8, lastModified: NOW },
    { url: `${BASE}/compare`, changeFrequency: "monthly", priority: 0.6, lastModified: NOW },
    { url: `${BASE}/best-colleges`, changeFrequency: "monthly", priority: 0.8, lastModified: NOW },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4, lastModified: NOW },
  ];

  // Main college pages
  const collegePages: MetadataRoute.Sitemap = COLLEGES.map(c => ({
    url: `${BASE}/colleges/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: NOW,
  }));

  // College sub-pages (placement, fees, cutoff, admission) — 4 per college
  const subPages = ["placement", "fees", "cutoff", "admission"];
  const collegeSubPages: MetadataRoute.Sitemap = COLLEGES.flatMap(c =>
    subPages.map(sub => ({
      url: `${BASE}/colleges/${c.slug}/${sub}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
      lastModified: NOW,
    }))
  );

  // Comparison pair pages
  const comparisonPages: MetadataRoute.Sitemap = getAllPairSlugs().map(pair => ({
    url: `${BASE}/compare/${pair}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    lastModified: NOW,
  }));

  // Best colleges in city pages
  const cityPages: MetadataRoute.Sitemap = getAllCitySlugs().map(city => ({
    url: `${BASE}/best-colleges/${city}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
    lastModified: NOW,
  }));

  const branchPages: MetadataRoute.Sitemap = getAllBranchSlugs().map(slug => ({
    url: `${BASE}/branches/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: NOW,
  }));

  // Keep program pages for SEO (they still work, just not in nav)
  const programPages: MetadataRoute.Sitemap = getAllProgramSlugs().map(slug => ({
    url: `${BASE}/programs/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
    lastModified: NOW,
  }));

  return [...staticPages, ...collegePages, ...collegeSubPages, ...comparisonPages, ...cityPages, ...branchPages, ...programPages];
}
