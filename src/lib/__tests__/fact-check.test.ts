import { describe, expect, it } from "vitest";
import { generateAffiliateCourses } from "@/lib/university-courses";
import { fmtCourseFee } from "@/lib/format";
import { PLACEMENT_DATA } from "@/lib/placement-data";
import { TS_CUTOFFS } from "@/lib/ts-cutoffs";

const college = { type: "Private", state: "Telangana", fee: 100000, goFee: 100000, branches: ["CSE"] };

describe("fact-check safeguards", () => {
  it("does not infer postgraduate offerings from undergraduate tuition", () => {
    const courses = generateAffiliateCourses(college)!;
    expect(courses.map(c => c.program)).toEqual(["B.Tech"]);
    expect(generateAffiliateCourses({ ...college, branches: ["MBBS"] })).toBeNull();
  });

  it("does not turn a shared fee into invented pharmacy prices or free tuition", () => {
    const courses = generateAffiliateCourses({ ...college, branches: ["CSE", "B.Pharm", "Pharm.D"] })!;
    for (const course of courses.filter(c => c.program !== "B.Tech")) {
      expect(course.fee).toBe(0);
      expect(fmtCourseFee(course.fee)).toBe("Not verified");
    }
  });

  it("requires a specific submission for placement figures attributed to NIRF", () => {
    for (const data of Object.values(PLACEMENT_DATA).filter(d => d.source === "NIRF")) {
      expect(data.sourceUrl).toMatch(/\/Engineering\/IR-E-[^/]+\.pdf$/);
      expect(data.summary?.avgPackage).toBeUndefined();
      expect(data.summary?.maxPackage).toBeUndefined();
      expect(data.summary!.placed).toBeLessThanOrEqual(data.summary!.graduated!);
    }
  });

  it("preserves self-finance entries and girls-only categories from the 2025 statement", () => {
    expect(TS_CUTOFFS.JNTHMT["2025"].MMS.OC).toBe(17006);
    expect(TS_CUTOFFS.KUEWSF["2025"].CSE.OC).toBeUndefined();
    expect(TS_CUTOFFS.KUEWSF["2025"].CSE.OC_G).toBeGreaterThan(0);
  });
});
