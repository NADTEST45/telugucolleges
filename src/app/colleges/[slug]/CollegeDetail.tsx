"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import type { College } from "@/lib/colleges";
import { fmtFee, fmtCourseFee } from "@/lib/format";
import { CATEGORIES, TS_CATEGORIES, getRankForGender, type CollegeCutoffs, type YearCutoffs, type Category, type Gender } from "@/lib/categories";
import type { CourseInfo } from "@/lib/university-courses";
import AdSlot from "@/components/ads/AdSlot";
import ShortlistButton from "@/components/ShortlistButton";
import CollegeMonogram from "@/components/CollegeMonogram";
import CutoffSparkline from "@/components/CutoffSparkline";
import FAQAccordion from "./components/FAQAccordion";
import ReportDataButton from "./components/ReportDataButton";
import DownloadCutoffPDF from "./components/DownloadCutoffPDF";
import PlacementsTab from "./components/PlacementsTab";
import ReviewsTab from "./components/ReviewsTab";
import AdmissionTab from "./components/AdmissionTab";
import ScholarshipsTab from "./components/ScholarshipsTab";
import type { FAQItem } from "./college-structured-data";
import type { CollegeDetailData } from "./college-detail-data";

const BASE_TABS = [
  { key: "overview", label: "Overview" },
  { key: "fees", label: "Fees & Courses" },
  { key: "cutoffs", label: "Cutoffs" },
  { key: "placements", label: "Placement Data" },
  { key: "reviews", label: "Reviews" },
];

function nirfBand(rank: number): string {
  if (rank <= 0) return "";
  if (rank <= 100) return `#${rank}`;
  if (rank <= 150) return "101-150";
  if (rank <= 200) return "151-200";
  return "201-300";
}

