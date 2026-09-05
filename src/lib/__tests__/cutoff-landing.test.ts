import { describe, expect, it } from "vitest";
import { COLLEGES } from "../colleges";
import { TS_CUTOFFS } from "../ts-cutoffs";
import { getTSCutoffRows } from "../ts-cutoff-2026";

describe("Telangana historical cutoff pages", () => {
  it("includes 2025-only colleges and sorts by the newest available rank", () => {
    const rows = getTSCutoffRows("cse");
    expect(rows.length).toBeGreaterThan(50);
    const expected = COLLEGES.filter(c => c.state === "Telangana" && TS_CUTOFFS[c.code]?.["2025"]?.CSE?.OC);
    for (const college of expected) {
      expect(rows.find(r => r.college.code === college.code)?.oc2025).toBe(TS_CUTOFFS[college.code]["2025"].CSE.OC);
    }
    const ranks = rows.map(r => r.oc2025 || r.oc2024 || r.oc2023);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(getTSCutoffRows("not-a-branch")).toEqual([]);
  });
});
