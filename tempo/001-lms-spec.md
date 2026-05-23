# PLATAFORMA LEARNING MANAGMENT SYSTEM (LMS) PWA ASISTIDA POR IA

Framework: Spec-Driven Development (GitHub Copilot Spec-Kit)
Estado: Activa
Autoridad: Subordinada estrictamente a `project\_constitution.md`

* **Control de Cambios:** 001-lms-ucc
* **Ticket de Usuario:** 001-lms-tkt


Framework de ejecución:
Spec‑Driven Development (DIANA‑SDK + Speckit)

## Relación con Speckit

Esta especificación es la **fuente canónica completa** del proyecto.

Para efectos de ejecución automática con Speckit:
- Se generará una **especificación operativa derivada**
- Dicha especificación debera incluir todos los temas aqui plasmados pero transformados de acuerdo al framework de speckit unicamente:
  - User stories
  - Acceptance scenarios
  - Requisitos funcionales
- La especificación operativa NO sustituye este documento
- La autoridad arquitectónica y constitucional permanece aquí

Speckit NO debe sobrescribir este archivo.

## Origen y Trazabilidad Canónica

Esta especificación canónica se deriva de una necesidad de negocio
formalmente documentada y aprobada mediante los siguientes artefactos
organizacionales del proyecto **DIANA Learning Managment System (LMS)**:

- Control de Cambios: **001-lms-ucc**
- Ticket de Usuario: **001-lms-tkt**
- Constitución del Proyecto: **lms-constitution.md**

Relación de autoridad:
- El Control de Cambios define la necesidad de negocio.
- El Ticket describe el problema desde la perspectiva del usuario.
- La Constitución

Nota de versión:
Esta especificación corresponde a la iniciativa canónica **001-learning-app**.
Cualquier regeneración de este documento debe sobrescribir esta misma especificación
y no generar una nueva versión, ya que no existe cambio funcional.

## Idioma de la Especificación

Esta especificación canónica se redacta en **español**,
en cumplimiento de la Constitución del Proyecto.

Cualquier artefacto derivado de esta especificación,
incluyendo planes técnicos, contratos y documentación generada
por herramientas SDD como Speckit,
DEBE mantenerse en español.

El uso de términos técnicos en inglés está permitido
únicamente cuando sea necesario y no ambiguo.

---

## 0 AUTORIDAD CONSTITUCIONAL

Esta especificación deriva directamente de la Constitución del Proyecto (`lms-constitution.md`) y está subordinada a ella como fuente de verdad primaria.

**Reglas no negociables heredadas de la Constitución:**
- Modelo semi-automático obligatorio
- La IA no ejecuta operaciones
- Control humano explícito en toda ejecución

Ante cualquier conflicto, prevalece `lms-constitution.md`.

---

## 1 OBJETIVO GENERAL

Diseñar, construir y operar una **Plataforma Web Educativa de Gestión y Seguimiento del Aprendizaje tipo LMS (Learning Management System)**, implementada como **Progressive Web App (PWA)**, orientada principalmente a instituciones educativas y organizaciones formativas, cuyo propósito central es **facilitar, estructurar y hacer trazable el proceso de aprendizaje humano**, garantizando control pedagógico, integridad académica y sostenibilidad operativa.

La plataforma tiene como objetivo:

* **Organizar el conocimiento de manera dinámica y no rígida**, permitiendo estructuras adaptables para la gestión de **cursos → módulos → lecciones**, alineadas a jerarquías institucionales configurables tales como áreas, departamentos, carreras, especialidades o perfiles de puesto, sin depender de esquemas estáticos.

* **Habilitar a los instructores** para **crear, publicar, administrar y mantener** contenidos educativos propios, soportando múltiples formatos y fuentes externas, incluyendo:
  - Video y audio
  - Documentos PDF
  - Archivos Office (PowerPoint, Word, Excel)
  - Enlaces URL a plataformas y proveedores de capacitación externos (por ejemplo: SAP, Microsoft, Udemy, Platzi, edX, EDTeam, entre otros)
  - Notas y contenidos web provenientes de herramientas como Notion, Evernote u otros servicios equivalentes.

* **Garantizar que los alumnos progresen de forma controlada y completamente trazable**, respetando reglas explícitas de prerequisitos académicos definidos por el instructor o la institución, evitando accesos prematuros o promociones automáticas no autorizadas.

* **Proteger la integridad académica de las evaluaciones**, asegurando que todo el proceso de calificación (grading) se ejecute **exclusivamente del lado servidor**, sin exponer lógica sensible, respuestas correctas ni decisiones evaluativas al cliente.

* **Reconocer formalmente los logros de aprendizaje**, mediante la **emisión de certificados y diplomas digitales verificables públicamente**, cada uno con un código único que permita su validación externa sin comprometer datos privados.

* **Integrar un tutor pedagógico asistido por Inteligencia Artificial**, basado en **Google Gemini 2.5 Flash**, con un enfoque socrático de acompañamiento al aprendizaje, operando siempre a través de servicios intermedios seguros, sin exponer claves, modelos ni lógica de IA en el cliente.

* **Funcionar como una Progressive Web App instalable**, con diseño responsive, capaz de operar en **modo offline básico**, garantizando continuidad mínima del aprendizaje incluso en condiciones de conectividad limitada.

* **Mantener un modelo operativo de bajo costo**, con una arquitectura optimizada para operar con **costo cercano a cero** en el escenario inicial de entre **50 y 100 usuarios activos**, sin comprometer seguridad, trazabilidad ni calidad educativa.

En todo momento, la plataforma se concibe como un **andamio tecnológico del aprendizaje humano**, cuyo rol es **organizar, acompañar y hacer visible el progreso**, sin sustituir la enseñanza, la evaluación ni el criterio pedagógico de las personas.

---

## 2. FILOSOFÍA DEL SISTEMA

La plataforma se rige por una filosofía explícita que prioriza el **aprendizaje humano, la integridad académica y la claridad arquitectónica**, sirviendo como base para todas las decisiones de diseño, implementación y operación.  
Esta filosofía es **normativa**: ninguna feature, flujo o automatización puede contradecirla.

---

### 2.1 Modelo Centrado en el Aprendizaje Humano

El sistema adopta un modelo pedagógico en el que la tecnología **acompaña, estructura y hace visible el aprendizaje**, sin sustituir el criterio académico ni la responsabilidad humana.

Principios fundamentales:

* El **alumno controla su ritmo de estudio**, pero su progresión académica está **estrictamente condicionada** por los prerequisitos definidos por el instructor o la institución.
* El **instructor es la autoridad pedagógica**: define el contenido, los criterios de evaluación y las reglas de progresión; el sistema se limita a **organizar, rastrear y hacer trazable** dicho proceso.
* **No existe promoción automática** sin haber superado explícitamente las evaluaciones configuradas.
* **No existe acceso a contenido bloqueado** sin cumplir previamente los prerequisitos académicos establecidos.
* La **evaluación es un acto académico**, no técnico:
  - La lógica de calificación nunca se delega al cliente.
  - La decisión evaluativa no puede ser alterada por automatismos no auditables.
* La Inteligencia Artificial **nunca reemplaza la evaluación humana**, ni proporciona respuestas directas o implícitas a exámenes o evaluaciones activas.
* La plataforma se concibe como un **andamio del aprendizaje**: sostiene, ordena y acompaña el proceso educativo, pero **no lo sustituye ni lo acelera artificialmente**.

Este modelo garantiza que el aprendizaje siga siendo **intencional, verificable y significativo**, incluso cuando se apoya en automatización o IA.

---

### 2.2 Arquitectura por Features Desacopladas (Vertical Slice)

La arquitectura del sistema refleja directamente su filosofía pedagógica mediante un enfoque de **features desacopladas**, también conocido como **Vertical Slice Architecture**.

Cada feature del sistema:

* Representa un **dominio funcional completo**, incluyendo sus propios:
  - componentes de UI
  - hooks
  - servicios
  - estado (store)
  - contratos de API
  - tipos y validaciones
* Es **funcional y técnicamente desacoplada** del resto del sistema.
* Puede **desarrollarse, probarse, versionarse y desplegarse** de forma relativamente independiente.
* Mantiene límites claros de responsabilidad, evitando lógica transversal implícita o dependencias ocultas.

Este enfoque:
* Reduce el acoplamiento entre dominios académicos, técnicos y administrativos.
* Facilita la evolución progresiva del sistema sin romper el core educativo.
* Permite que agentes SDD trabajen con alto grado de autonomía y trazabilidad.

**Features constitucionales del sistema:**

| Feature         | Responsabilidad                                                     |
| --------------- | ------------------------------------------------------------------- |
| `auth`          | Autenticación y gestión de sesión (email/password + Google OAuth)   |
| `courses`       | Catálogo, creación y gestión de cursos                              |
| `lessons`       | Reproductor de lecciones con tracking de progreso                   |
| `evaluations`   | Builder y runner de evaluaciones con grading seguro                 |
| `gamification`  | XP, niveles, badges, trofeos, certificados y leaderboards           |
| `ai-chat`       | Tutor socrático con streaming SSE (proxy vía Edge Function)         |
| `admin`         | Panel de administración con alcance por unidad organizativa         |
| `super-admin`   | Configuración global: branding, planes y gestión de administradores |
| `moderation`    | Cola de revisión y moderación de contenido                          |
| `profile`       | Perfil del usuario, avatar y estadísticas personales                |
| `notifications` | Sistema de notificaciones en tiempo real                            |

