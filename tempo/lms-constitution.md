---
ucc_source: 001-lms-ucc.md
initiative_id: 001-lms-foundation
project: diana-learning
version: 1.0.0
status: approved
owner: PENDIENTE
approved_by: PENDIENTE
approval_date: PENDIENTE
last_amended: 2026-05-19
amendment_count: 0
---

# 🎓 CONSTITUCIÓN DEL PROYECTO
## Plataforma LMS Escolar — Progressive Web App Asistida por Inteligencia Artificial

---

## 0. Naturaleza del Documento (Autoridad Constitucional)

Este documento constituye la **fuente de verdad primaria y superior** del proyecto LMS escolar.

Define los **principios inmutables**, **límites**, **reglas no negociables**, **gobierno de agentes**, **estándares técnicos mínimos** y **criterios rectores** bajo los cuales deberán alinearse **todas las especificaciones, tickets, agentes, skills, decisiones técnicas y código generado**.

Ninguna SPEC, ticket, agente o implementación podrá **contradecir esta Constitución** sin una **enmienda constitucional explícita y documentada**.

El blueprint técnico detallado (SQL, TypeScript, configuración) vive en `Investigacion.md`. Esta Constitución define el **por qué y los límites**; la investigación define el **cómo**.

---

## 1. Propósito Estratégico

Diseñar, construir y evolucionar una **plataforma educativa web tipo LMS (Learning Management System)** como Progressive Web App, orientada a **instituciones escolares**, que **potencie el aprendizaje humano** mediante:

- Gestión estructurada de cursos, módulos y lecciones
- Integración de contenido externo (video, PDF, slides, notas web) sin costo de hosting
- Evaluaciones con grading seguro del lado servidor
- Gamificación real (XP, badges, trofeos, certificados verificables)
- Tutoría socrática asistida por Inteligencia Artificial (Google Gemini 2.5 Flash)
- Rutas de aprendizaje estructuradas con prerrequisitos y progresión

La plataforma **no busca reemplazar al instructor**, sino **amplificar su impacto, trazabilidad y alcance** dentro de la institución.

---

## 2. Objetivo Constitucional

Desarrollar un **LMS escolar como PWA** que:

- Organice el conocimiento en **cursos → módulos → lecciones** con jerarquía institucional (áreas, departamentos, carreras, especialidades)
- Permita a los instructores **crear, publicar y gestionar** su propio contenido
- Garantice que los alumnos **progresen de forma trazable** y con **prerequisitos respetados**
- Proteja la **integridad de las evaluaciones** (grading siempre en el servidor, respuestas nunca al cliente)
- Emita **certificados y diplomas verificables públicamente**
- Integre un **tutor IA socrático** sin exponer claves de API al cliente
- Sea **instalable, funcione offline** en modo básico y sea responsive
- Opere con **costo cercano a cero** para el volumen inicial de 50–100 usuarios

Este objetivo es **independiente de variaciones de UI**, pero **sujeto a los estándares mínimos definidos en esta Constitución**.

---

## 3. Filosofía Fundamental del Sistema

### 3.1 Modelo Centrado en el Aprendizaje Humano

El sistema adopta por definición constitucional un modelo **centrado en el humano**:

- ✅ El alumno decide su ritmo, pero la progresión respeta los prerequisitos configurados
- ✅ El instructor define el contenido; el sistema lo organiza y rastrea
- ❌ No existe promoción automática sin superar evaluaciones configuradas
- ❌ No existe acceso a contenido sin cumplir los prerequisitos establecidos
- ❌ La IA nunca reemplaza la evaluación humana ni da respuestas directas de exámenes

---

### 3.2 Arquitectura por Features Desacopladas (Vertical Slice)

El sistema se compone de **features independientes**, donde cada feature:

- Representa un **dominio funcional** completo (auth, courses, lessons, evaluations, gamification, ai-chat, moderation…)
- Es **desacoplada funcional y técnicamente** (components, hooks, services, store, api, types propios)
- Puede desarrollarse, probarse y desplegarse de forma **relativamente independiente**

