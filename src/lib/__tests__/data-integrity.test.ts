import { describe, expect, it } from "vitest";
import { COLLEGES } from "@/lib/colleges";
import { NEWS_ITEMS } from "@/lib/news";
import { buildIcs, COUNSELLING_PHASES } from "@/lib/counselling-schedule";
import {
  AP_ICS_CONFIG,
  AP_PHASE_1_MILESTONES,
  apMilestonesForIcs,
} from "@/lib/ap-counselling-schedule";

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

  /*
   * Guards the AP EAPCET 2026 counselling dates against transcription drift.
   * APSCHE publishes its own "No. of days" column next to each window, so a
   * mistyped date shows up here as a day-count mismatch rather than as a wrong
   * deadline on a live page.
   */
  it("keeps AP counselling windows consistent with the official day counts", () => {
    const inclusiveDays = (start: string, end: string) =>
      Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000) + 1;

    expect(duplicates(AP_PHASE_1_MILESTONES.map(m => m.id))).toEqual([]);
    for (const m of AP_PHASE_1_MILESTONES) {
      expect(Date.parse(m.deadline)).toBeGreaterThanOrEqual(
        Date.parse(m.start ?? m.deadline)
      );
      if (m.days && m.start) {
        expect(inclusiveDays(m.start, m.deadline)).toBe(m.days);
      }
    }
  });

  /*
   * The .ics builder is shared by TS and AP; the board identity comes from an
   * optional config that defaults to TS. Pin both so a future board can't
   * silently relabel TS calendar entries.
   */
  it("builds board-correct calendars for TS (default) and AP", () => {
    const now = new Date("2026-07-17T00:00:00Z");
    const unfold = (ics: string) => ics.replace(/\r\n /g, "");

    const ts = buildIcs(
      [{ milestone: COUNSELLING_PHASES[0].milestones[0], phaseTag: "TS EAPCET P1" }],
      { now }
    );
    expect(ts).toContain("PRODID:-//TeluguColleges//TS EAPCET Counselling 2026//EN");
    expect(ts).toContain("X-WR-CALNAME:TS EAPCET 2026 Counselling");
    expect(unfold(ts)).toContain("Deadline day for the TGCHE TS EAPCET 2026 counselling step");
    expect(unfold(ts)).toContain("URL:https://eapcet.tgche.ac.in");

    const ap = buildIcs(apMilestonesForIcs(), { now, config: AP_ICS_CONFIG });
    expect(ap).toContain("PRODID:-//TeluguColleges//AP EAPCET Counselling 2026//EN");
    expect(unfold(ap)).toContain("Deadline day for the APSCHE AP EAPCET 2026 counselling step");
    expect(unfold(ap)).toContain("URL:https://eapcet-sche.aptonline.in");
    // Registration closes July 29; all-day DTEND is exclusive.
    expect(ap).toContain("DTSTART;VALUE=DATE:20260729");
    expect(ap).toContain("DTEND;VALUE=DATE:20260730");
    expect(ap.match(/BEGIN:VEVENT/g)?.length).toBe(AP_PHASE_1_MILESTONES.length);
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
