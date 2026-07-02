/**
 * Tiny display formatters. CLIENT-SAFE — no data imports. Extracted from
 * colleges.ts so client components can format fees without pulling the
 * full COLLEGES dataset into the browser bundle.
 */
export const fmtFee = (n: number) => n ? `₹${n.toLocaleString("en-IN")}` : "—";
