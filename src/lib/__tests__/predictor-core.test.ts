import { describe, it, expect } from "vitest";
import {
  classify,
  SAFE_FACTOR,
  MODERATE_FACTOR,
  REACH_FACTOR,
} from "@/lib/predictor-core";

describe("classify", () => {
  const CLOSING = 10000;

  it("returns null when closing rank is zero or negative", () => {
    expect(classify(5000, 0)).toBeNull();
    expect(classify(5000, -1)).toBeNull();
    expect(classify(1, 0)).toBeNull();
  });

  it("classifies well-inside ranks as safe", () => {
    expect(classify(1, CLOSING)).toBe("safe");
    expect(classify(5000, CLOSING)).toBe("safe");
  });

  it("boundary: exactly 0.8 × closing is safe (inclusive)", () => {
    expect(classify(CLOSING * SAFE_FACTOR, CLOSING)).toBe("safe"); // 8000
    expect(classify(CLOSING * SAFE_FACTOR + 1, CLOSING)).toBe("moderate"); // 8001
  });

  it("boundary: exactly 1.05 × closing is moderate (inclusive)", () => {
    expect(classify(CLOSING * MODERATE_FACTOR, CLOSING)).toBe("moderate"); // 10500
    expect(classify(CLOSING * MODERATE_FACTOR + 1, CLOSING)).toBe("reach"); // 10501
  });

  it("boundary: exactly 1.35 × closing is reach (inclusive), beyond is excluded", () => {
    expect(classify(CLOSING * REACH_FACTOR, CLOSING)).toBe("reach"); // 13500
    expect(classify(CLOSING * REACH_FACTOR + 1, CLOSING)).toBeNull(); // 13501
  });

  it("rank equal to closing rank is moderate", () => {
    expect(classify(CLOSING, CLOSING)).toBe("moderate");
  });
});
