import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { AP_CUTOFF_BRANCHES, getCutoffRows } from "@/lib/ap-cutoff-2026";
import { apResultExpectedPhrase } from "@/lib/ap-result-status";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://telugucolleges.com";
const url = `${SITE_URL}/eapcet/ap-cutoff-2026`;

export const revalidate = 86400;

const title = "AP EAPCET 2026 Cutoff — Expected Branch-wise & College-wise Closing Ranks";
const description =
  "AP EAPCET 2026 cutoff ranks for CSE, ECE, EEE, Civil, Mechanical, IT, AI/ML and more — expected college-wise closing ranks based on official APSCHE 2023-24 & 2022-23 last-rank data. Results expected end-June 2026; counselling from early July.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "TeluguColleges.com", type: "website", locale: "en_IN" },
  twitter: { card: "summary", title, description },
};

export default function APCutoff2026HubPage() {
  const branchStats = AP_CUTOFF_BRANCHES.map(b => {
    const rows = getCutoffRows(b.slug);
    return { ...b, count: rows.length, top: rows[0] };
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "AP EAPCET 2026 Cutoff", item: url },
    ],
  };

  const faqs = [
    {
      q: "When will the official AP EAPCET 2026 cutoff be released?",
      a: "Official closing ranks appear after each counselling round. AP EAPCET 2026 results were declared on July 1, 2026, with counselling registration expected within about a week; round-1 closing ranks should appear in late July, and final-phase cutoffs by August 2026.",
    },
    {
      q: "What is a good rank in AP EAPCET 2026?",
      a: "For CSE in the top AP colleges, OC closing ranks have historically been within the first 5,000–15,000. Mid-tier colleges extend to 50,000+, and many colleges admit well beyond 1,00,000 — especially in non-circuit branches and reserved categories. Check the branch-wise tables for exact reference ranks.",
    },
    {
      q: "How are these expected 2026 cutoffs calculated?",
      a: "They are official APSCHE last-rank statements from 2023-24 and 2022-23 convener-quota counselling — the strongest available predictor of 2026 cutoffs. Actual 2026 ranks typically vary ±10–20% depending on seat matrix and applicant volume.",
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
        <span className="text-gray-700 font-medium">AP Cutoff 2026</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        AP EAPCET 2026 Cutoff — Expected Closing Ranks (Branch-wise)
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Branch-wise expected cutoffs for AP EAPCET 2026 counselling, built from official APSCHE
        last-rank statements (2023–24 and 2022–23). Results{" "}
        <strong>{apResultExpectedPhrase()}</strong> and counselling registration in early July. Pick a
        branch below for the full college-wise table, or use the{" "}
        <Link href="/eapcet" className="text-accent font-semibold underline">College Predictor</Link>{" "}
        for a category- and gender-specific list once you have your rank.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {branchStats.map(b => (
          <Link key={b.slug} href={`/eapcet/ap-cutoff-2026/${b.slug}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-accent hover:shadow-sm transition-all">
            <div className="font-bold text-sm text-gray-900 mb-1">{b.label} Cutoff 2026</div>
            <div className="text-xs text-gray-500">
              {b.count} colleges with official last-rank data
              {(() => { const t = b.top && (b.top.oc2024 || b.top.oc2023 || b.top.oc2022); return t ? <> · tightest OC close: {t.toLocaleString("en-IN")}</> : null; })()}
            </div>
          </Link>
        ))}
      </div>

      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-8">
        <h2 className="text-base sm:text-lg font-bold mb-3">How AP EAPCET cutoffs work</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-3">
          <p>
            A cutoff (closing rank) is the last rank admitted to a college-branch combination in
            convener-quota counselling. APSCHE publishes official &ldquo;Last Rank Details&rdquo; after each
            round. Closing ranks differ by <strong>category</strong> (OC, BC-A/B/C/D/E, SC, ST, EWS) and{" "}
            <strong>gender</strong>, and relax in later rounds as candidates slide or exit.
          </p>
          <p>
            70% of seats in private colleges (Category-A) and all university-college seats are filled
            through this counselling; the remaining 30% (Category-B/management quota) does not follow
            these ranks.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">AP EAPCET 2026 Cutoff — FAQs</h2>
        <div className="space-y-3">
          {faqs.map(f => (
            <details key={f.q} className="bg-white rounded-xl border border-gray-200 p-4">
              <summary className="font-semibold text-sm cursor-pointer text-gray-900">{f.q}</summary>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 rounded-xl border border-blue-200 p-5 text-center mb-6">
        <p className="text-sm text-gray-700 mb-3">Track the result release and rank-card steps:</p>
        <Link href="/eapcet/ap-results-2026"
          className="inline-block bg-brand hover:bg-accent text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
          AP EAPCET Results 2026 — Live Updates →
        </Link>
      </section>

      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
    </main>
  );
}
