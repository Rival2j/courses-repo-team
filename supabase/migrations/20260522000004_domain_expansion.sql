-- 004_domain_expansion.sql
-- Scope: only data model for T221, T223, T321, T524.
-- No RPC/Edge functions and no CRUD endpoints.

-- =====================================================
-- T221: learning paths, prerequisites and course associations
-- =====================================================

-- Ensure target schema exists
CREATE SCHEMA IF NOT EXISTS cursos;


CREATE TABLE IF NOT EXISTS cursos.learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES cursos.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cursos.learning_path_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id uuid NOT NULL REFERENCES cursos.learning_paths(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES cursos.courses(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  is_required boolean NOT NULL DEFAULT true,
  UNIQUE (learning_path_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_learning_path_courses_path_id ON cursos.learning_path_courses(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_courses_course_id ON cursos.learning_path_courses(course_id);

CREATE TABLE IF NOT EXISTS cursos.course_prerequisites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES cursos.courses(id) ON DELETE CASCADE,
  prerequisite_course_id uuid NOT NULL REFERENCES cursos.courses(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_course_prerequisites_no_self CHECK (course_id <> prerequisite_course_id),
  UNIQUE (course_id, prerequisite_course_id)
);
CREATE INDEX IF NOT EXISTS idx_course_prerequisites_course_id ON cursos.course_prerequisites(course_id);
CREATE INDEX IF NOT EXISTS idx_course_prerequisites_prereq_id ON cursos.course_prerequisites(prerequisite_course_id);

-- RLS for learning paths and prerequisite tables.
ALTER TABLE IF EXISTS cursos.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cursos.learning_path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cursos.course_prerequisites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "learning_paths_read_active" ON cursos.learning_paths;
CREATE POLICY "learning_paths_read_active" ON cursos.learning_paths
  FOR SELECT
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1
      FROM cursos.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'instructor', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "learning_paths_admin_write" ON cursos.learning_paths;
CREATE POLICY "learning_paths_admin_write" ON cursos.learning_paths
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM cursos.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'instructor', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM cursos.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'instructor', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "learning_path_courses_read_active" ON cursos.learning_path_courses;
CREATE POLICY "learning_path_courses_read_active" ON cursos.learning_path_courses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM cursos.learning_paths lp
      WHERE lp.id = learning_path_id
        AND (
          lp.is_active = true
          OR EXISTS (
            SELECT 1
            FROM cursos.profiles p
            WHERE p.id = auth.uid()
              AND p.role IN ('admin', 'instructor', 'super_admin')
          )
        )
    )
  );

DROP POLICY IF EXISTS "learning_path_courses_admin_write" ON cursos.learning_path_courses;
CREATE POLICY "learning_path_courses_admin_write" ON cursos.learning_path_courses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM cursos.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'instructor', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM cursos.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'instructor', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "course_prerequisites_read_authenticated" ON cursos.course_prerequisites;
CREATE POLICY "course_prerequisites_read_authenticated" ON cursos.course_prerequisites
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "course_prerequisites_admin_write" ON cursos.course_prerequisites;
CREATE POLICY "course_prerequisites_admin_write" ON cursos.course_prerequisites
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM cursos.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'instructor', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM cursos.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'instructor', 'super_admin')
    )
  );

