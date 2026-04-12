"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { College, fmtFee } from "@/lib/colleges";
import { CATEGORIES, catKey, type CollegeCutoffs, type YearCutoffs, type Category, type Gender } from "@/lib/ap-cutoffs";
import { getCourses, getAffiliatedCourses, fmtCourseFee, UNIVERSITY_FEE_AY, type CourseInfo } from "@/lib/university-courses";
import { getReviewsByCollege, getAverageRating, type Review } from "@/lib/reviews";
import { getScholarships } from "@/lib/scholarships";
import { getExamByCollegeCode } from "@/lib/admission-exams";
import { getPlacementData, branchDisplayName } from "@/lib/placement-data";
import AdSlot from "@/components/ads/AdSlot";
import ShareButtons from "./components/ShareButtons";
import FAQAccordion from "./components/FAQAccordion";

/* ─── Download Cutoff Table as PDF ─── */
function DownloadCutoffPDF({ collegeName, tableRef, category, gender }: { collegeName: string; tableRef: React.RefObject<HTMLDivElement | null>; category: string; gender: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!tableRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      // Title
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(collegeName, 10, 15);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100);
      pdf.text(`EAPCET Cutoff Ranks — ${category}, ${gender === "girls" ? "Girls" : "Boys"}`, 10, 22);
      pdf.text(`Downloaded from TeluguColleges.com on ${new Date().toLocaleDateString("en-IN")}`, 10, 28);

      // Table image
      const startY = 34;
      if (imgHeight + startY > 280) {
        // Multi-page handling for large tables
        let yPos = startY;
        const pageHeight = 280;
        const sliceHeight = pageHeight - startY;
        const totalPages = Math.ceil(imgHeight / sliceHeight);
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) { pdf.addPage(); yPos = 10; }
          pdf.addImage(imgData, "PNG", 10, yPos - (page * sliceHeight), imgWidth, imgHeight);
        }
      } else {
        pdf.addImage(imgData, "PNG", 10, startY, imgWidth, imgHeight);
      }

      // Footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text("Source: Official APSCHE/TSCHE Last Rank Statement PDFs · TeluguColleges.com", 10, 290);
      }

      const safeName = collegeName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 40);
      pdf.save(`${safeName}_Cutoffs.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [collegeName, tableRef, category, gender]);

  return (
    <button onClick={handleDownload} disabled={downloading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a5276]/10 text-[#1a5276] text-xs font-semibold hover:bg-[#1a5276]/20 transition-colors disabled:opacity-50">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      {downloading ? "Generating..." : "Download PDF"}
    </button>
  );
}

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

import type { FAQItem } from "./page";

export default function CollegeDetail({ c, similar, historicalCutoffs, cutoffYears, phaseCutoffs, phases, faqs, initialTab }: { c: College; similar: College[]; historicalCutoffs: CollegeCutoffs | null; cutoffYears: readonly string[]; phaseCutoffs?: Record<string, YearCutoffs> | null; phases?: { key: string; label: string }[] | null; faqs?: FAQItem[]; initialTab?: string }) {
  const [tab, setTab] = useState(initialTab || "overview");
  const [category, setCategory] = useState<Category>("OC");
  const [gender, setGender] = useState<Gender>("boys");
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [feeTab, setFeeTab] = useState(0); // 0 = primary tab, 1 = secondary tab
  const cutoffTableRef = useRef<HTMLDivElement>(null);
  const cutoffs = Object.entries(c.cutoff).filter(([, v]) => v > 0).sort((a, b) => a[1] - b[1]);
  const courses = getCourses(c.code) || getAffiliatedCourses(c);
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

  const scholarshipInfo = getScholarships(c.code);
  const admissionExam = getExamByCollegeCode(c.code);

  let TABS = scholarshipInfo
    ? [...BASE_TABS.slice(0, 2), { key: "scholarships", label: "Scholarships" }, ...BASE_TABS.slice(2)]
    : [...BASE_TABS];
  if (admissionExam) {
    const placIdx = TABS.findIndex(t => t.key === "placements");
    TABS.splice(placIdx + 1, 0, { key: "admission", label: "Admission" });
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-gray-400 mb-4 flex items-center gap-1.5 min-w-0">
        <Link href="/" className="hover:text-[#2e86c1] shrink-0">Home</Link>
        <span className="shrink-0">/</span>
        <Link href="/colleges" className="hover:text-[#2e86c1] shrink-0">Colleges</Link>
        <span className="shrink-0">/</span>
        <span className="text-gray-600 font-medium truncate">{c.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`px-2.5 py-1 rounded text-xs font-semibold ${c.type === "Government" ? "bg-green-50 text-green-600" : c.type === "Deemed University" ? "bg-amber-50 text-amber-700" : c.type === "Private University" ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-600"}`}>{c.type}</span>
          {c.naac && c.naac !== "-" && <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-600">NAAC {c.naac}</span>}
          {c.nba && <span className="px-2.5 py-1 rounded text-xs font-semibold bg-purple-50 text-purple-600">NBA Accredited</span>}
          {c.nirf > 0 && <span className="px-2.5 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-600">NIRF 2025 {nirfBand(c.nirf)}</span>}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{c.name}</h1>
        <p className="text-gray-500 text-sm mb-3">{c.district}, {c.state} · {c.affiliation} · Established {c.year} · Code: {c.code}</p>
        {/* Google Reviews + Share */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(c.name + " " + c.district + " reviews")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-sm font-semibold text-gray-700 hover:text-[#1a5276]"
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
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {([
          ["B.Tech Fee", btechFeeLabel, c.type === "Deemed University" || c.type === "Private University" ? `University fee${UNIVERSITY_FEE_AY[c.code] ? ` · AY ${UNIVERSITY_FEE_AY[c.code]}` : ""}` : c.state === "Telangana" ? "GO.Ms.06 · 2025-28" : "APHERMC · 2023-26", "text-[#1a5276]"],
          ...(c.type !== "Deemed University" ? [["CSE Cutoff", c.cutoff.cse?.toLocaleString() || "—", "EAPCET final OC", "text-gray-900"]] : [["Admission", "Own Exam", "Not via EAPCET", "text-gray-900"]]),
          ["Avg Package", c.placements.avg > 0 ? `₹${c.placements.avg} LPA` : "—", "Placements", "text-green-600"],
          ["Highest Pkg", c.placements.highest > 0 ? `₹${c.placements.highest}L` : "—", "Top offer", "text-amber-600"],
          ...(c.nirf > 0
            ? [["NIRF 2025", nirfBand(c.nirf), "Engineering", "text-rose-600"]]
            : [["Companies", c.placements.companies > 0 ? `${c.placements.companies}+` : "—", "Recruiting", "text-[#2e86c1]"]]),
        ] as [string, string, string, string][]).map(([label, value, sub, color], idx, arr) => (
          <div key={label} className={`bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center ${idx === arr.length - 1 && arr.length % 2 === 1 ? "col-span-2 sm:col-span-1" : ""}`}>
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className={`text-lg sm:text-2xl font-extrabold ${color} truncate`}>{value}</div>
            <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

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
                {c.name} ({c.code}) is {c.type === "Government" ? "a government" : c.type === "Deemed University" ? "a deemed" : c.type === "Private University" ? "a private" : "a private"} engineering {c.type.includes("University") ? "university" : "college"} located in {c.district}, {c.state}, India{c.year > 0 ? `, established in ${c.year}` : ""}.{" "}
                {!c.type.includes("University") && `It is affiliated to ${c.affiliation} and `}
                {c.naac && c.naac !== "-" ? `holds NAAC Grade ${c.naac} accreditation${c.nba ? " with NBA-accredited programmes" : ""}. ` : c.nba ? "has NBA-accredited programmes. " : ""}
                {c.nirf > 0 ? `The institution is ranked in the ${nirfBand(c.nirf)} band under the NIRF 2025 Engineering category. ` : ""}
                {c.name} offers B.Tech programmes in {c.branches.length} {c.branches.length === 1 ? "branch" : "branches"} including {c.branches.slice(0, 5).join(", ")}{c.branches.length > 5 ? `, and ${c.branches.length - 5} more` : ""}.
              </p>
              <p>
                {c.fee > 0 ? `The annual tuition fee for B.Tech is ${fmtFee(c.fee)}${c.type === "Government" ? ", making it one of the most affordable options in " + c.state : c.goFee > 0 && c.goFee !== c.fee ? ` (government order fee: ${fmtFee(c.goFee)})` : ""}. Over four years, the total tuition cost comes to approximately ${fmtFee(btechTotalFee)}. ` : ""}
                {c.placements.avg > 0 ? `In recent placements, ${c.name.split(" ")[0]} reported an average package of ₹${c.placements.avg} LPA${c.placements.highest > 0 ? ` with the highest offer reaching ₹${c.placements.highest} LPA` : ""}${c.placements.companies > 0 ? `, attracting ${c.placements.companies}+ recruiting companies` : ""}. ` : ""}
                {"" /* ROI sentence removed */}
                {c.cutoff.cse > 0 ? `For ${c.state === "Telangana" ? "TS" : "AP"} EAPCET admissions, the CSE branch had a closing rank of ${c.cutoff.cse.toLocaleString("en-IN")} in the most recent counselling cycle.` : ""}
              </p>
            </div>
          </section>

          {/* Branches */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Branches Offered</h2>
            <div className="flex gap-2 flex-wrap">
              {c.branches.map(b => (
                <span key={b} className="bg-blue-50 text-[#1a5276] px-3 py-1.5 rounded-lg text-sm font-semibold">{b}</span>
              ))}
            </div>
          </section>

          {/* Ad: Detail sidebar/inline */}
          <AdSlot slot="detail_sidebar" slug={c.slug} state={c.state === "Andhra Pradesh" ? "AP" : "TS"} />

          {/* Similar Colleges */}
          {similar.length > 0 && (
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Similar Colleges</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {similar.map(s => (
                  <Link key={s.id} href={`/colleges/${s.slug}`} className="rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
                    <div className="font-bold text-sm mb-1">{s.name}</div>
                    <div className="text-xs text-gray-400 mb-2">{s.district} · {s.type}</div>
                    <div className="flex justify-between text-xs">
                      <span>Fee: {fmtFee(s.fee)}</span>
                      {s.cutoff.cse > 0 && <span className="font-semibold">Rank {s.cutoff.cse.toLocaleString()}</span>}
                    </div>
                  </Link>
                ))}
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
              {isDeemedOrPrivateUni && UNIVERSITY_FEE_AY[c.code] && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#1a5276] text-xs font-bold">
                  AY {UNIVERSITY_FEE_AY[c.code]}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              {isDeemedOrPrivateUni
                ? `Annual tuition fee as declared by the university${UNIVERSITY_FEE_AY[c.code] ? ` for AY ${UNIVERSITY_FEE_AY[c.code]}` : ""} — not regulated by state fee fixation committee`
                : isGovt
                ? "Government college — nominal tuition fee as per state norms"
                : "Annual tuition fee as per official government order"}
            </p>

            {/* Block Period Banner — only for affiliated private/govt colleges */}
            {!isDeemedOrPrivateUni && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#1a5276] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1a5276]">
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
                          ? hasConvenerQuota ? "bg-green-600 text-white shadow-sm" : "bg-[#1a5276] text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab1Label}
                    </button>
                    <button
                      onClick={() => setFeeTab(1)}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                        feeTab === 1
                          ? "bg-[#1a5276] text-white shadow-sm"
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
                      <div className="text-xs text-gray-400 mt-0.5">{c.state === "Telangana" ? "TAFRC regulated · State counseling" : `${quotaPct} of seats · G.O.Ms.No.19 (2024-27)`}</div>
                      <div className="text-2xl font-extrabold text-green-700 mt-2">{fmtFee(c.goFee)}<span className="text-xs font-normal text-gray-400">/yr (all B.Tech branches)</span></div>
                      <div className="mt-3 text-xs text-green-700">
                        {c.state === "Andhra Pradesh"
                          ? `${isBrownfield ? "Brownfield university — 70% of original seats" : "Greenfield university — 35% of seats"} filled through AP EAPCET at APHERMC-regulated fees per G.O.Ms.No.19 (block period 2024-27).`
                          : "Convener quota seats filled through TS EAMCET state counseling at TAFRC-regulated fees."}
                      </div>
                    </div>
                  )}
                  {hasConvenerQuota && feeTab === 1 && (
                    <div className="bg-blue-50 rounded-lg px-5 py-4">
                      <div className="text-sm text-[#1a5276] font-semibold">Direct Admission (University Quota)</div>
                      <div className="text-xs text-gray-400 mt-0.5">{c.state === "Andhra Pradesh" ? `${isBrownfield ? "30%" : "65%"} of seats · ` : ""}University entrance · Fee set by university{UNIVERSITY_FEE_AY[c.code] ? ` · AY ${UNIVERSITY_FEE_AY[c.code]}` : ""}</div>
                      <div className="text-2xl font-extrabold text-[#1a5276] mt-2">{fmtFee(c.fee)}<span className="text-xs font-normal text-gray-400">/yr (CSE — varies by branch)</span></div>
                    </div>
                  )}
                  {hasDualCategory && feeTab === 0 && (
                    <div className="bg-blue-50 rounded-lg px-5 py-4">
                      <div className="text-sm text-[#1a5276] font-semibold">Category-B (Direct Admission)</div>
                      <div className="text-xs text-gray-400 mt-0.5">For students admitted without entrance exam (60%+ in intermediate){UNIVERSITY_FEE_AY[c.code] ? ` · AY ${UNIVERSITY_FEE_AY[c.code]}` : ""}</div>
                      <div className="text-2xl font-extrabold text-[#1a5276] mt-2">{fmtFee(c.fee)}<span className="text-xs font-normal text-gray-400">/yr (CSE — varies by branch)</span></div>
                    </div>
                  )}
                  {hasDualCategory && feeTab === 1 && (
                    <div className="bg-green-50 rounded-lg px-5 py-4">
                      <div className="text-sm text-green-700 font-semibold">Category-A (With Entrance Exam)</div>
                      <div className="text-xs text-gray-400 mt-0.5">For students admitted through V-SAT / EAMCET / JEE{UNIVERSITY_FEE_AY[c.code] ? ` · AY ${UNIVERSITY_FEE_AY[c.code]}` : ""}</div>
                      <div className="text-2xl font-extrabold text-green-700 mt-2">
                        {courses && courses.find(co => co.mgmtFee && co.mgmtFee < co.fee) ? fmtFee(courses.find(co => co.mgmtFee && co.mgmtFee < co.fee)!.mgmtFee!) : "—"}
                        <span className="text-xs font-normal text-gray-400">/yr (CSE — varies by branch)</span>
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
                        {isDeemedOrPrivateUni ? "B.Tech Annual Tuition" : isGovt ? "B.Tech Annual Tuition" : "B.Tech Convener Quota (Category-A)"}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {isDeemedOrPrivateUni
                          ? `${c.type} · Fee set by university${UNIVERSITY_FEE_AY[c.code] ? ` · AY ${UNIVERSITY_FEE_AY[c.code]}` : ""}`
                          : isGovt
                          ? "Government college — nominal fee per state norms"
                          : "70% of seats · Government-regulated fee"}
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-[#1a5276]">{fmtFee(c.fee)}<span className="text-xs font-normal text-gray-400">/yr</span></div>
                  </div>

                  {/* Source note */}
                  {isDeemedOrPrivateUni && (
                    <div className="mt-3 bg-amber-50 rounded-lg px-4 py-2.5 text-xs text-amber-700">
                      {`${c.type} fees are set by the institution${UNIVERSITY_FEE_AY[c.code] ? ` (sourced from official website for AY ${UNIVERSITY_FEE_AY[c.code]})` : ""}. Contact admissions for exact, up-to-date fee details.`}
                    </div>
                  )}
                  {!isDeemedOrPrivateUni && !isGovt && (
                    <div className="mt-3 bg-amber-50 rounded-lg px-4 py-2.5 text-xs text-amber-700">
                      For management quota (Category-B, ~30% seats) fees, contact the college directly — these are approved per college by {c.state === "Telangana" ? "TS AFRC" : "APHERMC"}.
                    </div>
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
            const feeColor = (hasConvenerQuota && feeTab === 0) || (hasDualCategory && feeTab === 1) ? "text-green-700" : "text-[#1a5276]";
            const headerBg = (hasConvenerQuota && feeTab === 0) || (hasDualCategory && feeTab === 1) ? "bg-green-700" : "bg-[#1a5276]";
            const feeLabel = hasConvenerQuota
              ? (feeTab === 0 ? "Convener Fee" : "Direct Admission Fee")
              : hasDualCategory
              ? (feeTab === 0 ? "Cat-B (Direct)" : "Cat-A (Entrance)")
              : "Annual Fee";

            return grouped.map(group => (
            <section key={group.level} className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-1">{group.label}</h2>
              {hasConvenerQuota && feeTab === 0 && group.level === "UG" && (
                <p className="text-xs text-gray-400 mb-3">B.Tech branches have a <span className="font-semibold text-green-700">uniform convener fee of {fmtCourseFee(c.goFee)}/yr</span> through {c.state === "Telangana" ? "TS EAMCET" : "AP EAPCET"} counseling. Switch to &ldquo;Direct Admission&rdquo; tab for branch-wise university fees.</p>
              )}
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${headerBg} text-white`}>
                      <th className="px-4 py-2.5 text-left rounded-tl-lg">Program</th>
                      <th className="px-4 py-2.5 text-right">{feeLabel}</th>
                      <th className="px-4 py-2.5 text-right hidden sm:table-cell">Duration</th>
                      <th className="px-4 py-2.5 text-right rounded-tr-lg">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((co, i) => (
                      <tr key={`${co.program}-${co.specialization || ""}-${i}`} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{co.program}</div>
                          {co.specialization && <div className="text-xs text-gray-400 mt-0.5">{co.specialization}</div>}
                          <div className="text-xs text-gray-400 mt-0.5 sm:hidden">{co.duration} {co.duration === 1 ? "yr" : "yrs"}</div>
                        </td>
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
              <p className="text-xs text-gray-400 mb-3">{isDeemedOrPrivateUni || isGovt ? "Based on current tuition fee" : "Based on convener quota fee"}</p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50 rounded-xl p-4 sm:p-5 text-center">
                  <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Tuition (4 yrs)</div>
                  <div className="text-lg sm:text-2xl font-extrabold text-[#1a5276]">{fmtFee(c.fee * 4)}</div>
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
              <p className="text-[11px] text-gray-400 mt-3">Excludes hostel, transport, exam fees, and miscellaneous charges.</p>
            </section>
          )}

          {/* Fee disclaimer */}
          <div className="bg-amber-50 rounded-xl px-5 py-3 text-xs text-amber-700">
            {isDeemedOrPrivateUni
              ? `Fees shown are approximate annual tuition for AY ${UNIVERSITY_FEE_AY[c.code] || "2025-26"}. Actual fees may vary by admission category, scholarship, or merit slab. Hostel, exam, and miscellaneous charges are extra. Contact the university admissions office for exact figures.`
              : "Fees are from official government orders for the current block period. Hostel, transport, exam fees, and miscellaneous charges are extra. Actual costs may vary."}
          </div>

          {/* Ad: Below fees */}
          <AdSlot slot="detail_below_fees" slug={c.slug} state={c.state === "Andhra Pradesh" ? "AP" : "TS"} />
        </div>
        );
      })()}

      {tab === "scholarships" && scholarshipInfo && (
        <div className="space-y-6">
          {/* Scholarship tables grouped by exam */}
          {(() => {
            // Group tables by examName
            const grouped = new Map<string, typeof scholarshipInfo.tables>();
            scholarshipInfo.tables.forEach(t => {
              const key = t.examName;
              if (!grouped.has(key)) grouped.set(key, []);
              grouped.get(key)!.push(t);
            });

            return [...grouped.entries()].map(([examName, tables]) => (
              <section key={examName} className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-1">{examName}</h2>
                <p className="text-xs text-gray-400 mb-4">Merit-based tuition fee waiver</p>

                {tables.map((table, ti) => (
                  <div key={ti} className={ti > 0 ? "mt-5" : ""}>
                    {table.branchGroup && (
                      <div className="mb-2">
                        <span className="text-xs font-bold text-[#1a5276] bg-blue-50 px-2.5 py-1 rounded-lg">{table.branchGroup}</span>
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#1a5276] text-white">
                            <th className="px-4 py-2.5 text-left rounded-tl-lg">Fee Concession</th>
                            <th className="px-4 py-2.5 text-left rounded-tr-lg">Eligibility Criteria</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.slabs.map((slab, si) => {
                            // Determine badge color based on content
                            const p = slab.percent;
                            const isNoDiscount = p.includes("No concession") || p.includes("no concession") || p.includes("Regular");
                            const isFull = p.startsWith("100%");
                            const isHigh = /^(7[05]|8[0]|~80|~75)%/.test(p);
                            const isMid = /^(5[0]|6[0]|~60|~50)%/.test(p);
                            const isModerate = /^(3[0]|4[0]|~30|~40)%/.test(p);
                            const isLow = /^(1[0-9]|2[0-5]|~2[0-5]|~1[0-9])%/.test(p);
                            const badgeColor = isNoDiscount
                              ? "bg-gray-100 text-gray-500"
                              : isFull ? "bg-green-100 text-green-800"
                              : isHigh ? "bg-emerald-50 text-emerald-700"
                              : isMid ? "bg-blue-50 text-blue-700"
                              : isModerate ? "bg-violet-50 text-violet-700"
                              : isLow ? "bg-amber-50 text-amber-700"
                              : p.includes("Pay") ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-700";

                            return (
                              <tr key={si} className={si % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-4 py-3">
                                  <span className={`inline-block px-2.5 py-1.5 rounded-lg text-xs font-bold leading-tight ${badgeColor}`}>{p}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-700 text-sm">{slab.criteria}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </section>
            ));
          })()}

          {/* Continuation Requirements */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-3">Continuation Requirements</h2>
            <div className="bg-amber-50 rounded-lg px-5 py-4">
              <p className="text-sm text-amber-800 font-semibold">{scholarshipInfo.maintenance}</p>
            </div>
          </section>

          {/* Additional Notes */}
          {scholarshipInfo.notes && scholarshipInfo.notes.length > 0 && (
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-3">Important Notes</h2>
              <div className="space-y-2">
                {scholarshipInfo.notes.map((note, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-[#2e86c1] mt-0.5 shrink-0">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Source Attribution */}
          <div className="bg-blue-50 rounded-xl px-5 py-3 flex items-center justify-between">
            <div className="text-xs text-blue-700">
              <span className="font-semibold">Data source:</span> {scholarshipInfo.sourceLabel}
            </div>
            <a href={scholarshipInfo.source} target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold text-[#2e86c1] hover:underline shrink-0 ml-3">
              Verify on official site →
            </a>
          </div>
        </div>
      )}

      {tab === "cutoffs" && (() => {
        const isDeemedUni = c.type === "Deemed University";
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
          const key = catKey(category, gender);
          return brData[key] || (gender === "girls" ? 0 : brData[category] || 0);
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
        if (hasCurrentCutoffs) yearCols.push({ label: "2024-25", key: "current" });
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
          const key = catKey(category, gender);
          return brData[key] || (gender === "girls" ? 0 : brData[category] || 0);
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
        const selectedCatLabel = CATEGORIES.find(ct => ct.key === category)?.label || category;

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
                    <p className="text-xs text-gray-400">
                      See how cutoffs relax across counselling phases ({selectedCatLabel}, {gender === "girls" ? "Girls" : "Boys"})
                    </p>
                  </div>
                  <div className="flex items-end gap-2">
                    <div>
                      <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Gender</label>
                      <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg h-[38px]">
                        <button onClick={() => setGender("boys")}
                          className={`px-3 rounded-md text-xs font-semibold transition-all ${gender === "boys" ? "bg-white text-[#1a5276] shadow-sm" : "text-gray-500"}`}>
                          Boys
                        </button>
                        <button onClick={() => setGender("girls")}
                          className={`px-3 rounded-md text-xs font-semibold transition-all ${gender === "girls" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500"}`}>
                          Girls
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value as Category)}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold">
                        {CATEGORIES.map(ct => (
                          <option key={ct.key} value={ct.key}>{ct.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1a5276] text-white">
                        <th className="px-3 py-2.5 text-left rounded-tl-lg">Branch</th>
                        {phases!.map((p, i) => (
                          <th key={p.key} className={`px-3 py-2.5 text-right whitespace-nowrap ${i === phases!.length - 1 ? "rounded-tr-lg" : ""}`}>
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
                            <td className="px-3 py-2.5 font-semibold text-sm sm:whitespace-nowrap break-words">{branchLabel(branch)}</td>
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
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-2">↓ = cutoff relaxed from previous phase (higher rank = easier to get in). Source: TSCHE official Last Rank Statement PDFs</p>
                </div>
              </section>
            )}

            {/* Year-wise comparison (original view) */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold mb-1">{hasPhases ? "Year-wise Final Phase Cutoffs" : "EAPCET Cutoff Ranks — Branch-wise"}</h2>
                  <p className="text-xs text-gray-400">
                    Closing ranks ({selectedCatLabel}, {gender === "girls" ? "Girls" : "Boys"}). {hasHistorical ? `${yearCols.length} year${yearCols.length > 1 ? "s" : ""} of official ${c.state === "Telangana" ? "TSCHE" : "APSCHE"} data.` : "Based on latest counselling data."}
                  </p>
                </div>
                {hasHistorical && !hasPhases && (
                  <div className="flex items-end gap-2">
                    <div>
                      <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Gender</label>
                      <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg h-[38px]">
                        <button onClick={() => setGender("boys")}
                          className={`px-3 rounded-md text-xs font-semibold transition-all ${gender === "boys" ? "bg-white text-[#1a5276] shadow-sm" : "text-gray-500"}`}>
                          Boys
                        </button>
                        <button onClick={() => setGender("girls")}
                          className={`px-3 rounded-md text-xs font-semibold transition-all ${gender === "girls" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500"}`}>
                          Girls
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Category / Caste</label>
                      <select value={category} onChange={e => setCategory(e.target.value as Category)}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold">
                        {CATEGORIES.map(ct => (
                          <option key={ct.key} value={ct.key}>{ct.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              {!noCutoffData ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1a5276] text-white">
                        <th className="px-4 py-2.5 text-left rounded-tl-lg">Branch</th>
                        {yearCols.map((y, i) => (
                          <th key={y.key} className={`px-4 py-2.5 text-right ${i === yearCols.length - 1 ? "rounded-tr-lg" : ""}`}>{y.label}</th>
                        ))}
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
                            <td className="px-4 py-2.5 font-semibold text-sm break-words">{branchLabel(branch)}</td>
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-2">↑ = getting harder · ↓ = getting easier · Source: APSCHE official last rank details PDFs</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="font-semibold">Cutoff data not available</p>
                  <p className="text-xs mt-1">This college may not participate in EAPCET counselling or data has not been published</p>
                </div>
              )}
            </section>
            </div>{/* end cutoffTableRef */}
          </div>
        );
      })()}

      {tab === "placements" && (() => {
        const pd = getPlacementData(c.code);
        const latestYear = pd?.years[0] ?? null;
        return (
        <div className="space-y-6">
          {/* ── Placement Highlights (always shown) ── */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-1">Placement Highlights</h2>
            <p className="text-xs text-gray-400 mb-4">{c.placements.avg > 0 ? "Based on NIRF 2025 submission data (median salary, AY 2023-24)" : "Placement data not available — college did not participate in NIRF or data not published"}</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-3 sm:p-5 text-center">
                <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Average Package</div>
                <div className="text-lg sm:text-2xl font-extrabold text-green-700">{c.placements.avg > 0 ? `₹${c.placements.avg} LPA` : "—"}</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 sm:p-5 text-center">
                <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Highest Package</div>
                <div className="text-lg sm:text-2xl font-extrabold text-amber-700">{c.placements.highest > 0 ? `₹${c.placements.highest} LPA` : "—"}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 sm:p-5 text-center">
                <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Recruiting Companies</div>
                <div className="text-lg sm:text-2xl font-extrabold text-[#2e86c1]">{c.placements.companies > 0 ? `${c.placements.companies}+` : "—"}</div>
              </div>
            </div>

            {/* ROI section removed */}
          </section>

          {/* ── Branch-wise Placement Data (only if detailed data exists) ── */}
          {latestYear && Object.keys(latestYear.branches).length > 0 && (
            <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-1">Branch-wise Placement Data</h2>
              <p className="text-xs text-gray-400 mb-4">Detailed placements by department · {latestYear.year}</p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-sm min-w-[280px] sm:min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="py-2 px-3 text-gray-500 font-medium text-xs sticky left-0 bg-white">Branch</th>
                      <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">Intake</th>
                      <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">Placed</th>
                      <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">%</th>
                      <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">Avg Pkg</th>
                      {Object.values(latestYear.branches).some(b => b.maxPackage) && (
                        <th className="py-2 px-3 text-gray-500 font-medium text-xs text-right">Max Pkg</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(latestYear.branches)
                      .sort((a, b) => b[1].avgPackage - a[1].avgPackage)
                      .map(([branch, data]) => {
                        const pct = data.intake > 0 && data.placed > 0 ? Math.round((data.placed / data.intake) * 100) : 0;
                        return (
                          <tr key={branch} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-3 font-semibold sticky left-0 bg-white break-words">{branchDisplayName(branch)}</td>
                            <td className="py-2.5 px-3 text-right text-gray-600">{data.intake || "—"}</td>
                            <td className="py-2.5 px-3 text-right font-semibold">{data.placed || "—"}</td>
                            <td className="py-2.5 px-3 text-right">
                              {pct > 0 ? (
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${pct >= 80 ? "bg-green-100 text-green-700" : pct >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                                  {pct}%
                                </span>
                              ) : "—"}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-green-700">₹{data.avgPackage}L</td>
                            {Object.values(latestYear.branches).some(b => b.maxPackage) && (
                              <td className="py-2.5 px-3 text-right font-bold text-amber-600">{data.maxPackage ? `₹${data.maxPackage}L` : "—"}</td>
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              {pd?.sourceUrl && (
                <p className="text-[11px] sm:text-xs text-gray-400 mt-3">Source: <a href={pd.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2e86c1]">AICTE Mandatory Disclosure</a></p>
              )}
            </section>
          )}

          {/* ── Top Recruiters ── */}
          {latestYear?.topRecruiters && latestYear.topRecruiters.length > 0 && (
            <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-1">Top Recruiters</h2>
              <p className="text-xs text-gray-400 mb-4">Companies that recruited from this college · {latestYear.year}</p>
              <div className="grid gap-2">
                {latestYear.topRecruiters
                  .sort((a, b) => b.offers - a.offers)
                  .slice(0, 15)
                  .map((r, i) => (
                    <div key={r.name} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="w-6 h-6 rounded-full bg-[#1a5276] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="font-semibold text-sm flex-1 min-w-0 truncate">{r.name}</span>
                      <span className="text-xs text-gray-500 shrink-0">{r.offers} offers</span>
                      <span className="text-xs font-bold text-green-700 shrink-0 w-16 text-right">₹{r.avgPackage}L</span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* ── Year-over-Year Trends (if multiple years available) ── */}
          {pd && pd.years.length > 1 && (
            <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-1">Placement Trends</h2>
              <p className="text-xs text-gray-400 mb-4">Year-over-year placement performance</p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-sm min-w-[280px] sm:min-w-[400px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="py-2 px-3 text-gray-500 font-medium text-xs">Year</th>
                      {Object.keys(pd.years[0].branches).map(br => (
                        <th key={br} className="py-2 px-3 text-gray-500 font-medium text-xs text-center" colSpan={2}>{br}</th>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="py-1 px-3"></th>
                      {Object.keys(pd.years[0].branches).map(br => (
                        <>{/* eslint-disable-next-line react/jsx-key */}
                          <th key={`${br}-p`} className="py-1 px-2 text-[11px] sm:text-xs text-gray-400 font-medium text-right">Placed</th>
                          <th key={`${br}-a`} className="py-1 px-2 text-[11px] sm:text-xs text-gray-400 font-medium text-right">Avg ₹</th>
                        </>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pd.years.map(yr => (
                      <tr key={yr.year} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-semibold text-[#1a5276]">{yr.year}</td>
                        {Object.keys(pd.years[0].branches).map(br => {
                          const d = yr.branches[br];
                          return (
                            <>{/* eslint-disable-next-line react/jsx-key */}
                              <td key={`${yr.year}-${br}-p`} className="py-2.5 px-2 text-right text-gray-700">{d?.placed || "—"}</td>
                              <td key={`${yr.year}-${br}-a`} className="py-2.5 px-2 text-right font-bold text-green-700">{d ? `${d.avgPackage}L` : "—"}</td>
                            </>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Data source note ── */}
          <section className="bg-blue-50 rounded-xl p-4 sm:p-5">
            <div className="flex gap-3 items-start">
              <svg className="w-5 h-5 text-[#2e86c1] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              <div>
                <p className="text-sm font-semibold text-[#1a5276] mb-1">About this data</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {pd
                    ? "This placement data is sourced from the college's AICTE Mandatory Disclosure document. All AICTE-approved colleges are required to publish this data annually. Figures represent actual placements reported by the institution."
                    : "Overall placement data is based on NIRF 2025 submissions. Detailed branch-wise data from AICTE Mandatory Disclosures will be added as it becomes available. If you represent this college, you can submit detailed data through our College Admin portal."}
                </p>
              </div>
            </div>
          </section>
        </div>
        );
      })()}

      {/* ─── Admission Tab ─── */}
      {tab === "admission" && admissionExam && (
        <div className="space-y-6">
          {/* Exam Overview */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold">{admissionExam.examName} — {admissionExam.examFullName}</h2>
                <p className="text-sm text-gray-500 mt-1">Entrance exam for {c.name}</p>
              </div>
              <a href={admissionExam.officialUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a5276] text-white text-xs font-semibold hover:bg-[#154360] transition-colors shrink-0">
                Official Website
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                ["Exam Mode", admissionExam.mode],
                ["Duration", admissionExam.duration],
                ["Application Fee", admissionExam.applicationFee],
                ["Subjects", admissionExam.subjects],
                ["Eligibility", admissionExam.eligibility],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Exam Schedule */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">2026 Exam Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Phase</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Exam Dates</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Last Date to Apply</th>
                    {admissionExam.phases.some(p => p.resultDate) && (
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Result</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {admissionExam.phases.map((phase, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-3 px-3 font-semibold">{phase.phase}</td>
                      <td className="py-3 px-3 text-[#1a5276] font-semibold">{phase.examDates}</td>
                      <td className="py-3 px-3">{phase.lastDateToApply}</td>
                      {admissionExam.phases.some(p => p.resultDate) && (
                        <td className="py-3 px-3">{phase.resultDate || "—"}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Additional Info */}
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
            {admissionExam.alternateEntry && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-1">Alternative Entry</h3>
                <p className="text-sm text-gray-600 bg-green-50 rounded-lg px-4 py-2.5">{admissionExam.alternateEntry}</p>
              </div>
            )}
            {admissionExam.counsellingNote && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-1">Counselling Process</h3>
                <p className="text-sm text-gray-600 bg-blue-50 rounded-lg px-4 py-2.5">{admissionExam.counsellingNote}</p>
              </div>
            )}
            <p className="text-xs text-gray-400">Dates and details are sourced from official notifications and may change. Always verify on the official website before applying.</p>
          </section>
        </div>
      )}

      {tab === "reviews" && (() => {
        const reviews = getReviewsByCollege(c.code);
        const { avg, count } = getAverageRating(c.code);

        return (
          <div className="space-y-6">
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-1">Student Reviews</h2>
              <p className="text-xs text-gray-400 mb-4">Verified reviews from students and alumni of {c.name}</p>

              {count > 0 ? (
                <>
                  {/* Rating Summary */}
                  <div className="bg-gray-50 rounded-xl p-5 mb-6 flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-extrabold text-[#1a5276]">{avg}</div>
                      <div className="text-amber-500 text-lg mt-0.5">{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</div>
                      <div className="text-xs text-gray-400 mt-1">{count} review{count !== 1 ? "s" : ""}</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map(star => {
                        const starCount = reviews.filter(r => r.rating === star).length;
                        const pct = count > 0 ? (starCount / count) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs mb-1">
                            <span className="w-3 text-right text-gray-500">{star}</span>
                            <span className="text-amber-500 text-[11px] sm:text-xs">★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-6 text-gray-400 text-right">{starCount}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="border border-gray-100 rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-sm">{review.author}</div>
                            <div className="text-xs text-gray-400">{review.branch ? `${review.branch} · ` : ""}Class of {review.year}</div>
                          </div>
                          <div className="text-amber-500 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.body}</p>
                        {review.pros.length > 0 && (
                          <div className="mb-2">
                            <span className="text-[11px] sm:text-xs font-bold text-green-600 uppercase tracking-wide">Pros</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {review.pros.map((p, i) => <span key={i} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">{p}</span>)}
                            </div>
                          </div>
                        )}
                        {review.cons.length > 0 && (
                          <div>
                            <span className="text-[11px] sm:text-xs font-bold text-red-500 uppercase tracking-wide">Cons</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {review.cons.map((p, i) => <span key={i} className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs">{p}</span>)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="font-bold text-gray-700 text-lg mb-2">No Reviews Yet</p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Be the first to share your experience at {c.name}. Your review helps thousands of students make better decisions.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-5 max-w-sm mx-auto text-left">
                    <p className="text-sm font-semibold text-[#1a5276] mb-2">How to submit a review:</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Email your review to <span className="font-semibold text-[#2e86c1]">reviews@telugucolleges.com</span> with your college name, branch, graduation year, and your honest experience. We verify and publish all genuine reviews.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        );
      })()}

      {/* Ad: Bottom of detail page */}
      <div className="mt-8">
        <AdSlot slot="detail_bottom" slug={c.slug} state={c.state === "Andhra Pradesh" ? "AP" : "TS"} />
      </div>

      {/* ─── FAQ Section ─── */}
      {faqs && faqs.length > 0 && (
        <section className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
          <FAQAccordion faqs={faqs} />
          <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-400">Information is based on official data and may change. Please verify with the college directly.</p>
        </section>
      )}
    </main>
  );
}
