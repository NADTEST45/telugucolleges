/**
 * Stress test for the EAPCET predictor rank→college flow + phase-wise lookups.
 * Run: npx tsx scripts/stress-test-predictor.ts
 * Exercises every category × gender × phase × state across edge-case ranks,
 * verifying: no exceptions, sane cutoffs, monotonic phase relaxation sanity,
 * and rank-band slug parsing robustness.
 */
import { COLLEGES } from "../src/lib/colleges";
import { CATEGORIES, type Category, type Gender } from "../src/lib/ap-cutoffs";
import {
  getHistoricalCutoff,
  getTSPhaseHistoricalCutoff,
  PREDICTOR_PHASES,
  type PredictorPhase,
} from "../src/lib/cutoff-utils";
import { parseRankBandSlug, getAllRankBandSlugs, getCollegesForBand } from "../src/lib/rank-band-data";
import { classify } from "../src/lib/predictor-core";

let failures = 0;
const fail = (msg: string) => { failures++; console.error("  FAIL:", msg); };

// ── 1. Predictor simulation (mirrors eapcet/page.tsx logic) ──────────────
function predict(rankStr: string, state: string, branch: string, cat: Category, gen: Gender, phase: PredictorPhase) {
  const r = parseInt(rankStr);
  if (!r || r <= 0) return [];
  const usePhaseData = phase !== "final";
  return COLLEGES
    .filter(c => {
      if (state && c.state !== state) return false;
      const hist = c.state === "Telangana"
        ? getTSPhaseHistoricalCutoff(c.code, branch, cat, gen, phase)
        : getHistoricalCutoff(c.code, branch, cat, gen, c.state);
      // Inclusion window comes from predictor-core's classify() — the single
      // source of truth for safe/moderate/reach thresholds. classify() returns
      // null for excluded (rank too far past close) or invalid closing ranks.
      if (hist.avg > 0) return classify(r, hist.avg) !== null;
      if (usePhaseData) return false;
      const cutoff = c.cutoff[branch];
      return !!cutoff && cutoff > 0 && classify(r, cutoff) !== null;
    })
    .map(c => {
      const hist = c.state === "Telangana"
        ? getTSPhaseHistoricalCutoff(c.code, branch, cat, gen, phase)
        : getHistoricalCutoff(c.code, branch, cat, gen, c.state);
      const cutoff = hist.avg > 0 ? hist.avg : (c.cutoff[branch] || 0);
      if (!Number.isFinite(cutoff) || cutoff < 0) fail(`non-finite/negative cutoff ${cutoff} for ${c.code} ${branch} ${cat} ${gen} ${phase}`);
      const ratio = r / cutoff; // cutoff>0 guaranteed by filter
      if (!Number.isFinite(ratio)) fail(`non-finite ratio for ${c.code} (cutoff=${cutoff})`);
      return { code: c.code, cutoff };
    })
    .sort((a, b) => a.cutoff - b.cutoff);
}

console.log("1. Edge-case ranks (all states/phases, CSE/OC/boys)...");
const edgeRanks = ["", "0", "-5", "1", "abc", "1.7", "999999999", "150000", "15000", String(Number.MAX_SAFE_INTEGER)];
for (const state of ["Telangana", "Andhra Pradesh"]) {
  for (const phase of PREDICTOR_PHASES.map(p => p.key)) {
    for (const r of edgeRanks) {
      try {
        const res = predict(r, state, state === "Telangana" ? "CSE" : "cse", "OC", "boys", phase);
        const ri = parseInt(r);
        if ((!ri || ri <= 0) && res.length > 0) fail(`rank "${r}" should yield 0 results`);
        // sorted ascending check
        for (let i = 1; i < res.length; i++) if (res[i].cutoff < res[i - 1].cutoff) fail(`unsorted results for rank ${r}`);
      } catch (e) {
        fail(`exception for rank="${r}" state=${state} phase=${phase}: ${e}`);
      }
    }
  }
}

