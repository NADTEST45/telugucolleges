import { describe, expect, it } from "vitest";
import { indiaDate, isDeadlinePast, isNewsActionable, isNewsArchived } from "../content-freshness";
import { getCounsellingStatus } from "../counselling-status";
import { NEWS_ITEMS, type NewsItem } from "../news";
import { COUNSELLING_PHASES, buildIcs } from "../counselling-schedule";

const notice: NewsItem = {
  id: "test", date: "2026-09-05", title: "A deadline", summary: "", body: "",
  category: "counselling", state: "TS", priority: "high", tags: [],
};

describe("dated admission information", () => {
  it("expires deadlines at midnight in India, including on UTC servers", () => {
    const before = Date.parse("2026-09-05T18:29:59Z");
    const after = Date.parse("2026-09-05T18:30:00Z");
    expect(indiaDate(before)).toBe("2026-09-05");
    expect(isDeadlinePast("2026-09-05", before)).toBe(false);
    expect(isDeadlinePast("2026-09-05", after)).toBe(true);
  });

  it("honours explicit expiration and rejects invalid expiration dates", () => {
    const item = { ...notice, expiresAt: "2026-09-06T00:00:00+05:30" };
    const expiration = Date.parse(item.expiresAt);
    expect(isNewsActionable(item, expiration - 1)).toBe(true);
    expect(isNewsActionable(item, expiration)).toBe(false);
    expect(isNewsArchived({ ...notice, expiresAt: "invalid" }, expiration)).toBe(true);
  });

  it("archives legacy notices after 14 days and never promotes future notices", () => {
    expect(isNewsActionable(notice, Date.parse("2026-09-04T12:00:00Z"))).toBe(false);
    expect(isNewsActionable(notice, Date.parse("2026-09-05T12:00:00Z"))).toBe(true);
    expect(isNewsArchived(notice, Date.parse("2026-09-19T00:00:00+05:30"))).toBe(true);
  });

  it("does not advertise July action deadlines in September", () => {
    const now = Date.parse("2026-09-05T12:00:00Z");
    expect(NEWS_ITEMS.filter(n => n.date < "2026-08-01").every(n => !isNewsActionable(n, now))).toBe(true);
    expect(COUNSELLING_PHASES.flatMap(p => p.milestones).every(m => isDeadlinePast(m.deadline, now))).toBe(true);
    expect(getCounsellingStatus("TS", now).headline).toContain("Engineering rounds are over");
    expect(getCounsellingStatus("TS", Date.parse("2026-09-30T23:59:59+05:30")).stage).not.toBe("Review needed");
    expect(getCounsellingStatus("TS", Date.parse("2026-10-01T00:00:00+05:30")).stage).toBe("Review needed");
  });

  it("reviews AP independently without extending the TG freshness window", () => {
    const now = Date.parse("2026-10-01T00:00:00+05:30");
    const ap = getCounsellingStatus("AP", now);
    const tg = getCounsellingStatus("TS", now);
    expect(ap.headline).toContain("BiPC final-phase allotments released");
    expect(ap.next).toContain("that window has passed");
    expect(ap.asOf).toBe("September 30, 2026");
    expect(tg.asOf).toBe("September 24, 2026");
    expect(tg.stage).toBe("Review needed");
    const expiration = Date.parse("2026-10-07T00:00:00+05:30");
    expect(getCounsellingStatus("AP", expiration - 1).stage).not.toBe("Review needed");
    expect(getCounsellingStatus("AP", expiration).next).toContain("September 30, 2026");
    expect(getCounsellingStatus("AP", expiration).stage).toBe("Review needed");
  });

  it("replaces the superseded September 24 alert with an AP-only update", () => {
    const now = Date.parse("2026-09-30T18:15:00+05:30");
    const old = NEWS_ITEMS.find(n => n.id === "eapcet-2026-final-phase-status-september-24")!;
    const current = NEWS_ITEMS.find(n => n.id === "ap-eapcet-2026-final-allotments-released-september-30")!;
    expect(isNewsArchived(old, now)).toBe(true);
    expect(isNewsActionable(current, now)).toBe(true);
    expect(current.state).toBe("AP");
    expect(current.summary).toContain("has passed");
  });

  it("keeps schedule IDs unique, ordered windows and calendar links on the counselling portal", () => {
    const milestones = COUNSELLING_PHASES.flatMap(p => p.milestones);
    expect(new Set(milestones.map(m => m.id)).size).toBe(milestones.length);
    for (const m of milestones) expect((m.start ?? m.deadline) <= m.deadline).toBe(true);
    const milestone = milestones.find(m => m.id === "sliding-report")!;
    const ics = buildIcs([{ milestone, phaseTag: "TS EAPCET Sliding" }], { now: new Date("2026-08-01T00:00:00Z") });
    expect(ics).toContain("DTSTART;VALUE=DATE:20260817");
    expect(ics).toContain("DTEND;VALUE=DATE:20260818");
    expect(ics).toContain("URL:https://tgeapcet.nic.in");
    expect(ics).not.toContain("URL:https://eapcet.tgche.ac.in");
  });
});
