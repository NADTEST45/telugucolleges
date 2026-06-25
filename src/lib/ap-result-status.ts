/**
 * AP EAPCET 2026 result status — SINGLE SOURCE OF TRUTH.
 *
 * Every public surface that states the AP EAPCET result date/status reads from
 * here, so the "result is out" flip is a one-commit change on result day. This
 * module holds only plain strings/booleans — no heavy imports — so it is safe
 * to import from client components (e.g. the predictor page) as well as server
 * components.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ TO FLIP ON RESULT DAY                                                       │
 * │ (the moment cets.apsche.ap.gov.in actually publishes the rank cards):       │
 * │   1. set `declared: true`                                                   │
 * │   2. set `declaredAt` to the IST date (YYYY-MM-DD) and `asOf` to today      │
 * │   3. update `counsellingExpected` once APSCHE notifies the schedule         │
 * │   4. prepend AP_RESULT_DECLARED_NEWS (below) to NEWS_ITEMS in news.ts        │
 * │   5. commit + push — the rebuild flips every page automatically             │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Sourcing for the "awaited" window: as of 2026-06-25 APSCHE has still not
 * notified an official date; press reports (Eenadu, June 21) point to release
 * by the end of June 2026, held up by CBSE revised Class XII marks (Inter marks
 * carry 25% weightage in the final rank). Treat as expected, not official.
 */

export interface ApResultStatus {
  /** Flip to true the moment rank cards are live on the official portal. */
  declared: boolean;
  /** Last date this status was reviewed against official/press sources. */
  asOf: string; // YYYY-MM-DD
  /** Human window while awaited, e.g. "the end of June 2026". */
  expectedWindow: string;
  /** Tight form for the key-dates table cell. */
  expectedShort: string;
  /** Set on result day (YYYY-MM-DD); null while awaited. */
  declaredAt: string | null;
  /** Official rank-card portal. */
  resultUrl: string;
  /** AP convener-quota counselling portal. */
  counsellingPortal: string;
  /** When counselling registration is expected to open. */
  counsellingExpected: string;
}

export const AP_EAPCET_2026_RESULT: ApResultStatus = {
  declared: false,
  asOf: "2026-06-25",
  expectedWindow: "the end of June 2026",
  expectedShort: "End-June 2026 (expected)",
  declaredAt: null,
  resultUrl: "https://cets.apsche.ap.gov.in",
  counsellingPortal: "https://eapcet-sche.aptonline.in",
  counsellingExpected: "early July 2026",
};

function fmt(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "as of 25 June 2026" — for "still awaited" copy. */
export function apResultAsOf(): string {
  return `as of ${fmt(AP_EAPCET_2026_RESULT.asOf)}`;
}

/** Key-dates table cell: "Declared 30 June 2026" | "End-June 2026 (expected)". */
export function apResultDateCell(): string {
  const r = AP_EAPCET_2026_RESULT;
  return r.declared && r.declaredAt ? `Declared ${fmt(r.declaredAt)}` : r.expectedShort;
}

/**
 * Sentence fragment for prose, e.g.
 *   awaited:  "are expected by the end of June 2026"
 *   declared: "were declared on 30 June 2026"
 */
export function apResultExpectedPhrase(): string {
  const r = AP_EAPCET_2026_RESULT;
  return r.declared && r.declaredAt
    ? `were declared on ${fmt(r.declaredAt)}`
    : `are expected by ${r.expectedWindow}`;
}

/** One-line status sentence used in banners/intros. */
export function apResultStatusSentence(): string {
  const r = AP_EAPCET_2026_RESULT;
  return r.declared && r.declaredAt
    ? `AP EAPCET 2026 rank cards are out — download yours at ${r.resultUrl}.`
    : `AP EAPCET 2026 rank cards are still awaited (${apResultAsOf()}); press reports point to release by ${r.expectedWindow}. No official date has been notified.`;
}

/**
 * Ready-made news item to prepend to NEWS_ITEMS in news.ts on result day.
 * Edit the bracketed placeholders (rank-card live time, any official line)
 * before committing. Kept here so the flip lives beside the status it depends
 * on; it is NOT imported anywhere until you move it into news.ts.
 *
 * export const AP_RESULT_DECLARED_NEWS = {
 *   id: "ap-eapcet-2026-result-declared",
 *   date: "2026-06-__",
 *   title: "AP EAPCET 2026 Results Declared — Download Your Rank Card at cets.apsche.ap.gov.in",
 *   summary: "APSCHE has declared the AP EAPCET 2026 results. Rank cards are live at "
 *     + "cets.apsche.ap.gov.in — log in with your hall ticket number and date of birth. "
 *     + "Counselling registration is expected to follow shortly; build your web-options "
 *     + "list now with your rank.",
 *   body: "...",
 *   category: "eapcet",
 *   state: "AP",
 *   priority: "high",
 *   source: "APSCHE — AP EAPCET 2026 (cets.apsche.ap.gov.in)",
 *   sourceUrl: "https://cets.apsche.ap.gov.in",
 *   tags: ["AP EAPCET", "Result", "Rank Card", "2026"],
 * };
 */
