/**
 * Medical (MBBS) admission data.
 *
 * MBBS seats in Andhra Pradesh and Telangana are filled through NEET-UG based
 * counselling — NOT through AP/TS EAPCET (which is for engineering, pharmacy &
 * agriculture). This module supplies the correct NEET counselling facts so that
 * medical-college pages do not inherit the engineering EAPCET wording.
 *
 * Counselling authorities (verified June 2026):
 *  - Andhra Pradesh: Dr. NTR University of Health Sciences (NTRUHS), Vijayawada
 *    — official portal drntr.uhsap.in
 *  - Telangana: Kaloji Narayana Rao University of Health Sciences (KNRUHS),
 *    Warangal — official portal knruhs.telangana.gov.in
 *  - 15% All India Quota (AIQ) seats in government colleges are filled by the
 *    Medical Counselling Committee (MCC), DGHS — mcc.nic.in
 */

export interface MedicalAdmissionInfo {
  /** Qualifying exam */
  exam: string;            // "NEET-UG"
  examFullName: string;    // "National Eligibility cum Entrance Test (Undergraduate)"
  /** State counselling authority short name */
  authority: string;       // "NTRUHS" / "KNRUHS"
  authorityFullName: string;
  officialUrl: string;
  /** AIQ counselling authority */
  aiqAuthority: string;    // "MCC (DGHS)"
  aiqUrl: string;
  /** Primary counselling body to surface in the UI (state authority, or MCC for deemed) */
  primaryCounsellor: string;
  /** Primary counselling portal URL (state portal, or mcc.nic.in for deemed) */
  primaryUrl: string;
  /** One-line summary of the counselling route, varies by college type */
  counsellingSummary: string;
  /** Seat-quota breakdown lines */
  quotas: { label: string; detail: string }[];
}

/** A college admits via NEET if it offers MBBS (and not engineering EAPCET branches). */
export function isMedicalCollege(branches: string[]): boolean {
  return branches.some(b => /^MBBS$/i.test(b.trim()));
}

export function getMedicalAdmission(c: {
  name: string;
  state: string;
  type: string;
}): MedicalAdmissionInfo {
  const isAP = c.state !== "Telangana";
  const authority = isAP ? "NTRUHS" : "KNRUHS";
  const authorityFullName = isAP
    ? "Dr. NTR University of Health Sciences, Vijayawada"
    : "Kaloji Narayana Rao University of Health Sciences, Warangal";
  const officialUrl = isAP
    ? "https://drntr.uhsap.in"
    : "https://knruhs.telangana.gov.in";

  const isGovt = c.type === "Government";
  const isDeemed = c.type === "Deemed University";

  const counsellingSummary = isDeemed
    ? `Admission to ${c.name} is entirely NEET-UG based. As a deemed university, all MBBS seats are filled through the Medical Counselling Committee (MCC) deemed-university counselling at mcc.nic.in — there is no state-quota (${authority}) or EAPCET/EAMCET route. Only a valid NEET-UG score and All India Rank are considered.`
    : isGovt
    ? `Admission to ${c.name} is entirely NEET-UG based. Of the sanctioned MBBS seats, 15% are All India Quota (AIQ) filled by the Medical Counselling Committee (MCC), and the remaining 85% are state quota seats filled by ${authority} through online web-counselling. There is no EAPCET/EAMCET route for MBBS — only a valid NEET-UG score and rank are considered.`
    : `Admission to ${c.name} is entirely NEET-UG based. Seats are filled by ${authority} through online web-counselling — Competent Authority (Convener) quota at government-regulated fees, plus Management (B-category) and NRI (C-category) quota seats at higher fees per the ${authority} notification. There is no EAPCET/EAMCET route for MBBS — only a valid NEET-UG score and rank are considered.`;

  const quotas: { label: string; detail: string }[] = isDeemed
    ? [
        { label: "MCC Deemed-University Counselling", detail: "All seats filled by the Medical Counselling Committee (DGHS) via mcc.nic.in based on NEET-UG All India Rank." },
        { label: "NRI Quota", detail: "NRI/NRI-sponsored seats also allotted through MCC deemed counselling from NEET-qualified candidates." },
      ]
    : isGovt
    ? [
        { label: "All India Quota (15%)", detail: "Filled by MCC (DGHS) via mcc.nic.in based on NEET-UG All India Rank." },
        { label: `State Quota (85%)`, detail: `Filled by ${authority} for local/domicile candidates via NEET-UG state-rank web-counselling.` },
      ]
    : [
        { label: "Convener / Competent Authority Quota", detail: `Filled by ${authority} at government-regulated fees via NEET-UG state-rank web-counselling.` },
        { label: "Management (B-category)", detail: `Filled by ${authority} from a separate NEET-UG merit list at management-quota fees.` },
        { label: "NRI (C-category)", detail: `NRI/NRI-sponsored seats allotted by ${authority} from NEET-qualified candidates.` },
      ];

  return {
    exam: "NEET-UG",
    examFullName: "National Eligibility cum Entrance Test (Undergraduate)",
    authority,
    authorityFullName,
    officialUrl,
    aiqAuthority: "Medical Counselling Committee (MCC), DGHS",
    aiqUrl: "https://mcc.nic.in",
    primaryCounsellor: isDeemed ? "Medical Counselling Committee (MCC), DGHS" : authorityFullName,
    primaryUrl: isDeemed ? "https://mcc.nic.in" : officialUrl,
    counsellingSummary,
    quotas,
  };
}
