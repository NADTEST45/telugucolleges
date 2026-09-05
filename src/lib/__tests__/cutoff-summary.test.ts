import { describe, expect, it } from "vitest";
import { getCseSummary } from "@/lib/cutoff-summary";
import { TS_CUTOFFS } from "@/lib/ts-cutoffs";
import { TS_CUTOFFS_2025_PHASE1, TS_CUTOFFS_2025_PHASE2 } from "@/lib/ts-cutoffs-phases";
import conflicts from "../../../docs/fact-gaps-2024-onward/summary-cutoff-conflicts.json";
import phaseEvidence from "../../../docs/fact-gaps-2024-onward/tg-2025-phase-comparison.json";

describe("dated cutoff summaries", () => {
  it("resolves all 30 audited conflicts to the official 2025 final value", () => {
    for (const row of conflicts) {
      expect(getCseSummary("Telangana", TS_CUTOFFS[row.code])).toEqual({ rank: row.official2025, label: "2025 Final Phase · OC boys" });
    }
  });
  it("does not assign unverified AP gender data or pre-2024 ranks to current summaries", () => {
    expect(getCseSummary("Andhra Pradesh", { "2024": { cse: { OC: 100 } } })).toBeNull();
    expect(getCseSummary("Telangana", { "2023": { CSE: { OC: 100 } } })).toBeNull();
  });
  it("labels girls-only data and selects the later phase independently of input order", () => {
    const data = { "2025_phase1": { CSE: { OC_G: 100 } }, "2025_phase2": { CSE: { OC_G: 200 } } };
    expect(getCseSummary("Telangana", null, data, [
      { key: "2025_phase1", label: "2025 Phase 1" }, { key: "2025_phase2", label: "2025 Phase 2" },
    ])).toEqual({ rank: 200, label: "2025 Phase 2 · OC girls" });
  });
  it("includes all missing cells identified in the two official phase statements", () => {
    const tables = [TS_CUTOFFS_2025_PHASE1, TS_CUTOFFS_2025_PHASE2];
    phaseEvidence.forEach((evidence, index) => {
      for (const [code, branch, category, rank] of evidence.missingValues) {
        expect(tables[index][String(code)]?.["2025"]?.[String(branch)]?.[String(category)]).toBe(rank);
      }
      expect(tables[index].KUEWSF["2025"].CSE.OC).toBeUndefined();
    });
  });
});
