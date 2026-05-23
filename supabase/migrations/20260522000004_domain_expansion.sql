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
