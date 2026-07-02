import { describe, it, expect } from "vitest";
import {
  parseRankBandSlug,
  buildRankBandSlug,
  getAllRankBandSlugs,
  BRANCH_OPTIONS,
  STATE_OPTIONS,
  RANK_BANDS,
} from "@/lib/rank-band-data";

describe("rank-band slugs", () => {
  it("round-trips every enumerated slug (build → parse → build)", () => {
    for (const slug of getAllRankBandSlugs()) {
      const parsed = parseRankBandSlug(slug);
      expect(parsed, `slug should parse: ${slug}`).not.toBeNull();
      expect(buildRankBandSlug(parsed!.rank, parsed!.branch, parsed!.state)).toBe(slug);
    }
  });

  it("round-trips an arbitrary valid combination", () => {
    const branch = BRANCH_OPTIONS[0];
    const state = STATE_OPTIONS[0];
    const slug = buildRankBandSlug(RANK_BANDS[0], branch, state);
    const parsed = parseRankBandSlug(slug);
    expect(parsed).not.toBeNull();
    expect(parsed!.rank).toBe(RANK_BANDS[0]);
    expect(parsed!.branch.slug).toBe(branch.slug);
    expect(parsed!.state.slug).toBe(state.slug);
  });

  it("rejects malformed or out-of-domain slugs", () => {
    const bad = [
      "",
      "garbage",
      "0-cse-telangana", // rank must be > 0
      "-1-cse-telangana",
      "15000-cse-karnataka", // unknown state
      "15000-badbranch-telangana", // unknown branch
      "15000-cse", // missing state
      "1e5-cse-telangana", // non-integer rank
      "2000000-cse-telangana", // rank above 1,000,000 cap
    ];
    for (const slug of bad) {
      expect(parseRankBandSlug(slug), `should reject: "${slug}"`).toBeNull();
    }
  });
});
