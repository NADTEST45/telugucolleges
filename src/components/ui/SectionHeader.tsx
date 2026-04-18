import React from "react";
import Link from "next/link";

/**
 * SectionHeader — consistent h2 + optional description + trailing link.
 * Replaces the six inconsistent h2 patterns across pages.
 */
export function SectionHeader({
  title,
  description,
  action,
  actionLabel,
  actionHref,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-[color:var(--color-brand-700)] shrink-0">{icon}</span>}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h2>
        </div>
        {action ? action : (actionHref && actionLabel ? (
          <Link href={actionHref} className="shrink-0 text-sm font-semibold text-[color:var(--color-brand-500)] hover:underline">
            {actionLabel} →
          </Link>
        ) : null)}
      </div>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
}
