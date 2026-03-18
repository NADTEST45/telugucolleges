/**
 * Aggregated program data across all colleges.
 * Used by the /programs pages to show which colleges offer each program and at what fee.
 */
import { COLLEGES, College, fmtFee } from "./colleges";
import { getCourses, generateAffiliateCourses, CourseInfo } from "./university-courses";

export interface ProgramSummary {
  slug: string;
  name: string;          // e.g. "B.Tech", "MBBS"
  level: string;         // UG, PG, Integrated, etc.
  duration: number;      // years
  collegeCount: number;
  feeMin: number;
  feeMax: number;
  feeMedian: number;
  category: "Engineering" | "Pharmacy" | "Medical" | "Management" | "Science" | "Other";
}

export interface CollegeProgram {
  college: College;
  fee: number;
  mgmtFee?: number;
  specialization?: string;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getCategory(program: string): ProgramSummary["category"] {
  if (["B.Tech", "B.E.", "M.Tech", "M.E.", "Dual Degree (B.Tech + M.S.)", "Polytechnic Diploma"].includes(program)) return "Engineering";
  if (["B.Pharm", "M.Pharm", "Pharm.D"].includes(program)) return "Pharmacy";
  if (["MBBS", "MD/MS", "BDS"].includes(program)) return "Medical";
  if (["MBA", "MBA (IBS)", "BBA", "BBA (Hons)", "BBA + MBA (Integrated)", "BBA LLB (Hons)", "MCA", "BCA"].includes(program)) return "Management";
  if (program.startsWith("B.Sc") || program.startsWith("M.Sc") || program.startsWith("BA") || program.startsWith("B.Com")) return "Science";
  return "Other";
}

/** Get all courses for a college (from UNIVERSITY_COURSES or generated) */
function getAllCourses(c: College): CourseInfo[] {
  const specific = getCourses(c.code);
  if (specific) return specific;
  const generated = generateAffiliateCourses(c);
  return generated || [];
}

/** Build a map of program -> colleges offering it */
function buildProgramMap(): Map<string, { info: CourseInfo; colleges: CollegeProgram[] }> {
  const map = new Map<string, { info: CourseInfo; colleges: CollegeProgram[] }>();

  for (const college of COLLEGES) {
    const courses = getAllCourses(college);
    for (const course of courses) {
      const key = course.program;
      if (!map.has(key)) {
        map.set(key, { info: course, colleges: [] });
      }
      map.get(key)!.colleges.push({
        college,
        fee: course.fee,
        mgmtFee: course.mgmtFee,
        specialization: course.specialization,
      });
    }
  }

  return map;
}

const programMap = buildProgramMap();

/** Get list of all programs with summary stats */
export function getAllPrograms(): ProgramSummary[] {
  const programs: ProgramSummary[] = [];

  for (const [name, data] of programMap) {
    const fees = data.colleges.map(c => c.fee).filter(f => f > 0).sort((a, b) => a - b);
    if (fees.length === 0) continue;

    programs.push({
      slug: slugify(name),
      name,
      level: data.info.level,
      duration: data.info.duration,
      collegeCount: data.colleges.length,
      feeMin: fees[0],
      feeMax: fees[fees.length - 1],
      feeMedian: fees[Math.floor(fees.length / 2)],
      category: getCategory(name),
    });
  }

  // Sort: Engineering first, then by college count
  const catOrder: Record<string, number> = { Engineering: 0, Pharmacy: 1, Medical: 2, Management: 3, Science: 4, Other: 5 };
  programs.sort((a, b) => (catOrder[a.category] ?? 5) - (catOrder[b.category] ?? 5) || b.collegeCount - a.collegeCount);

  return programs;
}

/** Get all colleges offering a specific program */
export function getCollegesForProgram(slug: string): { program: ProgramSummary; colleges: CollegeProgram[] } | null {
  for (const [name, data] of programMap) {
    if (slugify(name) === slug) {
      const fees = data.colleges.map(c => c.fee).filter(f => f > 0).sort((a, b) => a - b);
      if (fees.length === 0) return null;

      const program: ProgramSummary = {
        slug,
        name,
        level: data.info.level,
        duration: data.info.duration,
        collegeCount: data.colleges.length,
        feeMin: fees[0],
        feeMax: fees[fees.length - 1],
        feeMedian: fees[Math.floor(fees.length / 2)],
        category: getCategory(name),
      };

      return { program, colleges: data.colleges };
    }
  }
  return null;
}

/** Get all program slugs for static generation */
export function getAllProgramSlugs(): string[] {
  return getAllPrograms().map(p => p.slug);
}

export { fmtFee };
