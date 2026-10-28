import { describe, expect, it } from "vitest";
import { getMedicalAdmission } from "../medical-admission";

describe("medical seat allocation", () => {
  it("limits the 15% All India Quota to government colleges", () => {
    const govt = getMedicalAdmission({ name: "G", state: "Telangana", type: "Government" });
    const pvt = getMedicalAdmission({ name: "P", state: "Andhra Pradesh", type: "Private" });
    const deemed = getMedicalAdmission({ name: "D", state: "Telangana", type: "Deemed University" });
    expect(govt.seatAllocationShort).toBe("KNRUHS (85% state quota) and MCC (15% All India Quota)");
    expect(pvt.seatAllocation).toContain("Dr. NTR University of Health Sciences");
    expect(pvt.seatAllocation).not.toContain("All India Quota");
    expect(deemed.seatAllocation).toContain("deemed-university counselling");
    expect(deemed.seatAllocationShort).not.toContain("KNRUHS");
  });
});
