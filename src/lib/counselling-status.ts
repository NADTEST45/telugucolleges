/** Small shared status records; safe to import from client components. */
export interface CounsellingStatus {
  /** State-specific review dates; updating AP must not refresh TG. */
  reviewedAt: string;
  asOf: string;
  stage: string;
  headline: string;
  next: string;
  short: string;
  portalUrl: string;
  portalLabel: string;
}

export const TG_SCHEDULE_SOURCE = "https://tgeapcetd.nic.in/files/TGEAPCET2026DETNOTIFICATION.PDF";
export const TG_SPOT_SOURCE = "https://tgeapcetd.nic.in/files/TGEAPCET2026SPOTADMNSGUIDELINES.pdf";
export const TG_BIPC_SCHEDULE_SOURCE = "https://tgeapcetbd.nic.in/files/BIPC2026DETAILEDNOTIFICATION.pdf";
export const AP_BIPC_SCHEDULE_SOURCE = "https://cap.apcfss.in/TET-PDF/EAPCET-BIPC-DOCS/EAPCETBIPCFINALPHASEREVISEDSCHEDULE.pdf";

export const TG_COUNSELLING_NOW: CounsellingStatus = {
  reviewedAt: "2026-09-24",
  asOf: "September 24, 2026",
  stage: "BiPC final phase",
  headline: "Engineering rounds are over; TG EAPCET BiPC final phase opens September 25",
  next: "The 2026 engineering (MPC) counselling rounds and the August spot admissions are over. The separate BiPC-stream counselling for B.Pharmacy, Pharm.D, Pharmaceutical Engineering, Bio-Medical Engineering and Bio-Technology runs its final phase on tgeapcetb.nic.in: processing fee and slot booking September 25, certificate verification September 26, options September 26–27 (options must be entered afresh), allotment on or before September 29, tuition fee and self-reporting September 29–30, and reporting at the college September 30 – October 1.",
  short: "TS BiPC final phase: slot booking Sept 25, allotment by Sept 29",
  portalUrl: "https://tgeapcetb.nic.in",
  portalLabel: "tgeapcetb.nic.in",
};

export const AP_COUNSELLING_NOW: CounsellingStatus = {
  reviewedAt: "2026-09-30",
  asOf: "September 30, 2026",
  stage: "Final-phase allotments",
  headline: "AP MPC third and final phase and BiPC final-phase allotments released",
  next: "The official Common Admissions Portal confirms that AP EAPCET 2026 MPC (engineering) third and final phase allotments and BiPC final-phase allotments have been released. Check your allotment order and the latest instructions on cap.apcfss.in. The published BiPC revised schedule lists self-reporting and college reporting for September 24–26; that window has passed. Do not assume reporting is still open or that an extension has been granted. Confirm any later notice and your applicable deadline with the official portal and allotted college.",
  short: "AP MPC and BiPC final-phase allotments released",
  portalUrl: "https://cap.apcfss.in/",
  portalLabel: "cap.apcfss.in",
};

/** Never leave a manually reviewed status looking live indefinitely. */
export function getCounsellingStatus(state: "AP" | "TS", now: number = Date.now()): CounsellingStatus {
  const status = state === "TS" ? TG_COUNSELLING_NOW : AP_COUNSELLING_NOW;
  const reviewExpiresAt = Date.parse(`${status.reviewedAt}T00:00:00+05:30`) + 7 * 86_400_000;
  if (now < reviewExpiresAt) return status;
  return {
    ...status,
    stage: "Review needed",
    headline: "Check the official portal for the current admission stage",
    short: `${state} counselling — check the official portal`,
    next: `Our last status review was ${status.asOf}. Confirm current deadlines and seat availability on the official portal before acting.`,
  };
}