Ninguna feature puede asumir responsabilidades que correspondan a otra sin una justificación explícita y documentada en la especificación.

---

### 2.3 Rol de la Inteligencia Artificial

La Inteligencia Artificial, basada en **Google Gemini 2.5 Flash**, ocupa un rol **claramente delimitado y subordinado** dentro del sistema.

Principios rectores:

* ✅ Es un **feature adicional de apoyo pedagógico**, nunca el núcleo del LMS.
* ✅ Actúa como **tutor socrático**, guiando al alumno mediante preguntas, reformulaciones y sugerencias, sin entregar respuestas cerradas.
* ✅ Puede generar contenidos auxiliares como quizzes de práctica, resúmenes o recomendaciones de estudio.
* ✅ Todas las interacciones con IA se realizan **exclusivamente a través de Edge Functions**, con:
  - JWT verificado
  - control de contexto
  - rate limiting
* ❌ Nunca responde directa ni indirectamente a una **evaluación activa**.
* ❌ Nunca es invocada directamente desde el cliente.
* ❌ Su API key o credenciales **jamás** forman parte del bundle del navegador.
* ❌ No reemplaza lógica determinística crítica como:
  - grading
  - control de prerequisitos
  - progreso académico
  - emisión de certificados

El **kill-switch de IA durante intentos de evaluación activos** es un principio constitucional **no negociable**, y su violación invalida cualquier implementación.

La IA es una **herramienta pedagógica contextual**, no una autoridad académica ni un decisor del sistema.

---

## 3. ALCANCE FUNCIONAL (VERSIÓN 1.0)

El alcance funcional de la versión 1.0 define el **conjunto completo de capacidades mínimas viables** para operar una plataforma LMS moderna, inspirada en el funcionamiento de plataformas como **Udemy y Platzi**, pero adaptada a un contexto institucional, con mayor control académico, trazabilidad y gobierno del aprendizaje.

---

### 3.1 Funcionalidades Incluidas

#### 3.1.1 Gestión Académica de Contenidos

* Gestión completa de **cursos, módulos y lecciones**, con una experiencia de navegación y consumo similar a plataformas tipo Udemy/Platzi:
  - Catálogo de cursos con vista resumida
  - Página de detalle del curso con estructura jerárquica expandible
  - Player centralizado con listado lateral de lecciones
* Organización dinámica del contenido, permitiendo:
  - Estructuras no rígidas
  - Reordenamiento de módulos y lecciones
  - Activación/desactivación de contenido sin eliminarlo

#### 3.1.2 Tipos de Contenido Soportados

* Soporte para contenidos **externos embebidos**, priorizando costo cero y escalabilidad:
  - `video`: YouTube, Vimeo
  - `pdf`: Google Drive, Supabase Storage (solo cuando sea privado)
  - `pptx`: Google Slides, OneDrive / SharePoint
  - `web_note`: URLs públicas (Notion, Evernote, sitios educativos, documentación técnica)
* El sistema detecta automáticamente el proveedor y renderiza el visor adecuado.
* El progreso del alumno se registra de forma consistente independientemente del proveedor.

#### 3.1.3 Roles y Gobierno Institucional

* Sistema de **cinco roles jerárquicos**, con permisos claros y trazables:
  - super_admin
  - admin
  - instructor
  - moderador
  - alumno
* Jerarquía institucional basada en **unidades organizativas**, permitiendo control por:
  - áreas
  - departamentos
  - carreras
  - especialidades
* El alcance de administración puede limitarse explícitamente por unidad organizativa.

#### 3.1.4 Evaluaciones Académicas

* Sistema completo de evaluaciones con experiencia similar a plataformas modernas:
  - Builder de evaluaciones
  - Runner controlado por intentos
  - Temporizador opcional
* **Grading seguro exclusivamente del lado servidor**, sin exposición de lógica sensible.
* Control de intentos, aprobación/reprobación y bloqueo de progresión.
* Las evaluaciones gobiernan el avance académico y la habilitación de contenido posterior.

#### 3.1.5 Gamificación y Motivación

* Sistema integral de gamificación alineado al progreso real del aprendizaje:
  - XP acumulable
  - 30 niveles progresivos
  - 24 badges
  - 7 trofeos especiales
* Leaderboards configurables (globales o por unidad organizativa).
* Emisión de:
  - **Certificados PDF verificables públicamente**
  - **Diplomas** asociados a rutas de aprendizaje completas

#### 3.1.6 Prerequisitos y Rutas de Aprendizaje

* Definición de prerequisitos entre cursos, con:
  - Validación automática
  - Detección de ciclos
* Rutas de aprendizaje:
  - Secuenciales (tipo carrera o programa)
  - Paralelas (tipo especialización)
* El sistema impide inscripción o avance cuando no se cumplen los prerequisitos definidos.

#### 3.1.7 Tutor IA Socrático

* Integración de un **tutor IA socrático**, con experiencia similar a un asistente educativo contextual:
  - Streaming en tiempo real (SSE)
  - Historial de conversación por usuario
* Funciones permitidas:
  - Aclaración conceptual
  - Generación de quizzes de práctica
  - Resúmenes de lecciones
* Funciones explícitamente bloqueadas:
  - Responder evaluaciones activas
  - Alterar decisiones académicas
* **Kill-switch obligatorio** durante intentos de evaluación activos.

#### 3.1.8 Notificaciones y Feedback

* Sistema de notificaciones en tiempo real mediante Supabase Realtime:
  - Progreso
  - Logros
  - Resultados de evaluaciones
  - Mensajes del sistema
* Indicadores visuales tipo “bell badge” similares a plataformas de e‑learning modernas.

#### 3.1.9 Progressive Web App (PWA)

* Aplicación **instalable** con experiencia similar a una app nativa:
  - Responsive en desktop, tablet y mobile
* Soporte **offline básico**, incluyendo:
  - Shell de la aplicación
  - Catálogo de cursos
  - Metadatos de lecciones visitadas
* Sincronización automática al recuperar conectividad.

#### 3.1.10 Moderación y Verificación Pública

* Panel de moderación con:
  - Cola de contenido reportado (flags)
  - Revisión por rol moderador
* Verificación pública de certificados mediante endpoint:
  - `/certificates/:code`
  - Sin exposición de información privada

---

### 3.2 Funcionalidades Excluidas (Diferidas a Versiones Futuras)

Las siguientes capacidades **no forman parte del alcance de la versión 1.0** y se consideran explícitamente fuera de scope inicial:

* Auto‑inscripción con pago y pasarela de pagos — **v2**
* Integración SSO / SAML institucional — **venta institucional**
* Videoconferencia integrada (Zoom / Google Meet embed) — **v2**
* Auto‑grading de respuestas abiertas mediante IA — **v2**
* Foro o comunidad social entre alumnos — **v2**
* Aplicación móvil nativa — la **PWA cubre el caso inicial**
* Arquitectura multi‑tenant (múltiples instituciones por deployment) — **v3**

Estas exclusiones permiten mantener el foco en la calidad, seguridad y trazabilidad del núcleo educativo.

#### 3.3 Gestión de Recursos de Aprendizaje (CRUD)

El sistema incluye un **CRUD completo de recursos de aprendizaje**, configurable por instructores dentro de cada curso, módulo y lección.

Un **recurso de aprendizaje** representa cualquier material necesario para completar una lección, y puede corresponder a uno o más elementos, tales como:

* Videos externos (YouTube, Vimeo, Microsoft Stream, etc.)
* Documentos (PDF, Word, Excel, PowerPoint)
* Enlaces a tutoriales externos (Microsoft, SAP, Udemy, Platzi, edX, documentación técnica)
* Notas web (Notion, Evernote u otras plataformas equivalentes)
* Cualquier URL pública accesible mediante navegador

Características del sistema de recursos:

* Cada lección puede contener **uno o múltiples recursos**, en **orden secuencial configurable**.
* Los recursos pueden ser de **formatos mixtos** dentro de la misma lección.
* El instructor puede:
  - Crear recursos
  - Editarlos
  - Reordenarlos
  - Activarlos o desactivarlos sin eliminarlos
* Los recursos se visualizan **dentro de la plataforma**, mediante visores embebidos.
* El progreso del alumno se registra a nivel de lección, independientemente del origen del recurso.

Este modelo permite construir experiencias de aprendizaje ricas, modulares y extensibles, alineadas a plataformas LMS modernas.


#### 3.4 Configuración Dinámica de Gamificación y Certificación

El sistema incluye funcionalidades administrativas para la **configuración dinámica y mantenible** de todos los elementos de gamificación y certificación, evitando valores fijos o hardcodeados.

Las capacidades incluidas son:

##### 3.4.1 Configuración de XP y Bonus

* CRUD de reglas de XP y bonus.
* Definición de:
  - acciones que generan XP
  - valores base y bonus
  - límites diarios
* Soporte para:
  - configuración global por defecto
  - sobrescritura por curso

##### 3.4.2 Configuración de Niveles de Usuario

