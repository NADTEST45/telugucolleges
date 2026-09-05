import Link from "next/link";
import { type College, fmtFee } from "@/lib/colleges";
import ShortlistButton from "@/components/ShortlistButton";
import CollegeMonogram from "@/components/CollegeMonogram";
import Badge from "@/components/ui/Badge";

/**
 * Server-rendered college card. The only client portion is the
 * <ShortlistButton/> island; everything else is plain HTML emitted by
 * the server, which keeps the colleges dataset out of the JS bundle.
 */
function nirfLabel(rank: number): string {
  if (rank <= 0) return "";
  if (rank <= 100) return `#${rank}`;
  if (rank <= 150) return "101-150";
  if (rank <= 200) return "151-200";
  return "201-300";
}

export default function CollegeCard({ c, borderClass }: { c: College; borderClass: string }) {
  const feeLabel =
    c.type === "Deemed University" || c.type === "Private University" || c.type === "Government"
      ? "Tuition/yr"
      : "Convener Fee";

  const typeTone =
    c.type === "Government"
      ? "government"
      : c.type === "Deemed University"
      ? "deemed"
      : c.type === "Private University"
      ? "privateUniversity"
      : "private";

  return (
    <div className={`cv-card relative bg-white rounded-xl px-3 sm:px-5 py-3 sm:py-4 shadow-sm hover:shadow-md transition-all border-l-4 ${borderClass}`}>
      {/* Full-card link — covers entire card for navigation. data-inline opts
          out of the global 44px touch-target rule: the whole card IS the target. */}
      <Link href={`/colleges/${c.slug}`} data-inline className="absolute inset-0 z-0 rounded-xl" aria-label={c.name} />
      {/* Shortlist button — positioned outside the Link DOM to avoid iOS Safari tap conflicts */}
      <div className="absolute top-2 right-2 z-10">
        <ShortlistButton collegeSlug={c.slug} />
      </div>
      {/* Desktop: side-by-side | Mobile: stacked */}
      <div className="relative z-[1] pointer-events-none flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0 flex items-start gap-2.5 sm:gap-3">
          <CollegeMonogram name={c.name} code={c.code} size="sm" />
          <div className="flex-1 min-w-0">
          <div className="font-bold text-sm sm:text-[15px] leading-tight pr-10">{c.name}</div>
          <div className="text-xs text-muted mt-0.5 truncate">{c.district}, {c.state} · {c.affiliation}{c.year ? ` · Est. ${c.year}` : ""}</div>
          <div className="flex gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
            <Badge tone={typeTone}>{c.type}</Badge>
            {c.nirf > 0 && <Badge tone="nirf">NIRF {nirfLabel(c.nirf)}</Badge>}
            {c.naac && c.naac !== "-" && <Badge tone="naac">NAAC {c.naac}</Badge>}
            {c.nba && <Badge tone="nba">NBA</Badge>}
            {c.branches.includes("B.Pharm") && <Badge tone="accent">Pharmacy</Badge>}
            {c.branches.includes("MBBS") && <Badge tone="nirf">Medical</Badge>}
          </div>
          </div>
        </div>
        {/* Fee-first stat block — fee is the primary decision input for the
            parent audience, so it leads large; packages follow as secondary
            context in a single muted line. */}
        <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0 sm:w-48">
          <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-1">
            <div className="text-xs text-muted">{feeLabel}</div>
            <div className="font-extrabold text-brand text-base sm:text-lg tabular-nums leading-none">{fmtFee(c.fee)}</div>
          </div>
          <div className="flex sm:justify-end gap-3 mt-1 text-xs">
            <span className={c.placements.avg > 0 ? "text-success font-semibold" : "text-gray-300"}>
              Avg {c.placements.avg > 0 ? `₹${c.placements.avg}L` : "—"}
            </span>
            <span className="text-gray-300" aria-hidden="true">·</span>
            <span className={c.placements.highest > 0 ? "text-warning font-semibold" : "text-gray-300"}>
              High {c.placements.highest > 0 ? `₹${c.placements.highest}L` : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
