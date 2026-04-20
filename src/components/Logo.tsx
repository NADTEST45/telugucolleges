import { useId } from "react";

/**
 * TeluguColleges logo. All variants share the same "TC" monogram mark —
 * a rounded-square tile with the brand gradient (brand-dark → brand → accent)
 * and a white T + open-C pair that reads cleanly from 16px favicon to 1024px.
 *
 * Static SVG copies live in `/public/logo/` for use in metadata, OG images,
 * and non-React contexts. Prefer these React components inside the app so the
 * mark picks up CSS-variable brand colors automatically if the @theme palette
 * is swapped.
 */

type LogoMarkProps = {
  /** Tailwind size classes. Default renders at 32px (w-8 h-8). */
  className?: string;
  /** Hide from assistive tech when paired with adjacent text of the same name. */
  decorative?: boolean;
};

/**
 * LogoMark — the TC square mark.
 *
 * Use cases:
 * - Nav tile (w-7 h-7 / w-8 h-8)
 * - Favicon fallback
 * - Loading states, empty states
 */
export function LogoMark({ className = "w-8 h-8", decorative = false }: LogoMarkProps) {
  const gradId = useId();

  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "TeluguColleges"}
      aria-hidden={decorative ? true : undefined}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-dark, #154360)" />
          <stop offset="55%" stopColor="var(--color-brand, #1a5276)" />
          <stop offset="100%" stopColor="var(--color-accent, #2e86c1)" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`url(#${gradId})`} />
      {/* T — bar + stem */}
      <rect x="8" y="17" width="24" height="7" rx="2" fill="#ffffff" />
      <rect x="16.5" y="17" width="7" height="30" rx="2" fill="#ffffff" />
      {/* C — open arc, mouth facing right */}
      <path
        d="M 52 25 A 10 10 0 1 0 52 39"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

type LogoProps = {
  /**
   * `dark` (default): dark wordmark for light backgrounds.
   * `light`: white wordmark for dark backgrounds (nav, footer).
   * `mark`: icon only, no wordmark.
   */
  variant?: "dark" | "light" | "mark";
  /** Hide from AT when adjacent text already names the brand. */
  decorative?: boolean;
  /** Extra classes applied to the outer wrapper. */
  className?: string;
};

/**
 * Logo — the full brand lockup (mark + wordmark).
 *
 * Responsive by default: mark visible always, wordmark hidden below sm
 * so it doesn't crowd mobile nav. Override via `className` if needed.
 */
export default function Logo({ variant = "dark", decorative = false, className = "" }: LogoProps) {
  if (variant === "mark") {
    return <LogoMark className={className || "w-8 h-8"} decorative={decorative} />;
  }

  const wordmarkColor = variant === "light" ? "text-white" : "text-brand";
  // blue-300 matches the existing nav `.com` tint; keep consistent on dark bg
  const dotColor = variant === "light" ? "text-blue-300" : "text-accent";

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "TeluguColleges.com"}
    >
      <LogoMark className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" decorative />
      <span
        className={`font-extrabold tracking-tight text-base sm:text-lg hidden sm:inline ${wordmarkColor}`}
        aria-hidden="true"
      >
        TeluguColleges<span className={dotColor}>.com</span>
      </span>
    </span>
  );
}
