import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import CounsellingToolkit from "@/components/CounsellingToolkit";
import { fmtFee } from "@/lib/colleges";
import {
  RANK_BANDS,
  BRANCH_OPTIONS,
  STATE_OPTIONS,
  parseRankBandSlug,
  getAllRankBandSlugs,
  getCollegesForBand,
  buildRankBandSlug,
  refYearLabel,
} from "@/lib/rank-band-data";
import { getCollegesMerged } from "@/lib/colleges-merged";


export const revalidate = 86400; // 24 hours — closing ranks change yearly
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRankBandSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseRankBandSlug(slug);
  if (!parsed) return { title: "Rank not found" };

  const { rank, branch, state } = parsed;
  const rankFmt = rank.toLocaleString("en-IN");
  const title = `${rankFmt} Rank in ${state.exam} — Best ${branch.label} Colleges in ${state.full}`;
  const description = `What ${branch.label} engineering colleges can you get with rank ${rankFmt} in ${state.exam} 2026? Top ${state.full} colleges where the official OC closing rank covers your score, with fees, NAAC and placements. Updated for ${refYearLabel(state)} cutoffs.`;
  const url = `${SITE_URL}/eapcet/rank/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "TeluguColleges.com",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function buildBreadcrumbJsonLd(slug: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TeluguColleges", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "EAPCET Predictor", item: `${SITE_URL}/eapcet` },
      { "@type": "ListItem", position: 3, name: label, item: `${SITE_URL}/eapcet/rank/${slug}` },
    ],
  };
}

function buildItemListJsonLd(slug: string, items: { college: { name: string; slug: string } }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/colleges/${m.college.slug}`,
      name: m.college.name,
    })),
  };
}

