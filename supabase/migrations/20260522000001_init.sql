-- Initial schema for courses_app_pwa
-- Generated: 2026-05-22
-- Includes core tables: profiles, courses, modules, lessons, enrollments, progress, evaluations

-- Ensure target schema exists for this app
CREATE SCHEMA IF NOT EXISTS cursos;

-- Users / Profiles (auth handled by Supabase Auth; keep profile data here)
CREATE TABLE IF NOT EXISTS cursos.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'student',
  created_at timestamptz DEFAULT now()
);

-- Courses, Modules, Lessons
CREATE TABLE IF NOT EXISTS cursos.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  created_by uuid REFERENCES cursos.profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cursos.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES cursos.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  position int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cursos.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES cursos.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  content jsonb,
  position int NOT NULL DEFAULT 0
);

-- Enrollments and Progress
CREATE TABLE IF NOT EXISTS cursos.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES cursos.profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES cursos.courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS cursos.progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES cursos.enrollments(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES cursos.lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz
);

-- Evaluations
CREATE TABLE IF NOT EXISTS cursos.evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES cursos.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cursos.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid REFERENCES cursos.evaluations(id) ON DELETE CASCADE,
  text text NOT NULL,
  meta jsonb
);

CREATE TABLE IF NOT EXISTS cursos.question_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES cursos.questions(id) ON DELETE CASCADE,
  text text NOT NULL,
  is_correct boolean DEFAULT false
);

-- Intentionally do NOT expose `is_correct` in views used by the client.

CREATE TABLE IF NOT EXISTS cursos.evaluation_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES cursos.profiles(id) ON DELETE CASCADE,
  evaluation_id uuid REFERENCES cursos.evaluations(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  score numeric
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON cursos.profiles(email);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON cursos.courses(slug);

-- RLS notes: enable RLS in a later migration after policies are defined.
-- Habilitar RLS en cada tabla
ALTER TABLE cursos.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos.evaluation_attempts ENABLE ROW LEVEL SECURITY;