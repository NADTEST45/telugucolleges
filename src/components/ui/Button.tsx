import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared button primitive — the single source for the site's CTA styles.
 * Consolidates the ad-hoc "px-6 py-3 rounded-xl bg-brand text-white font-bold"
 * strings that were previously re-assembled on every page (hero, banners,
 * compare tool, detail actions).
 *
 * Renders as a Next <Link> when `href` is given, otherwise a <button>.
 * Variants:
 *   - primary   solid brand blue — main action (Explore Colleges, Predict)
 *   - secondary translucent/outline — secondary action on coloured surfaces
 *   - ghost     quiet brand-on-light action (Compare tool, inline CTAs)
 * Sizes: sm (banner chips) · md (default) · lg (hero).
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "white";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all active:scale-[0.98] whitespace-nowrap";

const VARIANTS: Record<ButtonVariant, string> = {
  // Solid brand on light backgrounds.
  primary: "bg-brand text-white hover:bg-brand-dark shadow-sm",
  // Translucent/outline for use on dark/gradient surfaces (e.g. hero).
  secondary:
    "bg-white/15 text-white border border-white/30 hover:bg-white/25",
  // Quiet brand action on light surfaces.
  ghost: "bg-blue-50 text-brand hover:bg-blue-100",
  // Solid white with brand text — the primary CTA on a brand-gradient hero.
  white: "bg-white text-brand hover:bg-blue-50 shadow-xl",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 sm:px-8 py-3 sm:py-3.5 text-base sm:text-lg",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  onClick,
  type = "button",
  ariaLabel,
}: CommonProps & {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