Features constitucionales del sistema:

- `auth` — autenticación y sesión (email/password + Google OAuth)
- `courses` — catálogo, creación y gestión de cursos
- `lessons` — reproductor de lecciones con tracking de progreso
- `evaluations` — builder y runner de evaluaciones con grading seguro
- `gamification` — XP, niveles, badges, trofeos, certificados, leaderboards
- `ai-chat` — tutor socrático con streaming SSE (proxy Edge Function)
- `admin` — panel de administración scoped por unidad organizativa
- `super-admin` — configuración global, branding, planes, gestión de admins
- `moderation` — cola de revisión de contenido para moderadores
- `profile` — perfil del usuario, avatar, estadísticas
- `notifications` — sistema de notificaciones realtime

---

### 3.3 Rol de la Inteligencia Artificial

La IA (Google Gemini 2.5 Flash):

- ✅ Es un **feature adicional de apoyo pedagógico**, no el núcleo del sistema
- ✅ Actúa como **tutor socrático**: guía con preguntas, no da respuestas directas
- ✅ Genera quizzes, resúmenes y recomendaciones de aprendizaje
- ❌ **Nunca responde directamente las respuestas de una evaluación activa**
- ❌ **Nunca se llama desde el cliente** — toda llamada pasa por Edge Function con JWT verificado
- ❌ Su API key **jamás aparece en el bundle del navegador**
- ❌ No reemplaza la lógica determinística (grading, prerequisitos, progreso)

El kill-switch de IA durante intentos de evaluación activos es **no negociable**.

---

## 4. Principio de Progresión Verificada

Un alumno solo puede avanzar cuando:

- Ha **cumplido los prerequisitos del curso** con el score mínimo configurado
- Existe una **inscripción activa** (`enrollment.status = 'active'`)
- La **lección es accesible** según `app.can_access_lesson()` (combina inscripción + prerequisitos)
- En evaluaciones: el **número de intentos no excede `max_attempts`**

No existen atajos. El progreso es **trazable, auditable y reconstruible** en todo momento a partir de los registros en `progress_tracking` y `evaluation_attempts`.

---

## 5. Roles de los Actores del Sistema

El sistema define **cinco roles jerárquicos** con responsabilidades precisas y sin solapamiento ambiguo:

| Rol | Jerarquía | Responsabilidad |
|---|---|---|
| `super_admin` | 5 (máximo) | Configura la plataforma global: branding, planes, permisos, gestión de admins |
| `admin` | 4 | Gestiona toda la plataforma (usuarios, contenido, configuración); puede estar scopeado a una o varias unidades organizativas (área, departamento, carrera, especialidad) |
| `instructor` | 3 | Crea y gestiona sus propios cursos; un curso puede tener múltiples instructores (un `owner` + N `collaborator`) |
| `moderador` | 3 | Revisa contenido, marca flags, apoya al instructor; **sin permisos de edición** sobre cursos |
| `alumno` | 1 (mínimo) | Consume cursos, progresa, participa en evaluaciones y gamificación |

**Reglas constitucionales de roles:**
- Solo `super_admin` puede promover a `admin`.
- El Edge Function `update-user-role` es el **único camino** para cambiar roles; no existe mutación directa por cliente.
- Un usuario **no puede autoasignarse un rol superior** al propio (enforced en RLS + Edge Function).
- La jerarquía numérica (super_admin=5, admin=4, instructor=moderador=3, alumno=1) determina todos los permisos.

---

## 6. Alcance Constitucional de la Versión 1.0

### Incluye

