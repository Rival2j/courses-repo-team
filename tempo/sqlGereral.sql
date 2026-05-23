-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE cursos.course_prerequisites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  prerequisite_course_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT course_prerequisites_pkey PRIMARY KEY (id),
  CONSTRAINT course_prerequisites_course_id_fkey FOREIGN KEY (course_id) REFERENCES cursos.courses(id),
  CONSTRAINT course_prerequisites_prerequisite_course_id_fkey FOREIGN KEY (prerequisite_course_id) REFERENCES cursos.courses(id)
);
CREATE TABLE cursos.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT courses_pkey PRIMARY KEY (id),
  CONSTRAINT courses_created_by_fkey FOREIGN KEY (created_by) REFERENCES cursos.profiles(id)
);
CREATE TABLE cursos.domain_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid,
  actor_user_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT domain_events_pkey PRIMARY KEY (id),
  CONSTRAINT domain_events_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES cursos.profiles(id)
);
CREATE TABLE cursos.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  course_id uuid,
  enrolled_at timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'active'::text,
  CONSTRAINT enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES cursos.profiles(id),
  CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES cursos.courses(id)
);
CREATE TABLE cursos.evaluation_attempt_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL,
  question_id uuid NOT NULL,
  selected_option_id uuid,
  answer_text text,
  answered_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT evaluation_attempt_answers_pkey PRIMARY KEY (id),
  CONSTRAINT evaluation_attempt_answers_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES cursos.evaluation_attempts(id),
  CONSTRAINT evaluation_attempt_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES cursos.questions(id),
  CONSTRAINT evaluation_attempt_answers_selected_option_id_fkey FOREIGN KEY (selected_option_id) REFERENCES cursos.question_options(id)
);
CREATE TABLE cursos.evaluation_attempt_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type = ANY (ARRAY['started'::text, 'autosave'::text, 'submitted'::text, 'graded'::text, 'blocked'::text])),
  actor_user_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT evaluation_attempt_events_pkey PRIMARY KEY (id),
  CONSTRAINT evaluation_attempt_events_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES cursos.evaluation_attempts(id),
  CONSTRAINT evaluation_attempt_events_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES cursos.profiles(id)
);
CREATE TABLE cursos.evaluation_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  evaluation_id uuid,
  started_at timestamp with time zone DEFAULT now(),
  finished_at timestamp with time zone,
  score numeric,
  CONSTRAINT evaluation_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT evaluation_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES cursos.profiles(id),
  CONSTRAINT evaluation_attempts_evaluation_id_fkey FOREIGN KEY (evaluation_id) REFERENCES cursos.evaluations(id)
);
CREATE TABLE cursos.evaluation_policies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  evaluation_id uuid NOT NULL UNIQUE,
  max_attempts integer NOT NULL DEFAULT 1 CHECK (max_attempts > 0),
  passing_score numeric,
  time_limit_seconds integer CHECK (time_limit_seconds IS NULL OR time_limit_seconds > 0),
  allow_review boolean NOT NULL DEFAULT false,
  shuffle_questions boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT evaluation_policies_pkey PRIMARY KEY (id),
  CONSTRAINT evaluation_policies_evaluation_id_fkey FOREIGN KEY (evaluation_id) REFERENCES cursos.evaluations(id)
);
CREATE TABLE cursos.evaluations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid,
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT evaluations_pkey PRIMARY KEY (id),
  CONSTRAINT evaluations_course_id_fkey FOREIGN KEY (course_id) REFERENCES cursos.courses(id)
);
CREATE TABLE cursos.learning_path_courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  learning_path_id uuid NOT NULL,
  course_id uuid NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_required boolean NOT NULL DEFAULT true,
  CONSTRAINT learning_path_courses_pkey PRIMARY KEY (id),
  CONSTRAINT learning_path_courses_learning_path_id_fkey FOREIGN KEY (learning_path_id) REFERENCES cursos.learning_paths(id),
  CONSTRAINT learning_path_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES cursos.courses(id)
);
CREATE TABLE cursos.learning_paths (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT learning_paths_pkey PRIMARY KEY (id),
  CONSTRAINT learning_paths_created_by_fkey FOREIGN KEY (created_by) REFERENCES cursos.profiles(id)
);
CREATE TABLE cursos.lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module_id uuid,
  title text NOT NULL,
  content jsonb,
  position integer NOT NULL DEFAULT 0,
  CONSTRAINT lessons_pkey PRIMARY KEY (id),
  CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES cursos.modules(id)
);
CREATE TABLE cursos.modules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid,
  title text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  CONSTRAINT modules_pkey PRIMARY KEY (id),
  CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES cursos.courses(id)
);
CREATE TABLE cursos.notification_deliveries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL,
  channel text NOT NULL CHECK (channel = ANY (ARRAY['in_app'::text, 'email'::text, 'push'::text])),
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text, 'cancelled'::text])),
  attempts integer NOT NULL DEFAULT 0,
  provider_message_id text,
  error_message text,
  scheduled_at timestamp with time zone,
  delivered_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notification_deliveries_pkey PRIMARY KEY (id),
  CONSTRAINT notification_deliveries_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES cursos.notifications(id)
);
CREATE TABLE cursos.notification_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  topic_id uuid NOT NULL,
  channel text NOT NULL DEFAULT 'in_app'::text CHECK (channel = ANY (ARRAY['in_app'::text, 'email'::text, 'push'::text])),
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notification_subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT notification_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES cursos.profiles(id),
  CONSTRAINT notification_subscriptions_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES cursos.notification_topics(id)
);
CREATE TABLE cursos.notification_topics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notification_topics_pkey PRIMARY KEY (id)
);
CREATE TABLE cursos.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  topic_id uuid,
  category text NOT NULL CHECK (category = ANY (ARRAY['progress'::text, 'evaluation'::text, 'achievement'::text, 'system'::text, 'moderation'::text])),
  title text NOT NULL,
  body text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES cursos.profiles(id),
  CONSTRAINT notifications_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES cursos.notification_topics(id)
);
CREATE TABLE cursos.profiles (
  id uuid NOT NULL,
  display_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'student'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE cursos.progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  enrollment_id uuid,
  lesson_id uuid,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  CONSTRAINT progress_pkey PRIMARY KEY (id),
  CONSTRAINT progress_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES cursos.enrollments(id),
  CONSTRAINT progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES cursos.lessons(id)
);
CREATE TABLE cursos.question_options (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question_id uuid,
  text text NOT NULL,
  is_correct boolean DEFAULT false,
  CONSTRAINT question_options_pkey PRIMARY KEY (id),
  CONSTRAINT question_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES cursos.questions(id)
);
CREATE TABLE cursos.questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  evaluation_id uuid,
  text text NOT NULL,
  meta jsonb,
  CONSTRAINT questions_pkey PRIMARY KEY (id),
  CONSTRAINT questions_evaluation_id_fkey FOREIGN KEY (evaluation_id) REFERENCES cursos.evaluations(id)
);