import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(join(__dir, '../.env'), 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const SUPABASE_URL = env.SUPABASE_URL;
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY;
const API = 'http://127.0.0.1:3000';

const USERS = {
  alumno:     { email: 'adminprueba@gmail.com',       password: 'admin123',        id: 'b156590b-a53c-4ff2-91bc-dd870300f85c' },
  instructor: { email: 'instructornuevo@gmail.com',   password: 'Instructor-123!', id: '9ff81d09-a57d-45be-b08e-093aa8b55c88' },
  moderador:  { email: 'moderadornueo@gmail.com',     password: 'Moderator-123!',  id: '9ed19ac6-3a56-473a-b678-ff31c74c134f' },
  admin:      { email: 'admin@example.com',           password: 'Admin-123!',      id: '11111111-1111-1111-1111-111114111111' },
  superadmin: { email: 'superadmin@example.com',      password: 'SuperAdmin-123!', id: '22222222-2222-2222-2222-222225222222' },
};

let pass = 0, fail = 0;
function ok(label)  { console.log(`  ✅ ${label}`); pass++; }
function err(label) { console.log(`  ❌ ${label}`); fail++; }
function check(cond, label) { cond ? ok(label) : err(label); }

async function login(u) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: u.email, password: u.password }),
  });
  const d = await res.json();
  if (!d.access_token) throw new Error(`Login failed for ${u.email}: ${JSON.stringify(d)}`);
  return d.access_token;
}

