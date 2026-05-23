# Migraciones y flujo de despliegue de la base de datos (Supabase)

Propósito: documentar un flujo seguro y reproducible para versionar migraciones SQL, ejecutar y probar localmente, y aplicar o extraer (push/pull) cambios desde/hacia el entorno Supabase en la nube.

Audiencia: desarrolladores que trabajen en `001-team-03-backend` y otros equipos que necesiten reproducir producción localmente.

---

## Principios básicos

- Versionar siempre los cambios de esquema como migraciones numeradas en `db/migrations/` (p. ej. `001_init.sql`, `002_add_policies.sql`).
- No versionar el estado local del motor (`supabase/`) ni archivos que contengan secretos o WAL. Mantén `supabase/` en `.gitignore`.
- Documentar seeds reproducibles en `db/seeds/` y ejecutar en entornos de testing/staging solo cuando sea seguro.
- Aplicar migraciones en CI/CD y revisar en PRs antes de tocar producción.

---

## Estructura recomendada en el repo

- `db/migrations/` — archivos SQL ordenados y numerados (obligatorio).
- `db/seeds/` — seeds idempotentes para entornos de testing (opcional).
- `supabase/config.template.toml` — plantilla segura (sin secretos) si se necesita compartir configuración.
- `docs/supabase-setup.md` y `docs/db-migrations-and-deployment.md` — documentación operativa (esta guía).

---

## Convenciones de migraciones

- Nombre: `NNN_description.sql` donde `NNN` es un número secuencial con ceros a la izquierda (ej. `001`, `002`).
- Contenido: cambios DDL/DDL reversible, índices y creación de tablas. Evitar insertar datos volátiles en migraciones ya aplicadas en producción.
- Políticas RLS: definir en migraciones separadas (ej. `003_rls_policies.sql`) y activar RLS explícitamente en una migración posterior.
- Nunca editar migraciones ya aplicadas en entornos compartidos; en su lugar, añade una nueva migración que corrija o modifique el esquema.

---

## Prerrequisitos locales

- Node.js + npm (para `supabase` CLI si usas la variante npm), o instala la CLI oficial.
- `supabase` CLI instalada: `npm install -g supabase` o descargar binario.
- PostgreSQL client (`psql`, `pg_dump`, `pg_restore`) para operaciones avanzadas.
- Variables de entorno: copia `.env.example` a `.env` y rellena según sea necesario (localmente puedes usar claves de desarrollo).

---

## Flujo de trabajo local (desarrollo)

1. Levantar Supabase localmente (dev):

```bash
npx supabase start
```

2. Aplicar migraciones versionadas (config.toml apunta a `./db/migrations/*.sql`):

```bash
npx supabase db push
```

3. (Opcional) Resetear y aplicar seeds en local:

```bash
npx supabase db reset
npx supabase db seed --file db/seeds/001_seed.sql
```

4. Ejecutar tests unitarios e integración que dependan del esquema.

Notas:
- `supabase db push` aplica las migraciones declaradas en `supabase/config.toml` (`db.migrations.schema_paths`).
- Si necesitas forzar una restauración desde un dump de producción, usa `pg_restore` o `psql` (ver sección Pull/Replicar).

---

## Flujo para aplicar migraciones a Supabase en la nube (CI/CD)

1. NO almacenar keys en el repo; usa secrets del proveedor (GitHub Actions, GitLab CI, etc.).
2. En CI instale la CLI y autentica con token de servicio:

```bash
# ejemplo en GitHub Actions usa secretos
npm install -g supabase
supabase login --access-token $SUPABASE_ACCESS_TOKEN
supabase link --project-ref $SUPABASE_PROJECT_REF
supabase db push --project-ref $SUPABASE_PROJECT_REF
```

3. Ejemplo básico de workflow (GitHub Actions):

