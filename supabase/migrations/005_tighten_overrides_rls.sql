-- ============================================================
-- Tighten college_overrides SELECT RLS
-- ============================================================
-- Context: 003_security_hardening.sql created a permissive policy
--   "Anon can read overrides" ... FOR SELECT USING (true)
-- with a comment claiming the broad anon read was "needed for
-- build-time merge with anon key".
--
-- That comment is inaccurate. The ONLY reader of college_overrides is
-- getCollegesMerged() in src/lib/colleges-merged.ts, which fetches the
-- table using SUPABASE_SERVICE_ROLE_KEY (sent as both the `apikey` and
-- `Authorization: Bearer` headers — see lines 74, 83-84). This runs
-- server-side only, at build-time SSG and during ISR revalidation
-- (revalidate=3600 on the page, revalidate=60 on the fetch). The anon
-- key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is never used to read overrides.
-- The only other reference (src/app/api/edits/review/route.ts) is a
-- writer that also uses the service client.
--
-- Because service_role bypasses RLS entirely, the anon SELECT grant is
-- unnecessary attack surface. Dropping it does NOT affect the build,
-- the public site, or admin review — all override access uses
-- service_role. This migration replaces the permissive anon SELECT with
-- an explicit deny. The INSERT/UPDATE/DELETE deny policies from
-- migration 003 are left untouched.
-- ============================================================

-- Remove the permissive anon/public read grant from migration 003.
DROP POLICY IF EXISTS "Anon can read overrides" ON college_overrides;

-- Explicitly deny SELECT for anon/authenticated roles. service_role
-- bypasses RLS, so the build-time / ISR merge continues to work.
CREATE POLICY "No anon read of overrides"
  ON college_overrides FOR SELECT
  USING (false);
