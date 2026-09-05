/**
 * /eapcet hub — SERVER component. Owns everything that needs the large
 * static datasets (COLLEGES + AP/TS cutoff tables): the data-backed branch
 * dropdown and the per-state "At a Glance" stats. The interactive predictor
 * UI lives in EapcetClient, which calls /api/predict — so none of the big
 * tables ever reach the browser bundle (CLAUDE.md bundle rule).
 */
import type { College } from "@/lib/colleges";
import { getCollegesMerged } from "@/lib/colleges-merged";
import { AP_CUTOFFS } from "@/lib/ap-cutoffs";
import { TS_CUTOFFS } from "@/lib/ts-cutoffs";
import { CANONICAL_BRANCHES } from "@/lib/branch-taxonomy";
import { fmtFee } from "@/lib/format";
import EapcetClient, { type EapcetStateStats } from "./EapcetClient";

/* Branches to offer in the dropdown: the canonical taxonomy filtered to those
   that actually have cutoff data in at least one source. One label per branch,
   each backed by all its equivalent AP/TS codes (see branch-taxonomy.ts), so a
   single selection reaches both states' data. Order = competitor-style,
   most-popular-first (taxonomy order), not alphabetical. */
function branchesWithData(colleges: College[]): { id: string; label: string }[] {
  const present = new Set<string>();
  const add = (b: string) => present.add(b.toLowerCase());
  colleges.forEach(c => Object.keys(c.cutoff).forEach(add));
  Object.values(TS_CUTOFFS).forEach(college =>
    Object.values(college).forEach(yearData => Object.keys(yearData).forEach(add)));
  Object.values(AP_CUTOFFS).forEach(college =>
    Object.values(college).forEach(yearData => Object.keys(yearData).forEach(add)));
  return CANONICAL_BRANCHES
    .filter(b => b.codes.some(c => present.has(c.toLowerCase())))
    .map(b => ({ id: b.id, label: b.label }));
}

function statsFor(colleges: College[], state: "Telangana" | "Andhra Pradesh"): EapcetStateStats {
  const subset = colleges.filter(c => c.state === state);
  const feesAboveZero = subset.filter(c => c.fee > 0);
  return {
    colleges: subset.length,
    lowestFee: feesAboveZero.length > 0 ? fmtFee(Math.min(...feesAboveZero.map(c => c.fee))) : "—",
    highestFee: feesAboveZero.length > 0 ? fmtFee(Math.max(...feesAboveZero.map(c => c.fee))) : "—",
    nirfRanked: subset.filter(c => c.nirf > 0).length,
  };
}

export const revalidate = 300;

export default async function EAPCETPage() {
  const colleges = await getCollegesMerged();
  return (
    <EapcetClient
      initialNow={Date.now()}
      branches={branchesWithData(colleges)}
      stats={{
        Telangana: statsFor(colleges, "Telangana"),
        "Andhra Pradesh": statsFor(colleges, "Andhra Pradesh"),
      }}
    />
  );
}