CREATE OR REPLACE FUNCTION cursos.is_course_completed_by_user(p_user_id uuid, p_course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN NOT EXISTS (
      SELECT 1
      FROM cursos.enrollments e
      WHERE e.user_id = p_user_id
        AND e.course_id = p_course_id
        AND e.status = 'active'
    ) THEN false
    WHEN NOT EXISTS (
      SELECT 1
      FROM cursos.modules m
      JOIN cursos.lessons l ON l.module_id = m.id
      WHERE m.course_id = p_course_id
    ) THEN true
    ELSE (
      SELECT coalesce(sum(CASE WHEN p.completed THEN 1 ELSE 0 END), 0)::int >= count(l.id)::int
      FROM cursos.enrollments e
      JOIN cursos.modules m ON m.course_id = p_course_id
      JOIN cursos.lessons l ON l.module_id = m.id
      LEFT JOIN cursos.progress p
        ON p.lesson_id = l.id
       AND p.enrollment_id = e.id
      WHERE e.user_id = p_user_id
        AND e.course_id = p_course_id
        AND e.status = 'active'
    )
  END;
$$;

CREATE OR REPLACE FUNCTION cursos.can_enroll(p_user_id uuid, p_course_id uuid)
RETURNS TABLE (
  user_id uuid,
  course_id uuid,
  can_enroll boolean,
  reason text,
  enrollment_id uuid,
  pending_prerequisite_course_ids uuid[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  existing_enrollment_id uuid;
  pending_prerequisite_ids uuid[];
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM cursos.courses c
    WHERE c.id = p_course_id
  ) THEN
    RETURN QUERY SELECT p_user_id, p_course_id, false, 'course_not_found', NULL::uuid, ARRAY[]::uuid[];
    RETURN;
  END IF;

  SELECT e.id
    INTO existing_enrollment_id
  FROM cursos.enrollments e
  WHERE e.user_id = p_user_id
    AND e.course_id = p_course_id
    AND e.status = 'active'
  LIMIT 1;

  IF existing_enrollment_id IS NOT NULL THEN
    RETURN QUERY SELECT p_user_id, p_course_id, false, 'already_enrolled', existing_enrollment_id, ARRAY[]::uuid[];
    RETURN;
  END IF;

  SELECT coalesce(array_agg(cp.prerequisite_course_id ORDER BY cp.created_at ASC), ARRAY[]::uuid[])
    INTO pending_prerequisite_ids
  FROM cursos.course_prerequisites cp
  WHERE cp.course_id = p_course_id
    AND NOT cursos.is_course_completed_by_user(p_user_id, cp.prerequisite_course_id);

  IF coalesce(cardinality(pending_prerequisite_ids), 0) = 0 THEN
    RETURN QUERY SELECT p_user_id, p_course_id, true, 'eligible', NULL::uuid, ARRAY[]::uuid[];
  ELSE
    RETURN QUERY SELECT p_user_id, p_course_id, false, 'prerequisites_incomplete', NULL::uuid, pending_prerequisite_ids;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION cursos.can_enroll(uuid, uuid) TO authenticated;

-- =====================================================
-- T223: recursive CTE views for prerequisite paths and cycle detection
-- =====================================================

CREATE OR REPLACE VIEW cursos.course_prerequisite_paths AS
WITH RECURSIVE walk AS (
  SELECT
    cp.course_id AS root_course_id,
    cp.course_id,
    cp.prerequisite_course_id,
    ARRAY[cp.course_id, cp.prerequisite_course_id]::uuid[] AS path,
    1::int AS depth,
    false AS has_cycle
  FROM cursos.course_prerequisites cp

  UNION ALL

  SELECT
    w.root_course_id,
    cp.course_id,
    cp.prerequisite_course_id,
    w.path || cp.prerequisite_course_id,
    w.depth + 1,
    cp.prerequisite_course_id = ANY (w.path) AS has_cycle
  FROM walk w
  JOIN cursos.course_prerequisites cp
    ON cp.course_id = w.prerequisite_course_id
  WHERE w.depth < 50
    AND NOT w.has_cycle
)
SELECT
  root_course_id,
  course_id,
  prerequisite_course_id,
  path,
  depth,
  has_cycle
FROM walk;

CREATE OR REPLACE VIEW cursos.course_prerequisite_cycles AS
SELECT DISTINCT
  root_course_id,
  path,
  depth
FROM cursos.course_prerequisite_paths
WHERE has_cycle = true;

-- Prevent transactional creation of cycles: trigger that validates inserts/updates
CREATE OR REPLACE FUNCTION cursos.prevent_prerequisite_cycle()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  found boolean;
BEGIN
  -- On INSERT/UPDATE, ensure that by adding NEW (course -> prerequisite) we do not create a path
  -- from prerequisite_course_id back to course_id (i.e., a cycle).
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  -- Run a recursive search from the NEW.prerequisite_course_id following prerequisite edges
  SELECT EXISTS (
    WITH RECURSIVE search(n) AS (
      SELECT NEW.prerequisite_course_id
      UNION
      SELECT cp.prerequisite_course_id
      FROM cursos.course_prerequisites cp
      JOIN search s ON cp.course_id = s.n
      WHERE cp.prerequisite_course_id IS NOT NULL
    )
    SELECT 1 FROM search WHERE n = NEW.course_id
  ) INTO found;

  IF found THEN
    RAISE EXCEPTION 'inserting prerequisite % -> % would create a cycle', NEW.course_id, NEW.prerequisite_course_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_prerequisite_cycle ON cursos.course_prerequisites;
CREATE TRIGGER trg_prevent_prerequisite_cycle
  BEFORE INSERT OR UPDATE ON cursos.course_prerequisites
  FOR EACH ROW EXECUTE FUNCTION cursos.prevent_prerequisite_cycle();

-- Expose helper RPCs for querying paths and cycles
CREATE OR REPLACE FUNCTION cursos.get_prerequisite_paths(p_root_course_id uuid)
RETURNS TABLE(root_course_id uuid, course_id uuid, prerequisite_course_id uuid, path uuid[], depth int, has_cycle boolean)
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM cursos.course_prerequisite_paths WHERE root_course_id = p_root_course_id;
$$;

CREATE OR REPLACE FUNCTION cursos.get_prerequisite_cycles(p_root_course_id uuid)
RETURNS TABLE(root_course_id uuid, path uuid[], depth int)
LANGUAGE sql
STABLE
AS $$
  SELECT root_course_id, path, depth
  FROM cursos.course_prerequisite_cycles
  WHERE root_course_id = p_root_course_id;
$$;

GRANT EXECUTE ON FUNCTION cursos.get_prerequisite_paths(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION cursos.get_prerequisite_cycles(uuid) TO authenticated;

-- =====================================================
-- T321: evaluation model with auditable attempt state
-- =====================================================

CREATE TABLE IF NOT EXISTS cursos.evaluation_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid NOT NULL UNIQUE REFERENCES cursos.evaluations(id) ON DELETE CASCADE,
  max_attempts int NOT NULL DEFAULT 1,
  passing_score numeric(5,2),
  time_limit_seconds int,
  allow_review boolean NOT NULL DEFAULT false,
  shuffle_questions boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_evaluation_policies_max_attempts CHECK (max_attempts > 0),
  CONSTRAINT ck_evaluation_policies_time_limit CHECK (time_limit_seconds IS NULL OR time_limit_seconds > 0)
);

CREATE TABLE IF NOT EXISTS cursos.evaluation_attempt_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES cursos.evaluation_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES cursos.questions(id) ON DELETE CASCADE,
  selected_option_id uuid REFERENCES cursos.question_options(id) ON DELETE SET NULL,
  answer_text text,
  answered_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (attempt_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_evaluation_attempt_answers_attempt_id ON cursos.evaluation_attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_attempt_answers_question_id ON cursos.evaluation_attempt_answers(question_id);

CREATE TABLE IF NOT EXISTS cursos.evaluation_attempt_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES cursos.evaluation_attempts(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  actor_user_id uuid REFERENCES cursos.profiles(id),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_evaluation_attempt_events_type CHECK (event_type IN ('started', 'autosave', 'submitted', 'graded', 'blocked'))
);
CREATE INDEX IF NOT EXISTS idx_evaluation_attempt_events_attempt_id ON cursos.evaluation_attempt_events(attempt_id);

-- =====================================================
-- T524: notifications model for selective realtime emission
-- =====================================================

CREATE TABLE IF NOT EXISTS cursos.notification_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cursos.notification_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES cursos.profiles(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES cursos.notification_topics(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'in_app',
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_notification_subscriptions_channel CHECK (channel IN ('in_app', 'email', 'push')),
  UNIQUE (user_id, topic_id, channel)
);
CREATE INDEX IF NOT EXISTS idx_notification_subscriptions_user_id ON cursos.notification_subscriptions(user_id);

CREATE TABLE IF NOT EXISTS cursos.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES cursos.profiles(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES cursos.notification_topics(id) ON DELETE SET NULL,
  category text NOT NULL,
  title text NOT NULL,
  body text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_notifications_category CHECK (category IN ('progress', 'evaluation', 'achievement', 'system', 'moderation'))
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON cursos.notifications(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS cursos.notification_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL REFERENCES cursos.notifications(id) ON DELETE CASCADE,
  channel text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts int NOT NULL DEFAULT 0,
  provider_message_id text,
  error_message text,
  scheduled_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_notification_deliveries_channel CHECK (channel IN ('in_app', 'email', 'push')),
  CONSTRAINT ck_notification_deliveries_status CHECK (status IN ('pending', 'sent', 'failed', 'cancelled'))
);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_notification_id ON cursos.notification_deliveries(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_status ON cursos.notification_deliveries(status);

CREATE TABLE IF NOT EXISTS cursos.domain_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid,
  actor_user_id uuid REFERENCES cursos.profiles(id),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_domain_events_type_created_at ON cursos.domain_events(event_type, created_at DESC);

-- =====================================================
-- T224: progression/unlock rules and RLS for progress/enrollments
-- =====================================================

-- Policy: only enrollment owner or admin/instructor can modify enrollment rows
DROP POLICY IF EXISTS "enrollments_owner_write" ON cursos.enrollments;
CREATE POLICY "enrollments_owner_write" ON cursos.enrollments
  FOR ALL
  USING ( auth.uid() IS NOT NULL AND ( auth.uid() = user_id OR EXISTS (SELECT 1 FROM cursos.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','instructor','super_admin')) ) )
  WITH CHECK ( auth.uid() IS NOT NULL AND ( auth.uid() = user_id OR EXISTS (SELECT 1 FROM cursos.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','instructor','super_admin')) ) );

-- Policy: progress rows can be inserted/updated only by enrollment owner or admin/instructor
DROP POLICY IF EXISTS "progress_owner_write" ON cursos.progress;
CREATE POLICY "progress_owner_write" ON cursos.progress
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cursos.enrollments e WHERE e.id = progress.enrollment_id AND (e.user_id = auth.uid() OR EXISTS (SELECT 1 FROM cursos.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','instructor','super_admin')))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cursos.enrollments e WHERE e.id = progress.enrollment_id AND (e.user_id = auth.uid() OR EXISTS (SELECT 1 FROM cursos.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','instructor','super_admin')))
    )
  );

-- Trigger to enforce sequential completion within a module
CREATE OR REPLACE FUNCTION cursos.enforce_sequential_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  prev_lesson_id uuid;
  prev_completed boolean;
BEGIN
  -- Only enforce when setting completed = true
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  IF COALESCE(NEW.completed, false) = false THEN
    RETURN NEW;
  END IF;

  -- Find the previous lesson in the same module by position
  SELECT l_prev.id
    INTO prev_lesson_id
  FROM cursos.lessons l_curr
  JOIN cursos.lessons l_prev ON l_prev.module_id = l_curr.module_id AND l_prev.position < l_curr.position
  WHERE l_curr.id = NEW.lesson_id
  ORDER BY l_prev.position DESC
  LIMIT 1;

  IF prev_lesson_id IS NULL THEN
    -- No previous lesson, OK to complete
    RETURN NEW;
  END IF;

  SELECT COALESCE(p.completed, false)
    INTO prev_completed
  FROM cursos.progress p
  WHERE p.lesson_id = prev_lesson_id
    AND p.enrollment_id = NEW.enrollment_id
  LIMIT 1;

  IF prev_completed IS NOT TRUE THEN
    RAISE EXCEPTION 'cannot complete lesson % before completing previous lesson %', NEW.lesson_id, prev_lesson_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_sequential_progress ON cursos.progress;
CREATE TRIGGER trg_enforce_sequential_progress
  BEFORE INSERT OR UPDATE ON cursos.progress
  FOR EACH ROW EXECUTE FUNCTION cursos.enforce_sequential_progress();

GRANT EXECUTE ON FUNCTION cursos.enforce_sequential_progress() TO authenticated;