- Gestión completa de cursos, módulos y lecciones con contenido externo embebido
- Cuatro tipos de contenido: `video` (YouTube/Vimeo), `pdf` (Drive/Supabase), `pptx` (Slides/OneDrive), `web_note` (Notion/URL)
- Sistema de 5 roles con jerarquía institucional por unidades organizativas
- Evaluaciones con builder, runner, grading seguro y control de intentos
- Gamificación completa: XP, 30 niveles, 24 badges, 7 trofeos, certificados PDF verificables, diplomas, leaderboards
- Prerequisitos de cursos con detección de ciclos
- Rutas de aprendizaje secuenciales/paralelas
- Tutor IA socrático con streaming SSE, historial de conversación y kill-switch en evaluaciones
- Notificaciones realtime (Supabase Realtime)
- PWA instalable con soporte offline básico (shell + catálogo + lecciones visitadas)
- Panel de moderación con cola de flags
- Verificación pública de certificados (`/certificates/:code`)

### Excluye (diferidos a versiones futuras)

- Auto-inscripción con pago (pasarela de pagos)
- SSO/SAML institucional (diferido a venta institucional)
- Videoconferencia integrada (Zoom/Meet embed es v2)
- Auto-grading de respuestas abiertas por IA (v2)
- Foro/comunidad entre alumnos (v2)
- App móvil nativa (la PWA cubre el caso inicial)
- Multi-tenant (múltiples instituciones en un deployment) (v3)

---

## 7. Política de Versionado y Gobernanza de Cambios Constitucionales

### 7.1 Versionado Semántico de la Constitución

La Constitución se versionará según **Semantic Versioning 2.0** con el patrón `MAJOR.MINOR.PATCH`:

| Cambio | Tipo | Ejemplo | Incremento |
|---|---|---|---|
| Enmienda sustancial a principios fundacionales | MAJOR | Cambiar filosofía sobre roles o seguridad | 1.0.0 → 2.0.0 |
| Adición de nuevas secciones, principios o features constitucionales sin contradecir existentes | MINOR | Agregar nueva fase, nuevo stack técnico aprobado | 1.0.0 → 1.1.0 |
| Correcciones redaccionales, aclaraciones, ejemplos, metadatos | PATCH | Typos, ejemplos nuevos, actualizar fechas | 1.0.0 → 1.0.1 |

**Regla invariante:** Cambios MAJOR requieren votación formal del liderazgo del proyecto. Cambios MINOR requieren aprobación del responsable técnico (owner). Cambios PATCH no requieren aprobación explícita pero sí deben registrarse.

### 7.2 Registro de Cambios (Changelog) Obligatorio

Todo cambio a esta Constitución debe registrarse en una sección **Changelog** al final del documento con formato:

```
### [Versión] — YYYY-MM-DD — [Responsable]

**Cambios:**
- [Descripción breve del cambio: sección afectada, razón, impacto]

**Autorizado por:** [Nombre del aprobador / votación]
```

Este registro es **irrevocable y auditable**. No se pueden borrar cambios previos.

### 7.3 Protocolo Formal de Enmienda

Toda enmienda constitucional debe seguir este protocolo **obligatorio**:

1. **Proposición** (cualquier miembro del equipo):
   - Crear issue con etiqueta `constitutional-amendment`
   - Describir: sección afectada, cambio propuesto, justificación, impacto (MAJOR/MINOR/PATCH)

2. **Revisión** (responsable técnico / owner):
   - Verificar que la enmienda no viola principios superiores
   - Solicitar retroalimentación en iteraciones si aplica
   - Registrar comentarios de consistencia

3. **Aprobación**:
   - MAJOR: Votación de 2+ miembros de liderazgo (owner, tech lead, steering committee)
   - MINOR: Aprobación de owner o tech lead
   - PATCH: Cierre de issue por propositor o owner

4. **Implementación**:
   - Actualizar el archivo `project_constitution.md`
   - Incrementar versión según SemVer
   - Registrar en Changelog con fecha y aprobador
   - Commit con mensaje: `docs(constitution): <MAJOR|MINOR|PATCH> v1.x.x — <resumen>`

