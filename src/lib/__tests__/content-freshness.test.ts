import { describe, expect, it } from "vitest";
import { indiaDate, isDeadlinePast, isNewsActionable, isNewsArchived } from "../content-freshness";
import { AP_BIPC_THIRD_PHASE_SOURCE, getCounsellingStatus, TG_BIPC_SCHEDULE_SOURCE, TG_BIPC_SPOT_EXTENSION_SOURCE, TG_SCHEDULE_SOURCE } from "../counselling-status";
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
    expect(getCounsellingStatus("TS", now).next).toContain("August spot-admission windows have passed");
    expect(getCounsellingStatus("TS", Date.parse("2026-11-03T23:59:59+05:30")).stage).not.toBe("Review needed");
    expect(getCounsellingStatus("TS", Date.parse("2026-11-04T00:00:00+05:30")).stage).toBe("Review needed");
  });

  it("keeps AP and TG review dates as separate fields", () => {
    const now = Date.parse("2026-10-28T12:00:00+05:30");
    const ap = getCounsellingStatus("AP", now);
    const tg = getCounsellingStatus("TS", now);
    expect(ap.headline).toContain("BiPC third and final phase");
    expect(ap.next).toContain("October 28–30, 2026");
    expect(ap.next).toContain("seats were allotted on October 27");
    expect(AP_BIPC_THIRD_PHASE_SOURCE).toContain("cap.apcfss.in/TET-PDF/EAPCET-BIPC-DOCS/");
    expect(ap.reviewedAt).toBe("2026-10-28");
    expect(tg.reviewedAt).toBe("2026-10-28");
    const expiration = Date.parse("2026-11-04T00:00:00+05:30");
    expect(getCounsellingStatus("AP", expiration - 1).stage).not.toBe("Review needed");
    expect(getCounsellingStatus("AP", expiration).next).toContain("October 28, 2026");
    expect(getCounsellingStatus("AP", expiration).stage).toBe("Review needed");
  });

  it("reports the closed TG BiPC spot window from official sources", () => {
    const tg = getCounsellingStatus("TS", Date.parse("2026-10-11T23:00:00+05:30"));
    expect(tg.headline).toContain("BiPC spot admissions closed October 10");
    expect(tg.next).toContain("press note dated October 7");
    expect(tg.next).not.toContain("could not re-verify");
    expect(TG_BIPC_SCHEDULE_SOURCE).toContain("tgeapcetbd.nic.in/files/BIPC2026DETAILEDNOTIFICATION.pdf");
    expect(TG_BIPC_SPOT_EXTENSION_SOURCE).toContain("tgeapcetbd.nic.in/files/");
    expect(TG_SCHEDULE_SOURCE).not.toBe(TG_BIPC_SCHEDULE_SOURCE);
  });

  it("replaces superseded alerts and keeps the BiPC spot closure informational", () => {
    const now = Date.parse("2026-10-11T23:00:00+05:30");
    const old = NEWS_ITEMS.find(n => n.id === "eapcet-2026-final-phase-status-september-24")!;
    const ap = NEWS_ITEMS.find(n => n.id === "ap-eapcet-2026-final-allotments-released-september-30")!;
    const current = NEWS_ITEMS.find(n => n.id === "tg-eapcet-bipc-2026-spot-admissions-closed-october-10")!;
    expect(isNewsArchived(old, now)).toBe(true);
    expect(isNewsArchived(ap, now)).toBe(true);
    expect(isNewsArchived(current, now)).toBe(false);
    expect(isNewsActionable(current, now)).toBe(false);
    expect(current.state).toBe("TS");
    expect(current.summary).toContain("has now passed");
  });

  it("keeps the AP BiPC third-phase reporting alert live only through October 30", () => {
    const alert = NEWS_ITEMS.find(n => n.id === "ap-eapcet-bipc-2026-third-final-phase-allotment-october-27")!;
    const tgClosed = NEWS_ITEMS.find(n => n.id === "tg-eapcet-bipc-2026-spot-admissions-closed-october-10")!;
    const now = Date.parse("2026-10-28T12:00:00+05:30");
    expect(isNewsActionable(alert, now)).toBe(true);
    expect(isNewsArchived(tgClosed, now)).toBe(true);
    expect(isNewsActionable(alert, Date.parse("2026-10-30T23:59:59+05:30"))).toBe(true);
    expect(isNewsArchived(alert, Date.parse("2026-10-31T00:00:00+05:30"))).toBe(true);
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
