import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { fmtFee } from "@/lib/colleges";
import {
  TS_CUTOFF_BRANCHES,
  getTSCutoffBranch,
  getTSCutoffRows,
  isLastRankSentinel,
} from "@/lib/ts-cutoff-2026";
import { getCollegesMerged } from "@/lib/colleges-merged";


export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return TS_CUTOFF_BRANCHES.map(b => ({ branch: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branch: string }>;
}): Promise<Metadata> {
  const { branch } = await params;
  const b = getTSCutoffBranch(branch);
  if (!b) return { title: "Not found" };
  const rows = getTSCutoffRows(branch, await getCollegesMerged());
  const title = `TG EAPCET 2026 Cutoff for ${b.keyword} — College-wise Closing Ranks`;
  const description = `TG EAPCET 2026 ${b.keyword} cutoff reference for ${rows.length} Telangana engineering colleges, based on official TGCHE historical last-rank statements. Phase-1 allotment processing was underway on July 10.`;
  const url = `${SITE_URL}/eapcet/tg-cutoff-2026/${branch}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "TeluguColleges.com", type: "website", locale: "en_IN" },
    twitter: { card: "summary", title, description },
  };
}

/** Render a closing rank; sentinel values get a footnote marker. */
function rank(n: number): string {
  if (n <= 0) return "—";
  return n.toLocaleString("en-IN") + (isLastRankSentinel(n) ? "*" : "");
}

export default async function TGCutoffBranchPage({
  params,
}: {
  params: Promise<{ branch: string }>;
}) {
  const { branch } = await params;
  const b = getTSCutoffBranch(branch);
  if (!b) notFound();
  const rows = getTSCutoffRows(branch, await getCollegesMerged());

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "TG EAPCET 2026 Cutoff", item: `${SITE_URL}/eapcet/tg-cutoff-2026` },
      { "@type": "ListItem", position: 4, name: b.label, item: `${SITE_URL}/eapcet/tg-cutoff-2026/${branch}` },
    ],
  };

  const faqs = [
    {
      q: `What is the TG EAPCET 2026 cutoff for ${b.keyword}?`,
      a: `Official 2026 cutoffs are published only after each counselling phase. Phase-1 allotment processing was underway on July 10, 2026. The most reliable reference meanwhile is the official TGCHE last-rank data from 2024-25 counselling, shown in the table above for ${rows.length} colleges. Top colleges close ${b.slug === "cse" ? "within the first few thousand ranks" : "earlier than mid-tier colleges by tens of thousands of ranks"}, and cutoffs typically shift ±10–20% year to year.`,
    },
    {
      q: "When does TG EAPCET 2026 counselling start?",
      a: "Registration and web options have closed. The official portal entered Phase-1 allotment-processing mode on July 10, 2026; allotted candidates must pay the fee and self-report online by July 14. Official 2026 closing ranks appear after each allotment phase.",
    },
    {
      q: "Do cutoffs differ by category and gender?",
      a: "Yes — closing ranks differ substantially across OC, BC-A/B/C/D/E, SC, ST and EWS, and between boys and girls. The table shows OC, SC and EWS reference ranks; use the TeluguColleges predictor for your exact category × gender combination.",
    },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/eapcet" className="hover:text-accent">EAPCET</Link>
        <span>/</span>
        <Link href="/eapcet/tg-cutoff-2026" className="hover:text-accent">TG Cutoff 2026</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{b.label}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        TG EAPCET 2026 Cutoff for {b.label} — Closing Ranks
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        TG EAPCET 2026 cutoff reference for <strong>{b.label}</strong> across{" "}
        <strong>{rows.length} Telangana engineering colleges</strong>, based on official
        TGCHE last-rank statements from 2024–25 and 2023–24 convener-quota counselling —
        not a prediction. The official portal entered <strong>Phase-1 allotment
        processing</strong> on July 10; allotted candidates must pay the fee and self-report
        online by <strong>July 14, 2026</strong>. Official 2026 cutoffs appear after each phase.
        Bookmark this page — it will be updated as 2026 phases conclude.
      </p>

      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6 text-sm text-blue-900">
        Know your rank already? Get a category- and gender-specific list in the{" "}
        <Link href="/eapcet" className="font-semibold underline">EAPCET College Predictor</Link>.
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
        <table className="w-full bg-white rounded-xl shadow-sm text-sm min-w-[760px] border border-gray-100">
          <thead>
            <tr className="bg-brand text-white text-left">
              <th className="px-3 py-2.5 text-xs font-semibold w-10">#</th>
              <th className="px-3 py-2.5 text-xs font-semibold">College</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">OC 2024-25</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">OC 2023-24</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">SC 2024-25</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">EWS 2024-25</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">Phase-1 2023 (OC)†</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">Annual fee</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.college.id} className="border-b border-gray-100 last:border-0 hover:bg-blue-50/30">
                <td className="px-3 py-2.5 text-xs text-gray-500 font-mono">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <Link href={`/colleges/${r.college.slug}`} className="font-semibold text-sm text-gray-900 hover:text-accent">
                    {r.college.name}
                  </Link>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {r.college.code} · {r.college.district} · {r.college.type}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right font-mono font-semibold">
                  {rank(r.oc2024)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-600">
                  {rank(r.oc2023)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-600">
                  {rank(r.sc2024)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-600">
                  {rank(r.ews2024)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-600">
                  {rank(r.ocPhase1_2023)}
                </td>
                <td className="px-3 py-2.5 text-right text-xs">
                  {r.college.fee > 0 ? fmtFee(r.college.fee) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQs (visible content matching JSON-LD) */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">TG EAPCET 2026 {b.keyword} Cutoff — FAQs</h2>
        <div className="space-y-3">
          {faqs.map(f => (
            <details key={f.q} className="bg-white rounded-xl border border-gray-200 p-4 group">
              <summary className="font-semibold text-sm cursor-pointer text-gray-900">{f.q}</summary>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Other branches */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">TG EAPCET 2026 cutoffs for other branches</h2>
        <div className="flex flex-wrap gap-2">
          {TS_CUTOFF_BRANCHES.filter(x => x.slug !== branch).map(x => (
            <Link key={x.slug} href={`/eapcet/tg-cutoff-2026/${x.slug}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-accent transition-colors">
              {x.label}
            </Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500 leading-relaxed">
        Methodology: closing ranks are from official TSCHE &ldquo;Last Rank Statement&rdquo; PDFs for
        2024–25 and 2023–24 convener-quota counselling, final phase. † The Phase-1 column is
        the official TSCHE 2023 Phase-1 Last Rank Statement (OC), shown for reference —
        Phase-1 cutoffs are the tightest of the season. * A value of 1,56,852 (final phase)
        or 1,56,840 (Phase-1) in the 2023 statements means the branch closed at the last
        rank — seats were still available when that phase ended. These are reference values
        for TG EAPCET 2026 — actual 2026 cutoffs depend on seat matrix, applicant volume and
        counselling phase, and typically vary ±10–20% year to year. Not an admission guarantee.
      </p>

      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
    </main>
  );
}
