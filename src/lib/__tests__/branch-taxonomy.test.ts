import { describe, it, expect } from "vitest";
import {
  CANONICAL_BRANCHES,
  canonicalIdForCode,
  codesForBranch,
  branchLabel,
} from "@/lib/branch-taxonomy";

describe("canonicalIdForCode", () => {
  it("resolves canonical ids to themselves", () => {
    expect(canonicalIdForCode("cse")).toBe("cse");
    expect(canonicalIdForCode("cse_aiml")).toBe("cse_aiml");
  });

  it("resolves TS uppercase codes to canonical ids", () => {
    expect(canonicalIdForCode("CSM")).toBe("cse_aiml");
    expect(canonicalIdForCode("CSD")).toBe("cse_ds");
    expect(canonicalIdForCode("MEC")).toBe("mech");
    expect(canonicalIdForCode("INF")).toBe("it");
  });

  it("resolves AP lowercase codes to canonical ids", () => {
    expect(canonicalIdForCode("mech")).toBe("mech");
    expect(canonicalIdForCode("cse_ds")).toBe("cse_ds");
  });

  it("returns undefined for unknown codes", () => {
    expect(canonicalIdForCode("nonexistent")).toBeUndefined();
    expect(canonicalIdForCode("")).toBeUndefined();
  });

  it("every code of every canonical branch resolves back to that branch", () => {
    for (const b of CANONICAL_BRANCHES) {
      for (const code of b.codes) {
        expect(canonicalIdForCode(code), `${code} → ${b.id}`).toBe(b.id);
      }
    }
  });
});

describe("codesForBranch", () => {
  it("returns the full code set for a canonical id", () => {
    expect(codesForBranch("cse_aiml")).toEqual(expect.arrayContaining(["cse_aiml", "CSM"]));
    expect(codesForBranch("cse")).toEqual(expect.arrayContaining(["cse", "CSE"]));
  });

  it("falls back to [id] for unknown ids", () => {
    expect(codesForBranch("unknown_branch")).toEqual(["unknown_branch"]);
  });
});

describe("branchLabel", () => {
  it("returns competitor-standard labels", () => {
    expect(branchLabel("cse")).toBe("CSE");
    expect(branchLabel("cse_aiml")).toBe("CSE (AI & ML)");
  });

  it("falls back to uppercased id for unknown ids", () => {
    expect(branchLabel("xyz")).toBe("XYZ");
  });
});
