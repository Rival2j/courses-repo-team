import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, '../.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const SUPABASE_URL = env.SUPABASE_URL;
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY;
const API_URL = 'http://127.0.0.1:3000';

const users = [
  { label: 'ALUMNO     ', email: 'adminprueba@gmail.com',    password: 'admin123' },
  { label: 'INSTRUCTOR ', email: 'instructornuevo@gmail.com', password: 'Instructor-123!' },
  { label: 'MODERADOR  ', email: 'moderadornueo@gmail.com',   password: 'Moderator-123!' },
  { label: 'ADMIN      ', email: 'admin@example.com',         password: 'Admin-123!' },
  { label: 'SUPER_ADMIN', email: 'superadmin@example.com',    password: 'SuperAdmin-123!' },
];

const tokens = {};

console.log('\n=== 1. LOGIN DE TODOS LOS ROLES ===\n');
for (const u of users) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: u.email, password: u.password }),
  });
  const data = await res.json();
  if (data.access_token) {
    tokens[u.label.trim()] = data.access_token;
    console.log(`✅ ${u.label} LOGIN OK  | user_id: ${data.user?.id}`);
  } else {
    console.log(`❌ ${u.label} ERROR     | ${data.msg || data.error_code || JSON.stringify(data)}`);
  }
}

console.log('\n=== 2. GET /users/me POR ROL ===\n');
for (const [role, token] of Object.entries(tokens)) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  console.log(`${role.padEnd(12)} [${res.status}] ${res.status === 200 ? `role=${data.role} id=${data.id}` : JSON.stringify(data)}`);
}

console.log('\n=== 3. CONTROL DE ACCESO — alumno NO puede listar usuarios ===\n');
const alumnoToken = tokens['ALUMNO'];
if (alumnoToken) {
  const r1 = await fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${alumnoToken}` } });
  console.log(`GET /users con alumno     → [${r1.status}] ${r1.status === 403 ? '✅ 403 FORBIDDEN' : '❌ esperado 403'}`);

  const r2 = await fetch(`${API_URL}/users/me`);
  console.log(`GET /users/me sin token   → [${r2.status}] ${r2.status === 401 ? '✅ 401 UNAUTHORIZED' : '❌ esperado 401'}`);
}

console.log('\n=== 4. ADMIN — provision instructor y moderador ===\n');
const adminToken = tokens['ADMIN'];
if (adminToken) {
  const instrId = '9ff81d09-a57d-45be-b08e-093aa8b55c88';
  const modId   = '9ed19ac6-3a56-473a-b678-ff31c74c134f';

  const r1 = await fetch(`${API_URL}/users/${instrId}/provision`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ display_name: 'Instructor REST', email: 'instructornuevo@gmail.com', role: 'instructor' }),
  });
  const d1 = await r1.json();
  console.log(`PROVISION instructor [${r1.status}] ${r1.status < 300 ? '✅ OK' : '❌ ' + JSON.stringify(d1)}`);

  const r2 = await fetch(`${API_URL}/users/${modId}/provision`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ display_name: 'Moderador REST', email: 'moderadornueo@gmail.com', role: 'moderador' }),
  });
  const d2 = await r2.json();
  console.log(`PROVISION moderador  [${r2.status}] ${r2.status < 300 ? '✅ OK' : '❌ ' + JSON.stringify(d2)}`);
}

console.log('\n=== 5. CATÁLOGO — todos los roles pueden listar cursos ===\n');
for (const [role, token] of Object.entries(tokens)) {
  const res = await fetch(`${API_URL}/courses`, { headers: { 'Authorization': `Bearer ${token}` } });
  console.log(`${role.padEnd(12)} GET /courses [${res.status}] ${res.status === 200 ? '✅' : '❌'}`);
}

console.log('\n=== 6. ALUMNO NO puede provisionar usuarios ===\n');
if (alumnoToken) {
  const res = await fetch(`${API_URL}/users/fc2a6d5e-ddea-4549-8556-250d400731b8/provision`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${alumnoToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ display_name: 'No permitido', email: 'x@x.com', role: 'instructor' }),
  });
  console.log(`Alumno provision     [${res.status}] ${res.status === 403 ? '✅ 403 FORBIDDEN' : '❌ esperado 403'}`);
}

console.log('\nDone.\n');
