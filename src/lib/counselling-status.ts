/**
 * EAPCET 2026 counselling-season status — SINGLE SOURCE OF TRUTH.
 *
 * The "Happening now" strip on /eapcet and the homepage counselling banner
 * read from here, so keeping the site current as the season progresses is a
 * one-file edit. Plain strings only — no heavy imports — so this is safe to
 * import from both client and server components.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │ HOW TO UPDATE (each time a stage completes / a date is notified):      │
 * │   1. Update `stage`, `headline`, `next`, `short` for the state(s)      │
 * │   2. Point `portalUrl`/`portalLabel` at the portal for THAT stage      │
 * │   3. Bump COUNSELLING_STATUS_AS_OF                                     │
 * │   4. Commit + push — every surface re-renders from these strings       │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * Current basis (see news.ts):
 *  - TS: Phase-1 complete (allotment ≤ Jul 10, self-reporting closed Jul 14);
 *    Phase-2 opens Jul 17 (registration Jul 17, verification Jul 18, web
 *    options Jul 18–19, allotment ≤ Jul 22). (id: tg-eapcet-2026-phase-2-opens-july-17)
 *  - AP: result declared Jul 1; first-phase counselling schedule OFFICIALLY
 *    NOTIFIED Jul 16, published in newspapers Jul 17 — registration Jul 20–29,
 *    verification Jul 22–31, web options Jul 25–31, allotment Aug 6.
 *    (id: ap-eapcet-2026-counselling-schedule-notified-july-17)
 *    Full phase table: `ap-counselling-schedule.ts`.
 */

export interface CounsellingStatus {
  /** Tiny stage chip, e.g. "Phase 1" / "Results out". */
  stage: string;
  /** One-line status headline (what just happened / is happening). */
  headline: string;
  /** The single next thing a student should do or expect. */
  next: string;
  /** Ultra-short form for the homepage banner. */
  short: string;
  /** Official portal for THIS stage. */
  portalUrl: string;
  portalLabel: string;
}

/** Last date these strings were reviewed against official/press sources. */
export const COUNSELLING_STATUS_AS_OF = "July 17, 2026";

export const TG_COUNSELLING_NOW: CounsellingStatus = {
  stage: "Phase 2",
  headline: "Phase-1 is complete — Phase-2 counselling opens July 17",
  next:
    "Phase-2 registration and slot booking open July 17, certificate verification July 18, and fresh web options July 18–19 (Phase-1 options don't carry over). Phase-2 allotment is due by July 22.",
  short: "TS Phase-2 counselling opens July 17",
  portalUrl: "https://tgeapcet.nic.in",
  portalLabel: "tgeapcet.nic.in",
};

export const AP_COUNSELLING_NOW: CounsellingStatus = {
  stage: "Phase 1",
  headline: "Counselling schedule notified — first-phase registration opens July 20",
  next:
    "Registration and processing-fee payment run July 20–29, certificate verification July 22–31, and web options July 25–31 (options can be changed on August 1). Seat allotment is released August 6, with self-joining and reporting August 7–13.",
  short: "AP counselling registration opens July 20",
  portalUrl: "https://eapcet-sche.aptonline.in",
  portalLabel: "eapcet-sche.aptonline.in",
};