* CRUD de niveles de usuario.
* Cada nivel es configurable en:
  - nombre
  - rango de XP
  - orden jerárquico
* La plataforma incluye niveles estándar por defecto, los cuales pueden:
  - modificarse
  - renombrarse
  - ampliarse
  - reducirse

##### 3.4.3 Configuración de Badges e Insignias

* CRUD completo de badges.
* Definición de:
  - condiciones de otorgamiento
  - asociación a cursos o rutas
* Posibilidad de:
  - activar/desactivar badges
  - usar reglas globales o por curso

##### 3.4.4 Configuración de Trofeos

* CRUD de trofeos de alto nivel.
* Asociación a:
  - rankings
  - periodos
  - logros acumulativos
  - rutas de aprendizaje
* Reglas estrictas de otorgamiento, siempre evaluadas en backend.

##### 3.4.5 Configuración de Plantillas de Certificados y Diplomas

* CRUD de plantillas de certificados y diplomas.
* Las plantillas son configurables por roles administrativos (ej. Recursos Humanos, Desarrollo Organizacional).
* Cada plantilla define:
  - diseño
  - textos
  - firmantes
  - idioma
  - tipo de logro
* Las plantillas pueden:
  - definirse globalmente
  - sobrescribirse por unidad organizativa o programa
* La emisión siempre utiliza la plantilla vigente al momento de la generación.
``

---

## 4. ARQUITECTURA GENERAL

La plataforma adopta una **arquitectura desacoplada por capas**, orientada a soportar **múltiples fuentes de datos intercambiables**, manteniendo un contrato único y estable para el frontend.

El sistema se compone de cuatro capas principales:

1. **PWA (Frontend)**
2. **API Gateway / Backend propio (Node.js + Express)**
3. **Capa de Adaptadores de Fuente de Datos**
4. **Plataformas de datos (Supabase / APIs externas como SharePoint)**

---

### 4.1 Diagrama de Alto Nivel

```
PWA (Vite + React + TypeScript)
│
├── UI / UX (shadcn + Radix)
├── TanStack Query (server state)
├── Zustand (client state: sesión, UI flags, progreso offline)
├── React Hook Form + Zod (formularios y validación)
│
└── LMS API Gateway (Node.js + Express)
│
├── Auth & Context Resolver
├── Feature Routers (courses, lessons, evaluations, etc.)
├── Domain Services (business logic)
│
└── Data Source Adapter Layer
├── Supabase Adapter
│     ├── PostgreSQL + RLS
│     ├── Supabase Auth (email/password + Google OAuth)
│     ├── Supabase Realtime (notifications, progress, badges)
│     ├── Supabase Storage (avatars, thumbnails, certificates)
│     └── Edge Functions (Deno) ← API keys secretas aquí
│           ├── ai-chat (Gemini SSE, rate limit, kill-switch)
│           ├── submit-evaluation (grading server-side)
│           ├── issue-certificate (PDF gen + verificación)
│           ├── update-user-role (único camino de mutación de roles)
│           ├── check-achievements (XP, badges, trofeos)
│           └── enroll-course (prerequisitos + inscripción)
│
└── External Adapter
└── Microsoft SharePoint APIs
├── Lists
├── Files
└── Metadata

Vercel
├── PWA (Vite + React)
└── LMS API Gateway (Express / Serverless)
     ├── Supabase Adapter
     └── SharePoint Adapter

```

---

### 4.2 Principio Clave: Fuente de Datos Intercambiable

* La aplicación debe poder operar **con una única fuente de datos activa por sesión**:
  - Supabase (modo nativo LMS)
  - APIs externas (ej. Microsoft SharePoint)
* La **fuente de datos se define antes de ingresar a la aplicación**, mediante:
  - Variable de entorno
  - Configuración institucional
  - Flag persistido por tenant / institución
* El frontend **no conoce ni diferencia** la fuente de datos activa.

---

### 4.3 Capa de Adaptadores de Datos (Data Source Adapter)

Cada adaptador:

* Implementa **el mismo contrato de dominio**
* Transforma la respuesta externa a la **estructura canónica del LMS**
* Aísla diferencias de:
  - Esquema
  - Tipos de datos
  - Naming
  - Identificadores
  - Paginación

Ejemplo conceptual:

```
CourseDTO (canónico)
├── id
├── title
├── description
├── modules[]
└── metadata
```

* `SupabaseAdapter.getCourses()` → CourseDTO[]
* `SharePointAdapter.getCourses()` → CourseDTO[]

El frontend **consume siempre CourseDTO**, sin excepciones.

---

### 4.4 Rol de Supabase Edge Functions

Las **Edge Functions** se reservan exclusivamente para lógica **sensitiva o constitucional**:

* Grading de evaluaciones
* Emisión de certificados
* Integración con IA (Gemini)
* Mutación de roles
* Cálculo de logros

Nunca se usan para lógica de presentación ni consultas genéricas.

---

### 4.5 Principio de Embeds Externos

* Videos y documentos pesados **no se almacenan** en Supabase Storage.
* Se utilizan proveedores externos (YouTube, Vimeo, Drive, OneDrive, Microsoft SharePoint, Azure Storage, Notion).
* Supabase Storage se limita a:
  - Avatares
  - Thumbnails
  - Badges
  - Certificados PDF

Este principio es obligatorio por razones de costo y escalabilidad.

---

## 5. STACK TECNOLÓGICO OBLIGATORIO

### 5.1 Frontend — PWA

| Tecnología                | Rol                                      |
| ------------------------- | ---------------------------------------- |
| Vite                      | Bundler y entorno de desarrollo          |
| React 18+                 | Framework de UI                          |
| TypeScript                | Lenguaje principal                       |
| shadcn/ui + Radix UI      | Componentes accesibles tipo Udemy/Platzi |
| Tailwind CSS              | Sistema de estilos                       |
| TanStack Query v5         | Server state (API Gateway)               |
| Zustand                   | Estado cliente (sesión, flags, offline)  |
| React Hook Form + Zod     | Formularios y validación                 |
| React Router v6+          | Routing con guards                       |
| vite-plugin-pwa + Workbox | PWA y offline                            |
| i18next                   | Internacionalización                     |
| pnpm                      | Package manager                          |

---

### 5.2 Backend — API Gateway LMS

| Tecnología    | Rol                         |
| ------------- | --------------------------- |
| Node.js LTS   | Runtime                     |
| Express.js    | Framework REST              |
| Zod           | Validación de contratos API |
| Axios / Fetch | Consumo de APIs externas    |
| JWT           | Autenticación entre capas   |
| dotenv        | Configuración de entorno    |

---

### 5.3 Plataforma de Datos Principal

| Tecnología              | Rol                                 |
| ----------------------- | ----------------------------------- |
| Supabase                | PostgreSQL, Auth, Realtime, Storage |
| PostgreSQL              | Modelo de datos LMS                 |
| Supabase Edge Functions | Lógica sensible                     |
| @google/genai           | IA (solo Edge Functions)            |
| Resend + React Email    | Emails transaccionales              |

---

### 5.4 Integraciones Externas

| Plataforma           | Uso                                              |
| -------------------- | ------------------------------------------------ |
| Microsoft SharePoint | Fuente alternativa de cursos y contenidos        |
| Microsoft Graph API  | Acceso autenticado a base de datos en SharePoint |


### 5.5 Infraestructura

| Tecnología             | Rol                                                 |
| ---------------------- | --------------------------------------------------- |
| **Vercel Pro**         | Hosting (Hobby prohíbe uso comercial por ToS)       |
| **GitHub Actions**     | CI: lint + typecheck + test + Lighthouse en cada PR |
| **Sentry** (free tier) | Error tracking y tracing                            |

---

## 6. MODELO DE DATOS — RESUMEN EJECUTIVO

El modelo de datos canónico del LMS se define **independientemente de la fuente física**, y representa la estructura que **todos los adaptadores deben respetar**.

### 6.1 Modelo Canónico LMS (Supabase)

**26 tablas en orden de dependencia:**

profiles → organizational_units → admin_scopes → courses → course_instructors → modules → lessons → content_sources → enrollments → progress_tracking → evaluations → evaluation_questions → evaluation_options → evaluation_attempts → badges → user_badges → trophies → user_trophies → certificates → diplomas → learning_paths → learning_path_courses → course_prerequisites → notifications → ai_conversations → moderation_flags

---

### 6.2 Reglas de Datos No Negociables

* RLS activo desde el primer migration
* `evaluation_options.is_correct` nunca expuesto al cliente
* Roles como claims JWT firmados
* Índices optimizados para búsqueda y notificaciones
* Realtime limitado a tablas críticas

---

### 6.3 Homologación de Datos Externos

* Las fuentes externas (SharePoint) **no imponen su esquema al sistema**
* Cada adaptador debe:
  - Mapear campos externos → modelo canónico
  - Resolver IDs externos → IDs internos
  - Normalizar fechas, estados y relaciones
* El frontend y las features **operan solo sobre el modelo canónico**

Este principio garantiza portabilidad, mantenibilidad y escalabilidad.

### 6.4 Evolución del Modelo de Datos

El modelo de datos definido en esta especificación representa el **modelo canónico base del LMS**, válido para la versión 1.0.

