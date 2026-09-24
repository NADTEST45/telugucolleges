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
export const COUNSELLING_STATUS_AS_OF = "September 24, 2026";
export const COUNSELLING_REVIEWED_AT = "2026-09-24";
export const TG_SCHEDULE_SOURCE = "https://tgeapcetd.nic.in/files/TGEAPCET2026DETNOTIFICATION.PDF";
export const TG_SPOT_SOURCE = "https://tgeapcetd.nic.in/files/TGEAPCET2026SPOTADMNSGUIDELINES.pdf";
export const TG_BIPC_SCHEDULE_SOURCE = "https://tgeapcetbd.nic.in/files/BIPC2026DETAILEDNOTIFICATION.pdf";
export const AP_BIPC_SCHEDULE_SOURCE = "https://cap.apcfss.in/TET-PDF/EAPCET-BIPC-DOCS/EAPCETBIPCFINALPHASEREVISEDSCHEDULE.pdf";

export const TG_COUNSELLING_NOW: CounsellingStatus = {
  stage: "BiPC final phase",
  headline: "Engineering rounds are over; TG EAPCET BiPC final phase opens September 25",
  next: "The 2026 engineering (MPC) counselling rounds and the August spot admissions are over. The separate BiPC-stream counselling for B.Pharmacy, Pharm.D, Pharmaceutical Engineering, Bio-Medical Engineering and Bio-Technology runs its final phase on tgeapcetb.nic.in: processing fee and slot booking September 25, certificate verification September 26, options September 26–27 (options must be entered afresh), allotment on or before September 29, tuition fee and self-reporting September 29–30, and reporting at the college September 30 – October 1.",
  short: "TS BiPC final phase: slot booking Sept 25, allotment by Sept 29",
  portalUrl: "https://tgeapcetb.nic.in",
  portalLabel: "tgeapcetb.nic.in",
};

export const AP_COUNSELLING_NOW: CounsellingStatus = {
  stage: "Final-phase allotments",
  headline: "AP MPC third and final phase allotment released; BiPC final allotment due September 24",
  next: "The official Common Admissions Portal confirms the AP EAPCET 2026 MPC (engineering) third and final phase seat allotment has been released. Download your allotment order on cap.apcfss.in and complete self-reporting and reporting at the college by the deadline shown there. The schedule PDF on the portal has not been updated with the revised dates, so rely on the portal rather than news reports. For the BiPC stream, the portal says the final-phase allotment will be released on September 24, and the revised official schedule gives self-reporting and college reporting from September 24 to 26.",
  short: "AP MPC final allotment out · BiPC final allotment Sept 24",
  portalUrl: "https://cap.apcfss.in/",
  portalLabel: "cap.apcfss.in",
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
