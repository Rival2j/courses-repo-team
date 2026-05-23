# RLS (Row Level Security) — políticas iniciales y procedimiento (TEAM-03)

Este documento explica las políticas iniciales creadas por la tarea T023 y las recomendaciones de despliegue seguro.

## Migraciones añadidas

- `db/migrations/002_profiles_rls.sql` — habilita RLS en `profiles` y crea políticas para acceso propio y acceso de `admin`.
- `db/migrations/003_set_user_role.sql` — RPC `set_user_role(uuid, text)` que permite a administradores cambiar roles de usuarios de forma controlada.

## Consideraciones de seguridad

- `set_user_role` se define como `SECURITY DEFINER`. Requiere revisar el owner del objeto y sus privilegios.
- Antes de habilitar RLS en tablas adicionales, probar políticas en staging y realizar backups.
- `WITH CHECK` en `profiles_update_self` evita que usuarios cambien su `role` directamente por update; cambios deben pasar por el RPC.

## Despliegue recomendado

1. Aplicar migraciones en staging primero:

```bash
npx supabase db push --project-ref $STAGING_REF
```

2. Validar escenarios: creación de usuarios, login, actualización de perfil por el propio usuario, intento de escalado de rol (debe fallar), y ejecución del RPC por un admin.

3. Crear snapshot/backup en producción antes de aplicar migraciones.

4. Para habilitar RLS en más tablas, añadir migraciones separadas y realizar el mismo proceso de staging->review->prod.

## Auditoría y logging

- Recomendado: añadir trigger que inserte en `audit.logs` las ejecuciones de `set_user_role` para trazabilidad.
