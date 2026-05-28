-- Seed para validar Postman / TEAM-03
-- Escenarios cubiertos:
-- - happy path con usuario inscrito
-- - acceso bloqueado por no inscripcion
-- - acceso bloqueado por prerequisitos incompletos
-- - lectura de recursos externos
--
-- Nota: este archivo es idempotente por IDs fijos.

begin;

set search_path to cursos;

-- =====================================================
-- Profiles
-- =====================================================
insert into cursos.profiles (id, display_name, email, role, created_at)
values
  ('11111111-1111-1111-1111-111111111111', 'Seed Instructor', 'seed.instructor@example.com', 'instructor', now()),
  ('22222222-2222-2222-2222-222222222222', 'Seed Student Enrolled', 'seed.student.enrolled@example.com', 'student', now()),
  ('33333333-3333-3333-3333-333333333333', 'Seed Student Blocked', 'seed.student.blocked@example.com', 'student', now())
on conflict (id) do update set
  display_name = excluded.display_name,
  email = excluded.email,
  role = excluded.role;

-- =====================================================
-- Courses
-- =====================================================
insert into cursos.courses (id, slug, title, description, created_by, created_at)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'seed-happy-path-course', 'Seed Happy Path Course', 'Curso base para validar flujo feliz', '11111111-1111-1111-1111-111111111111', now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'seed-prereq-course', 'Seed Prerequisite Course', 'Curso prerequisito sin completado', '11111111-1111-1111-1111-111111111111', now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'seed-gated-course', 'Seed Gated Course', 'Curso bloqueado por prerequisitos', '11111111-1111-1111-1111-111111111111', now())
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  description = excluded.description,
  created_by = excluded.created_by;

-- =====================================================
-- Modules
-- =====================================================
insert into cursos.modules (id, course_id, title, position)
values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Happy Module', 1),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Prerequisite Module', 1),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Gated Module', 1)
on conflict (id) do update set
  course_id = excluded.course_id,
  title = excluded.title,
  position = excluded.position;

-- =====================================================
-- Lessons
-- =====================================================
insert into cursos.lessons (id, module_id, title, content, position)
values
  ('12121212-1212-1212-1212-121212121212', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Happy Lesson', '{"body":"Contenido de prueba happy path"}'::jsonb, 1),
  ('23232323-2323-2323-2323-232323232323', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Prerequisite Lesson', '{"body":"Contenido de prerequisito sin completar"}'::jsonb, 1),
  ('34343434-3434-3434-3434-343434343434', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Gated Lesson', '{"body":"Contenido bloqueado por prerequisitos"}'::jsonb, 1)
on conflict (id) do update set
  module_id = excluded.module_id,
  title = excluded.title,
  content = excluded.content,
  position = excluded.position;

-- =====================================================
-- Enrollments
-- =====================================================
insert into cursos.enrollments (id, user_id, course_id, enrolled_at, status)
values
  ('44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', now(), 'active'),
  ('44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', now(), 'active'),
  ('44444444-4444-4444-4444-444444444443', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', now(), 'active')
on conflict (id) do update set
  user_id = excluded.user_id,
  course_id = excluded.course_id,
  enrolled_at = excluded.enrolled_at,
  status = excluded.status;

-- =====================================================
-- Course prerequisites
-- =====================================================
insert into cursos.course_prerequisites (id, course_id, prerequisite_course_id, created_at)
values
  ('55555555-5555-5555-5555-555555555551', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', now())
on conflict (id) do update set
  course_id = excluded.course_id,
  prerequisite_course_id = excluded.prerequisite_course_id;

-- =====================================================
-- Progress
-- =====================================================
-- Happy path starts without completed progress so you can test the PUT endpoint.
-- Leave prerequisite course without completion so the gated course remains blocked.
insert into cursos.progress (id, enrollment_id, lesson_id, completed, completed_at)
values
  ('66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444441', '12121212-1212-1212-1212-121212121212', false, null),
  ('66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444442', '23232323-2323-2323-2323-232323232323', false, null),
  ('66666666-6666-6666-6666-666666666663', '44444444-4444-4444-4444-444444444443', '34343434-3434-3434-3434-343434343434', false, null)
on conflict (id) do update set
  enrollment_id = excluded.enrollment_id,
  lesson_id = excluded.lesson_id,
  completed = excluded.completed,
  completed_at = excluded.completed_at;

-- =====================================================
-- External resources (optional: only if the table exists)
-- =====================================================
do $$
begin
  if to_regclass('cursos.external_resources') is not null then
    insert into cursos.external_resources (
      id,
      lesson_id,
      url,
      provider,
      title,
      description,
      mime_type,
      thumbnail_url,
      duration_seconds,
      metadata,
      created_by,
      created_at
    )
    values
      (
        '77777777-7777-7777-7777-777777777771',
        '12121212-1212-1212-1212-121212121212',
        'https://example.com/happy-resource',
        'article',
        'Happy Resource',
        'Recurso de prueba para validar lectura de recursos',
        'text/html',
        null,
        null,
        '{"seed":true}'::jsonb,
        '11111111-1111-1111-1111-111111111111',
        now()
      )
    on conflict (id) do update set
      lesson_id = excluded.lesson_id,
      url = excluded.url,
      provider = excluded.provider,
      title = excluded.title,
      description = excluded.description,
      mime_type = excluded.mime_type,
      thumbnail_url = excluded.thumbnail_url,
      duration_seconds = excluded.duration_seconds,
      metadata = excluded.metadata,
      created_by = excluded.created_by;
  end if;
end $$;

commit;
