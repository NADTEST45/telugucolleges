/** Small shared status records; safe to import from client components. */
export interface CounsellingStatus {
  stage: string;
  headline: string;
  next: string;
  short: string;
  portalUrl: string;
  portalLabel: string;
}

/** Review date, not a claim that every linked notice has been updated. */
export const COUNSELLING_STATUS_AS_OF = "September 5, 2026";
export const COUNSELLING_REVIEWED_AT = "2026-09-05";
export const TG_SCHEDULE_SOURCE = "https://tgeapcetd.nic.in/files/TGEAPCET2026DETNOTIFICATION.PDF";
export const TG_SPOT_SOURCE = "https://tgeapcetd.nic.in/files/TGEAPCET2026SPOTADMNSGUIDELINES.pdf";

export const TG_COUNSELLING_NOW: CounsellingStatus = {
  stage: "Post-schedule guidance",
  headline: "Published engineering rounds and August 19–20 spot window have passed",
  next: "The 2026 engineering spot-admission guidelines scheduled admissions for August 19–20. Confirm any later opportunity with a new official notice. The separate MPC pharmacy round schedules allotment by September 6; it does not reopen engineering admissions.",
  short: "TS published rounds ended — check current college notices",
  portalUrl: "https://tgeapcet.nic.in",
  portalLabel: "tgeapcet.nic.in",
};

export const AP_COUNSELLING_NOW: CounsellingStatus = {
  stage: "Check official notice",
  headline: "AP first-phase dates are recorded; confirm the current admission window",
  next: "The AP counselling portal could not be reached during our September 5 review. Check the official portal for the active round, web-options dates and reporting deadline; the recorded first-phase reporting window ended August 13.",
  short: "AP counselling — confirm the current round on the official portal",
  portalUrl: "https://eapcet-sche.aptonline.in/EAPCET/",
  portalLabel: "eapcet-sche.aptonline.in",
};

/** Never leave a manually reviewed status looking live indefinitely. */
export function getCounsellingStatus(state: "AP" | "TS", now: number = Date.now()): CounsellingStatus {
  const status = state === "TS" ? TG_COUNSELLING_NOW : AP_COUNSELLING_NOW;
  const reviewExpiresAt = Date.parse(`${COUNSELLING_REVIEWED_AT}T00:00:00+05:30`) + 7 * 86_400_000;
  if (now < reviewExpiresAt) return status;
  return {
    ...status,
    stage: "Review needed",
    headline: "Check the official portal for the current admission stage",
    short: `${state} counselling — check the official portal`,
    next: `Our last status review was ${COUNSELLING_STATUS_AS_OF}. Confirm current deadlines and seat availability on the official portal before acting.`,
  };
}