Este modelo:
* Puede **extenderse** mediante nuevas tablas o columnas.
* Puede **optimizarse** mediante índices, vistas o RPCs adicionales.
* No puede **romper contratos existentes** consumidos por el frontend.

Cualquier modificación al modelo debe cumplir obligatoriamente:
* Mantener compatibilidad con el modelo canónico expuesto por la API.
* Respetar RLS y reglas de seguridad existentes.
* No introducir dependencias directas del frontend a la fuente física de datos.

La evolución del modelo se considera una **extensión controlada**, no un rediseño.


---

## 7. ROLES DE LOS ACTORES DEL SISTEMA

El sistema define **cinco roles jerárquicos** con jerarquía numérica explícita, aplicables tanto a **instituciones educativas** como a **organizaciones públicas o privadas**.

El **rol** determina los permisos funcionales dentro de la plataforma, mientras que el **contexto del usuario** (académico o corporativo) determina el propósito del aprendizaje, sin alterar el modelo de control ni la arquitectura del sistema.

---

### 7.1 Roles Definidos

| Rol           | Nivel | Responsabilidad                                                                                            |
| ------------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| `super_admin` | 5     | Configura la plataforma a nivel global: branding, planes, políticas, permisos y gestión de administradores |
| `admin`       | 4     | Administra la plataforma con alcance limitado a una o varias unidades organizativas                        |
| `instructor`  | 3     | Crea, gestiona y mantiene cursos propios (owner) y colabora en cursos asignados                            |
| `moderador`   | 3     | Revisa contenido, gestiona reportes y marca flags; no puede editar cursos                                  |
| `alumno`      | 1     | Consume contenidos, progresa académicamente, presenta evaluaciones y participa en la gamificación          |

---

### 7.2 Consideración Especial del Rol `alumno`

El rol `alumno` representa al **usuario final del proceso de aprendizaje**, y puede corresponder indistintamente a:

* Un **estudiante** de una institución educativa (escuela, universidad, centro de formación).
* Un **empleado** de una organización pública o privada (capacitación, inducción, certificación interna).
* Un **participante** de programas de formación continua o especializada.

Independientemente del contexto:

* El modelo de progresión, evaluación y certificación es el mismo.
* Las reglas de prerequisitos y trazabilidad académica no se alteran.
* El sistema no diferencia permisos por “tipo de alumno”, sino por **rol y unidad organizativa**.

Esto garantiza un modelo unificado, consistente y reutilizable en escenarios educativos y corporativos.

---

### 7.3 Jerarquía y Gobierno de Roles

La jerarquía numérica define de forma inequívoca los permisos y límites de acción dentro del sistema:

* Un rol con mayor nivel **puede administrar** roles de menor nivel, nunca iguales o superiores.
* La jerarquía es utilizada por:
  - RLS en base de datos
  - Edge Functions
  - Guards de frontend

---

### 7.4 Reglas Constitucionales de Roles (No Negociables)

* ✅ Solo el rol `super_admin` puede promover usuarios al rol `admin`.
* ✅ El Edge Function `update-user-role` es el **único camino autorizado** para modificar roles.
* ✅ Ningún usuario puede autoasignarse un rol superior al propio.
* ✅ Las reglas de promoción y degradación se hacen cumplir mediante:
  - Edge Functions
  - Políticas RLS
  - Claims JWT firmados
* ✅ Un `admin` **nunca** puede elevar a otro usuario al rol `super_admin`.
* ✅ Cada curso tiene exactamente:
  - **un `owner`** (instructor responsable)
  - **N `collaborators`**, definidos en `course_instructors`

Cualquier violación a estas reglas invalida la implementación desde el punto de vista constitucional del sistema.

---

### 7.5 Principio de Neutralidad de Dominio

El sistema es **neutral respecto al dominio** (educativo o corporativo):

* No existen roles específicos para “empresa” o “escuela”.
* La diferenciación se logra mediante:
  - unidades organizativas
  - rutas de aprendizaje
  - cursos asignados
  - políticas institucionales

Este principio permite que la plataforma opere de forma consistente como:
* LMS escolar
* LMS corporativo
* Plataforma mixta de formación continua

### 7.6 Permisos de Configuración Académica y Gamificación

La configuración de reglas académicas, gamificación y certificación se gobierna por rol, garantizando control institucional y flexibilidad operativa.

#### Permisos por Rol

* **super_admin**
  - Define configuraciones globales por defecto del sistema:
    - reglas de XP y bonus
    - niveles de usuario
    - catálogo de badges y trofeos
    - plantillas base de certificados y diplomas
  - Puede habilitar o restringir qué configuraciones son modificables por otros roles.

* **admin**
  - Puede:
    - ajustar configuraciones por unidad organizativa
    - definir plantillas de certificados y diplomas institucionales
    - administrar reglas de gamificación aplicables a múltiples cursos
  - No puede alterar reglas constitucionales del sistema.

* **instructor**
  - Puede **sobrescribir configuraciones por curso**, cuando el sistema lo permita:
    - valores de XP
    - bonus
    - badges y trofeos asociados al curso
  - No puede crear ni modificar plantillas institucionales globales de certificados.

* **moderador**
  - No tiene permisos de configuración académica ni de gamificación.

* **alumno**
  - No tiene permisos de configuración.
  - Es únicamente receptor de las reglas vigentes.

En todos los casos, las configuraciones por curso **no afectan** la configuración global ni otros cursos.

---

## 8. INTEGRACIONES DE CONTENIDO EXTERNO

La plataforma permite integrar, visualizar y dar seguimiento a **recursos de aprendizaje externos** directamente dentro de la experiencia del LMS, manteniendo una estructura jerárquica y trazable similar a plataformas como Udemy y Platzi.

Los recursos externos forman parte **estructural del contenido académico** y no son simples enlaces de salida.

---

### 8.1 Principios Generales

* Todo recurso externo:
  - Se **visualiza dentro de la plataforma** mediante un visor embebido.
  - Está **asociado jerárquicamente** a un curso, módulo/tema y lección.
  - Participa en el **seguimiento de progreso** del alumno.
* El sistema **no redirige al usuario fuera de la plataforma** salvo que el proveedor lo impida explícitamente.
* Un recurso externo es tratado como **contenido educativo de primera clase**, no como un link auxiliar.

---

### 8.2 Modelo Jerárquico de Recursos

El modelo de organización de contenido es el siguiente:
```
Curso
 └─ Módulo / Tema
     └─ Lección
         └─ Recurso 1
         └─ Recurso 2
         └─ Recurso N
```

* Cada **lección** puede contener **uno o múltiples recursos**.
* Los recursos:
  - Pueden ser de **formatos mixtos**.
  - Tienen un **orden secuencial configurable**.
* El avance del alumno se registra a nivel de **lección**, considerando el consumo de los recursos asociados.

---

### 8.3 CRUD de Recursos Externos (Configuración Académica)

El sistema incluye un **CRUD específico para recursos externos**, accesible para instructores y administradores autorizados.

Cada recurso configurable incluye, como mínimo:

* Tipo de recurso (`video`, `document`, `web_note`, `external_tutorial`, etc.)
* URL del recurso
* Proveedor detectado automáticamente
* Orden dentro de la lección
* Estado (activo / inactivo)
* Reglas mínimas de consumo (tiempo, navegación, visualización)

Acciones permitidas:

* Crear recursos
* Editarlos
* Reordenarlos
* Activarlos o desactivarlos sin eliminarlos
* Reutilizarlos en otras lecciones (cuando aplique)

Este CRUD es el mecanismo oficial para integrar:
- Tutoriales de Microsoft, SAP u otros proveedores
- Videos externos
- Documentos Office (Word, Excel, PowerPoint)
- Notas de Notion, Evernote
- Cualquier URL educativa válida

---

### 8.4 Proveedores de Contenido Soportados

| Proveedor                                        | Tipo                      | Visualización   | Seguimiento |
| ------------------------------------------------ | ------------------------- | --------------- | ----------- |
| **YouTube**                                      | Video                     | IFrame embebido | API oficial |
| **Vimeo**                                        | Video                     | IFrame embebido | SDK oficial |
| **Microsoft Stream**                             | Video                     | Embed           | Heurística  |
| **Google Drive**                                 | PDF                       | Embed           | Heurística  |
| **Google Slides**                                | Presentaciones            | Embed           | Navegación  |
| **OneDrive / SharePoint**                        | Word / Excel / PPTX / PDF | Embed           | Navegación  |
| **Notion** (`notion.site`)                       | Notas web                 | Embed           | Tiempo      |
| **Evernote**                                     | Notas web                 | Embed / Viewer  | Tiempo      |
| **SAP / Microsoft Learn / Udemy / Platzi / edX** | Tutoriales                | Web embebida    | Tiempo      |

---

### 8.5 Microsoft SharePoint y Azure como Repositorios

Microsoft SharePoint y servicios de Azure pueden operar como:

#### 8.5.1 Repositorio de Recursos Educativos

* Archivos Word, Excel, PowerPoint, PDF
* Videos institucionales
* Documentación oficial

Los recursos se integran:
* Mediante URL compartida
* Visualizados dentro del LMS
* Asociados a cursos, módulos y lecciones
* Sujetos al mismo seguimiento de progreso

#### 8.5.2 Fuente de Datos Estructurada (Modo API)

