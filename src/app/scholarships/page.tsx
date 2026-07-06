import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import { COLLEGES } from "@/lib/colleges";
import { SCHOLARSHIPS, type ScholarshipInfo } from "@/lib/scholarships";
import JsonLd from "@/components/JsonLd";


export const metadata: Metadata = {
  title: "Engineering College Scholarships in AP & Telangana 2026 — Merit Fee Waivers",
  description:
    "Merit scholarships and tuition-fee waivers at deemed & private universities in Andhra Pradesh and Telangana. Compare entrance-exam-based slabs (GAT, KLEEE, BITSAT, SAT and more) offering up to 100% waivers — all sourced from official university notifications.",
  alternates: { canonical: `${SITE_URL}/scholarships` },
  openGraph: {
    title: "Engineering College Scholarships in AP & Telangana 2026",
    description:
      "Merit scholarships and tuition-fee waivers at deemed & private universities in AP & Telangana — entrance-exam-based slabs up to 100%, from official sources.",
    url: `${SITE_URL}/scholarships`,
    siteName: "TeluguColleges.com",
    type: "website",
    locale: "en_IN",
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "What kind of scholarships are listed here?",
    a: "These are merit-based tuition-fee concessions offered directly by deemed and private universities in Andhra Pradesh and Telangana. They are awarded on your entrance-exam score (such as GAT, KLEEE, BITSAT or SAT) or JEE / board marks, and range from a partial concession up to a full 100% tuition waiver.",
  },
  {
    q: "Are these the same as government fee reimbursement (RTF)?",
    a: "No. Government fee reimbursement (Reimbursement of Tuition Fee / RTF) is an income-based scheme for students admitted through the convener counselling quota, administered by the state. The waivers on this page are separate merit awards set by each university, usually for management or direct-admission seats. Always check the official notification for how the two interact.",
  },
  {
    q: "How do I qualify for a merit scholarship?",
    a: "Each university publishes slabs that map an entrance-exam score or rank to a percentage waiver — for example, a top GAT band may get 100% while a lower band gets 25%. Some also consider JEE Main percentile or Class 12 marks. The exact criteria for each scheme are shown on the card above and in the university's official notification.",
  },
  {
    q: "Does the scholarship continue for all four years?",
    a: "Usually only if you maintain the required academic standard. Most universities ask for a minimum CGPA each year (shown as the 'To keep it' note on each card), typically with no backlogs. If you fall below it, the waiver can be reduced or withdrawn.",
  },
  {
    q: "Can I combine a university merit scholarship with government fee reimbursement?",
    a: "Generally not on the same seat — reimbursement applies to convener-quota seats, while merit waivers usually apply to management or direct-admission seats. Eligibility and stacking rules vary by university and by year, so confirm with the admissions office before relying on both.",
  },
  {
    q: "Is the waiver guaranteed if I hit the required score?",
    a: "Treat the slabs as guidance, not a guarantee. Universities revise criteria, amounts and seat limits each admission year, and some waivers are capped to a limited number of seats. Always verify against the official notification linked on each card before making a decision.",
  },
];

type StateSlug = "all" | "ts" | "ap";

interface Entry {
  code: string;
  info: ScholarshipInfo;
  slug?: string;
  state?: string;
  district?: string;
  type?: string;
  /** Short exam tokens for filtering, e.g. "GAT", "KLEEE". */
  examTokens: string[];
}

/** Strip parentheticals/extra words to a short, filterable exam token. */
function examToken(examName: string): string {
  return examName.split("(")[0].trim();
}

function buildEntries(): Entry[] {
  const byCode = new Map(COLLEGES.map(c => [c.code, c]));
  return Object.entries(SCHOLARSHIPS)
    .map(([code, info]) => {
      const c = byCode.get(code);
      return {
        code,
        info,
        slug: c?.slug,
        state: c?.state,
        district: c?.district,
        type: c?.type,
        examTokens: [...new Set(info.tables.map(t => examToken(t.examName)))],
      };
    })
    .sort((a, b) => a.info.collegeName.localeCompare(b.info.collegeName));
}

function stateMatches(entry: Entry, sel: StateSlug): boolean {
  if (sel === "all") return true;
  if (sel === "ts") return entry.state === "Telangana";
  return entry.state === "Andhra Pradesh";
}

/** Highest headline waiver an entry advertises, for the summary line. */
function topWaiver(info: ScholarshipInfo): string | null {
  let best = 0;
  for (const t of info.tables)
    for (const s of t.slabs) {
      const m = s.percent.match(/(\d+)\s*%/);
      if (m) best = Math.max(best, parseInt(m[1], 10));
    }
  return best > 0 ? `Up to ${best}% tuition waiver` : null;
}

