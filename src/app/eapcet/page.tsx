"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { COLLEGES, fmtFee, College } from "@/lib/colleges";
import { AP_CUTOFFS, AP_CUTOFF_YEARS, CATEGORIES, catKey, type Category, type Gender } from "@/lib/ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "@/lib/ts-cutoffs";
import { getHistoricalCutoff } from "@/lib/cutoff-utils";

export default function EAPCETPage() {
  const [rank, setRank] = useState("");
  const [state, setState] = useState<"Telangana" | "Andhra Pradesh">("Telangana");
  const [branch, setBranch] = useState("cse");
  const [category, setCategory] = useState<Category>("OC");
  const [gender, setGender] = useState<Gender>("boys");

  // Debounced rank for expensive predictor computation (P2)
  const [debouncedRank, setDebouncedRank] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleRankChange = useCallback((value: string) => {
    setRank(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedRank(value), 300);
  }, []);
  useEffect(() => { return () => { if (debounceRef.current) clearTimeout(debounceRef.current); }; }, []);

  /* Canonical branch labels (display name for each branch code) */
  const branchLabels: Record<string, string> = {
    CSE: "CSE", ECE: "ECE", EEE: "EEE", MEC: "Mechanical", CIV: "Civil", INF: "IT",
    CSM: "CSE (AI & ML)", CSD: "CSE (Data Science)", CSO: "CSE (IoT)", CSI: "CSE (Information Security)",
    CSB: "CSE (Blockchain)", CSC: "CSE (Cyber Security)", CSA: "CSE (AI)", CSG: "CSE (Gaming)",
    CSN: "CSE (Networks)", CSW: "CSE (IoT & Cyber Security with Blockchain)",
    AID: "AI & DS", AIM: "AI & ML", AI: "AI",
    BME: "Biomedical", BIO: "Biotechnology", BSE: "Bio Sciences", BTB: "B.Tech + B.Tech (Dual)",
    CHE: "Chemical", CIC: "CIC", CME: "Computer & Comm. Eng",
    ANE: "Automobile", AUT: "Automobile", DRG: "Agricultural", DTD: "Dairy Technology",
    AGR: "Agricultural", FDT: "Food Technology", GEO: "Geo Informatics",
    MET: "Metallurgy", MIN: "Mining", MMS: "Mechatronics", MTE: "Materials Tech",
    MCT: "Mech (Mechatronics)", MMT: "Mining & Mineral Tech",
    TEX: "Textile", PLG: "Plastics", PHE: "Pharma (Pharm-D)", PHS: "Pharma (B.Pharm)",
    PHB: "Pharma (B.Pharm)", PDB: "Pharma (Pharm-D BiPC)",
    ECI: "ECE (IoT)", ECM: "ECE & Comm. Eng", EIE: "Instrumentation",
    ETM: "Electronics & Telematics", EVL: "Environmental",
    CS: "Computer Science",
    // AP lowercase keys
    cse: "CSE", ece: "ECE", eee: "EEE", mech: "Mechanical", civil: "Civil",
    it: "IT", cse_ds: "CSE (Data Science)", cse_aiml: "CSE (AI/ML)", cse_iot: "CSE (IoT)",
    cse_bs: "CSE (Business Systems)", ai_ml: "AI & ML", ai_ds: "AI & DS", ai: "AI",
    cai: "CSE (AI)", cba: "CSE (Blockchain)", ccc: "Cyber Security", cia: "CSE (AI)",
    cic: "CIC", cit: "CSE (IoT)", cos: "Computer Science", cs: "Computer Science",
    csc: "CSE (Cyber Security)", cseb: "CSE (Blockchain)", cser: "CSE (Robotics)",
    csg: "CSE (Gaming)", csn: "CSE (Networks)", css: "CSE (Smart Systems)",
    eca: "ECE (AI)", biotech: "Biotechnology", chemical: "Chemical",
    auto: "Automobile", agr: "Agricultural", mining: "Mining",
    met: "Metallurgy", petroleum: "Petroleum", naval: "Naval Architecture",
    ase: "Aerospace", rbt: "Robotics", pee: "Power Electronics",
    geoinformatics: "Geo Informatics", ist: "IST", mrb: "Mech (Robotics)",
    eie: "Instrumentation", eii: "Instrumentation", evt: "Environmental",
    cad: "CAD/CAM", bme: "Biomedical", bse: "Bio Sciences",
    bpharm: "B.Pharm", drg: "Agricultural", dtd: "Dairy Tech",
    fdt: "Food Tech", inf: "IT", mec: "Mechanical", civ: "Civil",
    min: "Mining", mms: "Mechatronics", mte: "Materials", phb: "B.Pharm",
    pdb: "Pharm-D", plg: "Plastics", tex: "Textile", csm: "CSE (AI & ML)",
    csd: "CSE (Data Science)", cso: "CSE (IoT)", csi: "CSE (InfoSec)",
    che: "Chemical", mbbs: "MBBS",
  };

  /* All branches across all data sources — deduplicated by display label */
  const allBranches = useMemo(() => {
    const set = new Set<string>();
    // From colleges.ts static cutoffs
    COLLEGES.forEach(c => Object.keys(c.cutoff).forEach(b => set.add(b)));
    // From TS cutoff data (UPPERCASE)
    Object.values(TS_CUTOFFS).forEach(college => {
      Object.values(college).forEach(yearData => {
        Object.keys(yearData).forEach(b => set.add(b));
      });
    });
    // From AP cutoff data (lowercase)
    Object.values(AP_CUTOFFS).forEach(college => {
      Object.values(college).forEach(yearData => {
        Object.keys(yearData).forEach(b => set.add(b));
      });
    });
    // Deduplicate: keep one code per display label (prefer lowercase for consistency)
    const labelMap = new Map<string, string>(); // label → first code seen
    const allCodes = [...set].filter(b => b !== "mbbs" && b !== "MBBS");
    // Sort so lowercase comes first (ap data), then uppercase (ts data)
    allCodes.sort((a, b) => a.localeCompare(b));
    for (const code of allCodes) {
      const label = branchLabels[code] || code.toUpperCase();
      if (!labelMap.has(label)) labelMap.set(label, code);
    }
    return [...labelMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, code]) => code);
  }, []);

  /* Predictor — uses category + gender specific historical data for AP & TS */
  const predictions = useMemo(() => {
    const r = parseInt(debouncedRank);
    if (!r || r <= 0) return [];
    return COLLEGES
      .filter(c => {
        if (state && c.state !== state) return false;
        const hist = getHistoricalCutoff(c.code, branch, category, gender, c.state);
        if (hist.avg > 0) return r <= hist.avg * 1.3;
        const cutoff = c.cutoff[branch];
        return cutoff && cutoff > 0 && r <= cutoff * 1.3;
      })
      .map(c => {
        let cutoff = 0;
        let isHistorical = false;
        let dataYears: string[] = [];
        const hist = getHistoricalCutoff(c.code, branch, category, gender, c.state);
        if (hist.avg > 0) { cutoff = hist.avg; isHistorical = true; dataYears = hist.dataYears; }
        if (!isHistorical) cutoff = c.cutoff[branch] || 0;

        const ratio = r / cutoff;
        let chance: "Safe" | "Moderate" | "Reach" = "Safe";
        if (ratio > 1) chance = "Reach";
        else if (ratio > 0.7) chance = "Moderate";
        return { college: c, cutoff, chance, isHistorical, dataYears };
      })
      .sort((a, b) => a.cutoff - b.cutoff);
  }, [debouncedRank, state, branch, category, gender]);

  const catLabel = CATEGORIES.find(c => c.key === category)?.label || category;

  // ── EAPCET 2026 Key Dates ─────────────────────────────────────────────────
  // Update ONLY this object when dates change — the UI renders from it automatically.
  const EAPCET_DATES = {
    ap: {
      label: "AP EAPCET 2026",
      applyUrl: "https://cets.apsche.ap.gov.in",
      rows: [
        { label: "Registration",       date: "Feb 4 — Mar 24",  highlight: false },
        { label: "Last late-fee date",  date: "Apr 10",          highlight: false },
        { label: "Admit card download", date: "Apr 28",          highlight: false },
        { label: "Engineering Exam",    date: "May 12–15, 18",   highlight: true  },
        { label: "Agri / Pharmacy",     date: "May 19–20",       highlight: false },
        { label: "Results",             date: "June 1, 2026",    highlight: false },
        { label: "Counselling",         date: "July 2026",       highlight: false },
      ],
    },
    tg: {
      label: "TG EAPCET 2026",
      applyUrl: "https://eapcet.tgche.ac.in",
      rows: [
        { label: "Registration",        date: "Feb 19 — Apr 4",  highlight: false },
        { label: "Last late-fee date",  date: "May 2",           highlight: false },
        { label: "Agri / Pharmacy",     date: "May 4–5",         highlight: false },
        { label: "Engineering Exam",    date: "May 9–11",        highlight: true  },
        { label: "Results (Expected)",  date: "June 2026",       highlight: false },
        { label: "Counselling",         date: "Jul–Aug 2026",    highlight: false },
      ],
    },
  } as const;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#2e86c1]">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">EAPCET</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">TS & AP EAPCET 2026</h1>
      <p className="text-sm text-gray-500 mb-4">Engineering, Agriculture & Pharmacy Common Entrance Test — your gateway to B.Tech admissions in Telangana & Andhra Pradesh</p>

      {/* State Toggle */}
      <div className="flex gap-2 mb-6 sm:mb-8">
        <button onClick={() => setState("Telangana")}
          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 ${state === "Telangana" ? "bg-[#2e86c1] text-white" : "bg-blue-50 text-[#2e86c1] hover:bg-blue-100"}`}>
          TS EAPCET
        </button>
        <button onClick={() => setState("Andhra Pradesh")}
          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 ${state === "Andhra Pradesh" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
          AP EAPCET
        </button>
      </div>

      {/* Key Dates at a Glance */}
      <section className="rounded-xl sm:rounded-2xl mb-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f2b46 0%, #1a5276 40%, #2e86c1 100%)" }}>
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-1">
          <h2 className="text-base sm:text-xl font-bold text-white">EAPCET 2026 — Key Dates</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-6">
          {/* AP EAPCET */}
          <div className="rounded-xl p-4 sm:p-5" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-500 text-white">AP</span>
              <span className="text-white font-bold text-sm">{EAPCET_DATES.ap.label}</span>
            </div>
            <div className="space-y-2.5">
              {EAPCET_DATES.ap.rows.map(({ label, date, highlight }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-blue-100/80">{label}</span>
                  <span className={`text-sm font-semibold ${highlight ? "text-green-400" : "text-white"}`}>{date}</span>
                </div>
              ))}
            </div>
            <a href={EAPCET_DATES.ap.applyUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">
              Apply Now <span aria-hidden>→</span>
            </a>
          </div>

          {/* TG EAPCET */}
          <div className="rounded-xl p-4 sm:p-5" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#2e86c1] text-white">TS</span>
              <span className="text-white font-bold text-sm">{EAPCET_DATES.tg.label}</span>
            </div>
            <div className="space-y-2.5">
              {EAPCET_DATES.tg.rows.map(({ label, date, highlight }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-blue-100/80">{label}</span>
                  <span className={`text-sm font-semibold ${highlight ? "text-emerald-400" : "text-white"}`}>{date}</span>
                </div>
              ))}
            </div>
            <a href={EAPCET_DATES.tg.applyUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">
              Apply Now <span aria-hidden>→</span>
            </a>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-[10px] text-blue-200/50">
          * Dates based on official notifications as of March 2026. Check APSCHE / TSCHE websites for latest updates.
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">About EAPCET</h2>
        <div className="gap-6">
          {(state === "Telangana") && (
            <div>
              <h3 className="font-semibold text-sm text-[#2e86c1] mb-3">TS EAPCET (Telangana)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Conducted by JNTU Hyderabad on behalf of TSCHE. Required for B.E./B.Tech admissions into all engineering colleges in Telangana through convener quota counselling.</p>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <div>Convener Quota: 70% of seats filled via TSCHE web counselling</div>
                <div>Fee regulation: TS AFRC (block period system, currently 2025-28)</div>
                <div>Conducting body: JNTUH for TSCHE</div>
              </div>
              <div className="mt-3 text-xs text-gray-400">Official website: eapcet.tsche.ac.in</div>
            </div>
          )}
          {(state === "Andhra Pradesh") && (
            <div>
              <h3 className="font-semibold text-sm text-green-600 mb-3">AP EAPCET (Andhra Pradesh)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Conducted by JNTU Kakinada on behalf of APSCHE (the conducting university rotates among JNTUs). Required for B.E./B.Tech admissions into all engineering colleges in Andhra Pradesh through convener quota counselling.</p>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <div>Category-A (Convener Quota): 70% of seats via APSCHE counselling</div>
                <div>Category-B (Management Quota): 30% — fees regulated by APHERMC</div>
                <div>Conducting body: JNTUK (on rotation) for APSCHE</div>
              </div>
              <div className="mt-3 text-xs text-gray-400">Official website: cets.apsche.ap.gov.in</div>
            </div>
          )}
        </div>
        <div className="mt-4 bg-blue-50 rounded-lg px-4 py-2.5 text-xs text-blue-700">
          Check the official TSCHE / APSCHE websites for confirmed dates, notifications, and registration links.
        </div>
      </section>

      {/* Exam Pattern */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Exam Pattern (Engineering Stream)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
          {[
            ["Duration", "3 Hours", "Single session"],
            ["Questions", "160", "MCQs"],
            ["Marks", "160", "No negative marking"],
            ["Subjects", "M / P / C", "80 + 40 + 40"],
          ].map(([label, value, sub]) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 sm:p-4">
              <div className="text-[10px] sm:text-xs text-gray-400 mb-1">{label}</div>
              <div className="text-lg sm:text-xl font-extrabold text-gray-900">{value}</div>
              <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-3">Mathematics: 80 marks, Physics: 40 marks, Chemistry: 40 marks. Based on Intermediate (11th & 12th) syllabus.</p>
      </section>

      {/* College Predictor */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-1">College Predictor</h2>
        <p className="text-[10px] sm:text-xs text-gray-400 mb-4 sm:mb-5">Weighted prediction using official TSCHE closing ranks (2023-24 & 2024-25) and APSCHE closing ranks (2022-23 & 2023-24) — 70% latest year, 30% previous year. Category & gender-wise.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Your EAPCET Rank</label>
            <input type="number" value={rank} onChange={e => handleRankChange(e.target.value)}
              placeholder="e.g. 15000" className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 font-semibold" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Category / Caste</label>
            <select value={category} onChange={e => setCategory(e.target.value as Category)}
              className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold">
              {CATEGORIES.map(ct => (
                <option key={ct.key} value={ct.key}>{ct.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Gender</label>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg h-[42px]">
              <button onClick={() => setGender("boys")}
                className={`flex-1 rounded-md text-xs font-semibold transition-all ${gender === "boys" ? "bg-white text-[#1a5276] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                Boys
              </button>
              <button onClick={() => setGender("girls")}
                className={`flex-1 rounded-md text-xs font-semibold transition-all ${gender === "girls" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                Girls
              </button>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Branch</label>
            <select value={branch} onChange={e => setBranch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer uppercase">
              {allBranches.map(b => <option key={b} value={b}>{branchLabels[b] || b.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">State</label>
            <select value={state} onChange={e => setState(e.target.value as typeof state)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer">
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
            </select>
          </div>
        </div>

        {gender === "girls" && (
          <div className="bg-pink-50 rounded-lg px-4 py-2 text-[11px] text-pink-700 mb-4">
            Girls cutoff data is available for select AP colleges (2024-25). For colleges without girls-specific data, results use Boys cutoffs as reference. Girls cutoffs are typically similar or slightly higher.
          </div>
        )}

        {rank && predictions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">
                {predictions.length} college{predictions.length !== 1 ? "s" : ""} for rank {parseInt(rank).toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-400">{catLabel} · {gender === "girls" ? "Girls" : "Boys"} · {branch.toUpperCase()}</div>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto -mx-1 px-1">
              {predictions.map(({ college: col, cutoff, chance, isHistorical, dataYears }) => (
                <Link key={col.id} href={`/colleges/${col.slug}`}
                  className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all active:scale-[0.99]">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm leading-tight">{col.name}</div>
                    <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">
                      {col.district}, {col.state} · {fmtFee(col.fee)}/yr
                      {isHistorical && (
                        <span className="ml-1.5 text-blue-500">· {catLabel.split(" ")[0]} weighted ({dataYears.join(", ")})</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-[10px] text-gray-400">{isHistorical ? `${catLabel.split(" ")[0]} Cutoff` : "Cutoff"}</div>
                      <div className="font-bold text-xs sm:text-sm">{cutoff.toLocaleString()}</div>
                    </div>
                    <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold ${
                      chance === "Safe" ? "bg-green-100 text-green-700" :
                      chance === "Moderate" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-600"
                    }`}>{chance}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 rounded-lg px-4 py-2.5 text-[11px] text-amber-700">
              Data from official APSCHE &amp; TSCHE &quot;Last Rank Details&quot; PDFs. {gender === "girls" ? "Girls-specific data available for select colleges." : ""} Actual cutoffs vary year to year.
            </div>
          </div>
        )}

        {rank && predictions.length === 0 && parseInt(rank) > 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🎯</div>
            <p className="font-semibold">No colleges found for this rank</p>
            <p className="text-xs mt-1">Try a different branch, category, or remove the state filter</p>
          </div>
        )}
      </section>

      {/* Quick Stats */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">At a Glance</h2>
        {(() => {
          const subset = COLLEGES.filter(c => c.state === state);
          const feesAboveZero = subset.filter(c => c.fee > 0);
          const stats = [
            [String(subset.length), `${state === "Telangana" ? "TS" : "AP"} Colleges`],
            [feesAboveZero.length > 0 ? fmtFee(Math.min(...feesAboveZero.map(c => c.fee))) : "—", "Lowest Fee"],
            [feesAboveZero.length > 0 ? fmtFee(Math.max(...feesAboveZero.map(c => c.fee))) : "—", "Highest Fee"],
            [String(subset.filter(c => c.nirf > 0).length), "NIRF Ranked"],
          ];
          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
              {stats.map(([value, label]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="text-lg sm:text-xl font-extrabold text-[#1a5276]">{value}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </section>
    </main>
  );
}
