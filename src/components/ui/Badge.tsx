import type { ReactNode } from "react";

/**
 * Status / label badge with fixed-meaning tones. Centralises the badge styles
 * that were previously inlined ad-hoc across the homepage and listing pages.
 * Each tone's colour pairing meets WCAG AA on its tint background.
 */
export type BadgeTone =
  | "government"
  | "deemed"
  | "private"
  | "privateUniversity"
  | "nirf"
  | "naac"
  | "nba"
  | "accent"
  | "alert"
  | "neutral";

const TONES: Record<BadgeTone, string> = {
  government: "bg-green-100 text-green-700",
  deemed: "bg-amber-100 text-amber-700",
  private: "bg-sky-100 text-sky-700",
  privateUniversity: "bg-violet-100 text-violet-700",
  nirf: "bg-rose-100 text-rose-700",
  naac: "bg-amber-100 text-amber-700",
  nba: "bg-purple-100 text-purple-700",
  accent: "bg-blue-50 text-accent",
  alert: "bg-red-100 text-red-700",
  neutral: "bg-gray-100 text-gray-700",
};

export default function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