export default function CollegeDetail({ c, similar, historicalCutoffs, cutoffYears, phaseCutoffs, phases, faqs, initialTab, detail }: { c: College; similar: College[]; historicalCutoffs: CollegeCutoffs | null; cutoffYears: readonly string[]; phaseCutoffs?: Record<string, YearCutoffs> | null; phases?: { key: string; label: string }[] | null; faqs?: FAQItem[]; initialTab?: string; detail: CollegeDetailData }) {
  const [tab, setTab] = useState(initialTab || "overview");
  const [category, setCategory] = useState<Category>("OC");
  const [gender, setGender] = useState<Gender>("boys");
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [feeTab, setFeeTab] = useState(0); // 0 = primary tab, 1 = secondary tab
  const cutoffTableRef = useRef<HTMLDivElement>(null);
  const cutoffs = Object.entries(c.cutoff).filter(([, v]) => v > 0).sort((a, b) => a[1] - b[1]);

  // Per-college datasets (courses, scholarships, exams, placements, reviews)
  // are looked up server-side in college-detail-data.ts and passed down, so
  // this client component never bundles those data files.
  const { courses, scholarshipInfo, admissionExam, medical, feeAY } = detail;

  // Resolve the CSE OC closing rank for the summary card / About paragraph.
  // The static summary (c.cutoff.cse) is 0 for many colleges that DO have
  // real final-phase / historical CSE data in the cutoff tables below — which
  // produced the trust-breaking "CSE Cutoff: 0" card while the table showed
  // genuine closing ranks. Backfill from the same data the table renders:
  // prefer the static summary, then the most recent phase (phases are ordered
  // final-phase-first), then the latest historical year. OC / boys, matching
  // the "EAPCET final OC" card label.
  const cseClosing = (() => {
    if (c.cutoff.cse > 0) return c.cutoff.cse;
    if (phaseCutoffs && phases) {
      for (const p of phases) {
        const br = phaseCutoffs[p.key]?.["CSE"];
        const r = br ? getRankForGender(br, "OC", "boys") : 0;
        if (r > 0) return r;
      }
    }
    if (historicalCutoffs) {
      for (const y of Object.keys(historicalCutoffs).sort((a, b) => b.localeCompare(a))) {
        const br = historicalCutoffs[y]?.["CSE"];
        const r = br ? getRankForGender(br, "OC", "boys") : 0;
        if (r > 0) return r;
      }
    }
    return 0;
  })();

  // Use actual total from course data when available (handles variable yearly fees)
  const btechCourse = courses?.find(co => (co.program === "B.Tech" || co.program === "B.E.") && co.fee === c.fee);
  const btechTotalFee = btechCourse?.totalFee ?? c.fee * 4;

  // Compute B.Tech fee range from course data
  const fmtL = (n: number) => { const l = n / 100000; return l % 1 === 0 ? `${l}` : `${l.toFixed(1)}`; };
  const btechFees = courses
    ?.filter(co => co.program === "B.Tech" || co.program === "B.E.")
    .map(co => co.fee) ?? [];
  const btechFeeMin = btechFees.length > 0 ? Math.min(...btechFees) : c.fee;
  const btechFeeMax = btechFees.length > 0 ? Math.max(...btechFees) : c.fee;
  const btechFeeLabel = btechFeeMin !== btechFeeMax && btechFeeMin > 0
    ? `₹${fmtL(btechFeeMin)} – ${fmtL(btechFeeMax)}L`
    : fmtFee(c.fee);

  let TABS = scholarshipInfo
    ? [...BASE_TABS.slice(0, 2), { key: "scholarships", label: "Scholarships" }, ...BASE_TABS.slice(2)]
    : [...BASE_TABS];
  if (admissionExam || medical) {
    const placIdx = TABS.findIndex(t => t.key === "placements");
    TABS.splice(placIdx + 1, 0, { key: "admission", label: "Admission" });
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-4 flex items-center gap-1.5 min-w-0">
        <Link href="/" className="hover:text-accent shrink-0">Home</Link>
        <span className="shrink-0">/</span>
        <Link href="/colleges" className="hover:text-accent shrink-0">Colleges</Link>
        <span className="shrink-0">/</span>
        <span className="text-gray-600 font-medium truncate" title={c.name}>{c.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-8 mb-6 shadow-sm">
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`px-2.5 py-1 rounded text-xs font-semibold ${c.type === "Government" ? "bg-green-50 text-green-600" : c.type === "Deemed University" ? "bg-amber-50 text-amber-700" : c.type === "Private University" ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-600"}`}>{c.type}</span>
          {c.naac && c.naac !== "-" && <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-600">NAAC {c.naac}</span>}
          {c.nba && <span className="px-2.5 py-1 rounded text-xs font-semibold bg-purple-50 text-purple-600">NBA Accredited</span>}
          {c.nirf > 0 && <span className="px-2.5 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-600">NIRF 2025 {nirfBand(c.nirf)}</span>}
        </div>
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <CollegeMonogram name={c.name} code={c.code} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{c.name}</h1>
            <div className="mb-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700 tracking-wide">Code: {c.code}</span>
            </div>
            <p className="text-gray-500 text-sm">{c.district}, {c.state} · {c.affiliation} · Established {c.year}</p>
          </div>
        </div>
        {/* Google Reviews + Share */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(c.name + " " + c.district + " reviews")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-sm font-semibold text-gray-700 hover:text-brand"
          >
            <svg width="16" height="16" viewBox="0 0 48 48" className="shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Google Reviews
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
          {/* <ShareButtons collegeName={c.name} district={c.district} state={c.state} /> */}
          <ShortlistButton collegeSlug={c.slug} variant="full" />
          <ReportDataButton collegeCode={c.code} />
        </div>
      </div>

      {/* At a glance — the four decision-critical facts (verdict card) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
        {([
          ["Annual Fee", c.fee > 0 ? btechFeeLabel : "—", c.type === "Deemed University" || c.type === "Private University" ? `University fee${feeAY ? ` · AY ${feeAY}` : ""}` : c.state === "Telangana" ? "GO.Ms.06 · 2025-28" : "APHERMC · 2023-26", "text-brand"],
          ...(medical ? [["Admission", "NEET-UG", `Via ${medical.authority} counselling`, "text-gray-900"]] : c.type !== "Deemed University" ? [["CSE Closing Rank", cseClosing > 0 ? cseClosing.toLocaleString("en-IN") : "—", cseClosing > 0 ? "EAPCET final OC" : "Data pending", "text-gray-900"]] : [["Admission", "Own Exam", "Not via EAPCET", "text-gray-900"]]),
          ["Avg Package", c.placements.avg > 0 ? `₹${c.placements.avg} LPA` : "—", "Placements", "text-green-600"],
          ["NAAC Grade", c.naac && c.naac !== "-" ? c.naac : "—", c.naac && c.naac !== "-" ? "Accreditation" : "Not rated", "text-amber-600"],
        ] as [string, string, string, string][]).map(([label, value, sub, color]) => (
          <div key={label} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className={`text-lg sm:text-2xl font-extrabold ${color} truncate`}>{value}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Data sources & freshness strip */}
      {(() => {
        const isUni = c.type === "Deemed University" || c.type === "Private University";
        const sourceParts: string[] = [
          ...(!medical && c.type !== "Deemed University"
            ? [`Cutoffs from official ${c.state === "Telangana" ? "TGCHE/TSCHE" : "APSCHE"} Last Rank Statements`]
            : []),
          ...(!medical && !isUni
            ? [`fees from ${c.state === "Telangana" ? "TS AFRC" : "APHERMC"}-regulated government orders`]
            : []),
          ...((c.naac && c.naac !== "-") || c.nirf > 0 ? ["NAAC/NIRF from official listings"] : []),
        ];
        return (
          <div className="bg-white rounded-xl px-4 py-2.5 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[11px] sm:text-xs text-gray-500">
            {sourceParts.length > 0 ? (
              <p><span className="font-semibold text-gray-600">Data sources:</span> {sourceParts.join(" · ")}.</p>
            ) : (
              <p><span className="font-semibold text-gray-600">Data sources:</span> compiled from official publications.</p>
            )}
            <span className="shrink-0"><ReportDataButton collegeCode={c.code} variant="link" /></span>
          </div>
        );
      })()}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* College Info */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">College Information</h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                ["Full Name", c.name],
                ["College Code", c.code],
                ["Type", c.type],
                ["Affiliation", c.affiliation],
                ["District", c.district],
                ["State", c.state],
                ["Established", String(c.year)],
                ["NAAC Grade", c.naac && c.naac !== "-" ? c.naac : "Not rated"],
                ["NBA Accreditation", c.nba ? "Yes" : "No"],
                ...(c.nirf > 0 ? [["NIRF 2025 Rank", `${nirfBand(c.nirf)} (Engineering)`]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* About — SEO paragraph */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-3">About {c.name}</h2>
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>
                {c.name} ({c.code}) is {c.type === "Government" ? "a government" : c.type === "Deemed University" ? "a deemed" : c.type === "Private University" ? "a private" : "a private"} {medical ? "medical" : "engineering"} {c.type.includes("University") ? "university" : "college"} located in {c.district}, {c.state}, India{c.year > 0 ? `, established in ${c.year}` : ""}.{" "}
                {!c.type.includes("University") && `It is affiliated to ${c.affiliation} and `}
                {c.naac && c.naac !== "-" ? `holds NAAC Grade ${c.naac} accreditation${c.nba ? " with NBA-accredited programmes" : ""}. ` : c.nba ? "has NBA-accredited programmes. " : ""}
                {c.nirf > 0 ? `The institution is ranked in the ${nirfBand(c.nirf)} band under the NIRF 2025 ${medical ? "Medical" : "Engineering"} category. ` : ""}
                {medical
                  ? `${c.name} offers the ${c.branches.join(", ")} programme, with seats filled through NEET-UG based counselling conducted by ${medical.authorityFullName} (state quota) and the Medical Counselling Committee (All India Quota).`
                  : <>{c.name} offers B.Tech programmes in {c.branches.length} {c.branches.length === 1 ? "branch" : "branches"} including {c.branches.slice(0, 5).join(", ")}{c.branches.length > 5 ? `, and ${c.branches.length - 5} more` : ""}.</>}
              </p>
              <p>
                {c.fee > 0 ? (medical
                  ? `The annual MBBS tuition fee (convener/competent-authority quota) is ${fmtFee(c.fee)}${c.type === "Government" ? ", making it one of the most affordable options in " + c.state : ""}. Management and NRI quota seats carry higher fees set per the ${medical.authority} notification. `
                  : `The annual tuition fee for B.Tech is ${fmtFee(c.fee)}${c.type === "Government" ? ", making it one of the most affordable options in " + c.state : c.goFee > 0 && c.goFee !== c.fee ? ` (government order fee: ${fmtFee(c.goFee)})` : ""}. Over four years, the total tuition cost comes to approximately ${fmtFee(btechTotalFee)}. `) : ""}
                {c.placements.avg > 0 ? `In recent placements, ${c.name.split(" ")[0]} reported an average package of ₹${c.placements.avg} LPA${c.placements.highest > 0 ? ` with the highest offer reaching ₹${c.placements.highest} LPA` : ""}${c.placements.companies > 0 ? `, attracting ${c.placements.companies}+ recruiting companies` : ""}. ` : ""}
                {"" /* ROI sentence removed */}
                {cseClosing > 0 ? (c.type === "Deemed University"
                  ? `In its final ${c.state === "Telangana" ? "TS" : "AP"} EAPCET counselling cycle before becoming a deemed university, the CSE branch closed at rank ${cseClosing.toLocaleString("en-IN")}.`
                  : `For ${c.state === "Telangana" ? "TS" : "AP"} EAPCET admissions, the CSE branch had a closing rank of ${cseClosing.toLocaleString("en-IN")} in the most recent counselling cycle.`) : ""}
              </p>
            </div>
          </section>

          {/* Branches */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Branches Offered</h2>
            <div className="flex gap-2 flex-wrap">
              {c.branches.map(b => (
                <span key={b} className="bg-blue-50 text-brand px-3 py-1.5 rounded-lg text-sm font-semibold">{b}</span>
              ))}
            </div>
          </section>

          {/* Ad: Detail sidebar/inline */}
          <AdSlot slot="detail_sidebar" slug={c.slug} state={c.state === "Andhra Pradesh" ? "AP" : "TS"} />

          {/* Similar Colleges */}
          {similar.length > 0 && (
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-baseline justify-between mb-4 gap-4">
                <h2 className="text-lg font-bold">Similar Colleges</h2>
                <Link href="/compare" className="text-xs font-semibold text-accent hover:underline whitespace-nowrap">
                  Compare all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {similar.map(s => (
                  <div key={s.id} className="rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all flex flex-col">
                    <Link href={`/colleges/${s.slug}`} className="flex-1">
                      <div className="font-bold text-sm mb-1">{s.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{s.district} · {s.type}</div>
                      <div className="flex justify-between text-xs mb-3">
                        <span>Fee: {fmtFee(s.fee)}</span>
                        {s.cutoff.cse > 0 && <span className="font-semibold">Rank {s.cutoff.cse.toLocaleString()}</span>}
                      </div>
                    </Link>
                    <Link
                      href={`/compare/${c.code.toLowerCase()}-vs-${s.code.toLowerCase()}`}
                      className="mt-auto block text-center text-xs font-semibold text-brand bg-blue-50 hover:bg-blue-100 rounded-md py-1.5 transition-colors"
                    >
                      Compare vs {c.code}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-500">Not seeing the right match? Pick any 2–4 colleges to compare.</p>
                <Link
                  href="/compare"
                  className="shrink-0 inline-flex items-center gap-1 bg-brand text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-brand-dark transition-colors"
                >
                  Open Compare Tool
                </Link>
              </div>
            </section>
          )}
        </div>
      )}

      {tab === "fees" && (() => {
        const isDeemedOrPrivateUni = c.type === "Deemed University" || c.type === "Private University";
        const isGovt = c.type === "Government";

        const levels = ["UG", "Integrated", "PG", "Doctoral", "Diploma"] as const;
        const levelLabels: Record<string, string> = { UG: "Undergraduate Programs", Integrated: "Integrated / Dual Degree Programs", PG: "Postgraduate Programs", Doctoral: "Doctoral Programs", Diploma: "Diploma Programs" };
        const levelColors: Record<string, string> = { UG: "bg-blue-50 text-blue-800", Integrated: "bg-violet-50 text-violet-800", PG: "bg-green-50 text-green-800", Doctoral: "bg-amber-50 text-amber-800", Diploma: "bg-gray-50 text-gray-800" };
        const grouped = courses ? levels.reduce((acc, level) => {
          const items = courses.filter(co => co.level === level);
          if (items.length > 0) acc.push({ level, label: levelLabels[level], color: levelColors[level], items });
          return acc;
        }, [] as { level: string; label: string; color: string; items: CourseInfo[] }[]) : [];

        return (
        <div className="space-y-6">
          {/* Fee context banner */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold">Fee Structure</h2>
              {isDeemedOrPrivateUni && feeAY && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-brand text-xs font-bold">
                  AY {feeAY}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {isDeemedOrPrivateUni
                ? `Annual tuition fee as declared by the university${feeAY ? ` for AY ${feeAY}` : ""} — not regulated by state fee fixation committee`
                : isGovt
                ? "Government college — nominal tuition fee as per state norms"
                : "Annual tuition fee as per official government order"}
            </p>

            {/* Medical fee banner — MBBS fees are NEET/health-university regulated, not APHERMC/AFRC */}
            {medical && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-brand flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-brand">NEET-based MBBS admission · {medical.authority} counselling</div>
                  <div className="text-xs text-blue-700 mt-0.5">Convener/competent-authority fee shown below. Management (B-category) and NRI (C-category) seats carry higher fees per the {medical.authority} notification. Not an EAPCET/APHERMC fee.</div>
                </div>
              </div>
            )}

            {/* Block Period Banner — only for affiliated private/govt colleges */}
            {!isDeemedOrPrivateUni && !medical && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-brand flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-brand">
                    {c.state === "Telangana"
                      ? "G.O.Ms.No.06 — Block Period 2025–2028"
                      : "APHERMC — Block Period 2023–2026"}
                  </div>
                  <div className="text-xs text-blue-700 mt-0.5">
                    {c.state === "Telangana"
                      ? "Fees fixed by TS AFRC for AY 2025-26 through 2027-28. Applies to 70% of seats (Convener / Category-A)."
                      : "Fees fixed by APHERMC via G.O.Ms.No.41-43 (2023), enhanced by G.O.Ms.No.17/23 (2024). Applies to 70% of seats (Convener / Category-A)."}
                  </div>
                </div>
              </div>
            )}

            {/* Fee Display — depends on institution type */}
            {(() => {
              const hasConvenerQuota = c.type === "Private University" && c.goFee > 0 && c.goFee !== c.fee;
              const hasDualCategory = isDeemedOrPrivateUni && courses && courses.some(co => co.mgmtFee && co.mgmtFee < co.fee);
              const showTabs = hasConvenerQuota || hasDualCategory;

              const brownfieldCodes = new Set(["MBUT", "AITS", "ADTP", "GGUR"]);
              const isBrownfield = brownfieldCodes.has(c.code);
              const quotaPct = isBrownfield ? "70%" : "35%";
              const examName = c.state === "Telangana" ? "TS EAMCET" : "AP EAPCET";

              /* Tab labels */
              const tab1Label = hasConvenerQuota
                ? `${examName} Convener`
                : hasDualCategory ? "Direct Admission" : "";
              const tab2Label = hasConvenerQuota
                ? "Direct Admission"
                : hasDualCategory ? "With Entrance Exam" : "";

              return showTabs ? (
                <>
                  {/* Tab buttons */}
                  <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
                    <button
                      onClick={() => setFeeTab(0)}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                        feeTab === 0
                          ? hasConvenerQuota ? "bg-green-600 text-white shadow-sm" : "bg-brand text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab1Label}
                    </button>
                    <button
                      onClick={() => setFeeTab(1)}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                        feeTab === 1
                          ? "bg-brand text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab2Label}
                    </button>
                  </div>

                  {/* Tab content */}
                  {hasConvenerQuota && feeTab === 0 && (
                    <div className="bg-green-50 rounded-lg px-5 py-4">
                      <div className="text-sm text-green-700 font-semibold">{examName} Convener Quota</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.state === "Telangana" ? "TAFRC regulated · State counseling" : `${quotaPct} of seats · G.O.Ms.No.19 (2024-27)`}</div>
                      <div className="text-2xl font-extrabold text-green-700 mt-2">{fmtFee(c.goFee)}<span className="text-xs font-normal text-gray-500">/yr (all B.Tech branches)</span></div>
                      <div className="mt-3 text-xs text-green-700">
                        {c.state === "Andhra Pradesh"
                          ? `${isBrownfield ? "Brownfield university — 70% of original seats" : "Greenfield university — 35% of seats"} filled through AP EAPCET at APHERMC-regulated fees per G.O.Ms.No.19 (block period 2024-27).`
                          : "Convener quota seats filled through TS EAMCET state counseling at TAFRC-regulated fees per G.O. Ms. No. 06 dated 04.03.2026 (block period 2025–26 to 2027–28)."}
                      </div>
                    </div>
                  )}
                  {hasConvenerQuota && feeTab === 1 && (
                    <div className="bg-blue-50 rounded-lg px-5 py-4">
                      <div className="text-sm text-brand font-semibold">Direct Admission (University Quota)</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.state === "Andhra Pradesh" ? `${isBrownfield ? "30%" : "65%"} of seats · ` : ""}University entrance · Fee set by university{feeAY ? ` · AY ${feeAY}` : ""}</div>
                      <div className="text-2xl font-extrabold text-brand mt-2">{fmtFee(c.fee)}<span className="text-xs font-normal text-gray-500">/yr (CSE — varies by branch)</span></div>
                    </div>
                  )}
                  {hasDualCategory && feeTab === 0 && (
                    <div className="bg-blue-50 rounded-lg px-5 py-4">
                      <div className="text-sm text-brand font-semibold">Category-B (Direct Admission)</div>
                      <div className="text-xs text-gray-500 mt-0.5">For students admitted without entrance exam (60%+ in intermediate){feeAY ? ` · AY ${feeAY}` : ""}</div>
                      <div className="text-2xl font-extrabold text-brand mt-2">{fmtFee(c.fee)}<span className="text-xs font-normal text-gray-500">/yr (CSE — varies by branch)</span></div>
                    </div>
                  )}
                  {hasDualCategory && feeTab === 1 && (
                    <div className="bg-green-50 rounded-lg px-5 py-4">
                      <div className="text-sm text-green-700 font-semibold">Category-A (With Entrance Exam)</div>
                      <div className="text-xs text-gray-500 mt-0.5">For students admitted through V-SAT / EAMCET / JEE{feeAY ? ` · AY ${feeAY}` : ""}</div>
                      <div className="text-2xl font-extrabold text-green-700 mt-2">
                        {courses && courses.find(co => co.mgmtFee && co.mgmtFee < co.fee) ? fmtFee(courses.find(co => co.mgmtFee && co.mgmtFee < co.fee)!.mgmtFee!) : "—"}
                        <span className="text-xs font-normal text-gray-500">/yr (CSE — varies by branch)</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* No tabs — Deemed without dual / Private without convener / Govt / Affiliated */
                <>
                  <div className="bg-gray-50 rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-sm text-gray-500">
                        {medical ? "MBBS Annual Tuition (Convener Quota)" : isDeemedOrPrivateUni ? "B.Tech Annual Tuition" : isGovt ? "B.Tech Annual Tuition" : "B.Tech Convener Quota (Category-A)"}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {medical
                          ? `Competent-authority quota fee · ${c.type === "Government" ? "Government medical college" : "Per " + medical.authority + " notification"}`
                          : isDeemedOrPrivateUni
                          ? `${c.type} · Fee set by university${feeAY ? ` · AY ${feeAY}` : ""}`
                          : isGovt
                          ? "Government college — nominal fee per state norms"
                          : "70% of seats · Government-regulated fee"}
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-brand">{fmtFee(c.fee)}<span className="text-xs font-normal text-gray-500">/yr</span></div>
                  </div>

                  {/* Source note */}
                  {isDeemedOrPrivateUni && (
                    <div className="mt-3 bg-amber-50 rounded-lg px-4 py-2.5 text-xs text-amber-700">
                      {`${c.type} fees are set by the institution${feeAY ? ` (sourced from official website for AY ${feeAY})` : ""}. Contact admissions for exact, up-to-date fee details.`}
                    </div>
                  )}
                  {medical && (
                    <div className="mt-3 bg-amber-50 rounded-lg px-4 py-2.5 text-xs text-amber-700">
                      For management (B-category) and NRI (C-category) quota fees, refer to the {medical.authority} fee notification or contact the college directly. MBBS fees are not regulated by APHERMC/AFRC.
                    </div>
                  )}
                  {!isDeemedOrPrivateUni && !isGovt && !medical && (
                    <>
                      {c.state === "Telangana" && (
                        <div className="mt-3 bg-emerald-50 rounded-lg px-4 py-2.5 text-xs text-emerald-800">
                          Tuition fee fixed under <strong>G.O. Ms. No. 06 dt. 04.03.2026</strong> (TAFRC block 2025–26 to 2027–28). <Link href="/news#tg-engineering-fee-2025-28-go-ms-06" className="underline hover:text-emerald-900">Read the notification &rarr;</Link>
                        </div>
                      )}
                      <div className="mt-3 bg-amber-50 rounded-lg px-4 py-2.5 text-xs text-amber-700">
                        For management quota (Category-B, ~30% seats) fees, contact the college directly — these are approved per college by {c.state === "Telangana" ? "TS AFRC" : "APHERMC"}.
                      </div>
                    </>
                  )}
                </>
              );
            })()}
          </section>

          {/* Course-wise fee breakdown */}
          {courses && grouped.length > 0 && (() => {
            const hasConvenerQuota = c.type === "Private University" && c.goFee > 0 && c.goFee !== c.fee;
            const hasDualCategory = isDeemedOrPrivateUni && courses.some(co => co.mgmtFee && co.mgmtFee < co.fee);
            /* For convener tab (feeTab=0): show uniform goFee for B.Tech, per-course otherwise
               For direct tab (feeTab=1): show per-course fee as usual
               For deemed Cat-B (feeTab=0): show fee
               For deemed Cat-A (feeTab=1): show mgmtFee */
            const getFee = (co: CourseInfo) => {
              if (hasConvenerQuota && feeTab === 0 && co.program === "B.Tech") return c.goFee;
              if (hasDualCategory && feeTab === 1 && co.mgmtFee && co.mgmtFee < co.fee) return co.mgmtFee;
              return co.fee;
            };
            const getTotal = (co: CourseInfo) => {
              const annualFee = getFee(co);
              if (hasDualCategory && feeTab === 1 && co.mgmtFee && co.mgmtFee < co.fee) return annualFee * co.duration;
              if (hasConvenerQuota && feeTab === 0 && co.program === "B.Tech") return annualFee * co.duration;
              return co.totalFee ?? annualFee * co.duration;
            };
            const feeColor = (hasConvenerQuota && feeTab === 0) || (hasDualCategory && feeTab === 1) ? "text-green-700" : "text-brand";
            const headerBg = (hasConvenerQuota && feeTab === 0) || (hasDualCategory && feeTab === 1) ? "bg-green-700" : "bg-brand";
            const feeLabel = hasConvenerQuota
              ? (feeTab === 0 ? "Convener Fee" : "Direct Admission Fee")
              : hasDualCategory
              ? (feeTab === 0 ? "Cat-B (Direct)" : "Cat-A (Entrance)")
              : "Annual Fee";

            return grouped.map(group => (
            <section key={group.level} className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-1">{group.label}</h2>
              {hasConvenerQuota && feeTab === 0 && group.level === "UG" && (
                <p className="text-xs text-gray-500 mb-3">B.Tech branches have a <span className="font-semibold text-green-700">uniform convener fee of {fmtCourseFee(c.goFee)}/yr</span> through {c.state === "Telangana" ? "TS EAMCET" : "AP EAPCET"} counseling. Switch to &ldquo;Direct Admission&rdquo; tab for branch-wise university fees.</p>
              )}
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm border-collapse">
                  <caption className="sr-only">{group.label} at {c.name} — program-wise annual fee, duration and total cost</caption>
                  <thead>
                    <tr className={`${headerBg} text-white`}>
                      <th scope="col" className="px-4 py-2.5 text-left rounded-tl-lg">Program</th>
                      <th scope="col" className="px-4 py-2.5 text-right">{feeLabel}</th>
                      <th scope="col" className="px-4 py-2.5 text-right hidden sm:table-cell">Duration</th>
                      <th scope="col" className="px-4 py-2.5 text-right rounded-tr-lg">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((co, i) => (
                      <tr key={`${co.program}-${co.specialization || ""}-${i}`} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <th scope="row" className="px-4 py-3 text-left font-normal">
                          <div className="font-semibold">{co.program}</div>
                          {co.specialization && <div className="text-xs text-gray-500 mt-0.5">{co.specialization}</div>}
                          <div className="text-xs text-gray-500 mt-0.5 sm:hidden">{co.duration} {co.duration === 1 ? "yr" : "yrs"}</div>
                        </th>
                        <td className={`px-4 py-3 text-right font-bold ${feeColor}`}>{fmtCourseFee(getFee(co))}</td>
                        <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">{co.duration} {co.duration === 1 ? "year" : "years"}</td>
                        <td className="px-4 py-3 text-right font-semibold">{fmtCourseFee(getTotal(co))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            ));
          })()}

          {/* Fallback if no detailed course data */}
          {!courses && (
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">B.Tech 4-Year Cost Estimate</h2>
              <p className="text-xs text-gray-500 mb-3">{isDeemedOrPrivateUni || isGovt ? "Based on current tuition fee" : "Based on convener quota fee"}</p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50 rounded-xl p-4 sm:p-5 text-center">
                  <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Tuition (4 yrs)</div>
                  <div className="text-lg sm:text-2xl font-extrabold text-brand">{fmtFee(c.fee * 4)}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 sm:p-5 text-center">
                  <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Per Semester</div>
                  <div className="text-lg sm:text-2xl font-extrabold text-green-700">{fmtFee(Math.round(c.fee / 2))}</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 sm:p-5 text-center">
                  <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Per Month</div>
                  <div className="text-lg sm:text-2xl font-extrabold text-amber-700">{fmtFee(Math.round(c.fee / 12))}</div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3">Excludes hostel, transport, exam fees, and miscellaneous charges.</p>
            </section>
          )}

          {/* Fee disclaimer */}
          <div className="bg-amber-50 rounded-xl px-5 py-3 text-xs text-amber-700">
            {isDeemedOrPrivateUni
              ? `Fees shown are approximate annual tuition for AY ${feeAY || "2025-26"}. Actual fees may vary by admission category, scholarship, or merit slab. Hostel, exam, and miscellaneous charges are extra. Contact the university admissions office for exact figures.`
              : "Fees are from official government orders for the current block period. Hostel, transport, exam fees, and miscellaneous charges are extra. Actual costs may vary."}
          </div>

          {/* Scholarship callout — only if college has scholarship data */}
          {scholarshipInfo && (
            <button
              onClick={() => setTab("scholarships")}
              className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl px-5 py-3.5 text-left transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-emerald-800">Merit Scholarships Available</div>
                  <div className="text-xs text-emerald-600 mt-0.5">
                    {scholarshipInfo.tables.length > 1
                      ? `${scholarshipInfo.tables.length} scholarship schemes — up to 100% tuition waiver based on entrance exam scores`
                      : "Tuition fee concessions available based on entrance exam scores"}
                  </div>
                </div>
                <svg className="w-5 h-5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </div>
            </button>
          )}

          {/* Ad: Below fees */}
          <AdSlot slot="detail_below_fees" slug={c.slug} state={c.state === "Andhra Pradesh" ? "AP" : "TS"} />
        </div>
        );
      })()}

      {tab === "scholarships" && scholarshipInfo && <ScholarshipsTab scholarshipInfo={scholarshipInfo} />}

      {tab === "cutoffs" && (() => {
        const isDeemedUni = c.type === "Deemed University";
        if (medical) {
          return (
            <div className="space-y-6">
              <section className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Admission Cutoffs</h2>
                <div className="bg-amber-50 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">🩺</div>
                  <p className="font-semibold text-amber-800 mb-2">MBBS cutoffs are NEET-rank based — not EAPCET</p>
                  <p className="text-sm text-amber-700 mb-4">
                    {c.name} admits students through NEET-UG ranks, with seats allotted by {medical.authorityFullName} (state quota) and the Medical Counselling Committee (All India Quota). It does not participate in AP/TS EAPCET counselling.
                  </p>
                  <div className="bg-white rounded-lg p-4 text-left text-sm text-gray-600 max-w-md mx-auto">
                    <p className="font-semibold text-gray-800 mb-2">Closing ranks</p>
                    <p>NEET-UG closing ranks vary each year by category and counselling round. Check the official portal <a href={medical.officialUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline">{medical.officialUrl.replace(/^https?:\/\//, "")}</a> for the latest seat allotment and last-rank details. See the Admission tab for the full counselling process.</p>
                  </div>
                </div>
              </section>
            </div>
          );
        }
        if (isDeemedUni) {
          return (
            <div className="space-y-6">
              <section className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Admission Cutoffs</h2>
                <div className="bg-amber-50 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">🎓</div>
                  <p className="font-semibold text-amber-800 mb-2">Deemed University — Does Not Participate in EAPCET Counselling</p>
                  <p className="text-sm text-amber-700 mb-4">
                    {c.name} conducts its own entrance examination and admission process independent of the state EAPCET/ECET counselling system.
                  </p>
                  <div className="bg-white rounded-lg p-4 text-left text-sm text-gray-600 max-w-md mx-auto">
                    <p className="font-semibold text-gray-800 mb-2">How to apply:</p>
                    <p>Visit the official college website for admission details, entrance exam dates, and eligibility criteria. Deemed universities typically accept their own exam scores, national-level exam scores (JEE, etc.), or a combination of entrance test + academic performance.</p>
                  </div>
                </div>
              </section>
            </div>
          );
        }

        // Phase-wise view (TS colleges with phase data)
        const hasPhases = phaseCutoffs && phases && phases.length > 1;
        const isPhaseView = hasPhases && selectedPhase !== null;
        const activePhase = selectedPhase || (phases?.[0]?.key ?? null);

        // Phase-wise data helpers
        const getPhaseRank = (branch: string, phaseKey: string): number => {
          const yearData = phaseCutoffs?.[phaseKey];
          if (!yearData) return 0;
          const brData = yearData[branch] || yearData[branch.toUpperCase()] || yearData[branch.toLowerCase()];
          if (!brData) return 0;
          return getRankForGender(brData, category, gender);
        };

        // Default year-wise view
        const hasCurrentCutoffs = cutoffs.length > 0;
        const hasHistorical = historicalCutoffs && Object.keys(historicalCutoffs).length > 0;

        const allBranches = new Set<string>();
        if (hasCurrentCutoffs) cutoffs.forEach(([b]) => allBranches.add(b));
        if (hasHistorical) {
          Object.values(historicalCutoffs!).forEach(yearData => {
            Object.keys(yearData).forEach(b => allBranches.add(b));
          });
        }
        // Also add branches from phase data
        if (phaseCutoffs) {
          Object.values(phaseCutoffs).forEach(yearData => {
            Object.keys(yearData).forEach(b => allBranches.add(b));
          });
        }
        const branchList = [...allBranches].sort((a, b) => {
          const order = ["CSE","cse","CSM","csm","CSD","csd","CSO","cso","AID","AIM","ai_ml","ai_ds","INF","it","ECE","ece","EEE","eee","MEC","mech","CIV","civil","CSC","csc","CSB","CSI","CSA","CSG","BME","BIO","CHE","MMS","MTE"];
          const ai = order.indexOf(a) === -1 ? 99 : order.indexOf(a);
          const bi = order.indexOf(b) === -1 ? 99 : order.indexOf(b);
          return ai - bi || a.localeCompare(b);
        });

        const yearCols: { label: string; key: string }[] = [];
        // The hand-maintained summary column is labelled "2024-25". Once official
        // 2024 last-rank data exists it is the authoritative 2024-25 source, so skip
        // the summary column to avoid a duplicate "2024-25" header.
        const hasOfficial2024 = !!(hasHistorical && historicalCutoffs!["2024"]);
        if (hasCurrentCutoffs && !hasOfficial2024) yearCols.push({ label: "2024-25", key: "current" });
        if (hasHistorical) {
          cutoffYears.forEach(y => {
            if (historicalCutoffs![y]) yearCols.push({ label: `${y}-${String(Number(y) + 1).slice(-2)}`, key: y });
          });
        }

        const getRank = (branch: string, yearKey: string): number => {
          if (yearKey === "current") return c.cutoff[branch] || c.cutoff[branch.toLowerCase()] || 0;
          const yearData = historicalCutoffs?.[yearKey];
          if (!yearData) return 0;
          const brData = yearData[branch] || yearData[branch.toUpperCase()] || yearData[branch.toLowerCase()];
          if (!brData) return 0;
          return getRankForGender(brData, category, gender);
        };

        const branchLabel = (b: string) => {
          const map: Record<string, string> = {
            cse: "CSE", ece: "ECE", eee: "EEE", mech: "Mechanical", civil: "Civil",
            it: "IT", cse_ds: "CSE (Data Science)", cse_aiml: "CSE (AI/ML)", cse_ai: "CSE (AI)", csbs: "CSE (Business Systems)",
            aiml: "AI & ML", ai_ml: "AI & ML", ai_ds: "AI & Data Science", data_science: "Data Science",
            chemical: "Chemical", aero: "Aerospace", biotech: "Biotechnology",
            auto: "Automobile", agri: "Agricultural", food_tech: "Food Technology", mining: "Mining",
            robotics: "Robotics", metallurgy: "Metallurgy", petroleum: "Petroleum", pharmacy: "Pharmacy",
            pharmacy_d: "Pharmacy (D)", cst: "CST",
            CSE: "CSE", ECE: "ECE", EEE: "EEE", MEC: "Mechanical", CIV: "Civil", INF: "IT",
            CSM: "CSE (AI & ML)", CSD: "CSE (Data Science)", CSO: "CSE (IoT)", CSI: "CSE (Information Security)",
            CSB: "CSE (Blockchain)", CSC: "CSE (Cyber Security)", CSA: "CSE (AI)", CSG: "CSE (Gaming)",
            CSN: "CSE (Networks)", AID: "AI & DS", AIM: "AI & ML", AI: "AI",
            BME: "Biomedical", BIO: "Biotechnology", BSE: "Bio Sciences", BTB: "B.Tech (Dual)",
            CHE: "Chemical", CIC: "CIC", CME: "Computer & Comm. Eng",
            ANE: "Automobile", AUT: "Automobile", DRG: "Agricultural", DTD: "Dairy Technology",
            AGR: "Agricultural", FDT: "Food Technology", GEO: "Geo Informatics",
            MET: "Metallurgy", MIN: "Mining", MMS: "Mechatronics", MTE: "Materials Tech",
            MCT: "Mechatronics", MMT: "Mining & Mineral Tech", TEX: "Textile", PLG: "Plastics",
            PHE: "Pharma (Pharm-D)", PHS: "Pharma (B.Pharm)", PHB: "Pharma (B.Pharm)", PDB: "Pharma (Pharm-D BiPC)",
            ECI: "ECE (IoT)", ECM: "ECE & Comm.", EIE: "Instrumentation",
            ETM: "Electronics & Telematics", EVL: "Environmental", CS: "Computer Science",
            CSW: "CSE (IoT & Cyber Security)",
          };
          return map[b] || b.toUpperCase().replace(/_/g, " ");
        };

        const noCutoffData = yearCols.length === 0 && !hasPhases;
        const catList = c.state === "Telangana" ? TS_CATEGORIES : CATEGORIES;
        const selectedCatLabel = catList.find(ct => ct.key === category)?.label || category;

        return (
          <div className="space-y-6">
            {/* Download PDF button */}
            {!noCutoffData && !isDeemedUni && (
              <div className="flex justify-end">
                <DownloadCutoffPDF collegeName={c.name} tableRef={cutoffTableRef} category={selectedCatLabel} gender={gender} />
              </div>
            )}

            <div ref={cutoffTableRef}>
            {/* Phase-wise comparison (TS only) */}
            {hasPhases && (
              <section className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-bold mb-1">Phase-wise Cutoff Comparison</h2>
                    <p className="text-xs text-gray-500">
                      See how cutoffs relax across counselling phases ({selectedCatLabel}, {gender === "girls" ? "Girls" : "Boys"})
                    </p>
                  </div>
                  <div className="flex items-end gap-2">
                    <div>
                      <label className="text-[11px] text-gray-500 font-semibold mb-1 block">Gender</label>
                      <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg h-[38px]">
                        <button onClick={() => setGender("boys")}
                          className={`px-3 rounded-md text-xs font-semibold transition-all ${gender === "boys" ? "bg-white text-brand shadow-sm" : "text-gray-500"}`}>
                          Boys
                        </button>
                        <button onClick={() => setGender("girls")}
                          className={`px-3 rounded-md text-xs font-semibold transition-all ${gender === "girls" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500"}`}>
                          Girls
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-500 font-semibold mb-1 block">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value as Category)}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold">
                        {catList.map(ct => (
                          <option key={ct.key} value={ct.key}>{ct.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <caption className="sr-only">
                      Phase-wise TS EAMCET cutoff closing ranks for {c.name} by branch and counselling phase ({selectedCatLabel}, {gender === "girls" ? "Girls" : "Boys"})
                    </caption>
                    <thead>
                      <tr className="bg-brand text-white">
                        <th scope="col" className="px-3 py-2.5 text-left rounded-tl-lg">Branch</th>
                        {phases!.map((p, i) => (
                          <th scope="col" key={p.key} className={`px-3 py-2.5 text-right whitespace-nowrap ${i === phases!.length - 1 ? "rounded-tr-lg" : ""}`}>
                            {p.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {branchList.map((branch, i) => {
                        const ranks = phases!.map(p => getPhaseRank(branch, p.key));
                        const hasAnyData = ranks.some(r => r > 0);
                        if (!hasAnyData) return null;
                        return (
                          <tr key={branch} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <th scope="row" className="px-3 py-2.5 font-semibold text-sm text-left sm:whitespace-nowrap break-words">{branchLabel(branch)}</th>
                            {ranks.map((rank, ri) => {
                              // Color code: earlier phases (tighter) = red-ish, later (relaxed) = green-ish
                              const prevRank = ri > 0 ? ranks[ri - 1] : 0;
                              const relaxed = rank > 0 && prevRank > 0 && rank > prevRank;
                              return (
                                <td key={phases![ri].key} className={`px-3 py-2.5 text-right ${ri === 0 ? "font-bold" : ""}`}>
                                  {rank > 0 ? (
                                    <span>
                                      {rank.toLocaleString()}
                                      {relaxed && <span className="ml-1 text-[11px] sm:text-xs text-green-500">↓</span>}
                                    </span>
                                  ) : (
                                    <span className="text-gray-300">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-2">↓ = cutoff relaxed from previous phase (higher rank = easier to get in). Source: TSCHE official Last Rank Statement PDFs. From 2025, the SC quota is split into SC-I/II/III; for earlier years those options show the combined SC rank.</p>
                </div>
              </section>
            )}

            {/* Year-wise comparison (original view) */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold mb-1">{hasPhases ? "Year-wise Final Phase Cutoffs" : "EAPCET Cutoff Ranks — Branch-wise"}</h2>
                  <p className="text-xs text-gray-500">
                    Closing ranks ({selectedCatLabel}, {gender === "girls" ? "Girls" : "Boys"}). {hasHistorical ? `${yearCols.length} year${yearCols.length > 1 ? "s" : ""} of official ${c.state === "Telangana" ? "TSCHE" : "APSCHE"} data.` : "Based on latest counselling data."}
                  </p>
                </div>
                {hasHistorical && !hasPhases && (
                  <div className="flex items-end gap-2">
                    <div>
                      <label className="text-[11px] text-gray-500 font-semibold mb-1 block">Gender</label>
                      <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg h-[38px]">
                        <button onClick={() => setGender("boys")}
                          className={`px-3 rounded-md text-xs font-semibold transition-all ${gender === "boys" ? "bg-white text-brand shadow-sm" : "text-gray-500"}`}>
                          Boys
                        </button>
                        <button onClick={() => setGender("girls")}
                          className={`px-3 rounded-md text-xs font-semibold transition-all ${gender === "girls" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500"}`}>
                          Girls
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-500 font-semibold mb-1 block">Category / Caste</label>
                      <select value={category} onChange={e => setCategory(e.target.value as Category)}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold">
                        {catList.map(ct => (
                          <option key={ct.key} value={ct.key}>{ct.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              {!noCutoffData ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <caption className="sr-only">
                      Year-wise {c.state === "Telangana" ? "TS EAMCET" : "AP EAPCET"} cutoff closing ranks for {c.name} by branch and year ({selectedCatLabel}, {gender === "girls" ? "Girls" : "Boys"})
                    </caption>
                    <thead>
                      <tr className="bg-brand text-white">
                        <th scope="col" className="px-4 py-2.5 text-left rounded-tl-lg">Branch</th>
                        {yearCols.map(y => (
                          <th scope="col" key={y.key} className="px-4 py-2.5 text-right">{y.label}</th>
                        ))}
                        {yearCols.length >= 2 && (
                          <th scope="col" className="px-4 py-2.5 text-right rounded-tr-lg whitespace-nowrap">Trend</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {branchList.map((branch, i) => {
                        const ranks = yearCols.map(y => getRank(branch, y.key));
                        const hasAnyData = ranks.some(r => r > 0);
                        if (!hasAnyData) return null;
                        const validRanks = ranks.filter(r => r > 0);
                        let trend = "";
                        if (validRanks.length >= 2) {
                          const diff = validRanks[0] - validRanks[1];
                          if (Math.abs(diff) > 500) trend = diff < 0 ? "↑" : "↓";
                        }
                        return (
                          <tr key={branch} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <th scope="row" className="px-4 py-2.5 font-semibold text-sm text-left break-words">{branchLabel(branch)}</th>
                            {yearCols.map((y, yi) => {
                              const rank = getRank(branch, y.key);
                              return (
                                <td key={y.key} className={`px-4 py-2.5 text-right ${yi === 0 ? "font-bold" : ""}`}>
                                  {rank > 0 ? (
                                    <span>
                                      {rank.toLocaleString()}
                                      {yi === 0 && trend && (
                                        <span className={`ml-1 text-[11px] sm:text-xs ${trend === "↑" ? "text-red-500" : "text-green-500"}`}>{trend}</span>
                                      )}
                                    </span>
                                  ) : (
                                    <span className="text-gray-300">—</span>
                                  )}
                                </td>
                              );
                            })}
                            {yearCols.length >= 2 && (
                              <td className="px-4 py-2.5 text-right align-middle">
                                <div className="inline-flex justify-end">
                                  <CutoffSparkline ranks={ranks} labels={yearCols.map(y => y.label)} />
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-2">↑ = getting harder · ↓ = getting easier · Trend sparkline reads oldest→newest (<span className="text-red-500 font-semibold">red</span> = more competitive over time, <span className="text-green-500 font-semibold">green</span> = easing) · Source: {c.state === "Telangana" ? "TSCHE" : "APSCHE"} official last rank details PDFs{c.state === "Telangana" ? ". From 2025, the SC quota is split into SC-I/II/III; for earlier years those options show the combined SC rank." : ""}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="font-semibold">Cutoff data not available</p>
                  <p className="text-xs mt-1">This college may not participate in EAPCET counselling or data has not been published</p>
                </div>
              )}
            </section>
            </div>{/* end cutoffTableRef */}
          </div>
        );
      })()}

      {tab === "placements" && <PlacementsTab c={c} pd={detail.placementData} />}

      {/* ─── Admission Tab ─── */}
      {tab === "admission" && <AdmissionTab collegeName={c.name} medical={medical} admissionExam={admissionExam} />}

      {tab === "reviews" && <ReviewsTab collegeName={c.name} reviews={detail.reviews} avg={detail.rating.avg} count={detail.rating.count} />}

      {/* Ad: Bottom of detail page */}
      <div className="mt-8">
        <AdSlot slot="detail_bottom" slug={c.slug} state={c.state === "Andhra Pradesh" ? "AP" : "TS"} />
      </div>

      {/* ─── FAQ Section ─── */}
      {faqs && faqs.length > 0 && (
        <section className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
          <FAQAccordion faqs={faqs} />
          <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500">Information is based on official data and may change. Please verify with the college directly.</p>
        </section>
      )}
    </main>
  );
}
