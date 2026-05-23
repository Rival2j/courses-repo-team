# Supabase local environment setup (TEAM-03 T021)

Resumen de acciones realizadas para cumplir T021 (Configurar entorno Supabase):

- Se añadió configuración de buckets privados en `supabase/config.toml` (`private`, `backups`).
- Se creó `.env.example` con variables de entorno mínimas para desarrollo y CI.
- Recomendaciones de backup/PITR y lineamientos de seguridad base.

Instrucciones rápidas:

1. Copia `.env.example` a `.env` y rellena las variables sensibles.

```powershell
npx supabase start
```

2. Revise y ajuste los buckets en `supabase/config.toml` según necesidades de producción.

3. Backups y PITR (recomendado):

- Haga snapshots regulares y guárdelos fuera del host (S3 o storage seguro).
- Use `pg_dump` para exports programados y mantenga un retention de 30 días como mínimo.
- Para WAL archiving/PITR en producción, habilite `pg_wal` shipping a S3 y pruebe la restauración periódicamente.

4. Seguridad y storage:

- `storage.buckets.private` está configurado `public = false` para evitar acceso público a objetos.
- Use Signed URLs o Edge Functions con claims para servir objetos privados.

5. Operación local y CI:

- En CI, utilice `SUPABASE_SERVICE_ROLE_KEY` desde el secreto de CI y no lo exponga en logs.

Evidencia de implementación:

- `supabase/config.toml` actualizado con buckets privados.
- `.env.example` agregado al repositorio.
- `specs/001-team-03-backend/tasks.md` marcado T021 como completada.
