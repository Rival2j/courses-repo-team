import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(join(__dir, '../.env'), 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const SUPABASE_URL = env.SUPABASE_URL;
const ANON_KEY    = env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const API         = 'http://127.0.0.1:3000';

const RESULT_PATH = join(__dir, '../../../../tempo/resultado.md');
const log = [];

// ── Helpers ──────────────────────────────────────────────────────────────────

function section(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('═'.repeat(60));
  log.push(`\n## ${title}\n`);
}

async function call(label, method, url, { headers = {}, body } = {}) {
  const opts = { method, headers: { 'Content-Type': 'application/json', ...headers } };
  if (body) opts.body = JSON.stringify(body);

  const r = await fetch(url, opts);
  const data = await r.json().catch(() => null);

  const safeUrl = url.replace(SUPABASE_URL, '<SUPABASE_URL>');
  const bodyStr = body ? `\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\`` : '_sin body_';
  const respStr = `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;

  const entry = [
    `### ${label}`,
    `**${method}** \`${safeUrl}\``,
    '',
    '**Request body:**',
    bodyStr,
    '',
    `**Response \`${r.status}\`:**`,
    respStr,
    '',
  ].join('\n');

  log.push(entry);
  console.log(`[${r.status}] ${label}`);

  return { status: r.status, data };
}

async function supabaseAdminCreate(email, password) {
  return call(
    `Signup (admin-api): ${email}`,
    'POST',
    `${SUPABASE_URL}/auth/v1/admin/users`,
    {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
      body: { email, password, email_confirm: true },
    }
  );
}

async function login(email, password) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const d = await r.json();
  if (!d.access_token) throw new Error(`Login failed for ${email}: ${JSON.stringify(d)}`);
  return { token: d.access_token, userId: d.user?.id };
}

