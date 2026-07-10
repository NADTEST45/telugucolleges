# TeluguColleges — Data Schema Reference

Companion to `/CLAUDE.md`. Exact shapes of every core dataset, where it lives, and how the
three cutoff sources reconcile. All paths are under `src/lib/` unless noted.

---

## 1. College (`colleges.ts`)

The master list `COLLEGES: College[]` (~849 rows). Each row:

```ts
interface College {
  id: number;
  name: string;
  code: string;          // short institute code, e.g. "CBIT" — the join key to cutoff tables
  slug: string;          // URL slug, full-name based, e.g. "cvr-college-of-engineering-cvrh"
  district: string;
  state: "Telangana" | "Andhra Pradesh";
  type: "Government" | "Private" | "Deemed University" | "Private University";
  affiliation: string;   // e.g. "JNTUH", "Osmania University"
  naac: string;          // grade ("A++", "A+", "A", "B++"…) or "-" / "" if none
  nba: boolean;
  year: number | null;   // established; null means not verified (never use a fake sentinel)
  fee: number;           // annual tuition, ₹ (0 = unknown)
  goFee: number;         // govt-quota / convener fee, ₹
  nirf: number;          // NIRF rank (0 = unranked)
  cutoff: Record<string, number>;  // SUMMARY current-year ranks, lowercase core keys
                                   // {cse, ece, eee, mech, civil}; 0 = blank (≈119 colleges)
  placements: { avg: number; highest: number; companies: number }; // ₹ LPA; 0 = unknown
  branches: string[];    // display codes shown on the college page
}
```

Helpers:
- `getCollegeBySlug(slug)` → `College | undefined`
- `fmtFee(n)` → `"₹1,46,600"` or `"—"`
- `hasRealData(c, hasCutoffData?)` → ≥2-of-4 quality signals (cutoff / placements / NAAC / NIRF).
  Default `hasCutoffData = c.cutoff.cse > 0`; **pass the table-aware value** when available.

> The summary `cutoff` field is only the current-year column. Real cutoff history lives in the
> dedicated cutoff tables below, keyed by `College.code`.

---

## 2. Cutoff data — three sources, one taxonomy

### Shared types (`ap-cutoffs.ts`)
```ts
type Gender = "boys" | "girls";
type Category = /* OC / BC-A..E / SC / ST / EWS variants, with SC-I/II/III for TG 2025 */;
interface BranchCutoffs  { [category: string]: number; }   // category key → closing rank
interface YearCutoffs    { [branch: string]: BranchCutoffs; }
interface CollegeCutoffs { [year: string]: YearCutoffs; }
catKey(cat, gender)            // builds the composite category key
getRankForGender(cutoffs, cat, gender)
```

### Source A — AP (`ap-cutoffs.ts`)
`AP_CUTOFFS: Record<collegeCode, CollegeCutoffs>` — ~147 codes. `AP_CUTOFF_YEARS = ["2023","2022"]`.
Branch keys are **lowercase** (`cse`, `mech`, `civil`, `it`, `cse_aiml`, `cse_ds`…).

### Source B — TS summary (`ts-cutoffs.ts`)
`TS_CUTOFFS: Record<collegeCode, CollegeCutoffs>` — ~285 codes. `TS_CUTOFF_YEARS = ["2025","2024","2023"]`.
Branch keys are **3-letter UPPERCASE** (`MEC`, `CIV`, `INF`, `CSM`, `CSD`…).

### Source C — TS phases (`ts-cutoffs-phases.ts`)
Phase-level granularity. `PhaseKey = "2025" | "2025_phase1" | "2025_phase2" | "2024" |
"2023_phase1" | "2023_phase2" | "2023" | "2023_special" | "2022_phase1" | "2022_final"`.
`TS_PHASES[]` lists `{key,label,year}`. Per-phase consts like `TS_CUTOFFS_2025_PHASE1`.
`getTSPhaseCutoffs(code, phaseKey)` → `YearCutoffs | null`.

### Branch reconciliation (`branch-taxonomy.ts`) — READ BEFORE TOUCHING PREDICTOR
The same branch is spelled differently per source. `CANONICAL_BRANCHES: CanonicalBranch[]` maps each:
```ts
interface CanonicalBranch { id: string; label: string; codes: string[]; }
// e.g. { id:"cse_aiml", label:"CSE (AI & ML)", codes:["cse_aiml","CSM"] }
```
- `codesForBranch(id)` → all equivalent source codes
- `branchLabel(id)` → display label
- `canonicalIdForCode(code)` → canonical id (resolves legacy/shareable URL params, any case)

---

## 3. Predictor / cutoff utilities

### `cutoff-utils.ts`
```ts
interface HistoricalCutoffResult { /* resolved rank + which year/source it came from */ }
getHistoricalCutoff(...)                 // AP+TS summary lookup
type PredictorPhase = "final" | "phase1" | "phase2" | "special";
PREDICTOR_PHASES[]                       // selector options
getTSPhaseHistoricalCutoff(...)          // phase-aware TS lookup
```

### `cutoff-presence.ts` (SERVER-ONLY — imports the big tables)
```ts
CUTOFF_DATA_CODES: ReadonlySet<string>   // every code present in AP_CUTOFFS ∪ TS_CUTOFFS
hasCutoffData(c)   // c.cutoff.cse > 0  ||  CUTOFF_DATA_CODES.has(c.code)
isIndexable(c)     // hasRealData(c, hasCutoffData(c)) — use for sitemap & generateMetadata
```
Only import from server files (`sitemap.ts`, route `generateMetadata`). Never from client/`colleges.ts`.

