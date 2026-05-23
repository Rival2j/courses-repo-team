-- 002_profiles_rls.sql
-- Initial RLS policies for `profiles` table.
-- This migration creates policies to allow users to read/update their own profile
-- and allows users with role = 'admin' to manage profiles. RLS is enabled for profiles.

-- Enable Row Level Security for profiles (moved to `cursos` schema)
ALTER TABLE IF EXISTS cursos.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own profile
DROP POLICY IF EXISTS "profiles_select_self" ON cursos.profiles;
CREATE POLICY "profiles_select_self" ON cursos.profiles
  FOR SELECT
  USING (id = auth.uid());

-- Allow users to update their own profile (except role)
DROP POLICY IF EXISTS "profiles_update_self" ON cursos.profiles;
CREATE POLICY "profiles_update_self" ON cursos.profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow admins to select and update any profile
DROP POLICY IF EXISTS "profiles_admin_full_access" ON cursos.profiles;
CREATE POLICY "profiles_admin_full_access" ON cursos.profiles
  FOR ALL
  USING (EXISTS (SELECT 1 FROM cursos.profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM cursos.profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin'));

-- Block unauthorized role changes at row level using a trigger.
CREATE OR REPLACE FUNCTION cursos.prevent_non_admin_role_change()
RETURNS trigger AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF auth.uid() IS NULL THEN
      RAISE EXCEPTION 'unauthenticated';
    END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM cursos.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    ) THEN
      RAISE EXCEPTION 'permission denied: role changes require admin';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_non_admin_role_change ON cursos.profiles;
CREATE TRIGGER trg_prevent_non_admin_role_change
BEFORE UPDATE ON cursos.profiles
FOR EACH ROW
EXECUTE FUNCTION cursos.prevent_non_admin_role_change();

-- Notes:
-- - The policy above checks the caller's role in the profiles table. It assumes
--   the caller's profile row exists and role is authoritative.
-- - Role escalation is blocked by trigger `trg_prevent_non_admin_role_change`.
-- - Role changes should be performed via a controlled RPC (see 003_set_user_role.sql).
