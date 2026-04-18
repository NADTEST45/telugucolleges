import React from "react";

/**
 * Badge — small pill used to label a college with a single attribute.
 *
 * Only 4 canonical variants exist. Every new chip on the site must map to one.
 * This replaces the 6-color chip chaos documented in DESIGN-AUDIT.md.
 */
export type BadgeVariant = "type" | "rank" | "accreditation" | "specialty" | "neutral";
export type BadgeTone =
  | "government" | "private" | "deemed" | "stateuni"
  | "engineering" | "management" | "medical" | "pharmacy"
  | "nirf" | "naac" | "nba"
  | "neutral" | "success" | "info";

const TONES: Record<BadgeTone, string> = {
  // Type
  government: "bg-[color:var(--color-type-government-50)] text-[color:var(--color-type-government-600)]",
  private:    "bg-[color:var(--color-type-private-50)] text-[color:var(--color-type-private-600)]",
  deemed:     "bg-[color:var(--color-type-deemed-50)] text-[color:var(--color-type-deemed-600)]",
  stateuni:   "bg-[color:var(--color-type-stateuni-50)] text-[color:var(--color-type-stateuni-600)]",
  // Category (specialty)
  engineering: "bg-[color:var(--color-cat-engineering-50)] text-[color:var(--color-cat-engineering-600)]",
  management:  "bg-[color:var(--color-cat-management-50)] text-[color:var(--color-cat-management-600)]",
  medical:     "bg-[color:var(--color-cat-medical-50)] text-[color:var(--color-cat-medical-600)]",
  pharmacy:    "bg-[color:var(--color-cat-pharmacy-50)] text-[color:var(--color-cat-pharmacy-600)]",
  // Accreditation / rank
  nirf: "bg-rose-50 text-rose-700",
  naac: "bg-amber-50 text-amber-700",
  nba:  "bg-purple-50 text-purple-700",
  // Generic
  neutral: "bg-gray-100 text-gray-600",
  success: "bg-[color:var(--color-success-50)] text-[color:var(--color-success-600)]",
  info:    "bg-[color:var(--color-info-50)] text-[color:var(--color-info-600)]",
};

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Helper: map a college Type string to the canonical tone. */
export function toneForType(type: string): BadgeTone {
  if (type === "Government") return "government";
  if (type === "Deemed University") return "deemed";
  if (type === "Private University") return "stateuni";
  return "private";
}
