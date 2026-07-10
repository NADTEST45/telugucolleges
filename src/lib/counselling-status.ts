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
 *  - TS: Phase-1 web options closed Jul 1; mock allotment ≤ Jul 4; option
 *    modification Jul 5–7; final Phase-1 allotment ≤ Jul 10; self-reporting
 *    Jul 10–14; Phase 2 Jul 17–28. (id: tg-eapcet-2026-web-options-closed-july-1)
 *  - AP: result declared Jul 1, rank cards live; counselling registration
 *    expected within ~a week. (id: ap-eapcet-2026-result-declared-july-1)
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
export const COUNSELLING_STATUS_AS_OF = "July 10, 2026";

export const TG_COUNSELLING_NOW: CounsellingStatus = {
  stage: "Phase 1",
  headline: "Phase-1 allotment processing is underway — the official portal is temporarily closed",
  next:
    "Check tgeapcet.nic.in for the Phase-1 allotment result. Allotted candidates must pay the fee and self-report online by July 14.",
  short: "TS Phase-1 allotment processing underway",
  portalUrl: "https://tgeapcet.nic.in",
  portalLabel: "tgeapcet.nic.in",
};

export const AP_COUNSELLING_NOW: CounsellingStatus = {
  stage: "Results out",
  headline: "Rank cards are live — APSCHE has not yet published the 2026 MPC counselling schedule",
  next:
    "Download your rank card now, then build your college & branch preference list so you can enter web options quickly once registration opens.",
  short: "AP rank cards out — counselling schedule awaited",
  portalUrl: "https://cets.apsche.ap.gov.in",
  portalLabel: "cets.apsche.ap.gov.in",
};