Cuando SharePoint actúa como sistema fuente:

* El acceso se realiza **exclusivamente desde el backend**
* Se utiliza Microsoft Graph API
* Los datos se transforman al **modelo canónico del LMS**
* El frontend no distingue el origen de los datos

---

### 8.6 Supabase Storage — Uso Restringido

Supabase Storage se utiliza **únicamente** para:

* Avatares
* Thumbnails
* Badges y trofeos
* Certificados y diplomas PDF
* Recursos privados no públicos

**Regla no negociable:**  
👉 Videos y documentos pesados **NUNCA** se almacenan en Supabase Storage.

---

### 8.7 Principio de Neutralidad de Contenido

* El LMS es **agnóstico al proveedor de contenido**.
* La sustitución o adición de nuevos proveedores:
  - No requiere cambios en el frontend
  - Solo requiere un nuevo adaptador backend o visor
* El contenido externo siempre se gobierna desde el **modelo académico del LMS**, no desde el proveedor.

Este enfoque garantiza escalabilidad, bajo costo y control institucional.

---

## 9. PERSISTENCIA Y SEGURIDAD DE DATOS

La plataforma adopta un modelo de **defensa en profundidad**, donde la seguridad y la integridad de los datos se garantizan en **todas las capas del sistema**: base de datos, backend, Edge Functions y frontend.

La persistencia y el acceso a los datos se rigen por principios de **mínimo privilegio, trazabilidad y control institucional**.

---

### 9.1 Fuentes de Datos y Persistencia

#### 9.1.1 Plataforma de Datos Principal

* **Supabase PostgreSQL**
  - Usuarios y perfiles
  - Unidades organizativas
  - Cursos, módulos, lecciones y recursos
  - Inscripciones y progreso
  - Evaluaciones y resultados
  - Gamificación (XP, badges, trofeos)
  - Notificaciones
  - Conversaciones de IA

* **Supabase Storage**
  - Avatares de usuario
  - Thumbnails de cursos
  - Badges y trofeos (SVG/PNG)
  - Certificados y diplomas PDF
  - Recursos privados asociados a lecciones (enrolled-only)

Todos los recursos privados se sirven mediante **signed URLs con TTL limitado**.

---

#### 9.1.2 Fuentes de Datos Externas

* **APIs externas (ej. Microsoft SharePoint / Azure)**
  - Utilizadas como repositorio de documentos o fuente estructurada de datos
  - Accedidas exclusivamente desde el backend (API Gateway)
  - Nunca consumidas directamente desde el frontend

Las respuestas externas se **transforman y homologan** al modelo canónico del LMS antes de ser expuestas al cliente.

---

### 9.2 Principios de Seguridad No Negociables

1. **Row Level Security (RLS)** activo en todas las tablas desde el primer migration.  
   No existe ninguna tabla sin políticas explícitas.

2. **Separación estricta de responsabilidades**:
   - El frontend nunca ejecuta lógica sensible.
   - El backend orquesta acceso y contexto.
   - Las Edge Functions ejecutan lógica crítica.

3. El campo `evaluation_options.is_correct`:
   - ❌ Nunca es accesible vía SELECT directo al cliente
   - ✅ Solo se utiliza dentro de la Edge Function `submit-evaluation` con `service_role`

4. **Credenciales y secretos**:
   - La API key de Gemini **nunca** forma parte del bundle del navegador
   - El `service_role` de Supabase **nunca** se expone al cliente
   - Todas las credenciales sensibles residen únicamente en:
     - variables de entorno del backend
     - variables de entorno de Edge Functions
     - sin prefijo `VITE_`

5. **Control de acceso por roles**:
   - La jerarquía de roles se hace cumplir mediante:
     - RLS en base de datos
     - Edge Functions
     - Claims JWT firmados
   - El frontend **nunca** es la única barrera de control.

---

### 9.3 Seguridad en el Backend y API Gateway

* El API Gateway:
  - Valida JWT en cada request
  - Resuelve el contexto de usuario y rol
  - Aplica control de acceso por feature
* Las rutas del backend:
  - Nunca exponen directamente esquemas físicos de la base de datos
  - Devuelven únicamente DTOs del modelo canónico
* Todas las integraciones externas (SharePoint, Azure, etc.):
  - Se autentican y autorizan exclusivamente en el backend
  - Nunca exponen tokens al cliente

---

### 9.4 Seguridad en Edge Functions

Las **Supabase Edge Functions** son el único lugar autorizado para ejecutar lógica altamente sensible, incluyendo:

* Calificación de evaluaciones
* Emisión de certificados y diplomas
* Mutación de roles
* Integración con IA (Gemini)
* Cálculo de logros y gamificación

Medidas obligatorias:

* Validación de JWT en cada invocación
* Rate limiting por usuario y por IP
* Logs estructurados para auditoría

---

### 9.5 Control de IA y Abuso

* Rate limit estándar:
  - **60 interacciones de IA por día por usuario**
* **Kill-switch obligatorio**:
  - La IA se desactiva automáticamente durante intentos de evaluación activos
* Toda interacción con IA:
  - Es trazable
  - Está asociada a un usuario autenticado
  - Puede ser auditada

---

### 9.6 Seguridad de Recursos y Contenidos

* **Content Security Policy (CSP)** estricta en producción:
  - Solo dominios explícitamente permitidos:
    - YouTube
    - Vimeo
    - Google Drive / Slides
    - OneDrive / SharePoint
    - Notion
* Supabase Storage:
  - Acceso privado por defecto
  - Signed URLs con TTL corto (1h)
* No existe acceso público permanente a recursos privados.

---

### 9.7 Certificados y Verificación Pública

* Los certificados y diplomas:
  - Se emiten exclusivamente mediante Edge Function
  - Incluyen código único verificable
* La verificación pública se realiza vía:
  - RPC `verify_certificate(code)`
* La verificación:
  - Devuelve solo información pública mínima
  - Nunca expone registros completos ni datos sensibles
  - Está protegida por rate limiting

---

### 9.8 Respaldo, Recuperación y Auditoría

* **Point-In-Time Recovery (PITR)** habilitado en Supabase Pro
* Backup nocturno automático:
  - `pg_dump`
  - Almacenado en S3 / R2
  - Encriptado
* Logs de seguridad y errores:
  - Centralizados (Sentry)
  - Con correlación por request y usuario

La pérdida de datos o la falta de trazabilidad se considera un fallo crítico del sistema.

### 9.9 Persistencia y Seguridad de Configuraciones Dinámicas

Las configuraciones académicas, de gamificación y certificación del sistema son **entidades persistentes de primera clase**, y se gestionan mediante estructuras de datos específicas protegidas por políticas de seguridad estrictas.

Esto incluye, sin limitarse a:

* Reglas de XP y bonus
* Definiciones de niveles de usuario
* Badges e insignias
* Trofeos
* Plantillas de certificados y diplomas
* Sobrescrituras de configuración por curso o unidad organizativa

---

### 9.9.1 Principio de Configuración Data‑Driven

* Ninguna regla de gamificación o certificación está hardcodeada en el frontend.
* Todas las reglas:
  - se almacenan en base de datos
  - se versionan implícitamente mediante timestamps
  - pueden activarse o desactivarse sin eliminación física
* El frontend **solo consume configuraciones ya resueltas**, nunca reglas crudas.

---

### 9.9.2 Jerarquía de Configuración y Resolución

El sistema aplica las configuraciones siguiendo una jerarquía estricta:

1. **Configuración por defecto del sistema**
2. **Configuración por unidad organizativa** (cuando aplique)
3. **Configuración específica del curso** (override)

---

## 10. INTELIGENCIA ARTIFICIAL (TUTOR SOCRÁTICO)

La Inteligencia Artificial del sistema se implementa como un **tutor socrático asistido**, estrictamente subordinado a la autoridad académica humana y a las reglas constitucionales del LMS.

La IA **no constituye el núcleo del sistema**, sino un **feature complementario** de apoyo pedagógico, diseñado para mejorar la comprensión, la reflexión y la autonomía del aprendizaje.

---

### 10.1 Rol Constitucional de la IA (No Negociable)

La IA cumple exclusivamente los siguientes roles:

* Feature adicional de **apoyo pedagógico**, nunca el núcleo del sistema.
* **Confirmador contextual** de conceptos ya presentes en el contenido.
* Generador de **quizzes de práctica**, resúmenes y material de refuerzo.
* **Tutor socrático** que guía mediante preguntas y reformulación, nunca mediante respuestas directas.
* Herramienta de acompañamiento al aprendizaje autónomo.

La IA **no puede** bajo ninguna circunstancia:

* Actuar como evaluador académico.
* Ejecutar o modificar decisiones académicas.
* Determinar aprobación, reprobación o progreso.
* Ser fuente única de verdad académica.
* Responder directa o indirectamente evaluaciones activas.

Cualquier implementación que viole estos principios se considera inválida.

---

### 10.2 Arquitectura de Integración de IA

* El modelo de IA utilizado es **Google Gemini 2.5 Flash**.
* Toda interacción con IA se realiza:
  - Exclusivamente desde **Supabase Edge Functions**
  - Nunca desde el cliente
  - Nunca directamente desde el API Gateway