async function api(method, path, token, body) {
  const opts = {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${API}${path}`, opts);
  const data = await r.json().catch(() => null);
  return { status: r.status, data };
}

// ── Login all roles ──────────────────────────────────────────────────────────
console.log('\n=== LOGIN TODOS LOS ROLES ===\n');
const T = {};
for (const [role, u] of Object.entries(USERS)) {
  try {
    T[role] = await login(u);
    ok(`${role} login OK`);
  } catch (e) {
    err(`${role} login FAILED — ${e.message}`);
  }
}

// ── Sección 1: Admin lista usuarios ─────────────────────────────────────────
console.log('\n=== 1. ADMIN — LISTAR USUARIOS ===\n');

{
  const r = await api('GET', '/users', T.admin);
  check(r.status === 200, `GET /users [${r.status}] retorna lista`);
  if (r.status === 200) {
    const list = Array.isArray(r.data) ? r.data : (r.data?.data ?? []);
    ok(`  → ${list.length} usuarios encontrados`);
  }
}

{
  const r = await api('GET', '/users?role=instructor', T.admin);
  check(r.status === 200, `GET /users?role=instructor [${r.status}]`);
  if (r.status === 200) {
    const list = Array.isArray(r.data) ? r.data : (r.data?.data ?? []);
    ok(`  → ${list.length} instructores`);
  }
}

{
  const r = await api('GET', '/users?role=alumno', T.admin);
  check(r.status === 200, `GET /users?role=alumno [${r.status}]`);
}

// ── Sección 2: Admin exporta emails ─────────────────────────────────────────
console.log('\n=== 2. ADMIN — EXPORTAR EMAILS ===\n');

{
  const r = await api('GET', '/users/emails', T.admin);
  check(r.status === 200, `GET /users/emails [${r.status}]`);
}

{
  const res = await fetch(`${API}/users/emails?format=csv`, {
    headers: { Authorization: `Bearer ${T.admin}` },
  });
  const text = await res.text();
  check(res.status === 200, `GET /users/emails?format=csv [${res.status}]`);
  if (res.status === 200) {
    const isCSV = text.includes('@') || text.includes('email') || text.includes(',');
    check(isCSV, `  → respuesta contiene datos CSV`);
  }
}

// ── Sección 3: Admin provisiona instructor ───────────────────────────────────
console.log('\n=== 3. ADMIN — PROVISIONAR INSTRUCTOR ===\n');

{
  const instrId = USERS.instructor.id;
  const r = await api('POST', `/users/${instrId}/provision`, T.admin, {
    display_name: 'Instructor REST Test',
    email: USERS.instructor.email,
    role: 'instructor',
  });
  check(r.status < 300, `POST /users/${instrId}/provision role=instructor [${r.status}]`);
  if (r.status >= 300) console.log('    Body:', JSON.stringify(r.data));

  // Verificar que el rol quedó asignado
  const me = await api('GET', '/users/me', T.instructor);
  const role = me.data?.data?.profile?.role ?? me.data?.role;
  check(role === 'instructor', `  → GET /users/me confirma role=instructor (got: ${role})`);
}

// ── Sección 4: Admin provisiona moderador ────────────────────────────────────
console.log('\n=== 4. ADMIN — PROVISIONAR MODERADOR ===\n');

{
  const modId = USERS.moderador.id;
  const r = await api('POST', `/users/${modId}/provision`, T.admin, {
    display_name: 'Moderador REST Test',
    email: USERS.moderador.email,
    role: 'moderador',
  });
  check(r.status < 300, `POST /users/${modId}/provision role=moderador [${r.status}]`);
  if (r.status >= 300) console.log('    Body:', JSON.stringify(r.data));

  const me = await api('GET', '/users/me', T.moderador);
  const role = me.data?.data?.profile?.role ?? me.data?.role;
  check(role === 'moderador', `  → GET /users/me confirma role=moderador (got: ${role})`);
}

// ── Sección 5: Admin cambia rol de usuario (alumno → instructor) ─────────────
console.log('\n=== 5. ADMIN — CAMBIO DE ROL (alumno → instructor) ===\n');

{
  const alumnoId = USERS.alumno.id;
  const r = await api('POST', `/users/${alumnoId}/provision`, T.admin, {
    display_name: 'Alumno Promovido',
    email: USERS.alumno.email,
    role: 'instructor',
  });
  check(r.status < 300, `POST /users/${alumnoId}/provision role=instructor [${r.status}] (cambio de rol)`);
  if (r.status >= 300) console.log('    Body:', JSON.stringify(r.data));

  // provision solo acepta instructor|moderador — intentar rol=alumno debe dar 400 (diseño intencional)
  const revert = await api('POST', `/users/${alumnoId}/provision`, T.admin, {
    display_name: 'Alumno Prueba',
    email: USERS.alumno.email,
    role: 'alumno',
  });
  check(revert.status === 400, `  → provision role=alumno rechazado por schema [${revert.status}] (esperado 400)`);
}

// ── Sección 6: Super_admin provisiona y cambia rol ───────────────────────────
console.log('\n=== 6. SUPER_ADMIN — PROVISIONAR Y CAMBIAR ROL ===\n');

{
  const instrId = USERS.instructor.id;
  const r = await api('POST', `/users/${instrId}/provision`, T.superadmin, {
    display_name: 'Instructor por SuperAdmin',
    email: USERS.instructor.email,
    role: 'instructor',
  });
  check(r.status < 300, `SuperAdmin POST /users/${instrId}/provision [${r.status}]`);
  if (r.status >= 300) console.log('    Body:', JSON.stringify(r.data));
}

{
  const modId = USERS.moderador.id;
  const r = await api('PATCH', `/users/${modId}`, T.superadmin, {
    display_name: 'Moderador Actualizado SA',
  });
  check(r.status < 300 || r.status === 404, `SuperAdmin PATCH /users/${modId} display_name [${r.status}]`);
}

// ── Sección 7: Casos PROHIBIDOS — roles no autorizados ───────────────────────
console.log('\n=== 7. ACCESO PROHIBIDO — ALUMNO/INSTRUCTOR/MODERADOR no pueden provisionar ===\n');

{
  const targetId = USERS.instructor.id;
  const body = { display_name: 'Hack', email: 'x@x.com', role: 'admin' };

  for (const [role, token] of [['alumno', T.alumno], ['instructor', T.instructor], ['moderador', T.moderador]]) {
    const r = await api('POST', `/users/${targetId}/provision`, token, body);
    check(r.status === 403, `${role} POST /provision → [${r.status}] debe ser 403`);
  }
}

// ── Sección 8: Validación de rol inválido ────────────────────────────────────
console.log('\n=== 8. VALIDACIÓN — rol inválido rechazado ===\n');

{
  const instrId = USERS.instructor.id;
  const r = await api('POST', `/users/${instrId}/provision`, T.admin, {
    display_name: 'Test',
    email: USERS.instructor.email,
    role: 'god_mode',
  });
  check(r.status >= 400, `role=god_mode rechazado [${r.status}]`);
}

// ── Sección 9: Admin obtiene detalle de usuario ──────────────────────────────
console.log('\n=== 9. ADMIN — OBTENER DETALLE DE USUARIO ===\n');

{
  const instrId = USERS.instructor.id;
  const r = await api('GET', `/users/${instrId}`, T.admin);
  check(r.status === 200, `GET /users/${instrId} [${r.status}]`);
  if (r.status === 200) {
    const u = r.data?.data ?? r.data;
    ok(`  → email: ${u?.email ?? u?.profile?.email ?? '?'}`);
  }
}

// ── Sección 10: Admin NO puede autopromocionar a super_admin ─────────────────
console.log('\n=== 10. ADMIN NO puede asignarse super_admin ===\n');

{
  const adminId = USERS.admin.id;
  const r = await api('POST', `/users/${adminId}/provision`, T.admin, {
    display_name: 'Admin Hack',
    email: USERS.admin.email,
    role: 'super_admin',
  });
  check(r.status === 403 || r.status === 400, `Admin autopromover a super_admin → [${r.status}] esperado 403/400`);
}

// ── Resumen ───────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`RESULTADO: ${pass} ✅  /  ${fail} ❌  (total: ${pass + fail})`);
console.log('─'.repeat(50) + '\n');
