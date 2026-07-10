import { describe, expect, it } from "vitest";
import { validateEditValue, validateEvidenceUrl } from "@/lib/edit-validation";

describe("college edit validation", () => {
  it("binds each field to its declared category", () => {
    expect(validateEditValue("fees", "fee", "125000", 2026)).toBeNull();
    expect(validateEditValue("fees", "placements.avg", "8.4", 2026)).toContain("Invalid field");
    expect(validateEditValue("placements", "placements.avg", "8.4", 2026)).toBeNull();
  });

  it("rejects fabricated or out-of-range values", () => {
    expect(validateEditValue("basic_info", "year", "2000.5", 2026)).toContain("real year");
    expect(validateEditValue("basic_info", "year", "2027", 2026)).toContain("real year");
    expect(validateEditValue("basic_info", "naac", "Gold", 2026)).toContain("not recognized");
    expect(validateEditValue("placements", "placements.highest", "501", 2026)).toContain("outside");
    expect(validateEditValue("placements", "placements.companies", "3.5", 2026)).toContain("whole number");
  });

  it("requires HTTPS evidence", () => {
    expect(validateEvidenceUrl("https://www.naac.gov.in/example.pdf")).toBeNull();
    expect(validateEvidenceUrl("http://example.com/source")).toContain("HTTPS");
    expect(validateEvidenceUrl("not a url")).toContain("HTTPS");
  });
});
