-- ============================================================
-- TeluguColleges Admin Portal — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  college_code TEXT,                -- NULL for super_admin
  college_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'college_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- 2. Edit requests table
CREATE TABLE edit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_code TEXT NOT NULL,
  college_name TEXT NOT NULL,
  submitted_by UUID NOT NULL REFERENCES admin_users(id),
  submitted_by_email TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fees', 'placements', 'basic_info')),
  field_name TEXT NOT NULL,
  old_value TEXT NOT NULL,
  new_value TEXT NOT NULL,
  change_reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES admin_users(id),
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. College data overrides (approved changes ready for build-time merge)
CREATE TABLE college_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_code TEXT NOT NULL,
  field_name TEXT NOT NULL,
  value TEXT NOT NULL,
  edit_request_id UUID REFERENCES edit_requests(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES admin_users(id),
  UNIQUE(college_code, field_name)   -- one override per field per college
);

-- 4. Audit log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,              -- 'approve', 'reject', 'create_user', etc.
  actor_id UUID REFERENCES admin_users(id),
  actor_email TEXT,
  target_type TEXT,                  -- 'edit_request', 'admin_user', etc.
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_edit_requests_status ON edit_requests(status);
CREATE INDEX idx_edit_requests_college ON edit_requests(college_code);
CREATE INDEX idx_edit_requests_submitted_by ON edit_requests(submitted_by);
CREATE INDEX idx_college_overrides_code ON college_overrides(college_code);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_edit_requests_modtime
  BEFORE UPDATE ON edit_requests
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE edit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS, so these policies only affect anon/authenticated access

-- admin_users: users can read their own record
CREATE POLICY "Users can read own profile"
  ON admin_users FOR SELECT
  USING (auth.uid() = auth_id);

-- edit_requests: college admins see own edits, super admins see all
CREATE POLICY "College admins see own edits"
  ON edit_requests FOR SELECT
  USING (
    submitted_by IN (SELECT id FROM admin_users WHERE auth_id = auth.uid())
  );

CREATE POLICY "College admins can insert own edits"
  ON edit_requests FOR INSERT
  WITH CHECK (
    submitted_by IN (SELECT id FROM admin_users WHERE auth_id = auth.uid() AND is_active = true)
  );

-- college_overrides: read-only for authenticated users
CREATE POLICY "Authenticated users can read overrides"
  ON college_overrides FOR SELECT
  USING (auth.role() = 'authenticated');

-- audit_log: only super admins via service role (no direct access)
CREATE POLICY "No direct access to audit log"
  ON audit_log FOR SELECT
  USING (false);

-- ============================================================
-- Seed super admin (Sujeeth)
-- NOTE: Run this AFTER creating the auth user via Supabase Auth
-- ============================================================
-- INSERT INTO admin_users (auth_id, email, role)
-- VALUES ('<auth-user-uuid>', 'nadellasujeeth@hotmail.com', 'super_admin');
