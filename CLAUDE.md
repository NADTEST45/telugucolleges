# TeluguColleges — Agent Context

> Public-facing data site for AP & Telangana college admissions (EAPCET/EAMCET cutoffs,
> college info, fees, placements, predictor, news). **Accuracy is non-negotiable — this is
> a live public site.** For data updates, proceed directly; don't wait for sign-off.
> See `docs/SCHEMA.md` for full type definitions and data shapes.

## Stack & deployment
- **Next.js 16** (App Router, `output: "standalone"`), **React 19**, **TypeScript**, **Tailwind v4**.
- **Supabase** (Postgres + Auth) for admin portal, edits, shortlists, leads, data reports.
- **Upstash Redis** for production rate limiting (falls back to in-memory if unset).
- Hosted on **Vercel**. Apex domain `telugucolleges.com` is canonical; `www` must remain a
  **redirect to apex** — flipping it breaks Google Search Console sitemap fetch.
- Sitemap submitted to GSC (~4,300+ pages). Public contact: `contact@telugucolleges.com`.

### Push / build
As of 2026-07-17 the sandbox **can** commit, run a full `next build`, and **push to
`origin/main`** — pushing triggers a Vercel **production** deploy to the live site.
(This section previously said none of that was possible; it was stale.)

- Run `npm run ci` (typecheck + lint + test) and, for anything non-trivial, `npm run build`
  before pushing — the build catches what CI doesn't.
- **Pushing to `main` publishes to telugucolleges.com.** Treat it as a deploy, not a save.
  Only push when the user has actually asked to deploy; commit and let them push otherwise.
- A failed Vercel build leaves prod on the previous deploy, but don't rely on that as the
  safety net. Verify the deploy reached `READY` and hit the live URL before calling it done.

## How the data is stored
Almost all site data is **static TypeScript/JSON in `src/lib/`** — there is no runtime DB read
for public pages (the DB is only for the admin/edit/lead workflow). Editing data = editing these
files, then committing. The build merges any approved Supabase overrides on top (see below).

Key data files (all in `src/lib/`):
- `colleges.ts` — **the master college list** (`COLLEGES: College[]`, ~849 rows). 328 KB.
- `ap-cutoffs.ts` — AP EAPCET historical cutoffs (`AP_CUTOFFS`, ~147 college codes, years 2023/2022).
- `ts-cutoffs.ts` — TS EAMCET cutoffs (`TS_CUTOFFS`, ~285 codes, years 2025/2024/2023). 702 KB.
- `ts-cutoffs-phases.ts` — TS phase-level cutoffs (phase1/phase2/special/final). 1.5 MB.
- `branch-taxonomy.ts` — **canonical branch mapping** unifying AP/TS branch codes (read this first
  before touching any predictor/branch code).
- `news.ts` — `NEWS_ITEMS` (~51 items), powers `/news`.
- `scholarships.ts`, `admission-exams.ts`, `placement-data.ts`, `university-courses.ts` — supporting datasets.
- `ap-cutoff-2026.ts`, `ts-cutoff-2026.ts` — 2026-season cutoff landing-page data.
- `program-data.ts`, `branch-data.ts`, `city-data.ts`, `comparison-pairs.ts`, `rank-band-data.ts` —
  drive `/programs`, `/branches`, `/best-colleges/[city]`, `/compare/[pair]`, `/eapcet/rank/[slug]`.

> ⚠️ The cutoff files have very long single lines and exceed normal read limits. Use `grep`/`jq`
> for targeted edits; don't try to read them whole.

## Critical correctness rules (learned the hard way)
1. **Indexability / SEO gating.** `hasRealData(college)` in `colleges.ts` requires ≥2 of:
   cutoff present, placements.avg>0, real NAAC grade, NIRF>0. Pages failing this are `noindex` +
   excluded from sitemap. **Use `isIndexable()` from `cutoff-presence.ts`** (server-only) for
   sitemap/metadata decisions — it's table-aware and counts historical cutoff data that the summary
   `cutoff.cse` field misses. Importing `cutoff-presence.ts` into client code pulls the huge cutoff
   tables into the client bundle — **never do that.**
