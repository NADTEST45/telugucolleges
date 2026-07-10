/**
 * GET /api/predict — server-side college prediction for the /eapcet hub.
 *
 * Exists so the hub page can stay a thin client: the large AP/TS cutoff
 * tables (~1.3 MB) and COLLEGES stay on the server, and classification uses
 * the ONE canonical threshold set in predictor-core.ts — the same bands the
 * web-options generator uses, so both official tools always agree.
 *
 * Query params:
 *   rank   required, 1..1_000_000
 *   st     "ts" | "ap" (default "ts")
 *   br     canonical branch id from branch-taxonomy (default "cse")
 *   cat    Category key (default "OC")
 *   g      "boys" | "girls" (default "boys")
 *   ph     PredictorPhase — TS only (default "final")
 *
 * Responses are fully determined by the query string and static data, so
 * they are CDN-cacheable; s-maxage keeps origin load minimal.
 */
import { NextRequest, NextResponse } from "next/server";
import { type College } from "@/lib/colleges";
import { getCollegesMerged } from "@/lib/colleges-merged";
import {
  getHistoricalCutoff,
  getTSPhaseHistoricalCutoff,
  estimateAllotmentChance,
} from "@/lib/cutoff-utils";
import { CATEGORIES, TS_CATEGORIES, type Category, type Gender } from "@/lib/categories";
import {
  classify,
  SAFETY_LABEL,
  PREDICTOR_PHASES,
  type PredictorPhase,
  type PredictApiRow,
} from "@/lib/predictor-core";
import { CANONICAL_BRANCHES, codesForBranch } from "@/lib/branch-taxonomy";

const VALID_CATS = new Set<string>([...CATEGORIES, ...TS_CATEGORIES].map(c => c.key));
const VALID_BRANCHES = new Set(CANONICAL_BRANCHES.map(b => b.id));
const VALID_PHASES = new Set<string>(PREDICTOR_PHASES.map(p => p.key));

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;

  const rank = parseInt(q.get("rank") ?? "", 10);
  if (!Number.isFinite(rank) || rank <= 0 || rank > 1_000_000) {
    return NextResponse.json({ error: "invalid rank" }, { status: 400 });
  }
  const state: College["state"] = q.get("st") === "ap" ? "Andhra Pradesh" : "Telangana";
  const branch = VALID_BRANCHES.has(q.get("br") ?? "") ? (q.get("br") as string) : "cse";
  const category: Category = VALID_CATS.has(q.get("cat") ?? "") ? (q.get("cat") as Category) : "OC";
  const gender: Gender = q.get("g") === "girls" ? "girls" : "boys";
  const phaseParam = q.get("ph") ?? "final";
  // Phase-wise data exists only for TGEAPCET (TSCHE publishes phase-wise PDFs; APSCHE doesn't)
  const phase: PredictorPhase =
    state === "Telangana" && VALID_PHASES.has(phaseParam) ? (phaseParam as PredictorPhase) : "final";
  const usePhaseData = phase !== "final";

  // Equivalent AP + TS codes for the canonical branch — tried together so one
  // choice resolves against both states' data.
  const branchCodes = codesForBranch(branch);
  const staticCutoff = (c: College) =>
    branchCodes.reduce<number>((v, cd) => v || c.cutoff[cd] || c.cutoff[cd.toLowerCase()] || 0, 0);

  const out: PredictApiRow[] = [];
  for (const c of await getCollegesMerged()) {
    if (c.state !== state) continue;
    const hist =
      c.state === "Telangana"
        ? getTSPhaseHistoricalCutoff(c.code, branchCodes, category, gender, phase)
        : getHistoricalCutoff(c.code, branchCodes, category, gender, c.state);
    let cutoff = 0;
    let isHistorical = false;
    let dataYears: string[] = [];
    if (hist.avg > 0) {
      cutoff = hist.avg;
      isHistorical = true;
      dataYears = hist.dataYears;
    } else if (usePhaseData) {
      continue; // no fallback when a specific phase is chosen — accuracy over coverage
    } else {
      cutoff = staticCutoff(c);
    }
    // Canonical classification — same thresholds as the web-options generator.
    const safety = classify(rank, cutoff);
    if (!safety) continue;

    // Rough allotment-probability estimate — only when we have ≥2 real
    // category/gender closing ranks to back it (returns null otherwise).
    const estPct = isHistorical ? estimateAllotmentChance(rank, hist.years) : null;

    out.push({
      id: c.id,
      slug: c.slug,
      name: c.name,
      district: c.district,
      fee: c.fee,
      cutoff,
      chance: SAFETY_LABEL[safety],
      isHistorical,
      dataYears,
      estPct,
    });
  }
  // Hub display order: most competitive (lowest closing rank) first.
  out.sort((a, b) => a.cutoff - b.cutoff);

  return NextResponse.json(
    { results: out },
    {
      headers: {
        // Static-data-derived: cache aggressively at the CDN, revalidate daily.
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