5. **Trazabilidad**:
   - Issue → Commit → Branch en `diana/constitution-amendments/*`
   - Mantener referencia bidireccional (issue ↔ archivo)

### 7.4 Aprobadores y Quórum

Desde el inicio del proyecto, hasta que se formalice el steering committee:

- **Owner/Product Lead** (PENDIENTE): requiere aprobación explícita para MAJOR/MINOR
- **Tech Lead** (PENDIENTE): requiere consenso para MAJOR
- **Steering Committee** (TBD): foro para enmiendas muy sustanciales

Ante ausencia de aprobadores formales, la enmienda puede proceder con **documentación explícita de decisión tomada y fundamentos** en el issue/commit.

### 7.5 Congelación Constitucional

Una vez que el proyecto entra en **fase de evaluación con usuarios reales** (beta o producción), la Constitución entra en estado **"congelado"**:

- Solo se permiten cambios PATCH en la fase de beta/producción
- Cambios MAJOR/MINOR deben **diferirse a la versión siguiente** del proyecto
- Esta regla garantiza estabilidad contractual con usuarios y stakeholders

---

## 8. Principios de Ingeniería y Calidad

El proyecto se rige por los siguientes principios no negociables:

- **Spec-Driven Development** como metodología base — no se implementa sin especificación previa
- **RLS activo en todas las tablas desde el primer migration** — no existe tabla sin política de acceso
- **Grading siempre en el servidor** — `evaluation_options.is_correct` nunca llega al cliente vía SELECT
- **API keys secretas solo en Edge Functions** — Gemini, Supabase service role y Resend nunca en el bundle
- **Videos y PDFs grandes nunca en Supabase Storage** — embeds externos para costo cero
- Arquitectura modular por features (vertical slice)
- Testing obligatorio: Vitest + RTL para lógica, Playwright para 10 flows críticos E2E
- Lighthouse PWA ≥ 90 performance, 100 PWA en cada PR (medido por GitHub Action)
- Evidencia funcional obligatoria antes de cerrar una fase
- Seguridad estricta de credenciales y Content Security Policy en producción

---

## 9. Metodología de Ejecución

El proyecto se rige por **10 fases de implementación secuenciales** con dependencias duras:

| Fase | Nombre | Duración estimada |
|---|---|---|
| 0 | Setup (repo, CI, Supabase, Vercel, lint, auth shell) | 1–2 sem |
| 1 | Auth & Users (email + Google OAuth, roles, profiles) | 1–2 sem |
| 2 | Course & Content Core (CRUD, 4 viewers, player shell) | 3–4 sem |
| 3 | Enrollment & Prerequisites (progreso, prereqs, paths) | 2–3 sem |
| 4 | Evaluations (builder, runner, grading seguro) | 2 sem |
| 5 | Gamification (XP, badges, trofeos, certificados, ranking) | 2 sem |
| 6 | AI Integration (chat SSE, summarize, quiz gen, kill-switch) | 1–2 sem |
| 7 | Notifications & Realtime | 1 sem |
| 8 | PWA & Offline (Workbox, manifest, install prompt, sync) | 1 sem |
| 9 | Admin Panel (DAU, users, moderation, feature flags) | 1–2 sem |
| 10 | QA & Launch (E2E, Lighthouse, Security Advisor, beta) | 1–2 sem |

**Dependencias duras:** F2 requiere F1; F3 requiere F2; F4 requiere F3; F5 requiere F3+F4; F6 puede paralelizar con F4–F5; F8 paralela desde F2.

**Total estimado:** 17–22 semanas-persona (4.5–5.5 meses con 1 dev; 2.5–3 meses con 2 devs).

Esta metodología **no es opcional**. Saltarse fases o implementar sin spec genera deuda técnica no recuperable.

---

## 10. Stack Tecnológico Constitucional

### 9.1 Frontend — Stack Base Obligatorio

La plataforma web (PWA) deberá construirse **obligatoriamente** sobre el siguiente stack base:

