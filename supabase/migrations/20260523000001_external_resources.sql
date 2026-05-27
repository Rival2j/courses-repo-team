-- Nueva tabla de recursos externos por lección
CREATE TABLE IF NOT EXISTS cursos.external_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES cursos.lessons(id) ON DELETE CASCADE,
  url text NOT NULL,
  provider text NOT NULL,
  title text,
  description text,
  mime_type text,
  thumbnail_url text,
  duration_seconds int,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES cursos.profiles(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT ck_external_resources_provider CHECK (provider IN (
    'youtube',
    'vimeo',
    'pdf',
    'image',
    'audio',
    'article',
    'unknown'
  ))
);

CREATE INDEX IF NOT EXISTS idx_external_resources_lesson_id
  ON cursos.external_resources(lesson_id);

CREATE INDEX IF NOT EXISTS idx_external_resources_provider
  ON cursos.external_resources(provider);

ALTER TABLE cursos.external_resources ENABLE ROW LEVEL SECURITY;
