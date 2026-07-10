import { describe, expect, it } from "vitest";
import { COLLEGES } from "@/lib/colleges";
import { applyCollegeOverrides } from "@/lib/college-overrides";

describe("approved college overrides", () => {
  it("applies whitelisted values without mutating the static record", () => {
    const original = COLLEGES[0];
    const merged = applyCollegeOverrides(original, [
      { college_code: original.code, field_name: "fee", value: "123456" },
      { college_code: original.code, field_name: "placements.avg", value: "9.5" },
      { college_code: original.code, field_name: "year", value: "1998" },
    ]);
    expect(merged.fee).toBe(123456);
    expect(merged.placements.avg).toBe(9.5);
    expect(merged.year).toBe(1998);
    expect(original).not.toBe(merged);
    expect(original.placements).not.toBe(merged.placements);
  });

  it("fails closed for unknown, malformed, and out-of-range rows", () => {
    const original = COLLEGES[0];
    const merged = applyCollegeOverrides(original, [
      { college_code: original.code, field_name: "name", value: "Injected" },
      { college_code: original.code, field_name: "nba", value: "yes" },
      { college_code: original.code, field_name: "fee", value: "Infinity" },
      { college_code: original.code, field_name: "placements.highest", value: "501" },
    ]);
    expect(merged.name).toBe(original.name);
    expect(merged.nba).toBe(original.nba);
    expect(merged.fee).toBe(original.fee);
    expect(merged.placements.highest).toBe(original.placements.highest);
  });
});
