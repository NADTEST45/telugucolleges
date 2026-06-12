import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { fmtFee } from "@/lib/colleges";
import { AP_CUTOFF_BRANCHES, getCutoffBranch, getCutoffRows } from "@/lib/ap-cutoff-2026";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return AP_CUTOFF_BRANCHES.map(b => ({ branch: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branch: string }>;
}): Promise<Metadata> {
  const { branch } = await params;
  const b = getCutoffBranch(branch);
  if (!b) return { title: "Not found" };
  const rows = getCutoffRows(branch);
  const title = `AP EAPCET 2026 Cutoff for ${b.keyword} — Expected College-wise Closing Ranks`;
  const description = `AP EAPCET 2026 ${b.keyword} cutoff: expected closing ranks for ${rows.length} Andhra Pradesh engineering colleges, based on official APSCHE 2023-24 & 2022-23 last-rank statements. Results expected June 18–21, counselling from early July.`;
  const url = `${SITE_URL}/eapcet/ap-cutoff-2026/${branch}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "TeluguColleges.com", type: "website", locale: "en_IN" },
    twitter: { card: "summary", title, description },
  };
}

export default async function APCutoffBranchPage({
  params,
}: {
  params: Promise<{ branch: string }>;
}) {
  const { branch } = await params;
  const b = getCutoffBranch(branch);
  if (!b) notFound();
  const rows = getCutoffRows(branch);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "AP EAPCET 2026 Cutoff", item: `${SITE_URL}/eapcet/ap-cutoff-2026` },
      { "@type": "ListItem", position: 4, name: b.label, item: `${SITE_URL}/eapcet/ap-cutoff-2026/${branch}` },
    ],
  };

  const faqs = [
    {
      q: `What is the expected AP EAPCET 2026 cutoff for ${b.keyword}?`,
      a: `Official 2026 cutoffs are published only after counselling concludes (expected July–August 2026). The most reliable indicator is the official APSCHE last-rank data from 2023-24 counselling, shown in the table above for ${rows.length} colleges. Top colleges close ${b.slug === "cse" ? "within the first few thousand ranks" : "earlier than mid-tier colleges by tens of thousands of ranks"}, and cutoffs typically shift ±10–20% year to year.`,
    },
    {
      q: "When will AP EAPCET 2026 results and cutoffs be released?",
      a: "AP EAPCET 2026 results are expected June 18–21, 2026 (postponed from June 1 pending Intermediate supplementary results). Counselling registration is expected in early July, and the official 2026 closing ranks appear after each allotment round.",
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
        <Link href="/eapcet/ap-cutoff-2026" className="hover:text-accent">AP Cutoff 2026</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{b.label}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        AP EAPCET 2026 Cutoff for {b.label} — Expected Closing Ranks
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Expected AP EAPCET 2026 cutoff ranks for <strong>{b.label}</strong> across{" "}
        <strong>{rows.length} Andhra Pradesh engineering colleges</strong>, based on official
        APSCHE last-rank statements from 2023–24 and 2022–23 convener-quota counselling.
        Results are expected <strong>June 18–21, 2026</strong>; official 2026 cutoffs appear
        after each counselling round (from July). Bookmark this page — it will be updated as
        2026 rounds conclude.
      </p>

      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6 text-sm text-blue-900">
        Know your rank already? Get a category- and gender-specific list in the{" "}
        <Link href="/eapcet" className="font-semibold underline">EAPCET College Predictor</Link>.
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
        <table className="w-full bg-white rounded-xl shadow-sm text-sm min-w-[700px] border border-gray-100">
          <thead>
            <tr className="bg-brand text-white text-left">
              <th className="px-3 py-2.5 text-xs font-semibold w-10">#</th>
              <th className="px-3 py-2.5 text-xs font-semibold">College</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">OC 2023-24</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">OC 2022-23</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">SC 2023-24</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-right">EWS 2023-24</th>
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
                  {r.oc2023 > 0 ? r.oc2023.toLocaleString("en-IN") : "—"}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-600">
                  {r.oc2022 > 0 ? r.oc2022.toLocaleString("en-IN") : "—"}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-600">
                  {r.sc2023 > 0 ? r.sc2023.toLocaleString("en-IN") : "—"}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-600">
                  {r.ews2023 > 0 ? r.ews2023.toLocaleString("en-IN") : "—"}
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
        <h2 className="text-lg font-bold text-gray-900 mb-3">AP EAPCET 2026 {b.keyword} Cutoff — FAQs</h2>
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
        <h2 className="text-base font-bold text-gray-900 mb-3">AP EAPCET 2026 cutoffs for other branches</h2>
        <div className="flex flex-wrap gap-2">
          {AP_CUTOFF_BRANCHES.filter(x => x.slug !== branch).map(x => (
            <Link key={x.slug} href={`/eapcet/ap-cutoff-2026/${x.slug}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-accent transition-colors">
              {x.label}
            </Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500 leading-relaxed">
        Methodology: closing ranks are from official APSCHE &ldquo;Last Rank Details&rdquo; statements for
        2023–24 and 2022–23 convener-quota (Category-A) counselling, final phase. These are
        reference values for AP EAPCET 2026 — actual 2026 cutoffs depend on seat matrix,
        applicant volume and counselling round, and typically vary ±10–20% year to year.
        Not an admission guarantee.
      </p>

      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
    </main>
  );
}