- **Vite** como bundler y entorno de desarrollo
- **React** como framework de UI
- **TypeScript** como lenguaje principal
- **shadcn/ui + Tailwind CSS + Radix UI** para componentes (código propio, a11y incluida)
- **Zustand** para estado cliente (sesión, UI flags, progreso offline)
- **TanStack Query v5** para estado servidor (cursos, perfil, notificaciones)
- **React Hook Form + Zod** para formularios (schemas compartidos cliente ↔ Edge Function)
- **vite-plugin-pwa + Workbox** para service worker y estrategias de caché
- Arquitectura vertical slice (feature-based)

### 9.2 Backend y Base de Datos — Stack Base Obligatorio

La capa de datos y lógica de negocio deberá implementarse **obligatoriamente** sobre:

- **Supabase** (PostgreSQL + RLS + Realtime + Storage + Edge Functions + Auth)
- **PostgreSQL** con schema `public` para datos y schema `app` para helpers `security definer`
- **Supabase Edge Functions** (Deno) para lógica de negocio sensible: grading, generación de certificados, tutor IA, actualización de roles
- **Row Level Security en todas las tablas** — no existe tabla sin RLS

El backend **no expone** service role key, Gemini API key ni Resend API key al cliente en ninguna circunstancia.

### 9.3 Infraestructura — Stack Base Obligatorio

- **Vercel Pro** como plataforma de hosting (Hobby prohíbe uso comercial)
- **pnpm** como package manager
- **GitHub Actions** para CI (lint + typecheck + test + Lighthouse en cada PR)
- **Sentry** (free tier) para error tracking y tracing
- **Resend + React Email** para emails transaccionales
- **Google Gemini 2.5 Flash** (SDK `@google/genai v1+`) para IA — solo en Edge Functions

---

## 11. Estándar Constitucional de Documentación de Código

Todo código generado para el proyecto, ya sea por humanos o por agentes de IA, deberá cumplir **obligatoriamente** con el siguiente estándar:

- Comentarios con el prefijo **`🎓LMS:`**
- Utilizar emojis al inicio de los comentarios:
  - 🎓 para explicación de lógica educativa
  - ⚠️ para advertencia o restricción de seguridad
  - 🔒 para lógica de RLS o permisos
  - 🤖 para integración con IA
  - 🐛 para workaround de bug conocido
  - 💡 para decisión de arquitectura no obvia
- Documentación **en inglés y español (EN / ES)**
- Aplicado obligatoriamente en:
  - Edge Functions
  - Hooks públicos de features
  - Lógica de RLS y helpers `app.*`
  - Motores de progreso y grading
  - Integraciones con Gemini y plataformas externas

### Ejemplo Constitucional

```ts
//🎓LMS: Saves lesson progress with debounce to avoid excessive DB writes (EN)
//🎓LMS: Guarda el progreso de lección con debounce para evitar escrituras excesivas (ES)
//🔒LMS: RLS enforces user can only update their own progress_tracking rows (EN)
//🔒LMS: RLS garantiza que el usuario solo actualiza sus propias filas de progress_tracking (ES)
export function useProgressStore() { ... }
```

La ausencia de este estándar en lógica crítica **bloquea el cierre de tickets**.

---

## 12. Integraciones de Contenido Externo

### 11.1 Plataformas Obligatorias (v1.0)

La plataforma deberá ser funcional con los siguientes proveedores de contenido:

