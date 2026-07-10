import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/lib/ap-cutoffs";
import { BRANCH_OPTIONS, STATE_OPTIONS } from "@/lib/rank-band-data";
import { predict, SAFETY_ORDER } from "@/lib/predictor";

describe("predictor data integration", () => {
  it("sweeps state, category, gender, branch, and rank combinations", () => {
    const ranks = [1, 5_000, 40_000, 150_000, 1_000_000];
    for (const state of STATE_OPTIONS) {
      for (const { key: category } of CATEGORIES) {
        for (const gender of ["boys", "girls"] as const) {
          for (const rank of ranks) {
            const matches = predict({ rank, state, category, gender, branches: BRANCH_OPTIONS });
            for (const match of matches) {
              expect(match.college.state).toBe(state.full);
              expect(Number.isFinite(match.closingRank)).toBe(true);
              expect(match.closingRank).toBeGreaterThan(0);
            }
            for (let index = 1; index < matches.length; index++) {
              const previous = matches[index - 1];
              const current = matches[index];
              expect(SAFETY_ORDER[previous.safety]).toBeLessThanOrEqual(SAFETY_ORDER[current.safety]);
              if (previous.safety === current.safety) {
                expect(previous.closingRank).toBeLessThanOrEqual(current.closingRank);
              }
            }
          }
        }
      }
    }
  });
});
