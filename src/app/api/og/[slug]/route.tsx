import { ImageResponse } from "next/og";
import { fmtFee } from "@/lib/colleges";
import { getCollegeBySlugMerged } from "@/lib/colleges-merged";
import { hasCutoffData } from "@/lib/cutoff-presence";
import { getHistoricalCutoff } from "@/lib/cutoff-utils";

/**
 * Per-college OG image (1200×630) as a plain route handler.
 *
 * Why a route handler and not the opengraph-image.tsx file convention?
 * In Next 16 (Turbopack) the file convention in this dynamic segment
 * registered itself as file-based metadata — overriding the page's
 * config-based openGraph.images — but failed to inject its own URL,
 * so og:image silently fell back to the site-wide default. A normal
 * route + explicit openGraph.images in generateMetadata is deterministic.
 * (Verified in production 2026-06-12.)
 *
 * Cached at the CDN for 24h (s-maxage); college data changes at most
 * with a deploy or an approved override, and a stale share card for a
 * few hours is harmless.
 *
 * Data: getCollegeBySlugMerged() so approved Supabase overrides (fee,
 * naac, placements…) show on share cards, not just stale static values —
 * the override fetch is ISR-cached (60s) so this stays cheap. The cutoff
 * stat is table-aware: `cutoff.cse === 0` is common for colleges whose
 * real ranks live only in the historical tables (server-only imports —
 * this is a server route, so that's fine). Satori supports flexbox only;
 * every multi-child div needs display:flex.
 */

export const dynamic = "force-dynamic";

const BRAND = "#1a5276";
const SIZE = { width: 1200, height: 630 };
const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const c = await getCollegeBySlugMerged(slug);

  if (!c) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: BRAND, color: "#fff", fontSize: 56, fontWeight: 700 }}>
          TeluguColleges.com
        </div>
      ),
      { ...SIZE, headers: CACHE_HEADERS }
    );
  }

  // Scale the headline down for long college names
  const nameSize = c.name.length > 70 ? 38 : c.name.length > 45 ? 46 : 56;

  // Table-aware CSE cutoff: the summary `cutoff.cse` field is 0 for many
  // colleges whose genuine ranks live only in the historical tables. Fall
  // back to the recency-weighted OC/boys closing rank from those tables; if
  // the tables have entries but not for CSE specifically, point at the
  // cutoff page rather than showing a misleading "—".
  let cseCutoffValue = "—";
  if (c.cutoff.cse > 0) {
    cseCutoffValue = c.cutoff.cse.toLocaleString("en-IN");
  } else if (hasCutoffData(c)) {
    const hist = getHistoricalCutoff(c.code, "cse", "OC", "boys", c.state);
    cseCutoffValue = hist.avg > 0 ? hist.avg.toLocaleString("en-IN") : "See cutoffs";
  }

  const stats: { label: string; value: string }[] = [
    { label: "B.Tech Fee / yr", value: c.fee > 0 ? fmtFee(c.fee) : "—" },
    {
      label: c.type === "Deemed University" ? "Admission" : "CSE Cutoff (OC)",
      value: c.type === "Deemed University" ? "Own Exam" : cseCutoffValue,
    },
    { label: "Avg Package", value: c.placements.avg > 0 ? `₹${c.placements.avg} LPA` : "—" },
    { label: "NAAC", value: c.naac && c.naac !== "-" ? c.naac : "—" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${BRAND} 0%, #0e3a57 100%)`,
          padding: 56,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: site + type badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", color: "#ffffff", fontSize: 30, fontWeight: 700 }}>
            TeluguColleges<span style={{ color: "#7fb3d5" }}>.com</span>
          </div>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 600,
              background: "rgba(255,255,255,0.15)",
              padding: "8px 22px",
              borderRadius: 999,
            }}
          >
            {c.type}
          </div>
        </div>

        {/* College name + location */}
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: nameSize,
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: 1080,
            }}
          >
            {c.name}
          </div>
          <div style={{ display: "flex", color: "#aed6f1", fontSize: 28, marginTop: 18 }}>
            {c.district}, {c.state} · Code {c.code}
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 20 }}>
          {stats.map(s => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.97)",
                borderRadius: 18,
                padding: "22px 28px",
                flexGrow: 1,
                flexBasis: 0,
              }}
            >
              <div style={{ display: "flex", color: "#6b7a86", fontSize: 21 }}>{s.label}</div>
              <div style={{ display: "flex", color: BRAND, fontSize: 36, fontWeight: 800, marginTop: 6 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...SIZE, headers: CACHE_HEADERS }
  );
}
