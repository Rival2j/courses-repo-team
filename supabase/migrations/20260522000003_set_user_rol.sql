-- 003_set_user_role.sql
-- Server-side function to change a user's role in a controlled manner.
-- The function verifies the caller is an admin (by checking their profile.row role = 'admin').
-- It is defined SECURITY DEFINER to run with function owner's privileges but performs
-- an explicit check against auth.uid() to ensure only admins can execute it.

CREATE OR REPLACE FUNCTION cursos.set_user_role(target_user uuid, new_role text)
RETURNS void AS $$
BEGIN
  -- Ensure caller is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'unauthenticated';
  END IF;

  -- Ensure caller has admin role in profiles (now in cursos schema)
  IF NOT EXISTS (SELECT 1 FROM cursos.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') THEN
    RAISE EXCEPTION 'permission denied: caller is not admin';
  END IF;

  -- Update the target user's role (this will be audited by triggers/logging if configured)
  UPDATE cursos.profiles
    SET role = new_role
    WHERE id = target_user;

  RETURN;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- Grant execute to authenticated role (so functions can be called via RPC)
GRANT EXECUTE ON FUNCTION cursos.set_user_role(uuid, text) TO authenticated;

-- Note: SECURITY DEFINER functions run with the privileges of the function owner.
-- Be sure the function owner is a restricted DB role and review privileges.
