import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";
import { getCollegesMerged } from "@/lib/colleges-merged";
import { isIndexable } from "@/lib/cutoff-presence";
import { getAllProgramSlugs } from "@/lib/program-data";
import { getAllBranchSlugs } from "@/lib/branch-data";
import { getAllPairSlugs } from "@/lib/comparison-pairs";
import { getAllCitySlugs } from "@/lib/city-data";
import { getAllRegionSlugs } from "@/lib/region-data";
import { getAllRankBandSlugs } from "@/lib/rank-band-data";
import { AP_CUTOFF_BRANCHES } from "@/lib/ap-cutoff-2026";
import { TS_CUTOFF_BRANCHES } from "@/lib/ts-cutoff-2026";
import { NEWS_ITEMS } from "@/lib/news";

const BASE = SITE_URL;

/*
 * BUILD_DATE is pinned at module load, but we emit it sparingly. Previously
 * every URL claimed `lastModified: NOW` which (a) told Google every page
 * changed every deploy and (b) trained crawlers to recrawl static pages
 * pointlessly — wasting our crawl budget. Now:
 *   - Static top-level pages: lastModified omitted (Google infers freshness)
 *   - News items: lastModified from the item's actual published date
 *   - Other static-data pages (colleges, branches, programs, comparisons):
 *     lastModified set to BUILD_DATE — these change only on deploy
 */
const BUILD_DATE = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Use the MERGED college list (static COLLEGES + approved Supabase
  // overrides) so the sitemap judges indexability on the same data the
  // page metadata does (generateMetadata uses getCollegeBySlugMerged).
  // Overrides can flip isIndexable() — e.g. an approved naac or
  // placements.avg edit promotes a placeholder row — and iterating the
  // static list here would leave such pages indexable-but-unlisted.
  // getCollegesMerged() falls back to static COLLEGES when Supabase env
  // vars are absent or the fetch fails, so builds never break on it.
  const colleges = await getCollegesMerged();

  // Static top-level pages — no `lastModified`. These pages are templates
  // whose user-visible content changes on every dataset refresh, so claiming
  // a single timestamp would be misleading; Google handles missing
  // lastModified by inferring from crawl history.
  entries.push(
    { url: BASE, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/colleges`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/branches`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/programs`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/universities`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/eapcet`, changeFrequency: "monthly", priority: 0.8 },
    // EAPCET 2026 season pages — results tracker changes near-daily until the
    // result drops; counselling guides update as schedules are notified.
    { url: `${BASE}/eapcet/ap-results-2026`, changeFrequency: "daily", priority: 0.9 },
    // Telugu-language edition of the AP results tracker (hreflang alt of above).
    { url: `${BASE}/eapcet/ap-results-2026-telugu`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/eapcet/ap-web-options`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/eapcet/web-options-generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/eapcet/certificate-verification-documents`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/eapcet/ts-counselling-dates-2026`, changeFrequency: "weekly", priority: 0.8 },
    // AP EAPCET 2026 cutoff landing pages — pre-built ahead of the end-June
    // result spike; updated as official 2026 rounds conclude.
    { url: `${BASE}/eapcet/ap-cutoff-2026`, changeFrequency: "weekly", priority: 0.9 },
    // TG EAPCET 2026 cutoff landing pages — pre-built ahead of counselling
    // (registration June 19–28, Phase-1 allotment by July 10); updated as
    // official 2026 phases conclude.
    { url: `${BASE}/eapcet/tg-cutoff-2026`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/news`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/compare`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/fee-calculator`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/scholarships`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/best-colleges`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4 },
  );

  // Branch landing pages — content is computed from COLLEGES at build time,
  // so BUILD_DATE is the right freshness signal.
  for (const slug of getAllBranchSlugs()) {
    entries.push({
      url: `${BASE}/branches/${slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: BUILD_DATE,
    });
  }

  // Program landing pages — same: computed from COLLEGES + UNIVERSITY_COURSES
  // at build time.
  for (const slug of getAllProgramSlugs()) {
    entries.push({
      url: `${BASE}/programs/${slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: BUILD_DATE,
    });
  }

  // College profile pages + their sub-pages.
  //
  // ⚠️  Only colleges with hasRealData() === true are listed. The other
  // ~735 placeholder rows (every field is "0" / "-" / default fee) are
  // excluded from the sitemap AND emit `robots: noindex, follow` from
  // their page metadata. Reason: with placeholders included we had
  // ~4.4k URLs in the sitemap but only ~83 indexed in GSC — the thin
  // pages were diluting crawl budget and getting flagged "Crawled —
  // currently not indexed". As college data is populated, those rows
  // auto-promote into the sitemap on the next deploy.
  for (const c of colleges) {
    if (!isIndexable(c)) continue;
    const base = `${BASE}/colleges/${c.slug}`;
    entries.push(
      { url: base, changeFrequency: "monthly", priority: 0.7, lastModified: BUILD_DATE },
      { url: `${base}/placement`, changeFrequency: "monthly", priority: 0.65, lastModified: BUILD_DATE },
      { url: `${base}/fees`, changeFrequency: "monthly", priority: 0.65, lastModified: BUILD_DATE },
      { url: `${base}/cutoff`, changeFrequency: "monthly", priority: 0.65, lastModified: BUILD_DATE },
      { url: `${base}/admission`, changeFrequency: "monthly", priority: 0.65, lastModified: BUILD_DATE },
    );
  }

  // Comparison pair pages
  for (const pair of getAllPairSlugs()) {
    entries.push({
      url: `${BASE}/compare/${pair}`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: BUILD_DATE,
    });
  }

  // City best-colleges landing pages
  for (const city of getAllCitySlugs()) {
    entries.push({
      url: `${BASE}/best-colleges/${city}`,
      changeFrequency: "monthly",
      priority: 0.75,
      lastModified: BUILD_DATE,
    });
  }

  // Region best-colleges landing pages (multi-district aggregates)
  for (const slug of getAllRegionSlugs()) {
    entries.push({
      url: `${BASE}/best-colleges/region/${slug}`,
      changeFrequency: "monthly",
      priority: 0.75,
      lastModified: BUILD_DATE,
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
      lastModified: BUILD_DATE,
    });
  }

  // AP EAPCET 2026 branch-wise cutoff landing pages — high-intent
  // "ap eapcet 2026 cutoff <branch>" queries ahead of the result spike.
  for (const b of AP_CUTOFF_BRANCHES) {
    entries.push({
      url: `${BASE}/eapcet/ap-cutoff-2026/${b.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: BUILD_DATE,
    });
  }

  // TG EAPCET 2026 branch-wise cutoff landing pages — high-intent
  // "ts/tg eapcet 2026 cutoff <branch>" queries ahead of counselling.
  for (const b of TS_CUTOFF_BRANCHES) {
    entries.push({
      url: `${BASE}/eapcet/tg-cutoff-2026/${b.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: BUILD_DATE,
    });
  }

  return entries;
}