### `rank-band-data.ts` (drives `/eapcet/rank/[slug]`)
```ts
RANK_BANDS[]; BRANCH_OPTIONS[]; STATE_OPTIONS[];
interface ParsedRankBand { ... }
parseRankBandSlug(slug) / buildRankBandSlug(rank, branch, state) / getAllRankBandSlugs()
getOcClosingRank(...); getCollegesForBand(parsed) -> RankBandMatch[]
```

### 2026-season landing pages
`ap-cutoff-2026.ts` (`AP_CUTOFF_BRANCHES`, `CutoffBranch`, `CutoffRow`, `getCutoffRows`),
`ts-cutoff-2026.ts` (`TS_CUTOFF_BRANCHES`, `TSCutoffRow`, `getTSCutoffRows`, plus
`TS_LAST_RANK_SENTINELS` / `isLastRankSentinel` to filter placeholder "last rank" values).

---

## 4. News (`news.ts`)
```ts
interface NewsItem {
  id: string; date: string; // YYYY-MM-DD
  title: string; summary: string; body: string; // body = plain text w/ \n line breaks
  category: "eapcet" | "fees" | "counselling" | "naac-nirf" | "general";
  state: "AP" | "TS" | "Both";
  priority: "high" | "medium" | "low";
  source?: string; sourceUrl?: string;
  verifiedAt?: string; expiresAt?: string; // required for time-sensitive current alerts
  tags: string[];
}
export const NEWS_ITEMS: NewsItem[]   // newest first; prepend new items
```

## 5. Other datasets
- `program-data.ts` / `programs.ts` — program landing pages (`getAllProgramSlugs`).
- `branch-data.ts` / `branch-constants.ts` — branch landing pages (`getAllBranchSlugs`).
- `city-data.ts` — `/best-colleges/[city]` (`getAllCitySlugs`).
- `comparison-pairs.ts` / `compare-faq.ts` — `/compare/[pair]` (`getAllPairSlugs`).
- `university-courses.ts` — university course catalog (large).
- `scholarships.ts`, `admission-exams.ts`, `medical-admission.ts`, `placement-data.ts`,
  `reviews.ts`, `ads.ts`, `useShortlist.ts`.
- Legacy raw JSON (`ap_btech_data.json`, `ap_mba_data.json`, etc.) — source extracts; the `.ts`
  files above are the live ones rendered on the site.

---

## 6. Supabase (`supabase/init.sql` + `supabase/migrations/`)

| Table | Purpose | Access |
|---|---|---|
| `admin_users` | portal accounts; `role IN (super_admin, college_admin, marketing)`; `college_code` NULL for super_admin | self-read via RLS |
| `edit_requests` | proposed data changes with an official HTTPS `evidence_url`; `category IN (fees, placements, basic_info)`; `status IN (pending, approved, rejected)` | college admin reads/inserts own |
| `college_overrides` | approved changes, UNIQUE(college_code, field_name) | service-role only; merged server-side |
| `audit_log` | actions (`approve`/`reject`/`create_user`…) with JSONB details | service-role only |
| `user_shortlists` (002) | saved college shortlists per user | per-user RLS |
| `data_reports` (006) | anonymous "report incorrect data" from public pages via `/api/report` | service-role only |
| `counselling_leads` (007) | predictor/WhatsApp lead capture | service-role only |

`approve_edit_request(edit_id, reviewer_id, notes)` (migration 003) atomically flips status +
upserts the override. The review API fails closed if that RPC is unavailable; it never falls back to a
partially atomic multi-query approval. RLS is enabled on all tables; API routes use the service-role key.

### Override field whitelist (`colleges-merged.ts`)
Only these `field_name` values are applied: `fee`, `goFee`, `naac`, `nba`, `year`, `affiliation`,
`placements.avg`, `placements.highest`, `placements.companies`. Submission and merge-time validation
both enforce field-specific ranges; malformed persisted values fail closed. Anything else is ignored.

### Canonical public repository (`colleges-merged.ts`)

Server-rendered public surfaces use `getCollegesMerged()` / `getCollegeBySlugMerged()` so approved
overrides appear consistently in profiles, lists, comparison, calculators, rank/cutoff pages,
predictors, and shortlists. The repository is request-deduped and tagged for revalidation. Client
components receive slim projections rather than importing the full master dataset. Static
`COLLEGES` remains appropriate for valid-slug enumeration and immutable join-key validation.

---

## 7. Build / SEO surfaces
- `src/app/sitemap.ts` — single flat sitemap; iterates colleges via `isIndexable`, plus branch,
  program, city, compare, rank-band, 2026-cutoff, and news URLs. `lastModified` set sparingly
  (BUILD_DATE for static-data pages; published date for news; omitted for top-level templates).
- `src/app/robots.ts` — allow `/` & `/api/og/`; disallow private/auth routes and `/api/`.
- `next.config.ts` — `output: standalone`, IndexNow key rewrite, full CSP + security headers.
- `.github/workflows/ci.yml` — typecheck, lint, unit/data-integrity tests, and predictor integration sweep.
