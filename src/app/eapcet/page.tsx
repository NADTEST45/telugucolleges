"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { COLLEGES, fmtFee, College } from "@/lib/colleges";
import { AP_CUTOFFS, AP_CUTOFF_YEARS, CATEGORIES, catKey, type Category, type Gender } from "@/lib/ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "@/lib/ts-cutoffs";
import { getHistoricalCutoff, getTSPhaseHistoricalCutoff, PREDICTOR_PHASES, type PredictorPhase } from "@/lib/cutoff-utils";
import ShortlistButton from "@/components/ShortlistButton";
import LeadCapture from "@/components/LeadCapture";
import { EapcetStructuredData, PREDICTOR_FAQS } from "./structured-data";

export default function EAPCETPage() {
  const [rank, setRank] = useState("");
  const [state, setState] = useState<"Telangana" | "Andhra Pradesh">("Telangana");
  const [branch, setBranch] = useState("cse");
  const [category, setCategory] = useState<Category>("OC");
  const [gender, setGender] = useState<Gender>("boys");
  const [phase, setPhase] = useState<PredictorPhase>("final");
  // Phase-wise data exists only for TGEAPCET (TSCHE publishes phase-wise PDFs; APSCHE doesn't)
  const effectivePhase: PredictorPhase = state === "Telangana" ? phase : "final";

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

  /* Predictor — uses category + gender specific historical data for AP & TS.
     For TS, a specific counselling phase (Phase 1/2/Special) can be selected;
     phase-specific lookups never fall back to other data — accuracy over coverage. */
  const usePhaseData = effectivePhase !== "final";
  const lookupCutoff = useCallback((code: string, collegeState: string) =>
    collegeState === "Telangana"
      ? getTSPhaseHistoricalCutoff(code, branch, category, gender, effectivePhase)
      : getHistoricalCutoff(code, branch, category, gender, collegeState),
  [branch, category, gender, effectivePhase]);

  const predictions = useMemo(() => {
    const r = parseInt(debouncedRank);
    if (!r || r <= 0) return [];
    return COLLEGES
      .filter(c => {
        if (state && c.state !== state) return false;
        const hist = lookupCutoff(c.code, c.state);
        if (hist.avg > 0) return r <= hist.avg * 1.3;
        if (usePhaseData) return false; // no fallback when a specific phase is chosen
        const cutoff = c.cutoff[branch];
        return cutoff && cutoff > 0 && r <= cutoff * 1.3;
      })
      .map(c => {
        let cutoff = 0;
        let isHistorical = false;
        let dataYears: string[] = [];
        const hist = lookupCutoff(c.code, c.state);
        if (hist.avg > 0) { cutoff = hist.avg; isHistorical = true; dataYears = hist.dataYears; }
        if (!isHistorical) cutoff = c.cutoff[branch] || 0;

        const ratio = r / cutoff;
        let chance: "Safe" | "Moderate" | "Reach" = "Safe";
        if (ratio > 1) chance = "Reach";
        else if (ratio > 0.7) chance = "Moderate";
        return { college: c, cutoff, chance, isHistorical, dataYears };
      })
      .sort((a, b) => a.cutoff - b.cutoff);
  }, [debouncedRank, state, branch, usePhaseData, lookupCutoff]);

  const catLabel = CATEGORIES.find(c => c.key === category)?.label || category;

  /* ── Shareable predictor state (URL <-> controls) ──
     Lets a parent send their child a single link that reproduces the exact
     prediction (rank + filters). Validated against the same whitelists the
     selects use, so a junk param silently falls back to the default rather
     than producing a wrong result. */
  const [copied, setCopied] = useState(false);
  const hydratedFromUrl = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const rk = p.get("rank");
    if (rk && /^\d+$/.test(rk)) { setRank(rk); setDebouncedRank(rk); }
    const st = p.get("st");
    if (st === "ap") setState("Andhra Pradesh");
    else if (st === "ts") setState("Telangana");
    const br = p.get("br");
    if (br && allBranches.includes(br)) setBranch(br);
    const ct = p.get("cat");
    if (ct && CATEGORIES.some(c => c.key === ct)) setCategory(ct as Category);
    const g = p.get("g");
    if (g === "girls" || g === "boys") setGender(g);
    const ph = p.get("ph");
    if (ph && PREDICTOR_PHASES.some(x => x.key === ph)) setPhase(ph as PredictorPhase);
    hydratedFromUrl.current = true;
    // Run once on mount; whitelists referenced are stable for the page's life.
  }, []);

  useEffect(() => {
    if (!hydratedFromUrl.current) return; // don't clobber an incoming link before we read it
    const p = new URLSearchParams();
    if (rank && parseInt(rank) > 0) p.set("rank", String(parseInt(rank)));
    p.set("st", state === "Telangana" ? "ts" : "ap");
    p.set("br", branch);
    p.set("cat", category);
    p.set("g", gender);
    if (state === "Telangana" && phase !== "final") p.set("ph", phase);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    setCopied(false);
  }, [rank, state, branch, category, gender, phase]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked — no-op */ }
  };
  const handleWhatsApp = () => {
    const r = parseInt(rank);
    const text = `My EAPCET 2026 college options (rank ${r > 0 ? r.toLocaleString("en-IN") : "—"}, ${branchLabels[branch] || branch.toUpperCase()}, ${catLabel}): ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  // ── EAPCET 2026 Key Dates ─────────────────────────────────────────────────
  // Update ONLY this object when dates change — the UI renders from it automatically.
  const EAPCET_DATES = {
    ap: {
      label: "AP EAPCET 2026",
      applyUrl: "https://cets.apsche.ap.gov.in",
      rows: [
        { label: "Registration",       date: "Feb 4 — Mar 24",     highlight: false },
        { label: "Last late-fee date", date: "Apr 10",             highlight: false },
        { label: "Admit card download",date: "Apr 28",             highlight: false },
        { label: "Engineering Exam",   date: "May 12–15, 18 ✓",    highlight: true  },
        { label: "Agri / Pharmacy",    date: "May 19–20",          highlight: true  },
        { label: "Results (Expected)", date: "June 18–21, 2026 (postponed)", highlight: true },
        { label: "Counselling Reg.",   date: "Early July 2026 (expected)",   highlight: false },
        { label: "Counselling Rounds", date: "Jul–Aug 2026 (3 rds + spot)", highlight: false },
      ],
    },
    tg: {
      label: "TG EAPCET 2026",
      applyUrl: "https://eapcet.tgche.ac.in",
      rows: [
        { label: "Registration",       date: "Feb 19 — Apr 4",     highlight: false },
        { label: "Last late-fee date", date: "May 2",              highlight: false },
        { label: "Agri / Pharmacy",    date: "May 4–5 ✓",          highlight: false },
        { label: "Engineering Exam",   date: "May 9–11 ✓",         highlight: true  },
        { label: "Results",            date: "Declared May 17, 2026", highlight: true  },
        { label: "Counselling Reg.",   date: "June 19–28, 2026",   highlight: true  },
        { label: "Cert. Verification", date: "June 22–29, 2026",   highlight: false },
        { label: "Web Options",        date: "June 25 — July 1",   highlight: false },
        { label: "Counselling Rounds", date: "Jul–Aug 2026 (3 phases + sliding/spot)", highlight: false },
      ],
    },
  } as const;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">EAPCET</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">TS & AP EAPCET 2026</h1>
      <p className="text-sm text-gray-500 mb-4">Engineering, Agriculture & Pharmacy Common Entrance Test — your gateway to B.Tech admissions in Telangana & Andhra Pradesh</p>

      {/* State Toggle */}
      <div className="flex gap-2 mb-6 sm:mb-8">
        <button onClick={() => setState("Telangana")}
          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 ${state === "Telangana" ? "bg-accent text-white" : "bg-blue-50 text-accent hover:bg-blue-100"}`}>
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
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-accent text-white">TS</span>
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
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-[11px] text-blue-200/50">
          * Dates based on official notifications as of June 10, 2026. TG EAPCET results declared May 17, 2026; TG counselling registration June 19–28. AP EAPCET results postponed — expected June 18–21, 2026. Check APSCHE / TGCHE websites for latest updates.
        </div>
      </section>

      {/* 2026 season guides */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3">EAPCET 2026 — Results & Counselling Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/eapcet/ap-results-2026" className="block rounded-lg border border-gray-200 p-3 hover:border-accent hover:shadow-sm transition-all">
            <div className="font-semibold text-sm mb-0.5">AP EAPCET Results 2026 — Live Updates</div>
            <p className="text-xs text-gray-600 leading-relaxed">Why results are postponed, the new expected date (June 18–21), and rank card download steps.</p>
          </Link>
          <Link href="/eapcet/ap-cutoff-2026" className="block rounded-lg border border-gray-200 p-3 hover:border-accent hover:shadow-sm transition-all">
            <div className="font-semibold text-sm mb-0.5">AP EAPCET 2026 Cutoff — Branch-wise</div>
            <p className="text-xs text-gray-600 leading-relaxed">Expected college-wise closing ranks for CSE, ECE, EEE, Civil, Mech, IT &amp; AI branches.</p>
          </Link>
          <Link href="/eapcet/tg-cutoff-2026" className="block rounded-lg border border-gray-200 p-3 hover:border-accent hover:shadow-sm transition-all">
            <div className="font-semibold text-sm mb-0.5">TG EAPCET 2026 Cutoff — Branch-wise</div>
            <p className="text-xs text-gray-600 leading-relaxed">College-wise closing ranks from official TSCHE 2024-25 &amp; 2023-24 last-rank data, plus Phase-1 reference.</p>
          </Link>
          <Link href="/eapcet/ts-counselling-dates-2026" className="block rounded-lg border border-gray-200 p-3 hover:border-accent hover:shadow-sm transition-all">
            <div className="font-semibold text-sm mb-0.5">TS Counselling Dates 2026</div>
            <p className="text-xs text-gray-600 leading-relaxed">Full TGCHE phase-wise schedule — Phase 1 registration June 19–28, allotment by July 10.</p>
          </Link>
          <Link href="/eapcet/ap-web-options" className="block rounded-lg border border-gray-200 p-3 hover:border-accent hover:shadow-sm transition-all">
            <div className="font-semibold text-sm mb-0.5">AP Web Options Entry — Step-by-Step</div>
            <p className="text-xs text-gray-600 leading-relaxed">The exact entry process and the priority-order strategy that decides your seat.</p>
          </Link>
          <Link href="/eapcet/certificate-verification-documents" className="block rounded-lg border border-gray-200 p-3 hover:border-accent hover:shadow-sm transition-all">
            <div className="font-semibold text-sm mb-0.5">Certificate Verification Documents</div>
            <p className="text-xs text-gray-600 leading-relaxed">Complete checklist for AP & TS — including income certificate validity rules.</p>
          </Link>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">About EAPCET</h2>
        <div className="gap-6">
          {(state === "Telangana") && (
            <div>
              <h3 className="font-semibold text-sm text-accent mb-3">TS EAPCET (Telangana)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Conducted by JNTU Hyderabad on behalf of TGCHE. Required for B.E./B.Tech admissions into all engineering colleges in Telangana through convener quota counselling.</p>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <div>Convener Quota: 70% of seats filled via TGCHE web counselling</div>
                <div>Fee regulation: TS AFRC (block period system, currently 2025-28)</div>
                <div>Conducting body: JNTUH for TGCHE</div>
              </div>
              <div className="mt-3 text-xs text-gray-500">Official website: eapcet.tgche.ac.in</div>
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
              <div className="mt-3 text-xs text-gray-500">Official website: cets.apsche.ap.gov.in</div>
            </div>
          )}
        </div>
        <div className="mt-4 bg-blue-50 rounded-lg px-4 py-2.5 text-xs text-blue-700">
          Check the official TGCHE / APSCHE websites for confirmed dates, notifications, and registration links.
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
              <div className="text-[11px] sm:text-xs text-gray-500 mb-1">{label}</div>
              <div className="text-lg sm:text-xl font-extrabold text-gray-900">{value}</div>
              <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-500 mt-3">Mathematics: 80 marks, Physics: 40 marks, Chemistry: 40 marks. Based on Intermediate (11th & 12th) syllabus.</p>
      </section>

      {/* College Predictor */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-1">College Predictor</h2>
        <p className="text-[11px] sm:text-xs text-gray-500 mb-4 sm:mb-5">Weighted prediction using official TSCHE closing ranks (2023-24 & 2024-25) and APSCHE closing ranks (2022-23 & 2023-24) — 70% latest year, 30% previous year. Category & gender-wise. For Telangana, you can also predict by counselling phase (Phase 1 / Phase 2 / Special) — the only calculator with official first-phase data.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div>
            <label className="text-[11px] text-gray-500 font-semibold mb-1 block">Your EAPCET Rank</label>
            <input type="number" value={rank} onChange={e => handleRankChange(e.target.value)}
              placeholder="e.g. 15000" className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 font-semibold" />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 font-semibold mb-1 block">Category / Caste</label>
            <select value={category} onChange={e => setCategory(e.target.value as Category)}
              className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold">
              {CATEGORIES.map(ct => (
                <option key={ct.key} value={ct.key}>{ct.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 font-semibold mb-1 block">Gender</label>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg h-[42px]">
              <button onClick={() => setGender("boys")}
                className={`flex-1 rounded-md text-xs font-semibold transition-all ${gender === "boys" ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                Boys
              </button>
              <button onClick={() => setGender("girls")}
                className={`flex-1 rounded-md text-xs font-semibold transition-all ${gender === "girls" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                Girls
              </button>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 font-semibold mb-1 block">Branch</label>
            <select value={branch} onChange={e => setBranch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer uppercase">
              {allBranches.map(b => <option key={b} value={b}>{branchLabels[b] || b.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 font-semibold mb-1 block">State</label>
            <select value={state} onChange={e => setState(e.target.value as typeof state)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer">
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
            </select>
          </div>
          {state === "Telangana" && (
            <div>
              <label className="text-[11px] text-gray-500 font-semibold mb-1 block">Counselling Phase</label>
              <select value={phase} onChange={e => setPhase(e.target.value as PredictorPhase)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold">
                {PREDICTOR_PHASES.map(p => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {usePhaseData && (
          <div className="bg-blue-50 rounded-lg px-4 py-2 text-[11px] text-blue-700 mb-4">
            {phase === "phase1" && (
              <>Phase-1 cutoffs are the <strong>tightest</strong> of the season — later phases relax as seats free up. TG EAPCET 2026 Phase-1 allotment is due by <strong>July 10</strong>. Data: official TSCHE Phase-1 Last Rank Statements (2023 &amp; 2022).</>
            )}
            {phase === "phase2" && (
              <>Phase-2 cutoffs typically relax vs Phase 1 as candidates slide or exit. Data: official TSCHE Phase-2 Last Rank Statement (2023).</>
            )}
            {phase === "special" && (
              <>Special-phase cutoffs are the most relaxed — leftover seats after regular phases. Data: official TSCHE Special-Phase Last Rank Statement (2023).</>
            )}
            {" "}Colleges without official data for this phase are excluded — no estimates.
          </div>
        )}

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
              <div className="text-[11px] text-gray-500">{catLabel} · {gender === "girls" ? "Girls" : "Boys"} · {branch.toUpperCase()}{usePhaseData ? ` · ${PREDICTOR_PHASES.find(p => p.key === phase)?.label}` : ""}</div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] text-gray-400 font-medium">Share these results:</span>
              <button onClick={handleWhatsApp}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors active:scale-95">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.59 5.39l-.999 3.648 3.908-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                WhatsApp
              </button>
              <button onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors active:scale-95">
                {copied ? "Link copied ✓" : "Copy link"}
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto -mx-1 px-1">
              {predictions.map(({ college: col, cutoff, chance, isHistorical, dataYears }) => {
                // When there's no category/gender-specific history, the value
                // is the static OC closing rank (TSCHE 2024 / APSCHE 2023).
                // Flag that clearly so an SC/Girls selection never reads as if
                // it were category-specific data.
                const ocMismatch = !isHistorical && (category !== "OC" || gender === "girls");
                const ocVintage = col.state === "Telangana" ? "TSCHE 2024" : "APSCHE 2023";
                return (
                <div key={col.id}
                  className="relative flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                  {/* Stretched link makes the whole card navigate while keeping
                      the heart button (relative z-10) independently clickable. */}
                  <Link href={`/colleges/${col.slug}`} aria-label={`View ${col.name}`}
                    className="absolute inset-0 z-[1] rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm leading-tight">{col.name}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">
                      {col.district}, {col.state} · {fmtFee(col.fee)}/yr
                      {isHistorical && (
                        <span className="ml-1.5 text-blue-500">· {catLabel.split(" ")[0]} weighted ({dataYears.join(", ")})</span>
                      )}
                      {!isHistorical && (
                        <span className={`ml-1.5 ${ocMismatch ? "text-amber-600" : "text-gray-400"}`}>
                          · OC reference{ocMismatch ? ` — no ${catLabel.split(" ")[0]}${gender === "girls" ? "/Girls" : ""} data` : ""} ({ocVintage})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-[11px] text-gray-500">{isHistorical ? `${catLabel.split(" ")[0]} Cutoff` : "OC Cutoff"}</div>
                      <div className="font-bold text-xs sm:text-sm">{cutoff.toLocaleString()}</div>
                    </div>
                    <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold ${
                      chance === "Safe" ? "bg-green-100 text-green-700" :
                      chance === "Moderate" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-600"
                    }`}>{chance}</span>
                    <ShortlistButton collegeSlug={col.slug} program={branchLabels[branch] || branch.toUpperCase()} className="relative z-10" />
                  </div>
                </div>
                );
              })}
            </div>
            <div className="mt-4 bg-amber-50 rounded-lg px-4 py-2.5 text-[11px] text-amber-700">
              Data from official APSCHE &amp; TSCHE &quot;Last Rank Details&quot; PDFs. {gender === "girls" ? "Girls-specific data available for select colleges." : ""} Actual cutoffs vary year to year.
            </div>
            <LeadCapture rank={parseInt(rank)} examState={state} branch={branch} category={category} />
          </div>
        )}

        {rank && predictions.length === 0 && parseInt(rank) > 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p className="font-semibold">No colleges found for this rank</p>
            <p className="text-xs mt-1">
              {usePhaseData
                ? "Phase-specific data covers fewer college-branch combinations. Try Final Phase, or a different branch or category."
                : "Try a different branch, category, or remove the state filter"}
            </p>
          </div>
        )}
      </section>

      {/* Browse-by-rank hub — links to /eapcet/rank/[slug] static pages.
          Crawlable internal links so Googlebot can discover the per-band
          landing surfaces from the predictor without relying on sitemap-
          only discovery. Built statically from a small constant so this
          stays SSR-friendly even though the parent page is "use client". */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-1">Browse colleges by rank</h2>
        <p className="text-xs text-gray-500 mb-4">
          Pre-built lists for popular EAPCET rank bands — useful before you have your final score.
        </p>
        {(["telangana", "andhra-pradesh"] as const).map(stateSlug => {
          const stateLabel = stateSlug === "telangana" ? "Telangana (TG EAPCET)" : "Andhra Pradesh (AP EAPCET)";
          const bands = [5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000];
          return (
            <div key={stateSlug} className="mb-3 last:mb-0">
              <div className="text-xs font-semibold text-gray-600 mb-2">{stateLabel} — CSE</div>
              <div className="flex flex-wrap gap-2">
                {bands.map(r => (
                  <Link
                    key={r}
                    href={`/eapcet/rank/${r}-cse-${stateSlug}`}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-accent transition-colors"
                  >
                    {r.toLocaleString("en-IN")} rank
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        <p className="text-[11px] text-gray-400 mt-3">
          Other branches (ECE, EEE, Mech, Civil) and rank bands available — see any rank-band page for navigation.
        </p>
      </section>

      {/* FAQs — visible content matching the FAQPage JSON-LD emitted by
          EapcetStructuredData below (Google requires schema text to be
          present on the page). */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-1">How the predictor works — FAQs</h2>
        <p className="text-xs text-gray-500 mb-4">
          Data sources, methodology, and what the predictions do (and don&apos;t) guarantee.
        </p>
        <div className="space-y-3">
          {PREDICTOR_FAQS.map(f => (
            <details key={f.q} className="bg-gray-50 rounded-xl border border-gray-200 p-4 group">
              <summary className="font-semibold text-sm cursor-pointer text-gray-900">{f.q}</summary>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <EapcetStructuredData />

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
                  <div className="text-lg sm:text-xl font-extrabold text-brand">{value}</div>
                  <div className="text-[11px] sm:text-xs text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </section>
    </main>
  );
}
