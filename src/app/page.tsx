import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import { fmtFee } from "@/lib/colleges";
import { getCollegesMerged } from "@/lib/colleges-merged";
// Server-only (pulls the cutoff tables) — page.tsx is a server component.
import { hasCutoffData } from "@/lib/cutoff-presence";
import { getLatestNews } from "@/lib/news";
import AdSlot from "@/components/ads/AdSlot";
import JsonLd from "@/components/JsonLd";
import ProgramIcon from "@/components/ui/ProgramIcon";
import Badge from "@/components/ui/Badge";
import ts_mba from "@/lib/mba_data.json";
import ap_mba from "@/lib/ap_mba_data.json";
import ts_mca from "@/lib/mca_data.json";
import ap_mca from "@/lib/ap_mca_data.json";
import { getCounsellingStatus } from "@/lib/counselling-status";


// Homepage self-canonical. Title/description/OG inherit from the root
// layout (which intentionally no longer sets a canonical — see layout.tsx).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function Home() {
  const colleges = await getCollegesMerged();
  const stats = {
    total: colleges.length,
    ts: colleges.filter(c => c.state === "Telangana").length,
    ap: colleges.filter(c => c.state === "Andhra Pradesh").length,
    govt: colleges.filter(c => c.type === "Government").length,
    eng: colleges.filter(c => c.branches.some(b => ["CSE","ECE","EEE","MECH","CIVIL"].includes(b))).length,
    pharm: colleges.filter(c => c.branches.includes("B.Pharm")).length,
    mpharm: colleges.filter(c => c.branches.includes("M.Pharm")).length,
    pharmd: colleges.filter(c => c.branches.includes("Pharm.D")).length,
    med: colleges.filter(c => c.branches.includes("MBBS")).length,
    // Derived from program datasets (ts_*_data + ap_*_data) rather than the main
    // COLLEGES list, because MBA/MCA have dedicated listings that are broader
    // than the engineering directory.
    mba: (ts_mba as unknown[]).length + (ap_mba as unknown[]).length,
    mca: (ts_mca as unknown[]).length + (ap_mca as unknown[]).length,
  };

  const latestNews = getLatestNews(3);
  // Top-5 lists need a numeric rank to sort by, which only the summary
  // cutoff.cse provides — but don't EXCLUDE colleges whose ranks live only
  // in the historical tables (cutoff.cse === 0 is common for real colleges):
  // they get a fallback ordering after the numerically-ranked ones. This is
  // a server component, so importing the table-aware helper is safe here.
  const topByCse = (state: string) => {
    const inState = colleges.filter(c => c.state === state);
    const ranked = inState.filter(c => c.cutoff.cse > 0).sort((a, b) => a.cutoff.cse - b.cutoff.cse);
    const tableOnly = inState.filter(c => c.cutoff.cse === 0 && hasCutoffData(c));
    return [...ranked, ...tableOnly].slice(0, 5);
  };
  const topTS = topByCse("Telangana");
  const topAP = topByCse("Andhra Pradesh");
  const cheapest = [...colleges].filter(c => c.fee > 0 && c.branches.some(b => ["CSE","ECE","EEE","MECH","CIVIL"].includes(b))).sort((a, b) => a.fee - b.fee).slice(0, 6);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "TeluguColleges.com",
      url: SITE_URL,
      description:
        "Research professional colleges in Andhra Pradesh & Telangana. Official fees, real EAPCET cutoffs, placements and comparison tools.",
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/colleges?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "TeluguColleges.com",
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.png`,
      description:
        "Directory of engineering, pharmacy, medical and management colleges in Andhra Pradesh and Telangana with official fees and cutoffs.",
      areaServed: [
        { "@type": "State", name: "Andhra Pradesh" },
        { "@type": "State", name: "Telangana" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@telugucolleges.com",
        contactType: "customer support",
        availableLanguage: ["en", "te"],
      },
    },
  ];

  return (
    <main>
      <JsonLd data={jsonLd} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-dark via-brand to-accent text-white px-4 sm:px-6 pt-10 sm:pt-16 pb-14 sm:pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px"}} />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-blue-200 mb-2 sm:mb-3 font-medium">Andhra Pradesh & Telangana</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 sm:mb-5 leading-tight">
            Find the Right College<br className="hidden sm:block" /><span className="sm:hidden"> </span>for Your Future
          </h1>
          <p className="text-sm sm:text-lg opacity-80 mb-6 sm:mb-10 font-light max-w-xl mx-auto leading-relaxed">
            Compare fees, cutoffs, placements and rankings for {stats.total} professional colleges across both states.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0">
            <Link href="/colleges" className="inline-block bg-white text-brand font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg shadow-xl active:scale-[0.98] transition-all">
              Explore Colleges
            </Link>
            <Link href="/eapcet" className="inline-block bg-white/15 text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg border border-white/30 active:scale-[0.98] transition-all">
              EAPCET Predictor
            </Link>
          </div>
        </div>
      </section>

      {/* EAPCET counselling-season banner — status strings live in
          counselling-status.ts (single source, one-file update as the season
          progresses). Remove this block after counselling ends. */}
      <section className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
          <div className="flex items-start sm:items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1 sm:mt-0" aria-hidden>
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <p className="text-xs sm:text-sm text-gray-800 min-w-0">
              <span className="font-bold">EAPCET 2026 admission guidance:</span>{" "}
              {getCounsellingStatus("AP").short} · {getCounsellingStatus("TS").short}
            </p>
          </div>
          <div className="flex gap-2 sm:ml-auto shrink-0 pl-4 sm:pl-0">
            <Link href="/eapcet" className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-dark transition-colors active:scale-95">
              Predict my colleges
            </Link>
            <Link href="/eapcet/web-options-generator" className="px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-gray-700 text-xs font-semibold hover:border-accent hover:text-accent transition-colors active:scale-95">
              Build web options
            </Link>
          </div>
        </div>
      </section>

      {/* Program Quick Links Bar */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-12 sm:top-14 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-0 overflow-x-auto scrollbar-hide px-2 sm:px-6">
          {[
            { label: "B.Tech", href: "/programs/b-tech" },
            { label: "M.Tech", href: "/programs/m-tech" },
            { label: "MBA", href: "/programs/mba" },
            { label: "MCA", href: "/programs/mca" },
            { label: "BBA", href: "/programs/bba" },
            { label: "BCA", href: "/programs/bca" },
            { label: "MBBS", href: "/programs/mbbs" },
            { label: "B.Pharm", href: "/programs/b-pharm" },
            { label: "Pharm.D", href: "/programs/pharm-d" },
            { label: "M.Pharm", href: "/programs/m-pharm" },
            { label: "B.Arch", href: "/programs/b-arch" },
            { label: "BA LLB", href: "/programs/ba-llb-hons" },
            { label: "PhD", href: "/programs/ph-d" },
            { label: "Compare", href: "/compare" },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 hover:text-brand hover:bg-blue-50 whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-accent active:bg-blue-50">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Ad: Below Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
        <AdSlot slot="homepage_hero_below" />
      </div>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 relative z-10 pt-8 sm:pt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {[
            { label: "B.Tech", count: stats.eng, href: "/programs/b-tech", tint: "bg-indigo-50 text-indigo-600" },
            { label: "MBA", count: stats.mba, href: "/programs/mba", tint: "bg-amber-50 text-amber-600" },
            { label: "MCA", count: stats.mca, href: "/programs/mca", tint: "bg-cyan-50 text-cyan-600" },
            { label: "BBA", count: null, href: "/programs/bba", tint: "bg-orange-50 text-orange-600" },
            { label: "BCA", count: null, href: "/programs/bca", tint: "bg-sky-50 text-sky-600" },
            { label: "MBBS", count: stats.med, href: "/programs/mbbs", tint: "bg-rose-50 text-rose-600" },
            { label: "B.Pharm", count: stats.pharm, href: "/programs/b-pharm", tint: "bg-teal-50 text-teal-600" },
            { label: "Pharm.D", count: stats.pharmd, href: "/programs/pharm-d", tint: "bg-emerald-50 text-emerald-600" },
            { label: "M.Pharm", count: stats.mpharm, href: "/programs/m-pharm", tint: "bg-violet-50 text-violet-600" },
            { label: "M.Tech", count: null, href: "/programs/m-tech", tint: "bg-blue-50 text-blue-600" },
            { label: "B.Arch", count: null, href: "/programs/b-arch", tint: "bg-stone-100 text-stone-600" },
            { label: "BA LLB", count: null, href: "/programs/ba-llb-hons", tint: "bg-red-50 text-red-600" },
          ].map(item => (
            <Link key={item.label} href={item.href} aria-label={item.label} className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${item.tint}`} aria-hidden="true">
                <ProgramIcon name={item.label} className="w-5 h-5" />
              </span>
              <div className="font-bold text-xs sm:text-sm text-gray-800">{item.label}</div>
              {item.count ? <div className="text-xs text-gray-500 mt-0.5 tabular-nums">{item.count} colleges</div> : null}
            </Link>
          ))}
        </div>
      </section>

      {/* News Alert Strip */}
      {latestNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
              <Badge tone="alert" className="uppercase tracking-wide">Updates</Badge>
              <span className="font-bold text-sm text-gray-800">Latest Admission Updates</span>
              <Link href="/news" className="ml-auto text-xs text-accent font-semibold hover:underline">View All →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {latestNews.map(item => (
                <Link key={item.id} href="/news" className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-xs font-bold ${item.state === "AP" ? "bg-green-50 text-green-700" : item.state === "TS" ? "bg-blue-50 text-accent" : "bg-violet-50 text-violet-700"}`}>
                    {item.state}
                  </span>
                  <span className="text-sm text-gray-700 truncate">{item.title}</span>
                  <span className="shrink-0 text-xs text-gray-500 ml-auto tabular-nums">{item.date.slice(5)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Top CSE Colleges */}
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Top CSE Colleges by EAPCET Cutoff</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Final-phase OC closing ranks from official TSCHE/APSCHE data. Lower rank = harder to get in.</p>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">
          {[
            { title: "Telangana — Top 5", color: "bg-accent", list: topTS },
            { title: "Andhra Pradesh — Top 5", color: "bg-green-600", list: topAP },
          ].map(({ title, color, list }) => (
            <div key={title} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className={`${color} text-white px-4 sm:px-5 py-3 sm:py-3.5 font-bold text-sm sm:text-base`}>{title}</div>
              {list.map((c, i) => (
                <Link key={c.id} href={`/colleges/${c.slug}`} className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors gap-2">
                  <div className="min-w-0 flex-1 flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-gray-500 font-semibold shrink-0 text-xs sm:text-sm">#{i + 1}</span>
                    <span className="font-semibold text-xs sm:text-sm truncate" title={c.name}>{c.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-brand text-xs sm:text-sm tabular-nums">{c.cutoff.cse > 0 ? `Rank ${c.cutoff.cse.toLocaleString()}` : "See cutoffs"}</div>
                    <div className="text-xs text-gray-500 tabular-nums">{fmtFee(c.fee)}/yr</div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Ad: Mid-page */}
        <div className="mb-10 sm:mb-14">
          <AdSlot slot="homepage_mid" />
        </div>

        {/* Affordable Colleges */}
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Most Affordable B.Tech Programs</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Lowest tuition fees across AP & Telangana.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {cheapest.map(c => (
            <Link key={c.id} href={`/colleges/${c.slug}`} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98]">
              <div className={`text-xs font-semibold mb-1 ${c.type === "Government" ? "text-green-600" : "text-accent"}`}>
                {c.type} · {c.state}
              </div>
              <div className="font-bold text-sm sm:text-base mb-2 leading-snug">{c.name}</div>
              <div className="flex items-center justify-between">
                <div className="text-lg sm:text-xl font-extrabold text-brand tabular-nums">{fmtFee(c.fee)}<span className="text-xs font-normal text-gray-500">/yr</span></div>
                <Badge tone="accent">{c.district}</Badge>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-5 mb-10 sm:mb-14">
          {[
            ["Telangana Colleges", `${stats.ts} colleges with fees, cutoffs & placements`, "border-l-accent", "/colleges?state=Telangana"],
            ["Andhra Pradesh Colleges", `${stats.ap} colleges with fees, cutoffs & placements`, "border-l-green-600", "/colleges?state=Andhra+Pradesh"],
            ["Compare Colleges", "Pick 2–4 colleges and compare side by side", "border-l-amber-500", "/compare"],
            ["Web Options Generator", "Auto-build your counselling preference list from your rank", "border-l-rose-500", "/eapcet/web-options-generator"],
            ["Fee Calculator", "Estimate the full 4-year B.Tech cost — hostel included", "border-l-violet-500", "/fee-calculator"],
            ["Documents Checklist", "Every certificate needed for AP & TS verification", "border-l-teal-500", "/eapcet/certificate-verification-documents"],
          ].map(([title, desc, border, href]) => (
            <Link key={title as string} href={href as string} className={`block bg-white rounded-xl p-4 sm:p-6 shadow-sm border-l-4 ${border} hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98]`}>
              <div className="font-bold text-base sm:text-lg mb-1">{title as string}</div>
              <div className="text-xs sm:text-sm text-gray-500">{desc as string}</div>
            </Link>
          ))}
        </div>

        {/* Ad: Bottom */}
        <div className="mb-10 sm:mb-14">
          <AdSlot slot="homepage_bottom" />
        </div>

        {/* Why Us */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Built for Telugu States</h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              ["Official Fees", "All fee data comes from government orders, not estimates."],
              ["Real Cutoffs", "EAPCET closing ranks from official TSCHE & APSCHE counselling data."],
              [`${stats.total} Colleges`, "The most comprehensive directory of AP & Telangana professional colleges."],
            ].map(([t, d]) => (
              <div key={t} className="text-center">
                <div className="font-bold text-brand mb-2">{t}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