2. **`cutoff.cse === 0` is common** even for colleges with real data — their ranks live only in the
   historical/phase tables. Resolve via the cutoff tables (`hasCutoffData`), not the summary field.
3. **Branch codes differ across sources** — `colleges.ts` uses lowercase core codes, AP uses
   lowercase (`cse_aiml`), TS uses 3-letter UPPERCASE (`CSM`). Always go through
   `branch-taxonomy.ts` (`canonicalIdForCode`, `codesForBranch`, `branchLabel`).
4. **College slugs are full-name-based**; a wrong slug renders a 404 shell. Confirm slugs against
   `COLLEGES` before linking.
5. **FAQ answers must stay in the DOM** (not collapsed/JS-only) for SEO.
6. **OG/metadata:** the file-based `opengraph-image` convention is broken in dynamic segments — use
   the `/api/og` route instead.
7. **CSP** allows `'unsafe-inline'` for scripts (JSON-LD + Next hydration) and styles (Tailwind v4).
   Never concatenate user input into HTML — JSON.stringify only. No third-party scripts on public pages.

## Override / edit flow (Supabase)
Public pages are static, but `getCollegesMerged()` / `getCollegeBySlugMerged()` in
`colleges-merged.ts` fetch approved `college_overrides` (service-role, ISR 60s) and apply a
**whitelisted set of fields only**: `fee`, `goFee`, `naac`, `nba`, `year`, `affiliation`,
`placements.avg/highest/companies`. College admins submit edits → super_admin approves via the
atomic `approve_edit_request()` SQL function → an override row is upserted → next build picks it up.

## Routes (App Router, `src/app/`)
Public: `/`, `/colleges` + `/colleges/[slug]` (+ `/cutoff` `/fees` `/placement` `/admission`),
`/branches[/slug]`, `/programs[/slug]`, `/universities`, `/compare[/pair]`, `/best-colleges[/city]`,
`/fee-calculator`, `/news[/slug]`, `/about` `/contact` `/privacy` `/terms`, and the EAPCET cluster
(`/eapcet`, `/eapcet/rank/[slug]` = the predictor, `/eapcet/ap-cutoff-2026[/branch]`,
`/eapcet/tg-cutoff-2026[/branch]`, `ap-results-2026`, `ap-web-options`, `ts-counselling-dates-2026`,
`certificate-verification-documents`).
Gated: `/admin*`, `/college-admin*`, `/marketing*` (Supabase auth).
API: `src/app/api/` — `auth/*`, `edits/{submit,review}`, `report`, `leads`, `shortlist`,
`admin/{users,audit-log}`, `og` (share images).
SEO: `src/app/sitemap.ts` (single flat sitemap, uses `isIndexable`) and `src/app/robots.ts`
(disallows `/admin`, `/college-admin`, `/api/` except `/api/og/`).

## Supabase schema (`supabase/init.sql` + `migrations/`)
Tables: `admin_users` (roles: `super_admin`|`college_admin`|`marketing`), `edit_requests`,
`college_overrides` (unique per college_code+field_name), `audit_log`, plus migrations for
`user_shortlists`, `data_reports` (anonymous "report incorrect data", service-role only),
`counselling_leads`. RLS is enabled everywhere; service role bypasses it and is used by API routes.

## Env vars (`.env.example`)
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (required for
admin/edits/auth), `UPSTASH_REDIS_REST_URL`/`_TOKEN` (prod rate limiting),
optional `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION`.

## When updating data
- Verify against official sources (TGCHE/APSCHE/NIRF/NAAC/college sites) — accuracy is the product.
- Keep the `College` shape exact; don't introduce 0/`"-"` placeholders that demote a page out of the index.
- For cutoffs, match the existing per-source code convention and add to the right year/phase structure.
- For news, prepend to `NEWS_ITEMS` with a unique `id` and accurate `date`/`source`/`sourceUrl`.
- Commit with a clear message; remind the user to push from their Mac.
