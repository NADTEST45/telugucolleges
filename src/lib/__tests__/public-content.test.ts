import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import Home from "@/app/page";
import NewsItemPage from "@/app/news/[slug]/page";
import { PREDICTOR_FAQS } from "@/app/eapcet/structured-data";

vi.mock("@/lib/colleges-merged", () => ({ getCollegesMerged: async () => [] }));
const source = (path: string) => readFileSync(`src/${path}`, "utf8");

describe("public admissions copy", () => {
  it("labels archived homepage and related news and links directly to articles", async () => {
    vi.spyOn(Date, "now").mockReturnValue(Date.parse("2026-10-28T12:00:00+05:30"));
    try {
      const home = renderToStaticMarkup(await Home());
      expect(home).toContain("Archived update");
      expect(home).toContain('href="/news/tg-eapcet-bipc-2026-spot-admissions-closed-october-10"');
      expect(home).not.toContain("Top CSE Colleges");
      const related = renderToStaticMarkup(await NewsItemPage({ params: Promise.resolve({ slug: "ap-eapcet-2026-final-allotments-released-september-30" }) }));
      expect(related).toContain("Archived update — check current notices");
    } finally { vi.restoreAllMocks(); }
  });
  it("does not promise elapsed WhatsApp reminders in either results page", () => {
    expect(source("app/eapcet/ap-results-2026/page.tsx")).not.toContain("Get counselling reminders on WhatsApp");
    expect(source("app/eapcet/ap-results-2026-telugu/page.tsx")).not.toContain("<LeadCapture");
  });
  it("describes the actual predictor weights and distinct EWS category", () => {
    const copy = PREDICTOR_FAQS.map(f => f.a).join(" ");
    expect(copy).toContain("50%/30%/20%");
    expect(copy).toContain("70%/30%");
    expect(copy).toContain("EWS uses its own recorded cutoff, not OC");
    expect(copy).toContain("2025, 2024 and 2023");
  });
  it("does not show cross-year ranks as previous-phase relaxation", () => {
    expect(source("app/colleges/[slug]/CollegeDetail.tsx")).not.toContain("cutoff relaxed from previous phase");
  });
});
