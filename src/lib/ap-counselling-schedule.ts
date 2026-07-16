/**
 * AP EAPCET 2026 counselling schedule — SINGLE SOURCE OF TRUTH.
 *
 * Mirrors `counselling-schedule.ts` (TS/TGCHE) and reuses its milestone shape
 * and .ics builder, so the AP phase table and "Add to Calendar" behave exactly
 * like the TS ones.
 *
 * Basis: APSCHE "APEAPCET-2026 ADMISSIONS COUNSELLING SCHEDULE — FIRST PHASE
 * SCHEDULE". Admission committee met 15.07.2026, notification issued
 * 16.07.2026, published in newspapers 17.07.2026. Dates below are transcribed
 * verbatim from that notification; the official "No. of days" column is kept in
 * `days` so the table can be checked against the source at a glance.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │ WHEN APSCHE NOTIFIES PHASE 2 / FINAL PHASE:                            │
 * │   1. Append a new CounsellingPhase to AP_COUNSELLING_PHASES            │
 * │   2. Update AP_COUNSELLING_NOW in counselling-status.ts                │
 * │   3. Prepend a news item and bump AP_SCHEDULE_AS_OF                    │
 * └────────────────────────────────────────────────────────────────────────┘
 */

import type { CounsellingMilestone, CounsellingPhase } from "./counselling-schedule";
import type { IcsCalendarConfig } from "./counselling-schedule";

/** Convener-quota counselling portal — where registration/options actually happen. */
export const AP_COUNSELLING_PORTAL = "https://eapcet-sche.aptonline.in";

/** APSCHE portal carrying the notification itself. */
export const AP_NOTIFICATION_PORTAL = "https://cets.apsche.ap.gov.in";

/** Last date this schedule was checked against the official notification. */
export const AP_SCHEDULE_AS_OF = "July 17, 2026";

/** Calendar identity for AP .ics downloads (see counselling-schedule.buildIcs). */
export const AP_ICS_CONFIG: IcsCalendarConfig = {
  examLabel: "AP EAPCET",
  authority: "APSCHE",
  portal: AP_COUNSELLING_PORTAL,
};

/**
 * The three administrative rows at the top of the official notification. They
 * are provenance, not student action items, so they render as a source line
 * rather than as calendar-able milestones.
 */
export const AP_NOTIFICATION_TRAIL: { event: string; date: string }[] = [
  { event: "Admission committee meeting", date: "July 15, 2026" },
  { event: "Issue of notification", date: "July 16, 2026" },
  { event: "Publication in newspapers", date: "July 17, 2026" },
];

/**
 * Student-facing first-phase milestones, in official order. `days` is APSCHE's
 * own "No. of days" figure — kept only where the notification states one.
 */
export interface ApCounsellingMilestone extends CounsellingMilestone {
  /** Official "No. of days" column; absent for single-day items. */
  days?: number;
}

export const AP_PHASE_1_MILESTONES: ApCounsellingMilestone[] = [
  {
    id: "ap-p1-registration",
    event: "Registration cum payment of processing fee",
    dates: "July 20 – 29, 2026",
    days: 10,
    start: "2026-07-20",
    deadline: "2026-07-29",
    calendarTitle: "Registration & processing fee closes",
  },
  {
    id: "ap-p1-verification",
    event: "Verification of uploaded certificates at HLCs (online)",
    dates: "July 22 – 31, 2026",
    days: 10,
    start: "2026-07-22",
    deadline: "2026-07-31",
    calendarTitle: "Certificate verification ends",
  },
  {
    id: "ap-p1-web-options",
    event: "Web options entry",
    dates: "July 25 – 31, 2026",
    days: 7,
    start: "2026-07-25",
    deadline: "2026-07-31",
    calendarTitle: "Web options entry closes",
  },
  {
    id: "ap-p1-change-options",
    event: "Changing of web options",
    dates: "August 1, 2026",
    deadline: "2026-08-01",
    calendarTitle: "Last day to change web options",
  },
  {
    id: "ap-p1-allotment",
    event: "Release of seat allotments",
    dates: "August 6, 2026",
    deadline: "2026-08-06",
    calendarTitle: "Seat allotment result",
  },
  {
    id: "ap-p1-self-report",
    event: "Self joining and reporting at college",
    dates: "August 7 – 13, 2026",
    days: 7,
    start: "2026-08-07",
    deadline: "2026-08-13",
    calendarTitle: "Self joining & reporting closes",
  },
  {
    id: "ap-p1-classes",
    event: "Attending classes at college",
    dates: "August 10, 2026",
    deadline: "2026-08-10",
    calendarTitle: "Classes begin",
  },
];

export const AP_COUNSELLING_PHASES: CounsellingPhase[] = [
  {
    id: "ap-phase-1",
    title: "First Phase — July 20 to August 13, 2026",
    tag: "AP EAPCET P1",
    milestones: AP_PHASE_1_MILESTONES,
  },
];

/** Flatten AP phases into the shape buildIcs expects. */
export function apMilestonesForIcs(): {
  milestone: CounsellingMilestone;
  phaseTag: string;
}[] {
  return AP_COUNSELLING_PHASES.flatMap(p =>
    p.milestones.map(milestone => ({ milestone, phaseTag: p.tag }))
  );
}