async function apiCall(label, method, path, token, body) {
  return call(label, method, `${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
}

// ── Paso 1: Crear 3 usuarios test ─────────────────────────────────────────────
section('PASO 1 — Tres usuarios se dan de alta (test-1, test-2, test-3)');

const TEST_PASS = 'Test-123!';
const testUsers = [
  { email: 'test-1@gmail.com', password: TEST_PASS },
  { email: 'test-2@gmail.com', password: TEST_PASS },
  { email: 'test-3@gmail.com', password: TEST_PASS },
];

const createdIds = {};
for (const u of testUsers) {
  const r = await supabaseAdminCreate(u.email, u.password);
  const uid = r.data?.id ?? r.data?.user?.id;
  if (uid) createdIds[u.email] = uid;
}

// ── Paso 2: Cada usuario hace login y crea su perfil ──────────────────────────
section('PASO 2 — Cada alumno hace login y bootstrapea su perfil');

const testTokens = {};
for (const u of testUsers) {
  const { token, userId } = await login(u.email, u.password);
  testTokens[u.email] = token;
  if (!createdIds[u.email]) createdIds[u.email] = userId;

  await apiCall(
    `Bootstrap perfil: ${u.email}`,
    'POST', '/users/bootstrap',
    token,
    { display_name: u.email.split('@')[0] }
  );
}

// ── Paso 3: Admin crea instructor y moderador (admin-api + provision) ─────────
section('PASO 3 — Admin crea nuevos instructor y moderador');

const NEW_PASS = 'NewRole-123!';
const instrEmail = 'suinstructor-1@gmail.com';
const modEmail   = 'sumoderador-1@gmail.com';

const riInstr = await supabaseAdminCreate(instrEmail, NEW_PASS);
const riMod   = await supabaseAdminCreate(modEmail, NEW_PASS);

const instrUid = riInstr.data?.id ?? riInstr.data?.user?.id;
const modUid   = riMod.data?.id   ?? riMod.data?.user?.id;

// Bootstrap sus perfiles (login como ellos mismos primero)
const { token: instrToken } = await login(instrEmail, NEW_PASS);
const { token: modToken }   = await login(modEmail,   NEW_PASS);

await apiCall('Bootstrap perfil: suinstructor-1', 'POST', '/users/bootstrap', instrToken, { display_name: 'Instructor Nuevo' });
await apiCall('Bootstrap perfil: sumoderador-1',  'POST', '/users/bootstrap', modToken,   { display_name: 'Moderador Nuevo'  });

// Admin provisiona los roles
const { token: adminToken, userId: adminId } = await login('admin@example.com', 'Admin-123!');

await apiCall('Admin provisiona instructor', 'POST', `/users/${instrUid}/provision`, adminToken, {
  display_name: 'Instructor Nuevo',
  email: instrEmail,
  role: 'instructor',
});

await apiCall('Admin provisiona moderador', 'POST', `/users/${modUid}/provision`, adminToken, {
  display_name: 'Moderador Nuevo',
  email: modEmail,
  role: 'moderador',
});

// ── Paso 4: Los 3 alumnos obtienen sus cursos ─────────────────────────────────
section('PASO 4 — Los 3 alumnos obtienen su catálogo de cursos');

for (const u of testUsers) {
  await apiCall(`GET /courses para ${u.email}`, 'GET', '/courses', testTokens[u.email]);
}

// ── Paso 5: Admin cambia rol alumno→moderador y alumno→instructor ─────────────
section('PASO 5 — Admin promueve test-1 a moderador y test-2 a instructor');

const uid1 = createdIds['test-1@gmail.com'];
const uid2 = createdIds['test-2@gmail.com'];

await apiCall('Admin: test-1 → moderador', 'POST', `/users/${uid1}/provision`, adminToken, {
  display_name: 'Test 1 Promovido',
  email: 'test-1@gmail.com',
  role: 'moderador',
});

await apiCall('Admin: test-2 → instructor', 'POST', `/users/${uid2}/provision`, adminToken, {
  display_name: 'Test 2 Promovido',
  email: 'test-2@gmail.com',
  role: 'instructor',
});

// ── Paso 6: Admin cambia el email/nombre de los promovidos ────────────────────
section('PASO 6 — Admin actualiza email/nombre de los usuarios con rol cambiado');

await apiCall('Admin: renombra test-1 (mod)', 'PATCH', `/users/${uid1}`, adminToken, {
  display_name: 'cambiado-rol@gmail.com',
  email: 'cambiado-rol-1@gmail.com',
});

await apiCall('Admin: renombra test-2 (instr)', 'PATCH', `/users/${uid2}`, adminToken, {
  display_name: 'cambiado-rol@gmail.com',
  email: 'cambiado-rol-2@gmail.com',
});

// ── Paso 7: Verificar estado final ───────────────────────────────────────────
section('PASO 7 — Verificación final de perfiles promovidos');

await apiCall('GET /users/me (test-1 ahora moderador)', 'GET', '/users/me', testTokens['test-1@gmail.com']);
await apiCall('GET /users/me (test-2 ahora instructor)', 'GET', '/users/me', testTokens['test-2@gmail.com']);

// ── Paso 8: Admin lista todos los usuarios ────────────────────────────────────
section('PASO 8 — Admin lista todos los usuarios');

await apiCall('Admin: GET /users (todos)', 'GET', '/users', adminToken);
await apiCall('Admin: GET /users?role=instructor', 'GET', '/users?role=instructor', adminToken);
await apiCall('Admin: GET /users?role=moderador',  'GET', '/users?role=moderador',  adminToken);

// ── Escribir resultado.md ─────────────────────────────────────────────────────
const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
const header = `# Resultado de simulación de flujos LMS\n\n**Fecha:** ${now} UTC\n\n**API:** \`${API}\`\n\n---\n`;
const content = header + log.join('\n');

mkdirSync(join(__dir, '../../../../tempo'), { recursive: true });
writeFileSync(RESULT_PATH, content, 'utf8');

console.log(`\n✅ resultado.md escrito en: tempo/resultado.md\n`);