export default async function RankBandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseRankBandSlug(slug);
  if (!parsed) notFound();

  const { rank, branch, state } = parsed;
  const rankFmt = rank.toLocaleString("en-IN");
  const matches = getCollegesForBand(parsed, await getCollegesMerged());
  const breadcrumbLabel = `${rankFmt} rank · ${branch.label} · ${state.short}`;
  const refYearLbl = refYearLabel(state);

  // FAQ content (rendered visibly below AND emitted as FAQPage JSON-LD —
  // Google requires the schema text to match on-page content).
  const faqs = [
    {
      q: `Which ${branch.label} colleges can I get with ${rankFmt} rank in ${state.exam}?`,
      a: matches.length > 0
        ? `Based on official ${refYearLbl} convener-quota closing ranks, ${matches.length} ${state.full} college${matches.length === 1 ? "" : "s"} closed ${branch.label} at or beyond rank ${rankFmt} for OC — including ${matches.slice(0, 3).map(m => m.college.name).join(", ")}. Cutoffs shift every year, so treat these as realistic targets rather than guarantees.`
        : `In the ${refYearLbl} reference data, no ${state.full} college in our dataset had an OC closing rank of ${rankFmt} or beyond for ${branch.label}. Consider nearby branches or use the full predictor with your exact category.`,
    },
    {
      q: `Is ${rankFmt} a good rank in ${state.exam} 2026?`,
      a: `It depends on the branch and category. For ${branch.label}, ${matches.length > 0 ? `${matches.length} college${matches.length === 1 ? " was" : "s were"} reachable at this rank for OC candidates in ${refYearLbl}` : "options for OC candidates were limited at this rank in the reference year"}. Reserved-category (BC, SC, ST, EWS) closing ranks are substantially higher than OC, so the same rank reaches more colleges in those categories.`,
    },
    {
      q: `Do these cutoffs apply to all categories?`,
      a: `No — the table on this page uses OC (boys) closing ranks as the reference. Closing ranks for BC-A/B/C/D/E, SC, ST and EWS are higher (more lenient), and girls' closing ranks also differ. Use the TeluguColleges EAPCET predictor for a list matched to your exact category and gender.`,
    },
    {
      q: `When is ${state.exam} 2026 counselling?`,
      a: `${state.exam === "AP EAPCET" ? "AP EAPCET 2026 results are available; confirm the current counselling round on the official portal." : "The published TG EAPCET 2026 final-phase and internal-sliding deadlines have passed."} Official closing ranks for 2026 are published after each allotment round.`,
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
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/eapcet" className="hover:text-accent">EAPCET Predictor</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{breadcrumbLabel}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        Best {branch.label} Colleges for {rankFmt} Rank — {state.exam}
      </h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Colleges in {state.full} where the official OC closing rank
        ({refYearLabel(state)} counselling) covered rank{" "}
        <strong>{rankFmt}</strong> for{" "}
        <strong>{branch.label}</strong>. If your {state.exam} rank is around {rankFmt},
        the colleges below are realistic — admission isn&rsquo;t guaranteed (cutoffs
        shift each year and depend on category × gender), but these are your most
        defensible targets. For a personalised list using your category and gender,
        use the{" "}
        <Link href="/eapcet" className="text-accent font-semibold underline">
          full predictor
        </Link>
        .
      </p>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <div className="text-xs text-gray-500">Reachable colleges</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5">{matches.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <div className="text-xs text-gray-500">Reference year</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5">
            {refYearLabel(state)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <div className="text-xs text-gray-500">Category</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5">OC (Boys)</div>
        </div>
      </div>

      {/* Results table */}
      {matches.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <p className="text-sm text-amber-900 leading-relaxed">
            No colleges in our {state.full} {branch.label} cutoff dataset have an
            OC closing rank ≥ {rankFmt}. Try a higher rank band, a different
            branch, or use the{" "}
            <Link href="/eapcet" className="font-semibold underline">
              full predictor
            </Link>{" "}
            for a custom search.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
          <table className="w-full bg-white rounded-xl shadow-sm text-sm min-w-[640px] border border-gray-100">
            <thead>
              <tr className="bg-brand text-white text-left">
                <th className="px-3 py-2.5 text-xs font-semibold w-10">#</th>
                <th className="px-3 py-2.5 text-xs font-semibold">College</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-right">Closing rank</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-right">Annual fee</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-center">NAAC</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, i) => (
                <tr key={m.college.id} className="border-b border-gray-100 last:border-0 hover:bg-blue-50/30">
                  <td className="px-3 py-2.5 text-xs text-gray-500 font-mono">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/colleges/${m.college.slug}`}
                      className="font-semibold text-sm text-gray-900 hover:text-accent"
                    >
                      {m.college.name}
                    </Link>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {m.college.code} · {m.college.district} · {m.college.type}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right text-sm font-mono">
                    {m.closingRank.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2.5 text-right text-xs">
                    {m.college.fee > 0 ? fmtFee(m.college.fee) : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-center text-xs">
                    {m.college.naac && m.college.naac !== "-" ? m.college.naac : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cross-links to other rank bands */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Other rank bands for {branch.label} in {state.short}
        </h2>
        <div className="flex flex-wrap gap-2">
          {RANK_BANDS.filter(r => r !== rank).map(r => {
            const otherSlug = buildRankBandSlug(r, branch, state);
            return (
              <Link
                key={r}
                href={`/eapcet/rank/${otherSlug}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-accent transition-colors"
              >
                {r.toLocaleString("en-IN")} rank
              </Link>
            );
          })}
        </div>
      </section>

      {/* Cross-links to other branches at this rank */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Other branches at {rankFmt} rank ({state.short})
        </h2>
        <div className="flex flex-wrap gap-2">
          {BRANCH_OPTIONS.filter(b => b.slug !== branch.slug).map(b => {
            const otherSlug = buildRankBandSlug(rank, b, state);
            return (
              <Link
                key={b.slug}
                href={`/eapcet/rank/${otherSlug}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-accent transition-colors"
              >
                {b.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Cross-link to other state */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Switch state
        </h2>
        <div className="flex flex-wrap gap-2">
          {STATE_OPTIONS.filter(s => s.slug !== state.slug).map(s => {
            const otherSlug = buildRankBandSlug(rank, branch, s);
            return (
              <Link
                key={s.slug}
                href={`/eapcet/rank/${otherSlug}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-accent transition-colors"
              >
                {s.full} ({s.exam})
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA back to predictor */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 text-center mb-6">
        <p className="text-sm text-gray-700 mb-3">
          Want to filter by your category, gender, or specialised branch?
        </p>
        <Link
          href="/eapcet"
          className="inline-block bg-brand hover:bg-accent text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          Use the full EAPCET College Predictor →
        </Link>
      </div>

      {/* Counselling toolset cross-links */}
      <CounsellingToolkit className="mb-8" />

      {/* FAQs (visible content matching FAQPage JSON-LD) */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          {rankFmt} Rank in {state.exam} — FAQs
        </h2>
        <div className="space-y-3">
          {faqs.map(f => (
            <details key={f.q} className="bg-white rounded-xl border border-gray-200 p-4 group">
              <summary className="font-semibold text-sm cursor-pointer text-gray-900">{f.q}</summary>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Methodology disclaimer */}
      <p className="text-xs text-gray-500 leading-relaxed">
        Methodology: closing ranks are sourced from official{" "}
        {state.exam === "TG EAPCET" ? "TSCHE / JNTU Hyderabad" : "APSCHE / JNTU Kakinada"}{" "}
        last-rank statements for {refYearLabel(state)}.
        Reference data is OC (boys) — actual cutoffs vary by category and gender,
        and the convenor-quota cutoffs in 2026 may shift higher or lower than
        the reference year. Use this list as a shortlist for further research,
        not as an admission guarantee.
      </p>

      {/* JSON-LD */}
      <JsonLd data={buildBreadcrumbJsonLd(slug, breadcrumbLabel)} />
      <JsonLd data={faqJsonLd} />
      {matches.length > 0 && (
        <JsonLd data={buildItemListJsonLd(slug, matches)} />
      )}
    </main>
  );
}
