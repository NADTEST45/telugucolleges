/**
 * Tiny display formatters. CLIENT-SAFE — no data imports. Extracted from
 * colleges.ts so client components can format fees without pulling the
 * full COLLEGES dataset into the browser bundle.
 */
export const fmtFee = (n: number) => n ? `₹${n.toLocaleString("en-IN")}` : "—";

/** Unknown establishment years are null; never turn a sentinel into a fact. */
export const fmtEstablishedYear = (year: number | null): string =>
  year && year > 1800 ? String(year) : "Not verified";

/** Format course fee (moved from university-courses.ts so client components
 * can use it without pulling the course dataset into the bundle). */
export const fmtCourseFee = (fee: number): string => {
  return `₹${fee.toLocaleString("en-IN")}`;
};
