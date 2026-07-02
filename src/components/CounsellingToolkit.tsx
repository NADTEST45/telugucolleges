import Link from "next/link";

/**
 * Cross-link block for the EAPCET counselling toolset. Purely presentational
 * (no hooks), so it renders from both server and client components. Rendered
 * on /eapcet, the calculators, and rank-band pages so every tool is one tap
 * from every other tool — during counselling these were previously only
 * discoverable from scattered cards (the fee calculator wasn't linked from
 * /eapcet at all).
 */
const TOOLS: { href: string; label: string; desc: string; tag?: string }[] = [
  {
    href: "/eapcet",
    label: "College Predictor",
    desc: "See which colleges match your rank, category & branch.",
  },
  {
    href: "/eapcet/web-options-generator",
    label: "Web Options Generator",
    desc: "Auto-build a ready-to-enter preference list, tagged safe/moderate/reach.",
  },
  {
    href: "/fee-calculator",
    label: "Fee Calculator",
    desc: "Estimate the full 4-year B.Tech cost — tuition, hostel & extras.",
  },
  {
    href: "/eapcet/certificate-verification-documents",
    label: "Documents Checklist",
    desc: "Every certificate you need for verification — AP & TS.",
  },
  {
    href: "/eapcet/ts-counselling-dates-2026",
    label: "TS Counselling Dates",
    desc: "Full TGCHE phase-wise schedule and deadlines.",
    tag: "TS",
  },
  {
    href: "/eapcet/ap-web-options",
    label: "AP Web Options Guide",
    desc: "Step-by-step option entry and priority-order strategy.",
    tag: "AP",
  },
];

export default function CounsellingToolkit({
  current,
  className = "",
}: {
  /** href of the page rendering the block — that tool is hidden from the grid. */
  current?: string;
  className?: string;
}) {
  const tools = TOOLS.filter(t => t.href !== current);
  return (
    <section className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm ${className}`}>
      <h2 className="text-base sm:text-lg font-bold mb-1">Counselling toolkit</h2>
      <p className="text-xs text-gray-500 mb-3">
        Free tools for every step — from rank card to seat allotment.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {tools.map(t => (
          <Link
            key={t.href}
            href={t.href}
            className="group block rounded-lg border border-gray-200 p-3 hover:border-accent hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-900 group-hover:text-accent">
                {t.label}
              </span>
              {t.tag && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    t.tag === "AP" ? "bg-green-100 text-green-700" : "bg-blue-100 text-accent"
                  }`}
                >
                  {t.tag}
                </span>
              )}
              <span aria-hidden className="ml-auto text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{t.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
