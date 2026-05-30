# Pruebas manuales con curl — Endpoints de usuarios

Este archivo contiene comandos `curl` para probar los endpoints implementados en el servicio `lms_api` relacionados con las tareas T027-T030.

Requisitos (.env):

- `SUPABASE_CONNECTION_STRING` — cadena de conexión a la base de datos Postgres (solo para pruebas de integración automatizadas).
- `JWT_SECRET` — secreto HS256 utilizado para firmar tokens de prueba.
- `SUPABASE_SERVICE_ROLE_KEY` — (opcional) clave de servicio Supabase si necesitas acciones administrativas.

Generar un JWT de prueba (dos opciones):

1) Node.js (requiere tener `node` instalado):

```bash
# Ejecuta en el directorio del proyecto
node -e "const { SignJWT } = require('jose'); (async ()=>{ const s=process.env.JWT_SECRET||'test-secret'; const token = await new SignJWT({ role: 'alumno', sub: '00000000-0000-0000-0000-000000000000', email: 'test@example.com' }) .setProtectedHeader({ alg: 'HS256' }) .setIssuedAt() .setExpirationTime('1h') .sign(Buffer.from(s)); console.log(token); })()"
```

2) Python (requiere `PyJWT`):

```bash
python -c "import jwt, os; print(jwt.encode({'role':'alumno','sub':'00000000-0000-0000-0000-000000000000','email':'test@example.com'}, os.environ.get('JWT_SECRET','test-secret'), algorithm='HS256'))"
```

Notas: En los ejemplos el `sub` debe ser el UUID del usuario (o un valor de prueba). Reemplaza `test-secret` por el valor real en `JWT_SECRET`.

Variables útiles:

- `API_URL`: URL base del API (por ejemplo `http://localhost:3000`).
- `ADMIN_JWT`: token JWT de un usuario con rol `admin` real en `cursos.profiles`.
- El endpoint `POST /users/:userId/provision` valida el actor dentro de la base de datos, así que el token admin debe corresponder a un perfil existente con rol `admin`.
- `USER_JWT`: token JWT de un usuario normal (rol `alumno`).

Ejemplos de `curl` (happy paths):

1) Bootstrap / autopregistro (POST /users/bootstrap)

```bash
API_URL="http://localhost:3000"
USER_JWT="<pon-aqui-tu-jwt-de-alumno>"

curl -sS -X POST "$API_URL/users/bootstrap" \
  -H "Authorization: Bearer $USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{"display_name":"Juan Pérez"}'

# Respuesta esperada: 200 OK con `UserProfileEnvelope` que incluye `auth` y `profile`.
```

2) Obtener perfil propio (GET /users/me)

```bash
curl -sS "$API_URL/users/me" -H "Authorization: Bearer $USER_JWT"

# Respuesta esperada: 200 OK con el objeto `UserProfileEnvelope`.
```

3) Listar correos por rol y exportar CSV (admin) (GET /users/emails?role=alumno&format=csv)

```bash
ADMIN_JWT="<pon-aqui-tu-jwt-admin>"

curl -sS "$API_URL/users/emails?role=alumno&format=csv" \
  -H "Authorization: Bearer $ADMIN_JWT"

# Respuesta esperada: 200 OK con texto CSV: cabecera y lista de emails.
```

4) Listar perfiles (admin) (GET /users)

```bash
curl -sS "$API_URL/users" -H "Authorization: Bearer $ADMIN_JWT"

# Respuesta esperada: 200 OK con array de perfiles (JSON).
```

5) Provisionar rol a un usuario (admin) (POST /users/:userId/provision)

```bash
TARGET_USER_ID="11111111-1111-1111-1111-111111111111"

curl -sS -X POST "$API_URL/users/$TARGET_USER_ID/provision" \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"role":"moderador","email":"juan.perez@example.com","display_name":"Juan Pérez"}'

# Respuesta esperada: 200 OK con el perfil actualizado y/o un evento auditable en `domain_events`.
```

6) Obtener detalle y actualizar perfil (admin) (GET /users/:userId, PATCH /users/:userId)

```bash
curl -sS "$API_URL/users/$TARGET_USER_ID" -H "Authorization: Bearer $ADMIN_JWT"

curl -sS -X PATCH "$API_URL/users/$TARGET_USER_ID" \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"display_name":"Juan P. Renovado"}'

# Respuesta esperada: 200 OK con perfil actualizado.
```

Problemas comunes y soluciones:

- Si las pruebas devuelven `ETIMEDOUT` al intentar conectarse a la base de datos, asegura que `SUPABASE_CONNECTION_STRING` apunte a una instancia Postgres accesible desde tu máquina y que el firewall permita el acceso.
- Si no tienes un `ADMIN_JWT`, usa la cuenta de servicio (`SUPABASE_SERVICE_ROLE_KEY`) para crear usuarios/entradas en la DB con la CLI de Supabase o mediante la función RPC `cursos.set_user_role` documentada en las migraciones.

Sugerencia: para ejecutar las pruebas automáticas que añadimos en `test/integration.test.ts` necesitas una base de datos accesible y las variables `SUPABASE_CONNECTION_STRING` y `JWT_SECRET` exportadas en tu entorno.

```bash
export SUPABASE_CONNECTION_STRING="postgresql://user:pass@host:5432/dbname"
export JWT_SECRET="tu_jwt_secret"
npm test
```

Si quieres, puedo generar también pequeños scripts para crear tokens de prueba o sembrar usuarios en la base de datos si me das acceso a las credenciales necesarias.

---
Archivo generado por el asistente para pruebas manuales.
