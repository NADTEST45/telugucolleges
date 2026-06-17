import type { ReactNode } from "react";

/**
 * "Numbers as heroes" stat tile — a label (12px, uppercase, muted) above a
 * bold, brand-coloured, tabular-figure value, optionally with a small sub note.
 * Reusable on college / listing pages for fee, cutoff, package, etc.
 */
export default function StatTile({
  label,
  value,
  sub,
  className = "",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-gray-100 rounded-xl p-4 bg-gray-50 ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1.5 text-xl sm:text-2xl font-extrabold text-brand tabular-nums leading-none">
        {value}
      </div>
      {sub ? <div className="mt-1 text-xs text-muted">{sub}</div> : null}
    </div>
  );
}
