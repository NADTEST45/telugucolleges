-- ============================================================
-- Security hardening for SECURITY DEFINER functions
-- Resolves Supabase advisor warnings:
--   0011_function_search_path_mutable
--   0028_anon_security_definer_function_executable
--   0029_authenticated_security_definer_function_executable
-- ============================================================

-- Lock search_path on functions that touch SECURITY DEFINER territory.
-- A mutable search_path lets a caller create a same-named relation in a
-- schema they control and have the SECURITY DEFINER function resolve to
-- that object instead of public — classic privilege escalation vector.
ALTER FUNCTION public.update_modified_column() SET search_path = public, pg_temp;
ALTER FUNCTION public.approve_edit_request(uuid, uuid, text) SET search_path = public, pg_temp;

-- approve_edit_request is a privileged operation: bypasses RLS, mutates
-- edit_requests and college_overrides. It must only be callable from the
-- service-role API path. Revoke EXECUTE from everyone else.
REVOKE EXECUTE ON FUNCTION public.approve_edit_request(uuid, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.approve_edit_request(uuid, uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.approve_edit_request(uuid, uuid, text) FROM authenticated;
GRANT  EXECUTE ON FUNCTION public.approve_edit_request(uuid, uuid, text) TO service_role;
