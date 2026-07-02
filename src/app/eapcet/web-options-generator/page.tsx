import Link from "next/link";
import type { Metadata } from "next";
import { fmtFee } from "@/lib/colleges";
import { TS_CATEGORIES } from "@/lib/ap-cutoffs";
import { BRANCH_OPTIONS, STATE_OPTIONS, type BranchOption } from "@/lib/rank-band-data";
import {
  predict,
  countBySafety,
  parseState,
  parseCategory,
  parseGender,
  parseRank,
  parseBranches,
  type Safety,
} from "@/lib/predictor";
import WebOptionsExport, { type ExportRow } from "./WebOptionsExport";
import CounsellingToolkit from "@/components/CounsellingToolkit";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

type SP = Record<string, string | string[] | undefined>;

// First-visit default: a realistic multi-branch CSE-family spread so the tool
// shows a useful preference list immediately.
const DEFAULT_BRANCH_SLUGS = ["cse", "csm", "it", "ece"];
function branchesFromParams(v: string | string[] | undefined): BranchOption[] {
  if (v === undefined) return BRANCH_OPTIONS.filter(b => DEFAULT_BRANCH_SLUGS.includes(b.slug));
  return parseBranches(v);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const hasQuery = parseRank(sp.rank) !== null;
  const title =
    "EAPCET Web Options Generator 2026 — Preference Order by Rank, Category & Branch (TS & AP)";
  const description =
    "Generate your EAPCET / EAMCET web-options preference list. Enter your rank, category (OC / BC / SC / ST / EWS), gender and the branches you want, and get a ready-to-enter college+branch order across Telangana & Andhra Pradesh — each option tagged safe, moderate or reach, built on official closing ranks.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/eapcet/web-options-generator` },
    robots: hasQuery ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/eapcet/web-options-generator`,
      siteName: "TeluguColleges.com",
      type: "website",
      locale: "en_IN",
    },
  };
}

const SAFETY_META: Record<Safety, { label: string; chip: string; dot: string }> = {
  safe: { label: "Safe", chip: "bg-green-50 text-green-700", dot: "bg-green-500" },
  moderate: { label: "Moderate", chip: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  reach: { label: "Reach", chip: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
};

export default async function WebOptionsGeneratorPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const state = parseState(sp.state);
  const category = parseCategory(sp.cat);
  const gender = parseGender(sp.gender);
  const branches = branchesFromParams(sp.branch);
  const rank = parseRank(sp.rank);
  const branchSlugs = new Set(branches.map(b => b.slug));

  const matches = rank ? predict({ rank, state, category, gender, branches }) : [];
  const counts = countBySafety(matches);
  const catLabel = TS_CATEGORIES.find(c => c.key === category)?.label ?? category;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <nav className="text-xs text-gray-500 mb-3">
        <Link href="/eapcet" className="hover:text-accent">EAPCET</Link> · Web Options Generator
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
        EAPCET Web Options Generator
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
        Pick every branch you&rsquo;d accept and get one ready-to-enter preference list across
        all Telangana &amp; Andhra Pradesh colleges — ambitious{" "}
        <span className="font-semibold text-rose-700">reach</span> options first, then{" "}
        <span className="font-semibold text-amber-700">moderate</span>, then{" "}
        <span className="font-semibold text-green-700">safe</span> fallbacks. This is the order you can
        mirror in the official counselling web-options screen.
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Want admission odds for a single branch instead?{" "}
        <Link href="/eapcet" className="text-accent font-semibold hover:underline">Use the rank predictor →</Link>
      </p>

      {/* ── Form (GET — server-rendered, no client JS) ── */}
      <form
        method="get"
        className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 print:hidden"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your rank</span>
            <input
              type="number"
              name="rank"
              min={1}
              defaultValue={rank ?? ""}
              placeholder="e.g. 15000"
              required
              className="h-11 rounded-lg border border-gray-200 px-3 text-sm font-medium tabular-nums focus:border-accent focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Exam / state</span>
            <select name="state" defaultValue={state.slug} className="h-11 rounded-lg border border-gray-200 px-2 text-sm font-medium bg-white focus:border-accent focus:outline-none">
              {STATE_OPTIONS.map(s => (
                <option key={s.slug} value={s.slug}>{s.exam}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</span>
            <select name="cat" defaultValue={category} className="h-11 rounded-lg border border-gray-200 px-2 text-sm font-medium bg-white focus:border-accent focus:outline-none">
              {TS_CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</span>
            <select name="gender" defaultValue={gender} className="h-11 rounded-lg border border-gray-200 px-2 text-sm font-medium bg-white focus:border-accent focus:outline-none">
              <option value="boys">Boys / All</option>
              <option value="girls">Girls</option>
            </select>
          </label>
        </div>

        <div className="mt-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Branches you&rsquo;d accept</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {BRANCH_OPTIONS.map(b => {
              const on = branchSlugs.has(b.slug);
              return (
                <label
                  key={b.slug}
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-full border cursor-pointer select-none text-sm font-medium bg-white text-gray-700 border-gray-200 transition-colors has-[:checked]:bg-brand has-[:checked]:text-white has-[:checked]:border-brand"
                >
                  <input type="checkbox" name="branch" value={b.slug} defaultChecked={on} className="sr-only" />
                  {b.label}
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 h-11 px-6 rounded-lg bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors"
        >
          Generate my option list
        </button>
      </form>

      {/* ── Results ── */}
      {rank !== null && (
        <section className="mt-7">
          {matches.length === 0 ? (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
              No colleges matched rank {rank.toLocaleString("en-IN")} for{" "}
              {branches.map(b => b.label).join(", ")} ({catLabel}, {gender}) in {state.exam}.
              Try a wider rank, more branches, or the other state — closing ranks vary a lot by branch.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-brand-dark">
                  Your option order — {counts.total} choices
                  <span className="font-medium text-gray-500 text-sm"> · rank {rank.toLocaleString("en-IN")} · {catLabel} · {gender === "girls" ? "Girls" : "Boys/All"} · {state.short}</span>
                </h2>
                <div className="flex gap-2 text-xs font-semibold print:hidden">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-rose-50 text-rose-700"><span className="w-2 h-2 rounded-full bg-rose-500" />{counts.reach} reach</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 text-amber-700"><span className="w-2 h-2 rounded-full bg-amber-500" />{counts.moderate} moderate</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 text-green-700"><span className="w-2 h-2 rounded-full bg-green-500" />{counts.safe} safe</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Ordered ambitious-first: your <span className="font-semibold text-rose-700">reach</span> options
                lead, then <span className="font-semibold text-amber-700">moderate</span>, with{" "}
                <span className="font-semibold text-green-700">safe</span> fallbacks last — the order counselling
                guides recommend, since the engine allots your highest feasible choice and a safe option only
                backstops it. Enter them in this priority on the web-options screen (drop any you don&rsquo;t
                want). &ldquo;Closing rank&rdquo; is the {catLabel}{" "}
                {gender === "girls" ? "girls" : "boys"} last rank, weighted across available years.{" "}
                <span className="hidden print:inline">Generated on telugucolleges.com.</span>
                <span className="print:hidden">Tip: press Ctrl/Cmd&nbsp;+&nbsp;P to print or save this list.</span>
              </p>

              <WebOptionsExport
                rows={matches.map((m): ExportRow => ({
                  slug: m.college.slug,
                  collegeName: m.college.name,
                  branchLabel: m.branch.label,
                  district: m.college.district,
                  state: m.college.state,
                  closingRank: m.closingRank,
                  safety: m.safety,
                }))}
                meta={{
                  rank,
                  category: catLabel,
                  gender: gender === "girls" ? "Girls" : "Boys/All",
                  stateShort: state.short,
                }}
              />

              <ol className="mt-4 flex flex-col gap-2">
                {matches.map((m, i) => {
                  const meta = SAFETY_META[m.safety];
                  return (
                    <li key={`${m.college.slug}-${m.branch.slug}`} className="relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <Link href={`/colleges/${m.college.slug}`} className="absolute inset-0 rounded-xl" aria-label={m.college.name} />
                      <div className="relative pointer-events-none flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3">
                        <span className="shrink-0 w-6 sm:w-7 text-center font-bold text-gray-400 tabular-nums text-sm">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm sm:text-[15px] leading-tight truncate">{m.college.name}</div>
                          <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">
                            {m.branch.label} · {m.college.district}<span className="hidden sm:inline">, {m.college.state} · {m.college.type}</span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[10px] sm:text-[11px] text-gray-500 leading-none">Closing</div>
                          <div className="font-bold text-brand text-sm tabular-nums">{m.closingRank.toLocaleString("en-IN")}</div>
                        </div>
                        <div className="shrink-0 text-right w-16 hidden sm:block">
                          <div className="text-[11px] text-gray-500">Fee/yr</div>
                          <div className="font-bold text-gray-700 text-sm tabular-nums">{m.college.fee > 0 ? fmtFee(m.college.fee) : "—"}</div>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold ${meta.chip}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />{meta.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <p className="text-xs text-gray-500 mt-4 print:hidden">
                Budget check: estimate the full 4-year cost (tuition + hostel) of your top choices with the{" "}
                <Link href="/fee-calculator" className="text-accent font-semibold hover:underline">Fee Calculator →</Link>
              </p>
              <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
                Guidance only, not a guarantee of admission. Closing ranks are official last-phase
                figures from prior counselling years and can shift between phases and years. Always
                confirm against the official TGCHE / APSCHE counselling portal before locking your options.
              </p>
            </>
          )}
        </section>
      )}

      <CounsellingToolkit current="/eapcet/web-options-generator" className="mt-8 print:hidden" />
    </main>
  );
}
