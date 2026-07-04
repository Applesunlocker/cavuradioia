
-- Trigger-only functions: no client should ever call these
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Admin RPCs: revoke from PUBLIC/anon, keep authenticated (they self-check admin)
REVOKE EXECUTE ON FUNCTION public.claim_admin_if_none() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_users_with_roles() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_user_role(uuid, public.app_role, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_admin_if_none() TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_users_with_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, public.app_role, boolean) TO authenticated;

-- has_role: used by RLS policies; revoke from anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
