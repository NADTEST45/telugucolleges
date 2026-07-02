/**
 * CollegeMonogram — a pure-CSS avatar showing the college's initials in a
 * colored circle. Server-safe (no "use client"), no images, deterministic
 * color derived from the college code so the same college always renders
 * the same color everywhere (directory cards, detail pages, compare, etc.).
 *
 * Usage: <CollegeMonogram name={c.name} code={c.code} size="sm" />
 */

const PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
  "bg-orange-100 text-orange-700",
  "bg-cyan-100 text-cyan-700",
  "bg-fuchsia-100 text-fuchsia-700",
] as const;

const SIZES = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

/** Simple deterministic string hash (djb2 variant), stable across builds. */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return Math.abs(h | 0);
}

const STOP_WORDS = new Set(["of", "and", "the", "for", "&", "college", "institute"]);

/** First letters of the first two significant words, e.g. "JNTU Hyderabad" → "JH". */
function initials(name: string): string {
  const words = name
    .split(/\s+/)
    .filter(w => /^[A-Za-z]/.test(w) && !STOP_WORDS.has(w.toLowerCase()));
  const picked = (words.length > 0 ? words : name.split(/\s+/).filter(Boolean)).slice(0, 2);
  return picked.map(w => w[0]!.toUpperCase()).join("") || "?";
}

export default function CollegeMonogram({
  name,
  code,
  size = "md",
}: {
  name: string;
  code: string;
  size?: "sm" | "md" | "lg";
}) {
  const color = PALETTE[hashString(code || name) % PALETTE.length];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full font-bold shrink-0 select-none ${color} ${SIZES[size]}`}
    >
      {initials(name)}
    </span>
  );
}
