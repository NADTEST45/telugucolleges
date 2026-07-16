"use client";
/**
 * Interactive /eapcet hub UI. Predictions come from /api/predict (server),
 * which owns the cutoff tables AND the canonical safe/moderate/reach
 * thresholds (predictor-core.ts) — this file must never import the AP/TS
 * cutoff tables or COLLEGES (see the bundle rule in CLAUDE.md). Branch list
 * and headline stats are computed server-side in page.tsx and passed down.
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { fmtFee } from "@/lib/format";
import { CATEGORIES, TS_CATEGORIES, type Category, type Gender } from "@/lib/categories";
import { PREDICTOR_PHASES, type PredictorPhase, type PredictApiRow } from "@/lib/predictor-core";
import { branchLabel, canonicalIdForCode } from "@/lib/branch-taxonomy";
import ShortlistButton from "@/components/ShortlistButton";
import LeadCapture from "@/components/LeadCapture";
import CounsellingToolkit from "@/components/CounsellingToolkit";
import { EapcetStructuredData, PREDICTOR_FAQS } from "./structured-data";
import { readStatePref, writeStatePref } from "@/lib/state-pref";
import { AP_EAPCET_2026_RESULT, apResultDateCell } from "@/lib/ap-result-status";
import { TG_COUNSELLING_NOW, AP_COUNSELLING_NOW, COUNSELLING_STATUS_AS_OF } from "@/lib/counselling-status";

/* Canonical branch id -> /eapcet/web-options-generator branch slug, for the
   "build web options" hand-off. Only the branches the generator supports are
   mapped; anything else omits the param and the generator's sensible default
   (CSE-family spread) kicks in. */
const WEB_OPTIONS_BRANCH: Record<string, string> = {
  cse: "cse", ece: "ece", eee: "eee", mech: "mech", civil: "civil", it: "it",
  cse_aiml: "csm", cse_ds: "csd", ai_ds: "aid", cse_cys: "csc",
};

/* Tap-to-open explanations for the Safe/Moderate/Reach bands. Mirrors the
   canonical thresholds documented in predictor-core.ts — keep in sync. Shown
   in a bottom sheet because title-attribute tooltips are invisible on touch,
   and most visitors are on phones. */
const BAND_INFO: Record<"Safe" | "Moderate" | "Reach", { title: string; body: string }> = {
  Safe: {
    title: "Safe — well inside last close",
    body: "Your rank is comfortably inside this college's reference closing rank (at or better than 80% of it). Allotment should hold even if the cutoff tightens this year. Counselling guides recommend listing a few of these last, as backstops.",
  },
  Moderate: {
    title: "Moderate — near the close",
    body: "Your rank is at or just inside the reference closing rank (within 105% of it). Competitive, but closing ranks usually drift outward across phases, which works in your favour.",
  },
  Reach: {
    title: "Reach — beyond last close",
    body: "Your rank is up to 35% beyond the reference closing rank. Realistic mainly in later counselling phases or a softer year — the ambitious tier. List these first; the allotment engine picks your highest feasible option.",
  },
};

/** How many result rows render before the "Show all" expander. Keeps the page
 *  a single scroll on mobile instead of a nested scroll region. */
const INITIAL_ROWS = 15;

export interface EapcetStateStats {
  colleges: number;
  lowestFee: string;
  highestFee: string;
  nirfRanked: number;
}

interface EapcetClientProps {
  /** Canonical branches that have cutoff data in ≥1 source (server-computed). */
  branches: { id: string; label: string }[];
  /** Headline "At a Glance" stats per state (server-computed). */
  stats: Record<"Telangana" | "Andhra Pradesh", EapcetStateStats>;
}