* Las Edge Functions:
  - Validan JWT
  - Resuelven el contexto del usuario
  - Aplican control de permisos
  - Ejecutan rate limiting
  - Registran trazabilidad

La **API key de Gemini jamás** forma parte del bundle del navegador ni del frontend.

---

### 10.3 Capacidades Permitidas

La IA puede ejecutar únicamente las siguientes capacidades explícitas:

* **Chat socrático en tiempo real**, con streaming SSE:
  - Orientado a aclarar conceptos
  - Basado en el contenido del curso y recursos asociados
* **Generación de quizzes de práctica** a partir del contenido de una lección:
  - Uso exclusivo para autoevaluación
  - Nunca se consideran evaluaciones formales
* **Resumen de lecciones** con glosario de términos clave:
  - Cacheado en base de datos
  - Reutilizable para múltiples usuarios
* **Gestión de contexto conversacional**:
  - Historial por usuario
  - Rolling summary para control del context window

---

### 10.4 Contexto y Fuentes Permitidas para la IA

La IA solo puede utilizar como contexto:

* Contenido del curso, módulo y lección activos
* Recursos externos configurados en la lección (URLs, documentos, videos)
* Historial conversacional del usuario

La IA **no tiene acceso** a:

* Respuestas correctas de evaluaciones
* Datos personales sensibles
* Información de otros usuarios
* Datos fuera del contexto académico activo

---

### 10.5 Control de Uso, Abuso y Evaluaciones

* **Rate limiting estándar**:
  - 60 interacciones de IA por usuario por día
* **Kill-switch obligatorio**:
  - La IA se desactiva automáticamente durante intentos de evaluación activos
* El estado del kill-switch:
  - Se evalúa en cada llamada
  - Se hace cumplir en Edge Function
  - No puede ser sobrescrito desde el frontend

---

### 10.6 Trazabilidad y Auditoría

* Toda interacción con IA:
  - Está asociada a un usuario autenticado
  - Se registra con timestamp, tipo de acción y feature
  - Puede ser auditada
* El historial de conversaciones:
  - Es persistido
  - Puede ser anonimizado si la institución lo requiere
  - Cumple principios de mínimo almacenamiento necesario

---

### 10.7 Ruteo por Tarea y Estimación de Costos

Escenario estimado:
* 100 usuarios
* 20 interacciones promedio por día
* 30 días

| Tarea                       | Modelo                         | Costo estimado mensual |
| --------------------------- | ------------------------------ | ---------------------- |
| Chat tutor (80%)            | `gemini-2.5-flash`             | ~$76.80                |
| Generación de quizzes (15%) | `gemini-2.5-flash-lite`        | ~$8.10                 |
| Resúmenes (5%)              | `gemini-2.5-flash` (cacheable) | ~$12.75                |
| **Total estimado**          |                                | **~$97/mes**           |

El costo puede reducirse a **~$60–80/mes** mediante:
* Batch processing
* Context caching
* Reutilización de resúmenes

---

### 10.8 Principio Final de Uso de IA

La Inteligencia Artificial **no enseña por sí misma**.  
La IA **no evalúa**.  
La IA **no decide**.

La IA **acompaña**, **sugiere** y **estimula el pensamiento crítico** dentro de un marco académico gobernado por personas.

Este principio es constitucional y no admite excepciones.

---

## 11. GAMIFICACIÓN

El sistema de gamificación tiene como objetivo **reforzar la motivación, la constancia y la finalización efectiva del aprendizaje**, sin sustituir ni distorsionar el logro académico real.

La gamificación **no es un sistema de puntos aislado**, sino una capa transversal alineada con:
* el progreso académico
* las evaluaciones
* las rutas de aprendizaje
* la emisión de certificados y diplomas

Funciona de manera uniforme tanto para:
* estudiantes de instituciones educativas
* empleados de organizaciones públicas o privadas

---

### 11.1 Principios de Gamificación (No Negociables)

* La gamificación **nunca sustituye** evaluaciones académicas.
* No existe obtención de XP sin una acción académica válida.
* Todo cálculo de XP, niveles, badges y trofeos se realiza **del lado servidor**.
* El frontend **no puede** otorgar ni modificar logros.
* Se aplican límites y controles para evitar “farmear” recompensas.

---

### 11.2 Sistema de Experiencia (XP)

El sistema XP recompensa acciones reales de aprendizaje:

| Acción                  | XP         | Nota                                   |
| ----------------------- | ---------- | -------------------------------------- |
| Completar lección       | 10         | `xp_override` configurable por lección |
| Video visto ≥95%        | +5 bonus   | Detección de visualización genuina     |
| Aprobar evaluación      | 15–40      | Escala lineal según score              |
| Primer intento aprobado | +10 bonus  | Incentiva estudio previo               |
| Completar curso         | 100        |                                        |
| Completar learning path | 500        | Incluye diploma                        |
| **Cap diario**          | **200 XP** | Previene abuso                         |

---

### 11.3 Niveles de Usuario

* Fórmula de progreso: **`XP requerida = N² × 100`**
* Total de **30 niveles**, desde:
  - Aprendiz (niveles 1–4)
  - Intermedio
  - Avanzado
  - Experto
  - **Leyenda (30+)**

Cada nivel puede desbloquear:
* Beneficios visuales (badges, insignias)
* Accesos funcionales (cuando la institución lo defina)

---

### 11.4 Badges (Insignias)

El sistema incluye **24 badges**, agrupados en categorías:

* `progress` — avance constante
* `mastery` — dominio de contenido
* `habits` — constancia y hábitos
* `social` — participación (cuando aplique)
* `special` — logros excepcionales

Los badges:
* Se otorgan automáticamente por reglas del sistema.
* No pueden asignarse manualmente sin una regla documentada.
* Son persistentes y visibles en el perfil del usuario.

---

### 11.5 Trofeos (Logros de Alto Nivel)

Los **7 trofeos** representan logros superiores y poco frecuentes:

* `PATH_DIPLOMA`
* `TOP_3_MONTHLY`
* `TOP_1_MONTHLY`
* `STREAK_365`
* `ALL_COURSES`
* `PERFECT_PATH`
* `LEVEL_30`

Los trofeos:
* Requieren validaciones estrictas.
* Se calculan únicamente en backend.
* Tienen alto valor simbólico y motivacional.

---

### 11.6 Certificados y Diplomas

* Los **certificados** acreditan la finalización de cursos individuales.
* Los **diplomas** acreditan la finalización de rutas completas.

Características:

* Emisión exclusivamente vía **Edge Function `issue-certificate`**
* Generación de PDF mediante `@react-pdf/renderer`
* Formato:
  - A4 horizontal
  - Código QR único
  - Enlace de verificación pública `/certificates/:code`
* Verificación pública mediante:
  - RPC `verify_certificate(code)`
  - Devuelve solo campos públicos mínimos
* Rate limit en verificación:
  - **20 solicitudes por minuto por IP**

---

### 11.7 Trazabilidad y Auditoría de Logros

* Cada otorgamiento de:
  - XP
  - Badge
  - Trofeo
  - Certificado
* Queda registrado con:
  - usuario
  - evento académico
  - timestamp
  - fuente del evento

Esto permite:
* Auditoría institucional
* Revisión de logros
* Cumplimiento en entornos públicos y corporativos

---

### 11.8 Principio Final de Gamificación

La gamificación **acompaña el aprendizaje**,  
**no lo reemplaza**.

Un usuario progresa porque **aprende**,  
no porque acumula puntos sin significado académico.

### 11.9 Configuración Dinámica de Gamificación (CRUD)

El sistema de gamificación es **totalmente configurable y mantenible**, y no contiene valores fijos o hardcodeados.

Todas las reglas de gamificación se gestionan mediante **CRUDs administrativos**, permitiendo su adaptación a distintos contextos académicos y corporativos.

---

### 11.9.1 Configuración de XP y Bonus

El sistema incluye un **CRUD de reglas de XP**, que permite:

* Definir acciones que generan XP.
* Configurar:
  - XP base
  - XP bonus
  - límites diarios
* Activar o desactivar reglas sin eliminarlas.

Las reglas de XP pueden definirse en dos niveles:

* **Nivel sistema (default)** — aplicable a todos los cursos.
* **Nivel curso (override)** — permite que un instructor o admin:
  - ajuste valores
  - agregue bonus específicos
  - deshabilite reglas para un curso concreto.

---

### 11.9.2 Configuración de Niveles de Usuario

Los **niveles de usuario no son fijos**.

El sistema provee un **CRUD de niveles**, que permite:

* Crear, editar o eliminar niveles.
* Definir:
  - nombre del nivel
  - rango de XP mínimo y máximo
  - orden jerárquico
* Renombrar niveles según el contexto institucional o corporativo.

Por defecto, el sistema incluye una configuración estándar de 30 niveles, la cual puede ser modificada total o parcialmente.

---

### 11.9.3 Configuración de Badges e Insignias

Los badges son **entidades configurables**, gestionadas mediante CRUD, que permiten:

* Crear nuevas insignias.
* Definir condiciones de otorgamiento.
* Asociar badges a:
  - acciones
  - cursos específicos
  - rutas de aprendizaje.
* Activar o desactivar badges sin afectar el historial.

Los badges pueden:
* Usar configuración global por defecto.
* Tener reglas personalizadas por curso.

