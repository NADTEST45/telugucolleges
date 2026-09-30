import { describe, expect, it } from "vitest";
import { COLLEGES, type College } from "@/lib/colleges";
import { DEFAULT_FILTERS, filterAndSort, parseFilters } from "../filtering";
import { getCutoffProps } from "../[slug]/college-detail-data";
import { TS_CUTOFFS } from "@/lib/ts-cutoffs";

const records: College[] = [
  { ...COLLEGES[0], id: 1, name: "Unknown fee", fee: 0, naac: "A++" },
  { ...COLLEGES[0], id: 2, name: "Known affordable", fee: 50000, naac: "A+" },
  { ...COLLEGES[0], id: 3, name: "Known higher", fee: 100000, naac: "A" },
];

describe("directory filtering and dated cutoff assembly", () => {
  it("does not represent unknown fees as affordable or cheapest", () => {
    expect(filterAndSort({ ...DEFAULT_FILTERS, maxFee: "50000" }, records).map(c => c.id)).toEqual([2]);
    expect(filterAndSort({ ...DEFAULT_FILTERS, sort: "fee_low" }, records).map(c => c.id)).toEqual([2, 3, 1]);
  });
  it("trims searches and ignores invalid fee limits", () => {
    expect(filterAndSort({ ...DEFAULT_FILTERS, q: "  KNOWN AFFORDABLE  " }, records).map(c => c.id)).toEqual([2]);
    for (const maxFee of ["-10", "50000oops", "NaN", "0"]) expect(parseFilters({ maxFee }).maxFee).toBe("");
  });
  it("NAAC thresholds match their or-above labels", () => {
    expect(filterAndSort({ ...DEFAULT_FILTERS, naac: "A+" }, records).map(c => c.id).sort()).toEqual([1, 2]);
    expect(filterAndSort({ ...DEFAULT_FILTERS, naac: "A" }, records)).toHaveLength(3);
  });
  it("includes CBIT's 2025 final ranks in both historical and phase-wise views", () => {
    const cbit = COLLEGES.find(c => c.code === "CBIT")!;
    const props = getCutoffProps(cbit);
    expect(props.phaseCutoffs?.["2025"]).toEqual(TS_CUTOFFS.CBIT["2025"]);
    expect(props.phases).toContainEqual({ key: "2025", label: "2025 Final Phase" });
    expect(props.phaseCutoffs?.["2025"].CSE.OC).toBe(2053);
    expect(props.historicalCutoffs?.["2025"].CSE.OC).toBe(2053);
  });
});
