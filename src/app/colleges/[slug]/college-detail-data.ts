/**
 * Server-side data assembly for CollegeDetail.
 *
 * SERVER-ONLY: this module imports the large historical cutoff tables
 * (ap-cutoffs / ts-cutoffs / ts-cutoffs-phases) and the supporting datasets
 * (university-courses, scholarships, admission-exams, placement-data).
 * Never import it from a "use client" file — that would ship all of those
 * datasets in the client bundle (CLAUDE.md bundle rule).
 *
 * The five /colleges/[slug] pages call these helpers and pass the slim
 * results as props to the CollegeDetail client component, which therefore
 * no longer imports any of the data files itself.
 */
import type { College } from "@/lib/colleges";
import { AP_CUTOFFS, AP_CUTOFF_YEARS, type CollegeCutoffs, type YearCutoffs } from "@/lib/ap-cutoffs";
import { TS_CUTOFFS, TS_CUTOFF_YEARS } from "@/lib/ts-cutoffs";
import { TS_PHASES, getTSPhaseCutoffs, type PhaseKey } from "@/lib/ts-cutoffs-phases";
import { getCourses, getAffiliatedCourses, UNIVERSITY_FEE_AY, type CourseInfo } from "@/lib/university-courses";
import { getScholarships, type ScholarshipInfo } from "@/lib/scholarships";
import { getExamByCollegeCode, type AdmissionExam } from "@/lib/admission-exams";
import { isMedicalCollege, getMedicalAdmission, type MedicalAdmissionInfo } from "@/lib/medical-admission";
import { getPlacementData, type CollegePlacementData } from "@/lib/placement-data";
import { getReviewsByCollege, getAverageRating, type Review } from "@/lib/reviews";

export interface CollegeCutoffProps {
  historicalCutoffs: CollegeCutoffs | null;
  cutoffYears: readonly string[];
  phaseCutoffs: Record<string, YearCutoffs> | null;
  phases: { key: string; label: string }[] | null;
}

/**
 * Resolve the historical + phase-wise cutoff props for a college.
 * (Previously copy-pasted into each of the five page components.)
 */
export function getCutoffProps(c: College): CollegeCutoffProps {
  const historicalCutoffs = (c.state === "Telangana" ? TS_CUTOFFS[c.code] : AP_CUTOFFS[c.code]) || null;
  const cutoffYears = c.state === "Telangana" ? TS_CUTOFF_YEARS : AP_CUTOFF_YEARS;

  // Build phase-wise cutoff map for TS colleges
  let phaseCutoffs: Record<string, YearCutoffs> | null = null;
  let phases: { key: string; label: string }[] | null = null;
  if (c.state === "Telangana") {
    const phaseMap: Record<string, YearCutoffs> = {};
    for (const phase of TS_PHASES) {
      const data = phase.key === "2024"
        ? (TS_CUTOFFS[c.code]?.["2024"] || null)
        : phase.key === "2023"
        ? (TS_CUTOFFS[c.code]?.["2023"] || null)
        : getTSPhaseCutoffs(c.code, phase.key as PhaseKey);
      if (data) phaseMap[phase.key] = data;
    }
    if (Object.keys(phaseMap).length > 0) {
      phaseCutoffs = phaseMap;
      phases = TS_PHASES.filter(p => phaseMap[p.key]).map(p => ({ key: p.key, label: p.label }));
    }
  }

  return { historicalCutoffs, cutoffYears, phaseCutoffs, phases };
}

export interface CollegeDetailData {
  courses: CourseInfo[] | null;
  scholarshipInfo: ScholarshipInfo | null;
  admissionExam: AdmissionExam | null;
  medical: MedicalAdmissionInfo | null;
  placementData: CollegePlacementData | null;
  reviews: Review[];
  rating: { avg: number; count: number };
  /** Academic year the university fee was sourced for (deemed/private unis). */
  feeAY?: string;
}

/**
 * Look up the per-college supporting datasets that CollegeDetail renders.
 * These lookups previously ran inside the client component, dragging the
 * full datasets into the browser bundle.
 */
export function getCollegeDetailData(c: College): CollegeDetailData {
  return {
    courses: getCourses(c.code) || getAffiliatedCourses(c),
    scholarshipInfo: getScholarships(c.code),
    admissionExam: getExamByCollegeCode(c.code),
    medical: isMedicalCollege(c.branches) ? getMedicalAdmission(c) : null,
    placementData: getPlacementData(c.code),
    reviews: getReviewsByCollege(c.code),
    rating: getAverageRating(c.code),
    feeAY: UNIVERSITY_FEE_AY[c.code],
  };
}
