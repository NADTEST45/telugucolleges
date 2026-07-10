import { describe, expect, it } from "vitest";
import { COLLEGES } from "@/lib/colleges";
import { NEWS_ITEMS } from "@/lib/news";

function duplicates<T>(values: T[]): T[] {
  const seen = new Set<T>();
  const duplicate = new Set<T>();
  for (const value of values) {
    if (seen.has(value)) duplicate.add(value);
    else seen.add(value);
  }
  return [...duplicate];
}

describe("public data integrity", () => {
  it("keeps college join keys and URLs unique", () => {
    expect(COLLEGES.length).toBeGreaterThan(800);
    expect(duplicates(COLLEGES.map(college => college.id))).toEqual([]);
    expect(duplicates(COLLEGES.map(college => college.code))).toEqual([]);
    expect(duplicates(COLLEGES.map(college => college.slug))).toEqual([]);
  });

  it("uses null, not a fabricated sentinel, for unknown establishment years", () => {
    const currentYear = new Date().getFullYear();
    for (const college of COLLEGES) {
      expect(college.year === null || (college.year >= 1800 && college.year <= currentYear)).toBe(true);
      expect(college.year).not.toBe(2000);
      expect(college.fee).toBeGreaterThanOrEqual(0);
      expect(college.goFee).toBeGreaterThanOrEqual(0);
      expect(college.placements.avg).toBeGreaterThanOrEqual(0);
      expect(college.placements.highest).toBeGreaterThanOrEqual(0);
      expect(college.placements.companies).toBeGreaterThanOrEqual(0);
    }
  });

  it("keeps news IDs unique, prepends the latest update, and makes current alerts reviewable", () => {
    expect(duplicates(NEWS_ITEMS.map(item => item.id))).toEqual([]);
    expect(NEWS_ITEMS[0].date).toBe([...NEWS_ITEMS].sort((a, b) => b.date.localeCompare(a.date))[0].date);
    for (const item of NEWS_ITEMS.filter(item => item.expiresAt)) {
      expect(item.verifiedAt).toBeTruthy();
      expect(Date.parse(item.expiresAt!)).toBeGreaterThan(Date.parse(item.verifiedAt!));
      expect(item.sourceUrl?.startsWith("https://")).toBe(true);
    }
  });
});