export default function EapcetClient({ branches: allBranches, stats }: EapcetClientProps) {
  const [rank, setRank] = useState("");
  const [state, setState] = useState<"Telangana" | "Andhra Pradesh">("Telangana");
  const [branch, setBranch] = useState("cse");
  const [category, setCategory] = useState<Category>("OC");
  const [gender, setGender] = useState<Gender>("boys");
  const [phase, setPhase] = useState<PredictorPhase>("final");
  // Phase-wise data exists only for TGEAPCET (TSCHE publishes phase-wise PDFs; APSCHE doesn't)
  const effectivePhase: PredictorPhase = state === "Telangana" ? phase : "final";

  // Debounced rank for the predictor API call (P2)
  const [debouncedRank, setDebouncedRank] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userTypedRef = useRef(false);
  const handleRankChange = useCallback((value: string) => {
    userTypedRef.current = true; // real interaction — enables auto-scroll to results
    setRank(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedRank(value), 300);
  }, []);
  useEffect(() => { return () => { if (debounceRef.current) clearTimeout(debounceRef.current); }; }, []);

  const branchIds = useMemo(() => allBranches.map(b => b.id), [allBranches]);
  const usePhaseData = effectivePhase !== "final";

  /* Predictor — fetched from /api/predict, which resolves category + gender
     specific historical data for AP & TS server-side and classifies with the
     canonical thresholds. CDN-cached by query string, aborted on re-type. */
  const [predictions, setPredictions] = useState<PredictApiRow[]>([]);
  const [predicting, setPredicting] = useState(false);
  // Expand-collapse for the result list (no nested scroll region on mobile).
  const [showAll, setShowAll] = useState(false);
  // Touch-friendly explainer sheet (band meanings, ~% chance disclaimer).
  const [infoSheet, setInfoSheet] = useState<{ title: string; body: string } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const autoScrolledRef = useRef(false);
  // Collapse back to the short list whenever the inputs change.
  useEffect(() => { setShowAll(false); }, [debouncedRank, state, branch, category, gender, phase]);
  // On the FIRST typed prediction, bring the results into view — on 390px
  // screens the 3-step form pushes them below the fold. Once only; never on
  // URL-hydrated loads (no typing happened).
  useEffect(() => {
    if (predictions.length > 0 && userTypedRef.current && !autoScrolledRef.current && resultsRef.current) {
      autoScrolledRef.current = true;
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [predictions]);
  useEffect(() => {
    const r = parseInt(debouncedRank);
    if (!r || r <= 0) { setPredictions([]); setPredicting(false); return; }
    const ctrl = new AbortController();
    const p = new URLSearchParams({
      rank: String(r),
      st: state === "Telangana" ? "ts" : "ap",
      br: branch,
      cat: category,
      g: gender,
    });
    if (state === "Telangana" && phase !== "final") p.set("ph", phase);
    setPredicting(true);
    fetch(`/api/predict?${p.toString()}`, { signal: ctrl.signal })
      .then(res => (res.ok ? res.json() : { results: [] }))
      .then((d: { results?: PredictApiRow[] }) => {
        setPredictions(d.results ?? []);
        setPredicting(false);
      })
      .catch((err: unknown) => {
        if ((err as Error)?.name !== "AbortError") {
          setPredictions([]);
          setPredicting(false);
        }
      });
    return () => ctrl.abort();
  }, [debouncedRank, state, branch, category, gender, phase]);

  const predictorCatList = state === "Telangana" ? TS_CATEGORIES : CATEGORIES;
  const catLabel = predictorCatList.find(c => c.key === category)?.label || category;

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
    // State priority: explicit URL param (shared link) wins; otherwise fall
    // back to the saved cookie preference so a returning AP user lands on AP.
    const st = p.get("st");
    if (st === "ap") setState("Andhra Pradesh");
    else if (st === "ts") setState("Telangana");
    else {
      const pref = readStatePref();
      if (pref) setState(pref);
    }
    const br = p.get("br");
    if (br) {
      // Accept a canonical id, or map a legacy raw code (e.g. "CSM", "cse_aiml") to it.
      const id = canonicalIdForCode(br);
      if (id && branchIds.includes(id)) setBranch(id);
    }
    const ct = p.get("cat");
    if (ct && (CATEGORIES.some(c => c.key === ct) || TS_CATEGORIES.some(c => c.key === ct))) setCategory(ct as Category);
    const g = p.get("g");
    if (g === "girls" || g === "boys") setGender(g);
    const ph = p.get("ph");
    if (ph && PREDICTOR_PHASES.some(x => x.key === ph)) setPhase(ph as PredictorPhase);
    hydratedFromUrl.current = true;
    // Run once on mount; whitelists referenced are stable for the page's life.
    // (If eslint-plugin-react-hooks is added later, re-add its
    // exhaustive-deps disable comment here.)
  }, []);

  useEffect(() => {
    if (!hydratedFromUrl.current) return; // don't clobber an incoming link before we read it
    // Remember the chosen state section-wide (read back on the next visit and,
    // later, by other /eapcet pages).
    writeStatePref(state);
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
    const text = `My EAPCET 2026 college options (rank ${r > 0 ? r.toLocaleString("en-IN") : "—"}, ${branchLabel(branch)}, ${catLabel}): ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  /* Hand-off to the web-options generator, carrying the student's inputs so
     they don't re-enter them. Branch maps to the generator's slug where
     supported; otherwise the generator's default branch spread applies. */
  const webOptionsHref = useMemo(() => {
    const p = new URLSearchParams();
    const r = parseInt(rank);
    if (r > 0) p.set("rank", String(r));
    p.set("state", state === "Telangana" ? "telangana" : "andhra-pradesh");
    p.set("cat", category);
    p.set("gender", gender);
    const slug = WEB_OPTIONS_BRANCH[branch];
    if (slug) p.append("branch", slug);
    return `/eapcet/web-options-generator?${p.toString()}`;
  }, [rank, state, category, gender, branch]);

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
        { label: AP_EAPCET_2026_RESULT.declared ? "Results" : "Results (Expected)", date: apResultDateCell(), highlight: true },
        { label: "Counselling Reg.",   date: "Jul 20–29, 2026",    highlight: true  },
        { label: "Cert. Verification", date: "Jul 22–31, 2026",    highlight: false },
        { label: "Web Options",        date: "Jul 25–31, 2026",    highlight: false },
        { label: "Seat Allotment",     date: "Aug 6, 2026",        highlight: false },
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
        { label: "Web Options",        date: "June 25 — July 1 ✓", highlight: false },
        { label: "Counselling Rounds", date: "Jul–Aug 2026 (3 phases + sliding/spot)", highlight: false },
      ],
    },
  } as const;

  const now = state === "Telangana" ? TG_COUNSELLING_NOW : AP_COUNSELLING_NOW;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">EAPCET</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">EAPCET 2026 College Predictor — TS &amp; AP</h1>
      <p className="text-sm text-gray-500 mb-4">Check which B.Tech colleges you can get with your rank, build your web-options list, and track counselling — Telangana &amp; Andhra Pradesh.</p>

      {/* State Toggle — the ONE place you pick your exam; everything below follows it */}
      <div className="mb-5 sm:mb-6">
        <div className="text-xs font-semibold text-gray-500 mb-1.5">Which exam did you write?</div>
        <div className="flex gap-2">
          <button onClick={() => setState("Telangana")} aria-pressed={state === "Telangana"}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${state === "Telangana" ? "bg-accent text-white shadow-md" : "bg-blue-50 text-accent hover:bg-blue-100"}`}>
            TG EAPCET
            <span className={`block text-[10px] font-medium ${state === "Telangana" ? "text-blue-100" : "text-accent/70"}`}>Telangana</span>
          </button>
          <button onClick={() => setState("Andhra Pradesh")} aria-pressed={state === "Andhra Pradesh"}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${state === "Andhra Pradesh" ? "bg-green-600 text-white shadow-md" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
            AP EAPCET
            <span className={`block text-[10px] font-medium ${state === "Andhra Pradesh" ? "text-green-100" : "text-green-700/70"}`}>Andhra Pradesh</span>
          </button>
        </div>
      </div>

      {/* Happening now — season status for the selected state (single source:
          counselling-status.ts). Kept above the predictor so the page answers
          "what should I do today?" before anything else. */}
      <section aria-live="polite" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
            Happening now · {state === "Telangana" ? "TS" : "AP"} · {now.stage}
          </span>
          <a href="#dates" className="ml-auto text-[11px] font-semibold text-amber-700 hover:underline">Full schedule ↓</a>
        </div>
        <p className="mt-1.5 text-sm sm:text-[15px] font-bold text-gray-900">{now.headline}</p>
        <p className="mt-1 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {now.next}{" "}
          <span className="whitespace-nowrap">
            Official portal:{" "}
            <a href={now.portalUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">{now.portalLabel}</a>
          </span>
        </p>
        <p className="mt-1.5 text-[10px] text-amber-700/60">Status as of {COUNSELLING_STATUS_AS_OF}.</p>
      </section>

      {/* College Predictor — the page's main tool, now first */}
      <section id="predictor" className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 scroll-mt-20">
        <h2 className="text-base sm:text-lg font-bold mb-1">College Predictor</h2>
        <p className="text-[11px] sm:text-xs text-gray-500 mb-4 sm:mb-5">Built on official TSCHE/APSCHE closing ranks (weighted, latest 2 years), category &amp; gender-wise. For Telangana you can also predict by counselling phase.</p>

        <div className="space-y-4 sm:space-y-5 mb-4">
          {/* Step 1 — rank */}
          <div>
            <label htmlFor="eapcet-rank" className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-[11px] font-bold" aria-hidden>1</span>
              Enter your {state === "Telangana" ? "TG EAPCET" : "AP EAPCET"} rank
            </label>
            <input id="eapcet-rank" type="number" inputMode="numeric" min={1} value={rank}
              onChange={e => handleRankChange(e.target.value)} placeholder="e.g. 15000"
              className="w-full sm:max-w-xs px-4 h-14 rounded-xl border-2 border-gray-200 text-xl font-bold tabular-nums outline-none focus:border-accent focus:ring-4 focus:ring-blue-100" />
            <p className="text-[11px] text-gray-400 mt-1">The rank on your rank card — results update as you type.</p>
          </div>

          {/* Steps 2 & 3 — details & preference */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-[11px] font-bold" aria-hidden>2</span>
                Your category &amp; gender
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label htmlFor="predictor-category" className="text-[11px] text-gray-500 font-semibold mb-1 block">Category / Caste</label>
                  <select id="predictor-category" value={category} onChange={e => setCategory(e.target.value as Category)}
                    className="w-full px-3 sm:px-4 h-11 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold bg-white">
                    {predictorCatList.map(ct => (
                      <option key={ct.key} value={ct.key}>{ct.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 font-semibold mb-1 block">Gender</span>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg h-11">
                    <button onClick={() => setGender("boys")} aria-pressed={gender === "boys"}
                      className={`flex-1 rounded-md text-xs font-semibold transition-all ${gender === "boys" ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                      Boys
                    </button>
                    <button onClick={() => setGender("girls")} aria-pressed={gender === "girls"}
                      className={`flex-1 rounded-md text-xs font-semibold transition-all ${gender === "girls" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                      Girls
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-[11px] font-bold" aria-hidden>3</span>
                Branch to check
              </div>
              <div className={`grid gap-2 sm:gap-3 ${state === "Telangana" ? "grid-cols-2" : "grid-cols-1"}`}>
                <div>
                  <label htmlFor="predictor-branch" className="text-[11px] text-gray-500 font-semibold mb-1 block">Branch</label>
                  <select id="predictor-branch" value={branch} onChange={e => setBranch(e.target.value)}
                    className="w-full px-3 sm:px-4 h-11 rounded-lg border border-gray-200 text-sm cursor-pointer uppercase bg-white">
                    {allBranches.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                  </select>
                </div>
                {state === "Telangana" && (
                  <div>
                    <label htmlFor="predictor-phase" className="text-[11px] text-gray-500 font-semibold mb-1 block">Counselling Phase</label>
                    <select id="predictor-phase" value={phase} onChange={e => setPhase(e.target.value as PredictorPhase)}
                      className="w-full px-3 sm:px-4 h-11 rounded-lg border border-gray-200 text-sm cursor-pointer font-semibold bg-white">
                      {PREDICTOR_PHASES.map(p => (
                        <option key={p.key} value={p.key}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How to read the results */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-gray-500 mb-4">
          <span className="font-semibold text-gray-500">How to read results:</span>
          <button onClick={() => setInfoSheet(BAND_INFO.Safe)} className="cursor-pointer"><span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">Safe</span> well inside last close</button>
          <button onClick={() => setInfoSheet(BAND_INFO.Moderate)} className="cursor-pointer"><span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">Moderate</span> near the close</button>
          <button onClick={() => setInfoSheet(BAND_INFO.Reach)} className="cursor-pointer"><span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">Reach</span> beyond it — possible in later phases</button>
        </div>

        {usePhaseData && (
          <div className="bg-blue-50 rounded-lg px-4 py-2 text-[11px] text-blue-700 mb-4">
            {phase === "phase1" && (
              <>Phase-1 cutoffs are the <strong>tightest</strong> of the season — later phases relax as seats free up. TG EAPCET 2026 Phase-1 allotment processing is underway. Data: official TSCHE Phase-1 Last Rank Statements (2023 &amp; 2022).</>
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
            Girls cutoff data is available for select AP colleges (2023-24). For colleges without girls-specific data, results use Boys cutoffs as reference. Girls cutoffs are typically similar or slightly higher.
          </div>
        )}

        {!rank && (
          <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-400">
            Type your rank above — matching colleges appear instantly.
            <span className="block text-xs mt-1">
              Don&apos;t have your rank yet?{" "}
              <a href="#rank-bands" className="text-accent font-semibold hover:underline">Browse ready-made lists by rank band ↓</a>
            </span>
          </div>
        )}

        {rank && predicting && predictions.length === 0 && (
          <div role="status" aria-live="polite">
            <span className="sr-only">Finding colleges for rank {parseInt(rank) > 0 ? parseInt(rank).toLocaleString() : rank}…</span>
            {/* Skeleton rows sized like real result rows — prevents the list
                "popping" in and reserves layout so nothing shifts. */}
            <div className="space-y-2" aria-hidden>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 rounded-lg bg-gray-50 animate-pulse">
                  <div className="flex-1 min-w-0">
                    <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="h-8 w-14 bg-gray-200 rounded" />
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {rank && predictions.length > 0 && (
          <div>
            <div ref={resultsRef} className="flex items-center justify-between mb-3 scroll-mt-20">
              <div className="text-sm font-semibold text-gray-600">
                {predictions.length} college{predictions.length !== 1 ? "s" : ""} for rank {parseInt(rank).toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-500">{catLabel} · {gender === "girls" ? "Girls" : "Boys"} · {branchLabel(branch)}{usePhaseData ? ` · ${PREDICTOR_PHASES.find(p => p.key === phase)?.label}` : ""}</div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] text-gray-500 font-medium">Share these results:</span>
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
            {/* Single page scroll (no nested scroll region): first INITIAL_ROWS
                rows render, the rest expand via "Show all". */}
            <div className="space-y-2 -mx-1 px-1">
              {(showAll ? predictions : predictions.slice(0, INITIAL_ROWS)).map(({ id, slug, name, district, fee, cutoff, chance, isHistorical, dataYears, estPct }) => {
                // When there's no category/gender-specific history, the value
                // is the static OC closing rank (TSCHE 2024 / APSCHE 2023).
                // Flag that clearly so an SC/Girls selection never reads as if
                // it were category-specific data.
                const ocMismatch = !isHistorical && (category !== "OC" || gender === "girls");
                const ocVintage = state === "Telangana" ? "TSCHE 2024" : "APSCHE 2023";
                return (
                <div key={id}
                  className="relative flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                  {/* Stretched link makes the whole card navigate while keeping
                      the heart button (relative z-10) independently clickable. */}
                  <Link href={`/colleges/${slug}`} aria-label={`View ${name}`}
                    className="absolute inset-0 z-[1] rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm leading-tight">{name}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">
                      {district} · {fmtFee(fee)}/yr
                      {isHistorical && (
                        <span className="ml-1.5 text-blue-500 hidden sm:inline">· {catLabel.split(" ")[0]} weighted ({dataYears.join(", ")})</span>
                      )}
                      {!isHistorical && (
                        <span className={`ml-1.5 ${ocMismatch ? "text-amber-600" : "text-gray-500"}`}>
                          · OC ref{ocMismatch ? ` — no ${catLabel.split(" ")[0]}${gender === "girls" ? "/Girls" : ""} data` : ""}<span className="hidden sm:inline"> ({ocVintage})</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-sm shrink-0">
                    <div className="text-right sm:text-center leading-tight">
                      <div className="text-[10px] sm:text-[11px] text-gray-500">{isHistorical ? `${catLabel.split(" ")[0]} Cutoff` : "OC Cutoff"}</div>
                      <div className="font-bold text-xs sm:text-sm tabular-nums">{cutoff.toLocaleString()}</div>
                      {estPct !== null && (
                        // Button (not title-tooltip): the disclaimer must be
                        // reachable on touch, where most visitors are.
                        <button
                          onClick={() => setInfoSheet({
                            title: `~${estPct}% chance — what this means`,
                            body: `A rough estimate from ${dataYears.length} year${dataYears.length !== 1 ? "s" : ""} of closing ranks (${dataYears.join(", ")}) for this branch and category. It is not a guarantee — actual allotment depends on this year's seat matrix, the number of applicants, and the order you list your options.`,
                          })}
                          title={`Rough estimate from ${dataYears.length} year${dataYears.length !== 1 ? "s" : ""} of closing ranks (${dataYears.join(", ")}). Tap for details.`}
                          className="relative z-10 text-[10px] sm:text-[11px] font-semibold text-gray-500 tabular-nums leading-none mt-0.5 underline decoration-dotted underline-offset-2 cursor-pointer"
                        >
                          ~{estPct}% chance
                        </button>
                      )}
                    </div>
                    <span className={`shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold ${
                      chance === "Safe" ? "bg-green-100 text-green-700" :
                      chance === "Moderate" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-600"
                    }`}>{chance}</span>
                    <ShortlistButton collegeSlug={slug} program={branchLabel(branch)} className="relative z-10" />
                  </div>
                </div>
                );
              })}
            </div>

            {!showAll && predictions.length > INITIAL_ROWS && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-3 w-full py-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-accent hover:bg-blue-50 transition-colors active:scale-[0.99]"
              >
                Show all {predictions.length} colleges ↓
              </button>
            )}

            {/* Next step — hand off to the web-options generator with the same inputs */}
            <div className="mt-4 rounded-xl border border-accent/30 bg-blue-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div>
                <div className="font-bold text-sm text-gray-900">Next step: turn this into your web-options list</div>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Add every branch you&apos;d accept and get one ready-to-enter preference order across all colleges — your rank, category &amp; gender carry over.
                </p>
              </div>
              <Link href={webOptionsHref}
                className="mt-3 sm:mt-0 inline-flex shrink-0 items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors active:scale-95">
                Build web options <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="mt-4 bg-amber-50 rounded-lg px-4 py-2.5 text-[11px] text-amber-700">
              Data from official APSCHE &amp; TSCHE &quot;Last Rank Details&quot; PDFs. {gender === "girls" ? "Girls-specific data available for select colleges." : ""} Actual cutoffs vary year to year.
              <span className="block mt-1">
                <strong>&ldquo;~% est.&rdquo;</strong> is a rough chance estimate based only on how your rank compares to past closing ranks for that branch &amp; category — shown only where at least two years of data exist. It is <strong>not a guarantee</strong>: real allotment depends on this year&rsquo;s seat matrix, the number of applicants, and the order you list your options.
              </span>
            </div>
            <LeadCapture rank={parseInt(rank)} examState={state} branch={branch} category={category} />
          </div>
        )}

        {rank && !predicting && predictions.length === 0 && parseInt(rank) > 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p className="font-semibold">No colleges found for this rank</p>
            <p className="text-xs mt-1">
              {usePhaseData
                ? "Phase-specific data covers fewer college-branch combinations. Try Final Phase, or a different branch or category."
                : "Try a different branch or category — or check the other state above"}
            </p>
          </div>
        )}
      </section>

      {/* Every counselling tool, one tap away */}
      <CounsellingToolkit current="/eapcet" className="mb-6" />

      {/* 2026 season guides — every card stays rendered (crawlable internal
          links), but we tag each by state and order the selected state + shared
          guides first so an AP user isn't led to TS-only pages and vice versa. */}
      {(() => {
        const selectedTag = state === "Telangana" ? "TS" : "AP";
        const guides: {
          href: string;
          title: string;
          desc: string;
          tag: "AP" | "TS" | "Both";
          isNew?: boolean;
        }[] = [
          { href: "/eapcet/ap-counselling-dates-2026", tag: "AP", isNew: true, title: "AP Counselling Dates 2026 — Official Schedule", desc: "APSCHE-notified first phase: registration July 20–29, web options July 25–31, seat allotment August 6." },
          { href: "/eapcet/ap-results-2026", tag: "AP", title: "AP EAPCET Results 2026 — Declared July 1", desc: "Rank card download steps, pass percentages & toppers, and what happens next in counselling." },
          { href: "/eapcet/ap-cutoff-2026", tag: "AP", title: "AP EAPCET 2026 Cutoff — Branch-wise", desc: "Expected college-wise closing ranks for CSE, ECE, EEE, Civil, Mech, IT & AI branches." },
          { href: "/eapcet/ap-web-options", tag: "AP", title: "AP Web Options Entry — Step-by-Step", desc: "The exact entry process and the priority-order strategy that decides your seat." },
          { href: "/eapcet/tg-cutoff-2026", tag: "TS", title: "TG EAPCET 2026 Cutoff — Branch-wise", desc: "College-wise closing ranks from official TSCHE 2024-25 & 2023-24 last-rank data, plus Phase-1 reference." },
          { href: "/eapcet/ts-counselling-dates-2026", tag: "TS", title: "TS Counselling Dates 2026", desc: "Full TGCHE phase-wise schedule — Phase-1 allotment processing underway, self-reporting through July 14." },
          { href: "/eapcet/web-options-generator", tag: "Both", isNew: true, title: "Web Options Generator", desc: "Enter your rank, category & branches to auto-build a best-first preference list across all colleges — tagged safe / moderate / reach." },
          { href: "/eapcet/certificate-verification-documents", tag: "Both", title: "Certificate Verification Documents", desc: "Complete checklist for AP & TS — including income certificate validity rules." },
        ];
        // Selected state first, then shared ("Both"), then the other state.
        const tagRank = (t: "AP" | "TS" | "Both") => (t === selectedTag ? 0 : t === "Both" ? 1 : 2);
        const ordered = guides
          .map((g, i) => ({ g, i }))
          .sort((a, b) => tagRank(a.g.tag) - tagRank(b.g.tag) || a.i - b.i)
          .map(({ g }) => g);
        const tagStyle: Record<"AP" | "TS" | "Both", string> = {
          AP: "bg-green-100 text-green-700",
          TS: "bg-blue-100 text-accent",
          Both: "bg-gray-100 text-gray-500",
        };
        return (
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
            <h2 className="text-base sm:text-lg font-bold mb-3">EAPCET 2026 — Results & Counselling Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ordered.map(g => {
                const dimmed = g.tag !== "Both" && g.tag !== selectedTag;
                return (
                  <Link
                    key={g.href}
                    href={g.href}
                    className={`block rounded-lg border p-3 hover:border-accent hover:shadow-sm transition-all ${
                      g.tag === "Both" ? "border-accent/40 bg-blue-50/40" : "border-gray-200"
                    } ${dimmed ? "opacity-60 hover:opacity-100" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${tagStyle[g.tag]}`}>{g.tag === "Both" ? "AP & TS" : g.tag}</span>
                      <span className="font-semibold text-sm">{g.title}</span>
                      {g.isNew && <span className="text-[10px] font-bold text-accent align-middle">NEW</span>}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{g.desc}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* Key Dates at a Glance */}
      <section id="dates" className="rounded-xl sm:rounded-2xl mb-6 overflow-hidden scroll-mt-20" style={{ background: "linear-gradient(135deg, #0f2b46 0%, #1a5276 40%, #2e86c1 100%)" }}>
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
              Official portal <span aria-hidden>→</span>
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
              Official portal <span aria-hidden>→</span>
            </a>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-[11px] text-blue-200/50">
          * Dates based on official notifications as of {COUNSELLING_STATUS_AS_OF}. TG Phase-1 is complete; Phase-2 runs July 17–28. {AP_EAPCET_2026_RESULT.declared ? `AP EAPCET results are declared and APSCHE has notified the first-phase counselling schedule — registration opens July 20 at eapcet-sche.aptonline.in.` : `AP EAPCET results still awaited — now expected by ${AP_EAPCET_2026_RESULT.expectedWindow}.`} Check APSCHE / TGCHE websites for latest updates.
        </div>
      </section>

      {/* Browse-by-rank hub — links to /eapcet/rank/[slug] static pages.
          Crawlable internal links so Googlebot can discover the per-band
          landing surfaces from the predictor without relying on sitemap-
          only discovery. Built statically from a small constant so this
          stays SSR-friendly even though this component is "use client". */}
      <section id="rank-bands" className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 scroll-mt-20">
        <h2 className="text-base sm:text-lg font-bold mb-1">Browse colleges by rank</h2>
        <p className="text-xs text-gray-500 mb-4">
          Pre-built lists for popular EAPCET rank bands — useful before you have your final score.
        </p>
        {((state === "Andhra Pradesh"
          ? ["andhra-pradesh", "telangana"]
          : ["telangana", "andhra-pradesh"]) as ("telangana" | "andhra-pradesh")[]).map(stateSlug => {
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

      {/* About the exam — reference content, kept below the tools now that the
          2026 exams are over (pre-exam visitors still reach it via scroll/search). */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">About EAPCET</h2>
        <div>
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

      {/* Quick Stats — computed server-side in page.tsx from COLLEGES */}
      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">At a Glance</h2>
        {(() => {
          const s = stats[state];
          const rows = [
            [String(s.colleges), `${state === "Telangana" ? "TS" : "AP"} Colleges`],
            [s.lowestFee, "Lowest Fee"],
            [s.highestFee, "Highest Fee"],
            [String(s.nirfRanked), "NIRF Ranked"],
          ];
          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
              {rows.map(([value, label]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="text-lg sm:text-xl font-extrabold text-brand">{value}</div>
                  <div className="text-[11px] sm:text-xs text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* Touch-friendly explainer sheet — bottom sheet on mobile, centered
          dialog on desktop. Replaces title-attribute tooltips, which are
          invisible on touch devices. */}
      {infoSheet && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center sm:justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={infoSheet.title}
        >
          <button
            className="absolute inset-0 bg-black/40 cursor-default"
            aria-label="Close explanation"
            onClick={() => setInfoSheet(null)}
          />
          <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-xl">
            <div className="font-bold text-sm text-gray-900 mb-1.5">{infoSheet.title}</div>
            <p className="text-sm text-gray-600 leading-relaxed">{infoSheet.body}</p>
            <button
              onClick={() => setInfoSheet(null)}
              className="mt-4 w-full py-2.5 rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