console.log("2. Full matrix: categories × genders × phases (rank 40000, TS CSE)...");
for (const { key: cat } of CATEGORIES) {
  for (const gen of ["boys", "girls"] as Gender[]) {
    for (const { key: phase } of PREDICTOR_PHASES) {
      try {
        const res = predict("40000", "Telangana", "CSE", cat, gen, phase);
        for (const m of res) if (m.cutoff <= 0) fail(`zero cutoff included: ${m.code} ${cat} ${gen} ${phase}`);
      } catch (e) {
        fail(`exception ${cat}/${gen}/${phase}: ${e}`);
      }
    }
  }
}

console.log("3. Phase data integrity: phase-1 results must come only from phase sources...");
const p1 = predict("40000", "Telangana", "CSE", "OC", "boys", "phase1");
const fin = predict("40000", "Telangana", "CSE", "OC", "boys", "final");
console.log(`   Phase-1: ${p1.length} colleges | Final: ${fin.length} colleges (rank 40000, OC boys, CSE)`);
if (p1.length === 0) fail("Phase-1 returned 0 colleges at rank 40000 — data wiring broken?");
// Phase-1 cutoffs should generally be tighter (lower) than final for same college
let tighter = 0, looser = 0;
for (const a of p1) {
  const b = fin.find(x => x.code === a.code);
  if (b) { if (a.cutoff <= b.cutoff) tighter++; else looser++; }
}
console.log(`   Phase-1 tighter-or-equal vs Final: ${tighter}, looser: ${looser} (some looseness OK — different years)`);

console.log("4. All phases for every TS college code × every branch — exception sweep...");
const tsColleges = COLLEGES.filter(c => c.state === "Telangana");
const branches = ["CSE", "ECE", "EEE", "MEC", "CIV", "INF", "CSM", "CSD", "AID", "PHM", "nonexistent_branch", ""];
let lookups = 0;
for (const c of tsColleges) {
  for (const b of branches) {
    for (const { key: phase } of PREDICTOR_PHASES) {
      try { getTSPhaseHistoricalCutoff(c.code, b, "OC", "boys", phase); lookups++; }
      catch (e) { fail(`lookup exception ${c.code}/${b}/${phase}: ${e}`); }
    }
  }
}
console.log(`   ${lookups} lookups, no exceptions`);

console.log("5. Rank-band slugs (results-live → rank pages flow)...");
const slugs = getAllRankBandSlugs();
console.log(`   ${slugs.length} static rank-band pages`);
for (const s of slugs) {
  const parsed = parseRankBandSlug(s);
  if (!parsed) { fail(`own slug failed to parse: ${s}`); continue; }
  try {
    const m = getCollegesForBand(parsed);
    for (let i = 1; i < m.length; i++) if (m[i].closingRank < m[i - 1].closingRank) fail(`unsorted band ${s}`);
  } catch (e) { fail(`band exception ${s}: ${e}`); }
}
for (const bad of ["", "garbage", "0-cse-telangana", "-1-cse-telangana", "15000-cse-karnataka", "15000-badbranch-telangana", "15000-cse", "1e5-cse-telangana", "15000-cse-telangana-extra"]) {
  try {
    const p = parseRankBandSlug(bad);
    if (p) fail(`bad slug accepted: "${bad}"`);
  } catch (e) { fail(`parse exception for "${bad}": ${e}`); }
}

console.log("6. Perf: 1000 predictor runs (worst case: TS, final, varied ranks)...");
const t0 = Date.now();
for (let i = 0; i < 1000; i++) predict(String(1000 + i * 173), "Telangana", "CSE", "OC", "boys", "final");
const ms = Date.now() - t0;
console.log(`   ${ms}ms total, ${(ms / 1000).toFixed(2)}ms avg per keystroke-computation`);
if (ms / 1000 > 50) fail(`predictor too slow: ${(ms / 1000).toFixed(1)}ms avg (>50ms budget)`);

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
