import { ImageResponse } from "next/og";
import { COLLEGES, getCollegeBySlug, fmtFee } from "@/lib/colleges";

/**
 * Per-college OG image (1200×630), generated with next/og.
 *
 * Why: shares on WhatsApp/Telegram (our dominant share channel) previously
 * showed one generic site-wide og-image.png for every college. A card with
 * the college's own name, fee, cutoff and placements materially improves
 * link click-through.
 *
 * Uses ONLY the static COLLEGES data (no Supabase/merged overrides) so image
 * generation never makes a network call. Values that are zero/placeholder
 * render as "—". Satori supports flexbox only — every multi-child div needs
 * display:flex.
 */

export const alt = "College fees, cutoffs and placements on TeluguColleges.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return COLLEGES.map(c => ({ slug: c.slug }));
}

const BRAND = "#1a5276";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollegeBySlug(slug);

  if (!c) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: BRAND, color: "#fff", fontSize: 56, fontWeight: 700 }}>
          TeluguColleges.com
        </div>
      ),
      size
    );
  }

  // Scale the headline down for long college names
  const nameSize = c.name.length > 70 ? 38 : c.name.length > 45 ? 46 : 56;

  const stats: { label: string; value: string }[] = [
    { label: "B.Tech Fee / yr", value: c.fee > 0 ? fmtFee(c.fee) : "—" },
    {
      label: c.type === "Deemed University" ? "Admission" : "CSE Cutoff (OC)",
      value: c.type === "Deemed University" ? "Own Exam" : c.cutoff.cse > 0 ? c.cutoff.cse.toLocaleString("en-IN") : "—",
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
    size
  );
}