| Proveedor | Tipo | Acceso Instructor |
|---|---|---|
| **YouTube** | Video | [YouTube Studio](https://studio.youtube.com) — visibilidad *No listado* |
| **Vimeo** | Video (sin ads, privacidad real) | [Vimeo Upload](https://vimeo.com/upload) |
| **Google Drive** | PDF embed | [Google Drive](https://drive.google.com) — compartir "Cualquiera con el enlace" |
| **Google Slides** | Presentaciones | [Google Slides](https://slides.google.com) — Publicar en la web |
| **OneDrive / SharePoint** | PPTX nativo | [OneDrive](https://onedrive.live.com) — Insertar > Copiar iframe |
| **Notion** | Notas web | [Notion](https://www.notion.so) — Share > Publish to web (`notion.site`) |

### 11.2 Principio de Integración — Manual y Sin OAuth

**El sistema NO integra OAuth con ninguna plataforma de contenido.** El instructor pega la URL directamente. El sistema detecta el proveedor por regex y construye la URL de embed. Este principio garantiza:

- Cero dependencia de tokens OAuth que expiren
- Cero costo de APIs de terceros
- Cero setup de credenciales de plataformas externas
- Funcionamiento inmediato para cualquier instructor

### 11.3 Arquitectura Estándar de Proveedores

El sistema implementa una abstracción en `content_sources` que permite:

- Agregar nuevos proveedores sin reescribir los visores
- Proveedores encapsulados en `content-url-parser.ts` con regex por tipo
- Fallback configurado: Drive PDF → react-pdf si timeout 6 s
- Tracking de progreso adaptado por tipo: videoTime / currentSlide / page / timeSpent

La lógica de progreso **no puede acoplarse a un proveedor específico**.

---

## 13. Gobierno Constitucional de Agentes de IA

### 12.1 Naturaleza de los Agentes

Los agentes (**Picoro, Goku, Vegeta, Krilin, Bulma**) son **roles documentados**, no entidades autónomas sin control.

Los agentes:
- No toman decisiones fuera de su rol
- No ejecutan trabajo sin trazabilidad
- No sustituyen la aprobación humana del responsable del proyecto

---

### 12.2 Reglas Obligatorias para Todo Agente

Todo agente de IA que participe en el desarrollo:

- ✅ **DEBE declarar explícitamente el skill activo**
- ✅ **DEBE mostrar cabecera de actividad con fase y feature**
- ✅ **DEBE dejar evidencia verificable de salida** (SQL, TypeScript, tests, capturas)
- ✅ **DEBE respetar el estándar de comentarios `🎓LMS:`**
- ❌ **NO puede ejecutar trabajo fuera de su fase asignada**
- ❌ **NO puede generar código sin spec previa aprobada**

La ausencia de cualquiera de estos elementos **bloquea el avance del trabajo**.

---

### 12.3 Orden Operativo Constitucional Obligatorio

El flujo operativo de agentes es **obligatorio e inmutable**:

```
Picoro → (Goku ∥ Krilin) → (Vegeta ∥ Bulma) → Aprobación
```

| Agente | Rol en este proyecto |
|---|---|
| **Picoro** | Análisis, investigación, diseño de features, redacción de specs y migrations SQL |
| **Goku** | Implementación frontend (React, Zustand, hooks, visores de contenido) |
| **Vegeta** | Optimización, seguridad (RLS, CSP, Edge Functions, bundle size) |
| **Krilin** | Base de datos (migrations, RLS policies, RPCs, Supabase Edge Functions) |
| **Bulma** | Validación, testing (Vitest, Playwright, Lighthouse, Security Advisor) |
| **Dr.LMS** | Aprobación y validación humana explícita — cierra tickets y fases |

Violaciones a este flujo **bloquean el avance del trabajo**.

Cualquier violación a:
- El orden de agentes
- Las reglas de visibilidad
- La falta de evidencia o comentarios estándar

resulta en:

- ❌ Bloqueo inmediato del flujo
- ❌ No cierre de tickets
- ❌ No avance de fase

---

### 12.4 Independencia de Frameworks

Los agentes definidos en esta Constitución:

- Son **independientes** de los agentes internos de SpecKit u otros frameworks
- Funcionan como **modelo de gobierno y orquestación**
- Pueden operar sobre SpecKit, OpenSpec u otros frameworks de desarrollo

SpecKit **no reemplaza** este gobierno; **se subordina a él**.

---

## 14. Seguridad — Principios No Negociables

Los siguientes principios de seguridad son **constitucionales e inmutables**:

1. **RLS en todas las tablas desde el primer migration.** No existe tabla sin política. Saltarse esto es la causa #1 de fugas de datos.
2. **`evaluation_options.is_correct` nunca llega al cliente vía SELECT.** Solo el Edge Function `submit-evaluation` con `service_role` compara respuestas.
3. **Gemini API key nunca en el bundle del navegador.** Solo en variables de entorno de Edge Functions (sin prefijo `VITE_`).
4. **Supabase service role key nunca en el cliente.** Misma regla.
5. **La jerarquía de roles se enforza en Edge Function + RLS**, no solo en el frontend.
6. **Content Security Policy en producción** — solo los dominios exactos necesarios.
7. **Signed URLs con TTL corto (1h)** para recursos privados en Supabase Storage.
8. **Rate limit en IA**: 60 chats/día/usuario en Edge Function. Kill-switch durante evaluaciones activas.
9. **Certificados verificables por RPC público** `verify_certificate(code)` — nunca expone el registro completo.
10. **PITR activado en Supabase Pro** + backup nightly `pg_dump` a S3/R2 encriptado.

---

## 15. Escalabilidad del Ecosistema

Los principios de esta Constitución aplican a **todas las aplicaciones del ecosistema educativo**, incluyendo futuras expansiones como:

- LMS empresariales (mismo stack, distintos planes/tenants)
- Plataformas de certificación profesional
- Sistemas con IA Copilot pedagógica integrada
- Aplicaciones PWA + Supabase futuras del framework AI Skill Development

Esto garantiza reutilización de agentes, skills y gobierno; consistencia técnica entre proyectos; y escalabilidad organizacional.

---

## 16. Evolución y Enmiendas

La plataforma está diseñada para evolucionar hacia:

- Multi-tenancy (múltiples instituciones en un deployment)
- Videoconferencia integrada y clases en vivo
- Auto-grading de respuestas abiertas por IA (v2)
- Backtesting de estrategias pedagógicas con datos históricos
- Nuevos proveedores de contenido (Loom, Canva, etc.)
- SSO/SAML para instituciones con Workspace corporativo

Cualquier cambio que:

- Modifique la filosofía de control humano sobre el aprendizaje
- Altere el rol socrático (no oráculo) de la IA
- Habilite auto-promoción de alumnos sin evaluación
- Exponga datos sensibles de menores al exterior

requiere **enmienda constitucional explícita y documentada**.

---

## 17. Declaración Final

Esta Constitución define **qué es y qué no es** la plataforma LMS escolar.

Toda SPEC, ticket, agente, skill o línea de código deberá:

**Respetar, reflejar y reforzar esta Constitución**

El aprendizaje es un proceso humano. La plataforma es su andamio — no su sustituto.

---

**Estado**: ✅ Activa  
**Versión**: 1.0.0  
**Rol**: Fuente de verdad primaria del proyecto LMS  
**Framework**: Spec-Driven Development (SpecKit / OpenSpec)  
**Blueprint técnico de referencia**: `Investigacion.md`  
**UCC Fuente**: `001-lms-ucc.md`  
**Iniciativa**: `001-lms-foundation`

---

## Changelog

### [1.0.0] — 2026-05-19 — Auto-Normalization

**Cambios:**
- ✅ Añadido frontmatter YAML con metadatos canónicos (ucc_source, initiative_id, version, owner, approval_date)
- ✅ Agregada sección 7: "Política de Versionado y Gobernanza de Cambios Constitucionales" con SemVer, protocolo de enmienda formal y registro de cambios obligatorio
- ✅ Renumeradas todas las secciones posteriores (8→9, 9→10, … 16→17)
- ✅ Actualizado footer con versión SemVer y referencias bidireccionales a UCC e iniciativa
- ✅ Trazabilidad completa UCC → Constitución verificada y documentada

**Autorizado por:** Auto-normalization (Diana constitution agent)
