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
export const AP_BIPC_THIRD_PHASE_SOURCE = "https://cap.apcfss.in/TET-PDF/EAPCET-BIPC-DOCS/EAPCET2026BIPCTHIRDANDFINALPHASEDETAILEDNOTIFICATION.pdf";

export const TG_COUNSELLING_NOW: CounsellingStatus = {
  reviewedAt: "2026-10-28",
  asOf: "October 28, 2026",
  stage: "2026 counselling complete",
  headline: "TG EAPCET 2026 counselling is complete; BiPC spot admissions closed October 10",
  next: "The published 2026 TG engineering (MPC) counselling, internal-sliding and August spot-admission windows have passed. For the separate BiPC stream (B.Pharmacy, Pharm.D, Bio-Technology, Bio-Medical and Pharmaceutical Engineering), the official spot-admission guidelines scheduled institutional spot admissions for October 5–6, and a TGCHE press note dated October 7 extended them up to October 10, 2026. That extended window has passed. As of October 28, no further statewide round is listed on tgeapcet.nic.in or tgeapcetb.nic.in. Any later admission depends on official notices and the college itself; confirm directly before acting.",
  short: "TG 2026 counselling complete · BiPC spot closed Oct 10",
  portalUrl: "https://tgeapcetb.nic.in",
  portalLabel: "tgeapcetb.nic.in",
};

export const AP_COUNSELLING_NOW: CounsellingStatus = {
  reviewedAt: "2026-10-28",
  asOf: "October 28, 2026",
  stage: "BiPC third & final phase reporting",
  headline: "AP EAPCET BiPC third and final phase seats allotted October 27; college reporting October 28–30",
  next: "The official Common Admissions Portal confirms that the AP EAPCET 2026 BiPC-stream third and final phase allotment has been released. Under the detailed notification published on October 22, registration, online certificate verification and option entry ran on October 24–25, options could be changed on October 26 and seats were allotted on October 27. Self-reporting and reporting at the allotted college are scheduled for October 28–30, 2026, and colleges update joining details on October 30. The phase covers B.Pharmacy, Pharm.D and BiPC-eligible B.Tech courses. The MPC (engineering) third and final phase allotment was released earlier. Download your allotment order from cap.apcfss.in and confirm your deadline with the allotted college.",
  short: "AP BiPC third & final phase · report by Oct 30",
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
