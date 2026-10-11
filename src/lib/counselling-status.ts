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
export const TG_BIPC_SPOT_SOURCE = "https://tgeapcetbd.nic.in/files/TGEAPCETBiPC2026CANDIDATESGUIDELINES.pdf";
export const TG_BIPC_SPOT_EXTENSION_SOURCE = "https://tgeapcetbd.nic.in/files/PressNoteExtnofSpotAdmissions.pdf";
export const AP_BIPC_SCHEDULE_SOURCE = "https://cap.apcfss.in/TET-PDF/EAPCET-BIPC-DOCS/EAPCETBIPCFINALPHASEREVISEDSCHEDULE.pdf";

export const TG_COUNSELLING_NOW: CounsellingStatus = {
  reviewedAt: "2026-10-11",
  asOf: "October 11, 2026",
  stage: "2026 counselling complete",
  headline: "TG EAPCET 2026 counselling is complete; BiPC spot admissions closed October 10",
  next: "The published 2026 TG engineering (MPC) counselling, internal-sliding and August spot-admission windows have passed. For the separate BiPC stream (B.Pharmacy, Pharm.D, Bio-Technology, Bio-Medical and Pharmaceutical Engineering), the official spot-admission guidelines scheduled institutional spot admissions for October 5–6, and a TGCHE press note dated October 7 extended them up to October 10, 2026. That extended window has now passed, and no further statewide round is listed on tgeapcetb.nic.in. Any later admission depends on official notices and the college itself; confirm directly before acting.",
  short: "TG 2026 counselling complete · BiPC spot closed Oct 10",
  portalUrl: "https://tgeapcetb.nic.in",
  portalLabel: "tgeapcetb.nic.in",
};

export const AP_COUNSELLING_NOW: CounsellingStatus = {
  reviewedAt: "2026-10-11",
  asOf: "October 11, 2026",
  stage: "Final-phase allotments",
  headline: "AP MPC third and final phase and BiPC final-phase allotments released; no newer EAPCET notice",
  next: "The official Common Admissions Portal confirms that AP EAPCET 2026 MPC (engineering) third and final phase allotments and BiPC final-phase allotments have been released. The published BiPC revised schedule lists self-reporting and college reporting for September 24–26; that window has passed. As of October 11, the portal lists no newer public EAPCET notice, such as a spot-admission schedule. Do not assume reporting is still open or that another round will be held. Confirm any later notice and your applicable deadline with cap.apcfss.in and the allotted college.",
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
