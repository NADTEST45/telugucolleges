"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { COLLEGES, fmtFee, College } from "@/lib/colleges";
import { AP_CUTOFFS, AP_CUTOFF_YEARS, CATEGORIES, catKey, type Category, type Gender } from "@/lib/ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "@/lib/ts-cutoffs";

export default function EAPCETPage() {
  const [rank, setRank] = useState("");
  const [state, setState] = useState<"Telangana" | "Andhra Pradesh">("Telangana");
  const [branch, setBranch] = useState("cse");
  const [category, setCategory] = useState<Category>("OC");
  const [gender, setGender] = useState<Gender>("boys");

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

  /* Historical cutoff lookup — weighted average (70% latest year, 30% older) like CollegeDunia/Eduvale */
  const getHistoricalCutoff = (code: string, br: string, cat: Category, gen: Gender, collegeState?: string): { avg: number; years: number[]; dataYears: string[] } => {
    const cutoffSource = collegeState === "Telangana" ? TS_CUTOFFS[code] : AP_CUTOFFS[code];
    if (!cutoffSource) return { avg: 0, years: [], dataYears: [] };
    const ranks: number[] = [];
    const dataYears: string[] = [];
    const key = catKey(cat, gen);
    const fallbackKey = cat; // boys key as fallback
    const yearsToCheck = collegeState === "Telangana" ? TS_CUTOFF_YEARS : AP_CUTOFF_YEARS;
    // Try both cases: TS data uses UPPERCASE branch codes, AP uses lowercase
    const branchVariants = [br, br.toUpperCase(), br.toLowerCase()];
    for (const year of yearsToCheck) {
      const yearData = cutoffSource[year];
      if (!yearData) continue;
      const matchedBranch = branchVariants.find(v => yearData[v]);
      if (!matchedBranch) continue;
      const val = yearData[matchedBranch][key] || (gen === "girls" ? 0 : yearData[matchedBranch][fallbackKey]);
      if (val && val > 0) { ranks.push(val); dataYears.push(year); }
    }
    if (ranks.length === 0) return { avg: 0, years: [], dataYears: [] };
    // Weighted average: 70% most recent year, 30% older year (like major predictor sites)
    // yearsToCheck is ordered newest-first, so ranks[0] = latest year
    if (ranks.length === 1) return { avg: ranks[0], years: ranks, dataYears };
    const weighted = Math.round(ranks[0] * 0.7 + ranks[1] * 0.3);
    return { avg: weighted, years: ranks, dataYears };
  };

  /* Predictor — uses category + gender specific historical data for AP & TS */
  const predictions = useMemo(() => {
    const r = parseInt(rank);
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
  }, [rank, state, branch, category, gender]);

  const catLabel = CATEGORIES.find(c => c.key === category)?.label || category;

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
      <div className="flex gap-2 mb-8">
        <button onClick={() => setState("Telangana")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${state === "Telangana" ? "bg-[#2e86c1] text-white" : "bg-blue-50 text-[#2e86c1] hover:bg-blue-100"}`}>
          TS EAPCET
        </button>
        <button onClick={() => setState("Andhra Pradesh")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${state === "Andhra Pradesh" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
          AP EAPCET
        </button>
      </div>

      {/* Key Dates at a Glance */}
      <section className="rounded-2xl mb-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f2b46 0%, #1a5276 40%, #2e86c1 100%)" }}>
        <div className="px-6 pt-5 pb-1">
          <h2 className="text-lg sm:text-xl font-bold text-white">EAPCET 2026 — Key Dates at a Glance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6">
          {/* AP EAPCET */}
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-500 text-white">AP</span>
              <span className="text-white font-bold text-sm">AP EAPCET 2026</span>
            </div>
            <div className="space-y-2.5">
              {([
                ["Registration", "Feb 4 — Mar 17", false],
                ["Late fee deadline", "Apr 3", false],
                ["Engineering Exam", "May 12–15, 18", true],
                ["Agri/Pharmacy", "May 19–20", false],
                ["Results (Expected)", "June 2026", false],
                ["Counselling", "July 2026", false],
              ] as [string, string, boolean][]).map(([label, date, highlight]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-blue-100/80">{label}</span>
                  <span className={`text-sm font-semibold ${highlight ? "text-green-400" : "text-white"}`}>{date}</span>
                </div>
              ))}
            </div>
            <a href="https://cets.apsche.ap.gov.in" target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">
              Apply Now <span aria-hidden>→</span>
            </a>
          </div>

          {/* TG EAPCET */}
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#2e86c1] text-white">TS</span>
              <span className="text-white font-bold text-sm">TG EAPCET 2026</span>
            </div>
            <div className="space-y-2.5">
              {([
                ["Registration", "Feb 19 — Apr 4", false],
                ["Late fee deadline", "May 2", false],
                ["Agri/Pharmacy", "May 4–5", false],
                ["Engineering Exam", "May 9–11", true],
                ["Results (Expected)", "June 2026", false],
                ["Counselling", "Jul–Aug 2026", false],
              ] as [string, string, boolean][]).map(([label, date, highlight]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-blue-100/80">{label}</span>
                  <span className={`text-sm font-semibold ${highlight ? "text-emerald-400" : "text-white"}`}>{date}</span>
                </div>
              ))}
            </div>
            <a href="https://eapcet.tsche.ac.in" target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">
              Apply Now <span aria-hidden>→</span>
            </a>
          </div>
        </div>
        <div className="px-6 pb-4 text-[10px] text-blue-200/50">
          * Dates based on official notifications as of March 2026. Check APSCHE / TSCHE websites for latest updates.
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold mb-4">About EAPCET</h2>
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
      <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold mb-4">Exam Pattern (Engineering Stream)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            ["Duration", "3 Hours", "Single session"],
            ["Questions", "160", "MCQs"],
            ["Marks", "160", "No negative marking"],
            ["Subjects", "M / P / C", "80 + 40 + 40"],
          ].map(([label, value, sub]) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-1">{label}</div>
              <div className="text-xl font-extrabold text-gray-900">{value}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-3">Mathematics: 80 marks, Physics: 40 marks, Chemistry: 40 marks. Based on Intermediate (11th & 12th) syllabus.</p>
      </section>

      {/* College Predictor */}
      <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold mb-1">College Predictor</h2>
        <p className="text-xs text-gray-400 mb-5">Weighted prediction using official TSCHE closing ranks (2023-24 & 2024-25) and APSCHE closing ranks (2022-23 & 2023-24) — 70% latest year, 30% previous year. Category & gender-wise.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Your EAPCET Rank</label>
            <input type="number" value={rank} onChange={e => setRank(e.target.value)}
              placeholder="e.g. 15000" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 font-semibold" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Category / Caste</label>
            <select value={category} onChange={e => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold">
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
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {predictions.map(({ college: col, cutoff, chance, isHistorical, dataYears }) => (
                <Link key={col.id} href={`/colleges/${col.slug}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-semibold text-sm">{col.name}</div>
                    <div className="text-xs text-gray-400">
                      {col.district}, {col.state} · {fmtFee(col.fee)}/yr
                      {isHistorical && (
                        <span className="ml-1.5 text-blue-500">· {catLabel.split(" ")[0]} weighted ({dataYears.join(", ")})</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-[10px] text-gray-400">{isHistorical ? `${catLabel.split(" ")[0]} Cutoff` : "Cutoff"}</div>
                      <div className="font-bold">{cutoff.toLocaleString()}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
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
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">At a Glance</h2>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {stats.map(([value, label]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xl font-extrabold text-[#1a5276]">{value}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </section>
    </main>
  );
}
