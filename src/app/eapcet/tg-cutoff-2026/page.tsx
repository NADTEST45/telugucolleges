import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { TS_CUTOFF_BRANCHES, getTSCutoffRows } from "@/lib/ts-cutoff-2026";

const url = `${SITE_URL}/eapcet/tg-cutoff-2026`;

export const revalidate = 86400;

const title = "TG EAPCET 2026 Cutoff — Branch-wise & College-wise Closing Ranks";
const description =
  "TG EAPCET 2026 cutoff ranks for CSE, ECE, EEE, Civil, Mechanical, IT, AI/ML and more — college-wise closing ranks based on official TSCHE 2024-25 & 2023-24 last-rank data. Counselling registration June 19–28; web options June 25–July 1; Phase-1 allotment by July 10, 2026.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "TeluguColleges.com", type: "website", locale: "en_IN" },
  twitter: { card: "summary", title, description },
};

export default function TGCutoff2026HubPage() {
  const branchStats = TS_CUTOFF_BRANCHES.map(b => {
    const rows = getTSCutoffRows(b.slug);
    return { ...b, count: rows.length, top: rows[0] };
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: "TG EAPCET 2026 Cutoff", item: url },
    ],
  };

  const faqs = [
    {
      q: "When will the official TG EAPCET 2026 cutoff be released?",
      a: "Official closing ranks appear after each counselling phase. With registration June 19–28, web options June 25–July 1 and Phase-1 allotment due by July 10, 2026, the Phase-1 last-rank statement should appear in mid-July, and final-phase cutoffs by August 2026.",
    },
    {
      q: "What is a good rank in TG EAPCET 2026?",
      a: "For CSE in the top Telangana colleges, OC closing ranks have historically been within the first 5,000–15,000. Mid-tier colleges extend to 50,000+, and many colleges admit well beyond 1,00,000 — especially in non-circuit branches and reserved categories. Check the branch-wise tables for exact reference ranks.",
    },
    {
      q: "Are these tables a prediction of 2026 cutoffs?",
      a: "No. These are official TSCHE last-rank statements from 2024-25 and 2023-24 convener-quota counselling — not a prediction. They are the strongest available reference for 2026; actual 2026 closing ranks typically vary ±10–20% depending on seat matrix and applicant volume.",
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
        <span className="text-gray-700 font-medium">TG Cutoff 2026</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        TG EAPCET 2026 Cutoff — Closing Ranks (Branch-wise)
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Branch-wise cutoffs for TG EAPCET 2026 counselling, built from official TSCHE
        last-rank statements (2024–25 and 2023–24) — not a prediction. Phase-1 web options
        closed <strong>July 1</strong>; mock allotment is due by <strong>July 4</strong>{" "}
        (revise options July 5–7) and the final Phase-1 allotment by{" "}
        <strong>July 10, 2026</strong>. Pick a branch below for the full college-wise table,
        or use the{" "}
        <Link href="/eapcet" className="text-accent font-semibold underline">College Predictor</Link>{" "}
        for a category- and gender-specific list once you have your rank.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {branchStats.map(b => (
          <Link key={b.slug} href={`/eapcet/tg-cutoff-2026/${b.slug}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-accent hover:shadow-sm transition-all">
            <div className="font-bold text-sm text-gray-900 mb-1">{b.label} Cutoff 2026</div>
            <div className="text-xs text-gray-500">
              {b.count} colleges with official last-rank data
              {b.top?.oc2024 ? <> · tightest OC close: {b.top.oc2024.toLocaleString("en-IN")}</> : null}
            </div>
          </Link>
        ))}
      </div>

      <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-8">
        <h2 className="text-base sm:text-lg font-bold mb-3">How TG EAPCET cutoffs work</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-3">
          <p>
            A cutoff (closing rank) is the last rank admitted to a college-branch combination in
            convener-quota counselling. TSCHE publishes official &ldquo;Last Rank Statement&rdquo; PDFs
            after each phase. Closing ranks differ by <strong>category</strong> (OC, BC-A/B/C/D/E, SC, ST, EWS)
            and <strong>gender</strong>, and relax in later phases as candidates slide or exit.
          </p>
          <p>
            70% of seats in private colleges (convener quota) and all university-college seats are
            filled through this counselling; the remaining 30% (management/Category-B quota) does
            not follow these ranks.
          </p>
          <p>
            In the 2023 statements, a value of <strong>1,56,852</strong> (final phase) or{" "}
            <strong>1,56,840</strong> (Phase-1) means the branch <em>closed at the last rank</em> —
            seats were still available when that phase ended, so effectively any qualified rank
            could get in.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">TG EAPCET 2026 Cutoff — FAQs</h2>
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
        <p className="text-sm text-gray-700 mb-3">Track the full TGCHE phase-wise counselling schedule:</p>
        <Link href="/eapcet/ts-counselling-dates-2026"
          className="inline-block bg-brand hover:bg-accent text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
          TS Counselling Dates 2026 — Phase-wise Schedule →
        </Link>
      </section>

      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
    </main>
  );
}
