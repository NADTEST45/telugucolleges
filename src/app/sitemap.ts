import type { MetadataRoute } from "next";
import { COLLEGES } from "@/lib/colleges";
import { getAllProgramSlugs } from "@/lib/program-data";
import { getAllBranchSlugs } from "@/lib/branch-data";

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
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4, lastModified: NOW },
  ];

  const collegePages: MetadataRoute.Sitemap = COLLEGES.map(c => ({
    url: `${BASE}/colleges/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
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

  return [...staticPages, ...collegePages, ...branchPages, ...programPages];
}
