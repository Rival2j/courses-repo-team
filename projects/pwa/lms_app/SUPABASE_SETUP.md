# Configuración de Supabase para PWA LMS

## Descripción

El `courseService.ts` ahora consume datos desde Supabase en lugar de usar mocks locales de `data.ts`. Las variables de entorno se leen desde `.env.local` con el prefijo `VITE_` (obligatorio para Vite).

## Instalación de Dependencias

Primero instala `@supabase/supabase-js`:

```bash
cd projects/pwa/lms_app
pnpm install
```

## Configuración de Variables de Entorno

Copia las credenciales de Supabase a `.env.local`:

```bash
# Copia el ejemplo (opcional)
cp .env.local .env.local.backup

# Edita .env.local con tus credenciales:
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

Para obtener estas credenciales:
1. Abre la consola de Supabase (https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public key** → `VITE_SUPABASE_ANON_KEY`

## Estructura de Base de Datos

El servicio espera las siguientes tablas en Supabase (schema `cursos`):

- **courses**: `id`, `title`, `summary`, `instructor`, `difficulty`, `prerequisite_course_ids`
- **modules**: `id`, `course_id`, `title`, `description`
- **lessons**: `id`, `module_id`, `title`, `description`, `blocked_by`
- **resources**: `id`, `lesson_id`, `title`, `type`, `source`, `description`

## Funcionamiento

### Con Supabase Configurado

1. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

2. El `courseService.ts` consultará automáticamente Supabase:
   - Obtiene cursos de la tabla `courses`
   - Para cada curso, carga módulos, lecciones y recursos
   - Reconstituye la jerarquía completa en memoria

3. Los datos se cachean en React Query (5 minutos por defecto)

### Con Supabase NO Disponible

Si Supabase no está disponible o hay errores:

1. El servicio captura excepciones e imprime logs en consola
2. Retorna automáticamente **mocks de fallback** para no romper la UX
3. Permite desarrollo offline y testing sin depender de Supabase

## Logs y Debugging

Abre la consola del navegador (F12) para ver:

```javascript
// Ejemplo de salida cuando Supabase está disponible:
// "Fetching courses from Supabase..."

// Ejemplo si hay error:
// console.error("Error fetching courses from Supabase:", error)
// console.warn("Using fallback mock data")
```

## Próximos Pasos

1. **Crear migraciones en Supabase** para las tablas si aún no existen
2. **Sincronizar datos**: Importa datos desde `data.ts` a Supabase
3. **Activar Row-Level Security (RLS)**: Protege datos según permisos
4. **Integrar autenticación**: Usa `supabase.auth` para sesiones de usuario

## Notas de Seguridad

⚠️ **Nunca expongas claves secretas (`SUPABASE_SERVICE_ROLE_KEY`) en el cliente**.

- Usa solo la **Anon public key** (`VITE_SUPABASE_ANON_KEY`)
- Las operaciones sensibles (admin, cierre de cursos, etc.) deben ejecutarse en el backend
- Supabase RLS protege los datos según políticas que definas
