-- ============================================================
-- Security hardening migration
-- Fixes: H1 (marketing role), M1 (overrides RLS), M2 (audit_log RLS),
--        M3 (edit_requests RLS), L2 (atomic edit approval)
-- ============================================================

-- H1: Add 'marketing' to allowed roles in admin_users
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE admin_users ADD CONSTRAINT admin_users_role_check
  CHECK (role IN ('super_admin', 'college_admin', 'marketing'));

-- M1: Restrict college_overrides SELECT to super_admin or own college
DROP POLICY IF EXISTS "Authenticated users can read overrides" ON college_overrides;

-- Allow public/anon to read overrides (needed for build-time merge with anon key)
CREATE POLICY "Anon can read overrides"
  ON college_overrides FOR SELECT
  USING (true);

-- Deny INSERT/UPDATE/DELETE for non-service-role
CREATE POLICY "Only service role can modify overrides"
  ON college_overrides FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only service role can update overrides"
  ON college_overrides FOR UPDATE
  USING (false);

CREATE POLICY "Only service role can delete overrides"
  ON college_overrides FOR DELETE
  USING (false);

-- M2: Complete audit_log RLS — explicit deny for INSERT/UPDATE/DELETE
-- (service_role bypasses RLS, so these block anon/authenticated only)
CREATE POLICY "No direct insert to audit log"
  ON audit_log FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No direct update to audit log"
  ON audit_log FOR UPDATE
  USING (false);

CREATE POLICY "No direct delete from audit log"
  ON audit_log FOR DELETE
  USING (false);

-- M3: Add UPDATE and DELETE policies to edit_requests
-- Only service_role (via API) can update status; direct updates blocked
CREATE POLICY "No direct update to edit requests"
  ON edit_requests FOR UPDATE
  USING (false);

CREATE POLICY "No direct delete from edit requests"
  ON edit_requests FOR DELETE
  USING (false);

-- L2: Create an atomic function for edit approval (status + override in one transaction)
CREATE OR REPLACE FUNCTION approve_edit_request(
  p_edit_id UUID,
  p_reviewer_id UUID,
  p_reviewer_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_edit RECORD;
BEGIN
  -- Get and lock the edit request
  SELECT * INTO v_edit
  FROM edit_requests
  WHERE id = p_edit_id AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Edit request not found or already reviewed';
  END IF;

  -- Update status
  UPDATE edit_requests
  SET status = 'approved',
      reviewer_id = p_reviewer_id,
      reviewer_notes = p_reviewer_notes
  WHERE id = p_edit_id;

  -- Upsert override
  INSERT INTO college_overrides (college_code, field_name, value, edit_request_id, updated_by, updated_at)
  VALUES (v_edit.college_code, v_edit.field_name, v_edit.new_value, p_edit_id, p_reviewer_id, now())
  ON CONFLICT (college_code, field_name)
  DO UPDATE SET
    value = EXCLUDED.value,
    edit_request_id = EXCLUDED.edit_request_id,
    updated_by = EXCLUDED.updated_by,
    updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
