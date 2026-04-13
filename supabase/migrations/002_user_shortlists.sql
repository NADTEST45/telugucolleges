-- ============================================================
-- TeluguColleges: User Shortlists
-- Allows authenticated public users to shortlist college+program combos
-- ============================================================

-- Shortlists table
CREATE TABLE IF NOT EXISTS user_shortlists (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_slug text NOT NULL,              -- matches College.slug in app data
  program     text,                         -- optional: e.g. "CSE", "MBA", "B.Pharm"
  created_at  timestamptz DEFAULT now() NOT NULL,

  -- Data integrity constraints
  CONSTRAINT college_slug_not_empty CHECK (college_slug <> ''),
  CONSTRAINT college_slug_format CHECK (college_slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$' OR length(college_slug) = 1),
  CONSTRAINT college_slug_length CHECK (length(college_slug) <= 255),
  CONSTRAINT program_not_empty CHECK (program IS NULL OR program <> ''),
  CONSTRAINT program_length CHECK (program IS NULL OR length(program) <= 100)
);

-- Each user can shortlist a college+program combo only once
CREATE UNIQUE INDEX IF NOT EXISTS idx_shortlists_unique
  ON user_shortlists (user_id, college_slug, COALESCE(program, ''));

-- Fast lookup: all shortlists for a user
CREATE INDEX IF NOT EXISTS idx_shortlists_user
  ON user_shortlists (user_id, created_at DESC);

-- Fast lookup: how many users shortlisted a college
CREATE INDEX IF NOT EXISTS idx_shortlists_college
  ON user_shortlists (college_slug);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE user_shortlists ENABLE ROW LEVEL SECURITY;

-- Users can only see their own shortlists
CREATE POLICY "Users read own shortlists"
  ON user_shortlists FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own shortlists
CREATE POLICY "Users insert own shortlists"
  ON user_shortlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own shortlists (defense in depth — app doesn't use UPDATE)
CREATE POLICY "Users update own shortlists"
  ON user_shortlists FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own shortlists
CREATE POLICY "Users delete own shortlists"
  ON user_shortlists FOR DELETE
  USING (auth.uid() = user_id);

-- Service role (admin) can read all for analytics
CREATE POLICY "Service role reads all shortlists"
  ON user_shortlists FOR SELECT
  USING (auth.role() = 'service_role');
