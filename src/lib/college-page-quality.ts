import "server-only";

import type { College } from "./colleges";
import { hasCutoffData, isIndexable } from "./cutoff-presence";
import { PLACEMENT_DATA } from "./placement-data";
import { UNIVERSITY_COURSES } from "./university-courses";
import { getExamByCollegeCode } from "./admission-exams";
import { isMedicalCollege } from "./medical-admission";

export type CollegePageSection = "profile" | "fees" | "cutoff" | "placement" | "admission";

export function isCollegeSectionIndexable(c: College, section: CollegePageSection): boolean {
  if (!isIndexable(c)) return false;
  switch (section) {
    case "fees":
      return c.fee > 0 || c.goFee > 0 || Boolean(UNIVERSITY_COURSES[c.code]);
    case "cutoff":
      return hasCutoffData(c);
    case "placement":
      return c.placements.avg > 0 || c.placements.highest > 0 ||
        c.placements.companies > 0 || Boolean(PLACEMENT_DATA[c.code]);
    case "admission":
      return isMedicalCollege(c.branches) || Boolean(getExamByCollegeCode(c.code)) || hasCutoffData(c);
    case "profile":
    default:
      return true;
  }
}
