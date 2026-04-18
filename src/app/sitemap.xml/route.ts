import { NextResponse } from "next/server";

/*
 * Explicit sitemap index.
 *
 * Next.js 16, when `generateSitemaps` is used in `app/sitemap.ts`, serves the
 * sub-sitemaps at `/sitemap/[id].xml` but does NOT automatically expose a
 * sitemap index at `/sitemap.xml`. Without an index, Google has no single URL
 * to submit in Search Console and our robots.txt `Sitemap:` directive 404s.
 *
 * This route handler produces the index by hand, pointing at each sub-sitemap
 * id declared in `generateSitemaps()`. Keep SECTION_COUNT in sync with that
 * list.
 */

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

// Matches the 7 sections defined in src/app/sitemap.ts `generateSitemaps`:
//   0 = static + branches + programs
//   1 = college profiles
//   2 = /placement sub-pages
//   3 = /fees sub-pages
//   4 = /cutoff sub-pages
//   5 = /admission sub-pages
//   6 = comparisons + cities
const SECTION_COUNT = 7;

export const dynamic = "force-static";
export const revalidate = 3600; // regenerate at most once per hour

export async function GET() {
  const now = new Date().toISOString();

  const entries = Array.from({ length: SECTION_COUNT }, (_, i) => {
    return `  <sitemap>
    <loc>${BASE}/sitemap/${i}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
