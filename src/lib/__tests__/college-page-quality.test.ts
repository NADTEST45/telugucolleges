import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { COLLEGES } from "@/lib/colleges";
import { isCollegeSectionIndexable, type CollegePageSection } from "@/lib/college-page-quality";

describe("college section SEO gates", () => {
  it("never indexes a section when the parent profile is not indexable", () => {
    const sections: CollegePageSection[] = ["fees", "cutoff", "placement", "admission"];
    for (const college of COLLEGES) {
      for (const section of sections) {
        if (isCollegeSectionIndexable(college, section)) {
          expect(isCollegeSectionIndexable(college, "profile")).toBe(true);
        }
      }
    }
  });

  it("requires real section-specific evidence", () => {
    const sections: CollegePageSection[] = ["fees", "cutoff", "placement", "admission"];
    for (const section of sections) {
      const count = COLLEGES.filter(college => isCollegeSectionIndexable(college, section)).length;
      expect(count, `${section} should have indexable pages`).toBeGreaterThan(0);
      expect(count, `${section} should not blindly index every college`).toBeLessThan(COLLEGES.length);
    }
  });
});