```yaml
name: Deploy DB migrations
on:
  push:
    paths:
      - 'db/migrations/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Supabase CLI
        run: npm install -g supabase
      - name: Login
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        run: supabase login --access-token $SUPABASE_ACCESS_TOKEN
      - name: Link project
        env:
          SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}
        run: supabase link --project-ref $SUPABASE_PROJECT_REF
      - name: Push migrations
        run: supabase db push --project-ref $SUPABASE_PROJECT_REF
```

4. Revisión: las migraciones deben revisarse en PR antes de mergear a main/branch de despliegue.

---

## Pull / Replicar producción (schema y/o datos)

IMPORTANTE: extraer datos de producción requiere permisos, cuidado con la privacidad y cumplir con políticas de datos (GDPR/leyes locales).

- Para obtener solo el esquema (sin datos):

```bash
# usar pg_dump desde la DB de producción (DATABASE_URL en secrets)
pg_dump "$DATABASE_URL" --schema-only -f prod_schema.sql
```

- Para obtener un dump completo (datos y esquema) en formato comprimido:

```bash
pg_dump -Fc "$DATABASE_URL" -f prod_dump.dump
# restaurar localmente contra la DB local del supabase dev
pg_restore -d $LOCAL_DATABASE_URL -c prod_dump.dump
```

- Alternativa con supabase CLI (cuando la CLI soporte dumps/restore para el servicio enlazado):

```bash
# linkear el proyecto remoto (requiere token con permisos)
supabase link --project-ref $SUPABASE_PROJECT_REF
# (si disponible) usar comando de dump/restore de la CLI
# supabase db dump --project-ref $SUPABASE_PROJECT_REF --file prod_dump.dump
```

Precauciones:
- Nunca restaures datos de producción en entornos compartidos sin anonimizar o sin avisar al equipo.
- Mantén backups fuera del entorno de ejecución (S3, artefactos de CI) y restringe accesos.

---

## Backups y PITR (producción)

- En producción, usar snapshots gestionados del proveedor (Supabase hosted o RDS/GCP/Cloud SQL) y/o configurar WAL shipping a S3 para PITR.
- Procedimiento recomendado antes de migraciones críticas: crear snapshot / backup y validar su integridad.

---

## RLS y políticas

- Agrega políticas RLS en migraciones separadas y prueba localmente antes de habilitar RLS en producción.
- Flujo sugerido:
  1. Crear políticas en `db/migrations/00X_policies.sql` pero NO habilitar RLS.
  2. Probar endpoints/local infra con políticas aplicadas en un entorno de staging.
  3. Habilitar RLS en una migración explícita (ej. `00Y_enable_rls.sql`) con fecha y autor.

Ejemplo mínimo de habilitar RLS y crear una policy:

```sql
-- 010_enable_rls_and_policies.sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_self" ON profiles
  USING (auth.uid() = id);

-- después probar que las queries que no tengan auth.fallback fallen
```

---

## Checklist de seguridad antes de aplicar a producción

- [ ] Revisar migraciones por efectos destructivos (DROP TABLE, ALTER COLUMN que pierda datos).
- [ ] Asegurar backup/snapshot reciente y rutas de recuperación probadas.
- [ ] Confirmar seeds y fixtures no contienen datos sensibles.
- [ ] Revisar RLS/policies en staging y testear permisos.

---

## Buenas prácticas operativas

- Versiona siempre las migraciones y comprueba que `db/migrations` es fuente canónica para el esquema.
- Mantén la rama `main` estable; usa `staging` para pre-aplicación.
- Documenta cualquier restauración o dump realizado en el runbook de operaciones.

---

## Referencias rápidas

- Supabase CLI: https://supabase.com/docs/guides/cli
- pg_dump / pg_restore: https://www.postgresql.org/docs/current/app-pgdump.html

---

Si quieres, puedo:
- Añadir un ejemplo `db/seeds/001_seed.sql` con datos mínimos, o
- Crear un `workflow` de GitHub Actions como borrador para tu repo.

Indica qué prefieres que haga a continuación.