---

### 11.9.4 Configuración de Trofeos

Los trofeos representan logros de alto nivel y también son **dinámicos**:

* CRUD de trofeos disponible para administradores.
* Definición explícita de:
  - condiciones
  - frecuencia
  - unicidad.
* Asociables a:
  - ranking
  - periodos
  - rutas
  - logros acumulativos.

---

### 11.9.5 Plantillas de Certificados y Diplomas

Los certificados y diplomas se generan a partir de **plantillas configurables**, administradas mediante CRUD por roles administrativos (ej. Recursos Humanos, Desarrollo Organizacional).

Cada plantilla define:

* Diseño visual
* Logos institucionales
* Texto legal
* Firmantes
* Idioma
* Tipo de logro (curso, ruta, certificación interna)

Las plantillas:
* Se asocian por defecto al sistema.
* Pueden sobrescribirse por:
  - unidad organizativa
  - tipo de curso
  - programa formativo.

La emisión de certificados siempre se realiza vía Edge Function, utilizando la plantilla vigente al momento de la emisión.

---

## 12. PRERREQUISITOS Y RUTAS DE APRENDIZAJE

El sistema incorpora un mecanismo formal de **control de prerrequisitos y rutas de aprendizaje**, diseñado para garantizar progresión académica ordenada, trazable y coherente, tanto en contextos educativos como corporativos.

Las reglas de prerrequisitos y rutas aplican de igual forma para:
* estudiantes de instituciones educativas
* empleados de organizaciones públicas o privadas

---

### 12.1 Prerrequisitos Académicos entre Cursos

* Los cursos pueden definir **prerrequisitos explícitos** respecto a otros cursos.
* Antes de registrar cualquier prerrequisito:
  - Se ejecuta una **detección de ciclos** mediante **CTE recursiva en PostgreSQL**.
  - No se permite guardar configuraciones que generen dependencias circulares.
* Los prerrequisitos gobiernan:
  - inscripción
  - acceso al contenido
  - progresión académica

---

### 12.2 Validación de Inscripción

* El sistema expone el RPC:
  
```
  can_enroll(user_id, course_id)
```
que devuelve:

```
      {
      "allowed": boolean,
      "missing": ["course_id"]
      }
```

Esta validación:

- Se ejecuta siempre en backend.
- Es consumida por el frontend antes de renderizar el botón “Inscribirme”.


Cuando la inscripción está bloqueada:

- El botón se muestra deshabilitado.
- Se presenta un icono de bloqueo.
- Se informa al usuario qué cursos faltan por completar.

Este comportamiento replica la experiencia de plataformas LMS modernas tipo Udemy/Platzi, con mayor control institucional.

---

### 12.3 Rutas de Aprendizaje (Learning Paths)

Una ruta de aprendizaje representa un conjunto estructurado de cursos orientados a:
- una carrera académica
- una especialización
- un perfil de puesto
- un programa de capacitación corporativa

Las rutas pueden configurarse como:
- secuenciales
- paralelas

En rutas secuenciales (is_sequential = true):
- Solo se desbloquea el siguiente curso pendiente con menor position.
- El usuario no puede saltar cursos.

---

### 12.4 Progresión, Desbloqueo y Automatismos

- El sistema monitorea el estado de inscripción del usuario.
Cuando un curso cambia a status = 'completed':
  - Se evalúa el desbloqueo de:
    - cursos dependientes
    - cursos dentro de rutas secuenciales
  - El desbloqueo siempre se calcula del lado servidor.
  - El frontend solo refleja el estado resultante.

---

### 12.5 Emisión Automática de Diplomas

Cuando un usuario completa todos los cursos de una ruta de aprendizaje:
- Se dispara un trigger sobre enrollments.
- El sistema encola la emisión del diploma correspondiente.

La emisión del diploma:
- Se realiza vía Edge Function
- Usa la plantilla vigente configurada por la institución
- Queda registrada para auditoría

---

### 12.6 Integración con Gamificación y Certificación

La finalización de cursos y rutas:
- Otorga XP según las reglas vigentes
- Puede desbloquear badges o trofeos
- Dispara la emisión de certificados o diplomas

Todas estas acciones:
- Se calculan en backend
- Son trazables
- No pueden ser forzadas desde el frontend

---

### 12.7 Principio de Control Académico

No existe acceso a contenido sin cumplir prerrequisitos.
No existe inscripción forzada que viole reglas académicas.
No existe desbloqueo manual sin registro y auditoría.

Las rutas de aprendizaje representan un contrato académico explícito, y su violación invalida la coherencia del sistema.


---
## 13. REQUISITOS NO FUNCIONALES

Los Requisitos No Funcionales (NFR) definen los **atributos de calidad, restricciones y comportamientos globales** del sistema LMS.

Estos requisitos son **arquitectónicamente significativos** y de **cumplimiento obligatorio** para todas las features y fases del proyecto.

---

### 13.1 Rendimiento

* Tiempo de carga inicial (PWA instalada):
  - LCP ≤ 2.5 s
* Navegación entre vistas críticas:
  - ≤ 500 ms en condiciones normales
* Submit de evaluaciones:
  - ≤ 800 ms server‑side
* Streaming SSE de IA:
  - Primer token ≤ 1.5 s

---

### 13.2 Escalabilidad

* Soporte mínimo garantizado:
  - 100 usuarios concurrentes (v1)
* Escalado sin rediseño:
  - hasta 1,000 usuarios concurrentes
* Realtime limitado a tablas críticas
* Proveedores externos desacoplados mediante adaptadores

---

### 13.3 Disponibilidad y Resiliencia

* Objetivo de disponibilidad:
  - 99.5% mensual
* Degradación controlada:
  - Falla IA → LMS sigue operando
  - Falla SharePoint → aviso + retry
  - Falla Realtime → fallback a polling

---

### 13.4 Seguridad

* RLS obligatorio en todas las tablas
* Secrets nunca en frontend
* Grading siempre server‑side
* Integraciones externas solo desde backend
* CSP estricta en producción

---

### 13.5 Observabilidad

* Logs estructurados en:
  - backend
  - Edge Functions
* Error tracking activo desde Fase 0

---

## 14. ACCESIBILIDAD Y USABILIDAD

La plataforma debe cumplir con principios de **accesibilidad universal**, especialmente en contextos educativos y del sector público.

---

### 14.1 Estándar

* Cumplimiento mínimo:
  - WCAG 2.1 nivel AA

---

### 14.2 Interacción

* Navegación completa por teclado
* Roles ARIA explícitos en componentes interactivos
* Foco visible y controlado

---

### 14.3 Contenido

* Contraste mínimo 4.5:1
* Soporte de subtítulos cuando el proveedor externo lo permita
* Estados de progreso anunciables por lector de pantalla

---

### 14.4 Formularios y Evaluaciones

* Errores descriptivos y accesibles
* Validaciones no dependientes del color

---

## 15. MODELO DE ERRORES Y FALLAS CONTROLADAS

El sistema define un modelo explícito de manejo de errores para garantizar **resiliencia, claridad y continuidad operativa**.

---

### 15.1 Tipos de Error

| Tipo    | Ejemplo                | Respuesta UX        |
| ------- | ---------------------- | ------------------- |
| Red     | Offline / timeout      | Retry + aviso       |
| Permiso | RLS bloquea            | Mensaje educativo   |
| Negocio | Prerrequisito faltante | Tooltip explicativo |
| Externo | SharePoint no responde | Fallback            |
| IA      | Rate limit             | Mensaje + cooldown  |

---

### 15.2 Principios

* Nunca exponer stack trace al usuario
* Nunca silenciar errores críticos
* Todo error crítico:
  - se registra
  - es trazable


## 16. ESTRATEGIA DE TESTING

La calidad del sistema se valida mediante una estrategia de testing multinivel.

---

### 16.1 Unitarios (Vitest)

* Hooks
* Stores
* Validadores
* Helpers de dominio

---

### 16.2 Integración

* RPCs críticos
* Edge Functions sensibles
* Resolución de reglas dinámicas

---

### 16.3 End‑to‑End (Playwright)

Flujos mínimos obligatorios:

1. Registro → inscripción → lección
2. Evaluación → grading → XP
3. Certificado emitido y verificado
4. Kill‑switch IA activo
5. Offline → sync exitoso

---

### 16.4 Validación Continua

* Tests obligatorios en cada PR
* Bloqueo de merge si fallan

---

## 17. MATRIZ DE RIESGOS

| Riesgo              | Impacto | Mitigación               |
| ------------------- | ------- | ------------------------ |
| Abuso de IA         | Alto    | Rate limit + kill‑switch |
| Error en RLS        | Crítico | Testing + revisión       |
| Dependencia externa | Medio   | Adaptadores              |
| Realtime saturado   | Medio   | Canales limitados        |
| Config maliciosa    | Alto    | Auditoría + RLS          |

Los riesgos se revisan en cada cierre de fase.

---

## 18. GLOSARIO CONSTITUCIONAL

* **Recurso:** Unidad de contenido asociada a una lección.
* **Evaluación activa:** Intento no finalizado.
* **Override:** Configuración que sobrescribe el default.
* **Modelo canónico:** Estructura de datos interna estándar.
* **Kill‑switch IA:** Bloqueo automático de IA por contexto académico.
* **Ruta de aprendizaje:** Secuencia estructurada de cursos.