function qs(params: Record<string, string>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v && v !== "all") sp.set(k, v);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const stateSel = (Array.isArray(sp.state) ? sp.state[0] : sp.state) as StateSlug;
  const state: StateSlug = stateSel === "ts" || stateSel === "ap" ? stateSel : "all";
  const examSel = (Array.isArray(sp.exam) ? sp.exam[0] : sp.exam) ?? "all";

  const all = buildEntries();
  const allExams = [...new Set(all.flatMap(e => e.examTokens))].sort();
  const entries = all.filter(
    e => stateMatches(e, state) && (examSel === "all" || e.examTokens.includes(examSel)),
  );

  const stateTabs: { slug: StateSlug; label: string }[] = [
    { slug: "all", label: "All states" },
    { slug: "ts", label: "Telangana" },
    { slug: "ap", label: "Andhra Pradesh" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Engineering College Scholarships in AP & Telangana",
      itemListElement: all.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${e.info.collegeName} merit scholarships`,
        url: e.slug ? `${SITE_URL}/colleges/${e.slug}` : `${SITE_URL}/scholarships`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <JsonLd data={jsonLd} />

      <nav className="text-xs text-gray-500 mb-3">
        <Link href="/" className="hover:text-accent">Home</Link> · Scholarships
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
        College Scholarships in AP &amp; Telangana
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
        Merit-based tuition-fee waivers at deemed &amp; private universities, awarded on
        entrance-exam scores (GAT, KLEEE, BITSAT, SAT and more). Every slab below is taken
        from the university&rsquo;s official notification — open a college to see its full tab.
      </p>

      {/* ── Filters (GET, server-rendered) ── */}
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {stateTabs.map(t => {
            const on = state === t.slug;
            return (
              <Link
                key={t.slug}
                href={`/scholarships${qs({ state: t.slug, exam: examSel })}`}
                className={`h-9 inline-flex items-center px-3 rounded-full border text-sm font-medium ${on ? "bg-brand text-white border-brand" : "bg-white text-gray-700 border-gray-200 hover:border-accent"}`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/scholarships${qs({ state, exam: "all" })}`}
            className={`h-8 inline-flex items-center px-3 rounded-full border text-xs font-semibold ${examSel === "all" ? "bg-accent text-white border-accent" : "bg-white text-gray-600 border-gray-200 hover:border-accent"}`}
          >
            All exams
          </Link>
          {allExams.map(ex => {
            const on = examSel === ex;
            return (
              <Link
                key={ex}
                href={`/scholarships${qs({ state, exam: ex })}`}
                className={`h-8 inline-flex items-center px-3 rounded-full border text-xs font-semibold ${on ? "bg-accent text-white border-accent" : "bg-white text-gray-600 border-gray-200 hover:border-accent"}`}
              >
                {ex}
              </Link>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        {entries.length} {entries.length === 1 ? "university" : "universities"}
        {state !== "all" ? ` in ${state === "ts" ? "Telangana" : "Andhra Pradesh"}` : ""}
        {examSel !== "all" ? ` offering ${examSel} scholarships` : ""}
      </p>

      {/* ── Cards ── */}
      <div className="mt-3 flex flex-col gap-4">
        {entries.length === 0 ? (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            No scholarships match this filter. <Link href="/scholarships" className="font-semibold underline">Reset filters</Link>.
          </div>
        ) : (
          entries.map(e => {
            const waiver = topWaiver(e.info);
            return (
              <article key={e.code} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <h2 className="font-bold text-base sm:text-lg leading-tight">
                      {e.slug ? (
                        <Link href={`/colleges/${e.slug}`} className="hover:text-accent">{e.info.collegeName}</Link>
                      ) : (
                        e.info.collegeName
                      )}
                    </h2>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {[e.district, e.state, e.type].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  {waiver && (
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                      {waiver}
                    </span>
                  )}
                </div>

                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  {e.info.tables.map((t, ti) => (
                    <div key={ti} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                      <div className="text-sm font-semibold text-brand-dark">{t.examName}</div>
                      {t.branchGroup && (
                        <div className="text-[11px] text-gray-500 mb-1">{t.branchGroup}</div>
                      )}
                      <ul className="mt-1.5 flex flex-col gap-1">
                        {t.slabs.map((s, si) => (
                          <li key={si} className="flex items-baseline gap-2 text-xs">
                            <span className="font-bold text-emerald-700 tabular-nums shrink-0 w-16">{s.percent}</span>
                            <span className="text-gray-600">{s.criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {e.info.maintenance && (
                  <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <span className="font-semibold">To keep it:</span> {e.info.maintenance}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <a
                    href={e.info.source}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-xs text-gray-500 hover:text-accent"
                  >
                    Source: {e.info.sourceLabel} ↗
                  </a>
                  {e.slug && (
                    <Link href={`/colleges/${e.slug}`} className="text-xs font-semibold text-accent hover:underline">
                      Full details &amp; fees →
                    </Link>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* ── FAQ (answers kept in the DOM for SEO, not JS-collapsed) ── */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-brand-dark">Scholarships — frequently asked questions</h2>
        <dl className="mt-4 flex flex-col gap-4">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <dt className="font-semibold text-sm sm:text-base text-gray-900">{f.q}</dt>
              <dd className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-[11px] text-gray-400 mt-6 leading-relaxed">
        Scholarship slabs are merit/entrance-exam based and set by each university; criteria,
        amounts and continuation rules can change each admission year. Always confirm on the
        official university notification (linked per card) before relying on a waiver.
      </p>
    </main>
  );
}