---

## 19. ESTÁNDAR DE COMENTARIOS DE CÓDIGO


Todo código generado dentro del proyecto LMS **DEBE cumplir obligatoriamente** con el siguiente estándar de comentarios, cuyo objetivo es garantizar:

* claridad pedagógica
* trazabilidad técnica
* auditabilidad de decisiones
* cumplimiento de reglas de seguridad y arquitectura

Este estándar es **constitucional** y su incumplimiento **bloquea el cierre de tickets y fases**.

---

## 19.1 Formato Obligatorio

Todo bloque de lógica relevante debe incluir comentarios bilingües (EN / ES) utilizando el prefijo `LMS` y emojis semánticos.

Ejemplo obligatorio:

```ts
// 🎓LMS: Saves lesson progress with debounce to avoid excessive DB writes (EN)
// 🎓LMS: Guarda el progreso de lección con debounce para evitar escrituras excesivas (ES)
// 🔒LMS: RLS enforces user can only update their own progress\_tracking rows (EN)
// 🔒LMS: RLS garantiza que el usuario solo actualiza sus propias filas de progress\_tracking (ES)
export function useProgressStore() { ... }
```

---

## 19.2 Ámbito de Aplicación (Dónde es Obligatorio)
El estándar de comentarios es obligatorio en:

Lógica de negocio
Lógica educativa (progreso, evaluaciones, gamificación)
Seguridad y control de acceso
Políticas RLS
RPCs y Edge Functions
Integraciones con IA
Resolución de reglas dinámicas (XP, niveles, prerrequisitos, rutas)

En código puramente estructural o trivial (ej. exports simples), el uso es recomendado pero no obligatorio.

---

## 19.3 Diccionario de Emojis y Uso Semántico

| Emoji | Uso                                    |
| ----- | -------------------------------------- |
| 🎓     | Explicación de lógica educativa        |
| ⚠️     | Advertencia o restricción de seguridad |
| 🔒     | Lógica de RLS o permisos               |
| 🤖     | Integración con IA                     |
| 🐛     | Workaround de bug conocido             |
| 💡     | Decisión de arquitectura no obvia      |

Cada emoji debe usarse solo cuando aplique, evitando ruido innecesario.

---

## 19.4 Criterio de Bloqueo
La ausencia, incorrecta aplicación o uso engañoso del estándar de comentarios en lógica crítica:

❌ invalida el ticket
❌ bloquea el cierre de fase
❌ requiere corrección antes de cualquier despliegue

El estándar de comentarios no es decorativo:
es parte integral del contrato técnico y pedagógico del sistema.

La ausencia de este estándar en lógica crítica **bloquea el cierre de tickets**.

---

## 20. FASES SUGERIDAS DE IMPLEMENTACIÓN (NO CONTRACTUAL)

Las fases descritas a continuación representan una **secuencia lógica sugerida** para la implementación del sistema, derivada de las dependencias funcionales y arquitectónicas definidas en esta especificación.

Estas fases:

* ✅ NO constituyen un plan de proyecto
* ✅ NO incluyen fechas ni duraciones comprometidas
* ✅ NO sustituyen la planeación operativa
* ✅ SÍ definen el orden lógico recomendado de desarrollo

La planeación detallada (tiempos, sprints, tareas, estimaciones) deberá documentarse en artefactos separados de planificación.

---

| Fase | Nombre                                                           | Dependencias |
| ---- | ---------------------------------------------------------------- | ------------ |
| 0    | Setup del sistema (repo, CI, Supabase, Vercel, lint, auth shell) | —            |
| 1    | Autenticación y Usuarios (email, OAuth, roles, perfiles)         | F0           |
| 2    | Núcleo Académico (cursos, módulos, lecciones, recursos, player)  | F1           |
| 3    | Inscripción y Progresión (enrollments, prerrequisitos, rutas)    | F2           |
| 4    | Evaluaciones Académicas (builder, runner, grading seguro)        | F3           |
| 5    | Gamificación y Certificación (XP, niveles, badges, certificados) | F3 + F4      |
| 6    | Integración de IA (tutor socrático, resúmenes, quizzes)          | F4 + F5      |
| 7    | Notificaciones y Realtime                                        | F5           |
| 8    | PWA y Offline (install, cache, sync)                             | F2           |
| 9    | Administración y Moderación                                      | F7           |
| 10   | Calidad, Seguridad y Cierre                                      | F9           |

---

### Principio de Avance entre Fases

El avance entre fases requiere obligatoriamente:

* Cumplimiento de la especificación correspondiente
* Evidencia verificable de salida
* Validación técnica y de seguridad
* **Aprobación humana explícita**, conforme al Gobierno de Agentes

La omisión de cualquiera de estos puntos invalida el cierre de la fase.

---

## 21. CRITERIOS DE ACEPTACIÓN GLOBALES

Los criterios de aceptación globales definen las **condiciones mínimas obligatorias** que deben cumplirse para considerar **válida** cualquier fase, feature o release del sistema LMS.

Estos criterios son **constitucionales**, transversales a todo el proyecto y **no negociables**.  
El incumplimiento de cualquiera de ellos **bloquea el cierre de fases, tickets y despliegues**.

---

### 21.1 Cumplimiento Constitucional

* Respeto total y explícito a la **Constitución del Proyecto** (`lms_constitution.md`).
* Ante cualquier conflicto entre artefactos, **prevalece la Constitución**.
* Ninguna implementación puede contradecir principios constitucionales, aunque sea funcional.

---

### 21.2 Integridad Académica y Evaluaciones

* La IA **nunca responde directa ni indirectamente evaluaciones activas**.
* El **kill-switch de IA** durante evaluaciones activas debe:
  - estar implementado
  - ser verificable
  - no ser sobrescribible desde frontend.
* El **grading de evaluaciones** se ejecuta **siempre en servidor**.
* El campo `evaluation_options.is_correct`:
  - ❌ nunca se expone al cliente
  - ✅ está protegido mediante **RLS + RPC `security definer`**.

---

### 21.3 Seguridad y Control de Acceso

* Los roles y permisos:
  - se enforzan en **Edge Functions y RLS**
  - **nunca** dependen únicamente del frontend.
* Todas las credenciales secretas:
  - residen exclusivamente en variables de entorno
  - **sin prefijo `VITE_`**
  - nunca forman parte del bundle del navegador.
* La integración con APIs externas (ej. SharePoint, Azure):
  - ocurre solo en backend
  - nunca expone tokens al cliente.

---

### 21.4 Evidencia y Validación de Fases

* Ninguna fase puede cerrarse sin:
  - evidencia funcional verificable
  - artefactos revisables (código, SQL, tests)
  - validación técnica y de seguridad.
* La evidencia debe ser suficiente para:
  - reproducir el comportamiento
  - auditar decisiones críticas.
* La **aprobación humana explícita** es obligatoria para cerrar cualquier fase.

---

### 21.5 Calidad Técnica y Experiencia de Usuario

* La PWA debe cumplir:
  - **Lighthouse Performance ≥ 90**
  - **Lighthouse PWA = 100**
* Estas métricas se validan:
  - en cada Pull Request
  - mediante GitHub Actions
* El incumplimiento de métricas bloquea el merge.

---

### 21.6 Testing y Cobertura

* Testing unitario:
  - Cobertura mínima definida por el proyecto
  - Ejecutado con **Vitest**
* Testing End-to-End:
  - Mínimo **10 flujos críticos**
  - Ejecutados con **Playwright**
* Los flujos E2E deben cubrir:
  - inscripción
  - progreso
  - evaluaciones
  - gamificación
  - certificados
  - bloqueo por prerrequisitos.

---

### 21.7 Observabilidad y Trazabilidad

* Los logs y trazabilidad:
  - deben estar activos desde la **Fase 0**
  - centralizados (ej. Sentry)
* Todo error crítico debe:
  - ser rastreable
  - incluir contexto suficiente para diagnóstico.
* La ausencia de observabilidad se considera un fallo crítico.

---

### 21.8 Estándares de Código y Documentación

* El estándar de comentarios `🎓LMS:`:
  - debe aplicarse en **toda lógica crítica**
  - es obligatorio y auditable.
* La ausencia o uso incorrecto del estándar:
  - invalida el ticket
  - bloquea el cierre de fase.

---

### 21.9 Principio Final de Aceptación

Un feature **no se considera aceptado** solo porque “funciona”.

Para ser aceptado debe:
* cumplir la especificación
* respetar la Constitución
* ser seguro
* ser auditable
* estar validado por una persona responsable.

Este principio garantiza calidad, control y sostenibilidad del sistema.

---

## 22. DECLARACIÓN FINAL

Este documento:

* Constituye un **único archivo Markdown canónico**
* Está **subordinado a `lms_constitution.md`** como fuente de autoridad primaria
* Es **constitucionalmente válido** para la ejecución bajo Spec‑Driven Development
* Representa fielmente el estado actual del proyecto LMS en su versión 1.0

Este documento no sustituye la planeación operativa ni la ejecución técnica,
pero define el **marco de verdad, límites y principios** del sistema.

**El aprendizaje es un proceso humano.  
La plataforma es su andamio — no su sustituto.**

---