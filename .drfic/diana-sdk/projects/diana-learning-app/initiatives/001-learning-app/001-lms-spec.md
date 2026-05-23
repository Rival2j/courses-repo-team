---
project_id: diana-learning-app
alias: lms
initiative_id: 001-learning-app
spec_id: 001-lms-spec
action: generate
source_mode: input
primary_source: tempo/001-lms-spec.md
constitutional_source: .drfic/diana-sdk/projects/diana-learning-app/lms-constitution.md
change_source: .drfic/diana-sdk/projects/diana-learning-app/governance/change-requests/001-lms-ucc.md
initiative_meta: .drfic/diana-sdk/projects/diana-learning-app/initiatives/001-learning-app/meta.md
version: 1.0.0
status: draft
generated_at: 2026-05-20
---

# Especificacion Canonica: Plataforma Learning Management System (LMS) PWA Asistida por IA

**Iniciativa**: 001-learning-app
**Proyecto**: diana-learning-app
**Version**: 1.0
**Estado**: Draft
**Fuente**: Constitucion canonica + UCC 001-lms-ucc.md + meta de iniciativa + input tempo/001-lms-spec.md

## Objetivo

Definir la especificacion funcional canonica de la iniciativa 001-learning-app para construir y operar un LMS institucional tipo PWA, con progreso academico trazable, evaluaciones seguras, gamificacion verificable y tutor IA socratico bajo control humano explicito.

## Alcance Funcional

- RF-001: Gestionar cursos, modulos, lecciones y recursos de aprendizaje con trazabilidad de progreso.
- RF-002: Ejecutar evaluaciones con grading server-side, control de intentos y proteccion de respuestas correctas.
- RF-003: Habilitar prerrequisitos, rutas de aprendizaje, gamificacion y certificacion verificable.
- RF-004: Integrar un tutor IA socratico exclusivamente por servicios server-side con kill-switch en evaluaciones activas.
- RF-005: Operar como PWA instalable con soporte offline basico, notificaciones y gobierno institucional por roles.

## Alcance No Funcional

- RNF-001: Mantener RLS en todas las tablas desde el primer migration.
- RNF-002: No exponer secretos ni logica sensible al cliente.
- RNF-003: Asegurar trazabilidad, auditabilidad y evidencia verificable por fase.
- RNF-004: Cumplir accesibilidad minima WCAG 2.1 AA y objetivos de performance definidos en la spec.

## Restricciones

- La constitucion del proyecto prevalece sobre cualquier otro artefacto.
- La IA no puede evaluar, decidir progreso ni responder evaluaciones activas.
- El frontend no conoce la fuente de datos activa ni ejecuta logica sensible.
- Las integraciones externas se consumen exclusivamente desde backend o Edge Functions.

## Supuestos

- La iniciativa mantiene topologia `multi_team` con tres equipos registrados en meta.md.
- El borrador de tempo/001-lms-spec.md representa el alcance funcional aprobado y debe preservarse.
- No existe spec operativa previa en `specs/*/spec.md`, por lo que no hay divergencia operativa que reconciliar en esta generacion.

## Criterios de Exito

- Criterio 1: La spec resultante conserva y organiza el alcance completo del borrador sin perdida de contenido.
- Criterio 2: La spec refleja los principios constitucionales de seguridad, control humano, SDD e integridad academica.
- Criterio 3: La spec deja trazabilidad explicita a la constitucion, al UCC y al contexto de iniciativa.

## Trazabilidad

- Principios constitucionales reflejados: SDD como gobierno del codigo, IA subordinada, progreso auditable, seguridad por diseno, roles jerarquicos reforzados por RLS y server-side.
- UCC de origen: 001-lms-ucc.md.
- Meta de iniciativa incorporada: iniciativa 001-learning-app con topologia multi_team y 3 equipos esperados.
- Baseline operativo de backend incorporado: acceso MCP de Supabase por proyecto con schema `cursos` como destino por defecto para verificaciones y consultas de TEAM-03.
- Gaps detectados: no se encontro spec operativa en `specs/*/spec.md`; no bloquea la generacion.
- Decision tomada: generar spec canonica consolidada en modo normal usando constitucion + UCC + meta + input explicito.

## Documento Base Integrado y Ampliado

# PLATAFORMA LEARNING MANAGEMENT SYSTEM (LMS) PWA ASISTIDA POR IA

Framework: Spec-Driven Development (GitHub Copilot Spec-Kit)
Estado: Activa
Autoridad: Subordinada estrictamente a `lms-constitution.md`

* **Control de Cambios:** 001-lms-ucc.md
* **Ticket de Usuario:** 001-lms-tkt.md


Framework de ejecucion:
Spec-Driven Development (DIANA-SDK + Speckit)

## Relacion con Speckit

Esta especificacion es la **fuente canonica completa** del proyecto.

Para efectos de ejecucion automatica con Speckit:
- Se generara una **especificacion operativa derivada**
- Dicha especificacion debera incluir todos los temas aqui plasmados pero transformados de acuerdo al framework de Speckit unicamente:
  - User stories
  - Acceptance scenarios
  - Requisitos funcionales
- La especificacion operativa NO sustituye este documento
- La autoridad arquitectonica y constitucional permanece aqui

Speckit NO debe sobrescribir este archivo.

## Origen y Trazabilidad Canonica

Esta especificacion canonica se deriva de una necesidad de negocio
formalmente documentada y aprobada mediante los siguientes artefactos
organizacionales del proyecto **DIANA Learning Management System (LMS)**:

- Control de Cambios: **001-lms-ucc.md**
- Ticket de Usuario: **001-lms-tkt.md**
- Constitucion del Proyecto: **lms-constitution.md**

Relacion de autoridad:
- El Control de Cambios define la necesidad de negocio.
- El Ticket describe el problema desde la perspectiva del usuario.
- La Constitucion establece principios, limites, gobierno y restricciones no negociables.
- Esta especificacion convierte dichas fuentes en alcance funcional y tecnico verificable.

Nota de version:
Esta especificacion corresponde a la iniciativa canonica **001-learning-app**.
Cualquier regeneracion de este documento debe sobrescribir esta misma especificacion
y no generar una nueva version, ya que no existe cambio funcional aprobado distinto.

## Idioma de la Especificacion

Esta especificacion canonica se redacta en **espanol**,
en cumplimiento de la Constitucion del Proyecto.

Cualquier artefacto derivado de esta especificacion,
incluyendo planes tecnicos, contratos y documentacion generada
por herramientas SDD como Speckit,
DEBE mantenerse en espanol.

El uso de terminos tecnicos en ingles esta permitido
unicamente cuando sea necesario y no ambiguo.

---

## 0 AUTORIDAD CONSTITUCIONAL

Esta especificacion deriva directamente de la Constitucion del Proyecto (`lms-constitution.md`) y esta subordinada a ella como fuente de verdad primaria.

**Reglas no negociables heredadas de la Constitucion:**
- Modelo semi-automatico obligatorio
- La IA no ejecuta operaciones
- Control humano explicito en toda ejecucion

Ante cualquier conflicto, prevalece `lms-constitution.md`.

---

## 1 OBJETIVO GENERAL

Disenar, construir y operar una **Plataforma Web Educativa de Gestion y Seguimiento del Aprendizaje tipo LMS (Learning Management System)**, implementada como **Progressive Web App (PWA)**, orientada principalmente a instituciones educativas y organizaciones formativas, cuyo proposito central es **facilitar, estructurar y hacer trazable el proceso de aprendizaje humano**, garantizando control pedagogico, integridad academica y sostenibilidad operativa.

La plataforma tiene como objetivo:

* **Organizar el conocimiento de manera dinamica y no rigida**, permitiendo estructuras adaptables para la gestion de **cursos -> modulos -> lecciones**, alineadas a jerarquias institucionales configurables tales como areas, departamentos, carreras, especialidades o perfiles de puesto, sin depender de esquemas estaticos.

* **Habilitar a los instructores** para **crear, publicar, administrar y mantener** contenidos educativos propios, soportando multiples formatos y fuentes externas, incluyendo:
  - Video y audio
  - Documentos PDF
  - Archivos Office (PowerPoint, Word, Excel)
  - Enlaces URL a plataformas y proveedores de capacitacion externos (por ejemplo: SAP, Microsoft, Udemy, Platzi, edX, EDTeam, entre otros)
  - Notas y contenidos web provenientes de herramientas como Notion, Evernote u otros servicios equivalentes.

* **Garantizar que los alumnos progresen de forma controlada y completamente trazable**, respetando reglas explicitas de prerequisitos academicos definidos por el instructor o la institucion, evitando accesos prematuros o promociones automaticas no autorizadas.

* **Proteger la integridad academica de las evaluaciones**, asegurando que todo el proceso de calificacion (grading) se ejecute **exclusivamente del lado servidor**, sin exponer logica sensible, respuestas correctas ni decisiones evaluativas al cliente.

* **Reconocer formalmente los logros de aprendizaje**, mediante la **emision de certificados y diplomas digitales verificables publicamente**, cada uno con un codigo unico que permita su validacion externa sin comprometer datos privados.

* **Integrar un tutor pedagogico asistido por Inteligencia Artificial**, basado en **Google Gemini 2.5 Flash**, con un enfoque socratico de acompanamiento al aprendizaje, operando siempre a traves de servicios intermedios seguros, sin exponer claves, modelos ni logica de IA en el cliente.

* **Funcionar como una Progressive Web App instalable**, con diseno responsive, capaz de operar en **modo offline basico**, garantizando continuidad minima del aprendizaje incluso en condiciones de conectividad limitada.

* **Mantener un modelo operativo de bajo costo**, con una arquitectura optimizada para operar con **costo cercano a cero** en el escenario inicial de entre **50 y 100 usuarios activos**, sin comprometer seguridad, trazabilidad ni calidad educativa.

En todo momento, la plataforma se concibe como un **andamio tecnologico del aprendizaje humano**, cuyo rol es **organizar, acompanar y hacer visible el progreso**, sin sustituir la ensenanza, la evaluacion ni el criterio pedagogico de las personas.

---

## 2. FILOSOFIA DEL SISTEMA

La plataforma se rige por una filosofia explicita que prioriza el **aprendizaje humano, la integridad academica y la claridad arquitectonica**, sirviendo como base para todas las decisiones de diseno, implementacion y operacion.
Esta filosofia es **normativa**: ninguna feature, flujo o automatizacion puede contradecirla.

---

### 2.1 Modelo Centrado en el Aprendizaje Humano

El sistema adopta un modelo pedagogico en el que la tecnologia **acompana, estructura y hace visible el aprendizaje**, sin sustituir el criterio academico ni la responsabilidad humana.

Principios fundamentales:

* El **alumno controla su ritmo de estudio**, pero su progresion academica esta **estrictamente condicionada** por los prerequisitos definidos por el instructor o la institucion.
* El **instructor es la autoridad pedagogica**: define el contenido, los criterios de evaluacion y las reglas de progresion; el sistema se limita a **organizar, rastrear y hacer trazable** dicho proceso.
* **No existe promocion automatica** sin haber superado explicitamente las evaluaciones configuradas.
* **No existe acceso a contenido bloqueado** sin cumplir previamente los prerequisitos academicos establecidos.
* La **evaluacion es un acto academico**, no tecnico:
  - La logica de calificacion nunca se delega al cliente.
  - La decision evaluativa no puede ser alterada por automatismos no auditables.
* La Inteligencia Artificial **nunca reemplaza la evaluacion humana**, ni proporciona respuestas directas o implicitas a examenes o evaluaciones activas.
* La plataforma se concibe como un **andamio del aprendizaje**: sostiene, ordena y acompana el proceso educativo, pero **no lo sustituye ni lo acelera artificialmente**.

Este modelo garantiza que el aprendizaje siga siendo **intencional, verificable y significativo**, incluso cuando se apoya en automatizacion o IA.

---

### 2.2 Arquitectura por Features Desacopladas (Vertical Slice)

La arquitectura del sistema refleja directamente su filosofia pedagogica mediante un enfoque de **features desacopladas**, tambien conocido como **Vertical Slice Architecture**.

Cada feature del sistema:

* Representa un **dominio funcional completo**, incluyendo sus propios:
  - componentes de UI
  - hooks
  - servicios
  - estado (store)
  - contratos de API
  - tipos y validaciones
* Es **funcional y tecnicamente desacoplada** del resto del sistema.
* Puede **desarrollarse, probarse, versionarse y desplegarse** de forma relativamente independiente.
* Mantiene limites claros de responsabilidad, evitando logica transversal implicita o dependencias ocultas.

Este enfoque:
* Reduce el acoplamiento entre dominios academicos, tecnicos y administrativos.
* Facilita la evolucion progresiva del sistema sin romper el core educativo.
* Permite que agentes SDD trabajen con alto grado de autonomia y trazabilidad.

**Features constitucionales del sistema:**

| Feature         | Responsabilidad                                                     |
| --------------- | ------------------------------------------------------------------- |
| `auth`          | Autenticacion y gestion de sesion (email/password + Google OAuth)   |
| `courses`       | Catalogo, creacion y gestion de cursos                              |
| `lessons`       | Reproductor de lecciones con tracking de progreso                   |
| `evaluations`   | Builder y runner de evaluaciones con grading seguro                 |
| `gamification`  | XP, niveles, badges, trofeos, certificados y leaderboards           |
| `ai-chat`       | Tutor socratico con streaming SSE (proxy via Edge Function)         |
| `admin`         | Panel de administracion con alcance por unidad organizativa         |
| `super-admin`   | Configuracion global: branding, planes y gestion de administradores |
| `moderation`    | Cola de revision y moderacion de contenido                          |
| `profile`       | Perfil del usuario, avatar y estadisticas personales                |
| `notifications` | Sistema de notificaciones en tiempo real                            |

Ninguna feature puede asumir responsabilidades que correspondan a otra sin una justificacion explicita y documentada en la especificacion.

---

### 2.3 Rol de la Inteligencia Artificial

La Inteligencia Artificial, basada en **Google Gemini 2.5 Flash**, ocupa un rol **claramente delimitado y subordinado** dentro del sistema.

Principios rectores:

* Es un **feature adicional de apoyo pedagogico**, nunca el nucleo del LMS.
* Actua como **tutor socratico**, guiando al alumno mediante preguntas, reformulaciones y sugerencias, sin entregar respuestas cerradas.
* Puede generar contenidos auxiliares como quizzes de practica, resumenes o recomendaciones de estudio.
* Todas las interacciones con IA se realizan **exclusivamente a traves de Edge Functions**, con:
  - JWT verificado
  - control de contexto
  - rate limiting
* Nunca responde directa ni indirectamente a una **evaluacion activa**.
* Nunca es invocada directamente desde el cliente.
* Su API key o credenciales **jamas** forman parte del bundle del navegador.
* No reemplaza logica deterministica critica como:
  - grading
  - control de prerequisitos
  - progreso academico
  - emision de certificados

El **kill-switch de IA durante intentos de evaluacion activos** es un principio constitucional **no negociable**, y su violacion invalida cualquier implementacion.

La IA es una **herramienta pedagogica contextual**, no una autoridad academica ni un decisor del sistema.

---

## 3. ALCANCE FUNCIONAL (VERSION 1.0)

El alcance funcional de la version 1.0 define el **conjunto completo de capacidades minimas viables** para operar una plataforma LMS moderna, inspirada en el funcionamiento de plataformas como **Udemy y Platzi**, pero adaptada a un contexto institucional, con mayor control academico, trazabilidad y gobierno del aprendizaje.

---

### 3.1 Funcionalidades Incluidas

#### 3.1.1 Gestion Academica de Contenidos

* Gestion completa de **cursos, modulos y lecciones**, con una experiencia de navegacion y consumo similar a plataformas tipo Udemy/Platzi:
  - Catalogo de cursos con vista resumida
  - Pagina de detalle del curso con estructura jerarquica expandible
  - Player centralizado con listado lateral de lecciones
* Organizacion dinamica del contenido, permitiendo:
  - Estructuras no rigidas
  - Reordenamiento de modulos y lecciones
  - Activacion/desactivacion de contenido sin eliminarlo

#### 3.1.2 Tipos de Contenido Soportados

* Soporte para contenidos **externos embebidos**, priorizando costo cero y escalabilidad:
  - `video`: YouTube, Vimeo
  - `pdf`: Google Drive, Supabase Storage (solo cuando sea privado)
  - `pptx`: Google Slides, OneDrive / SharePoint
  - `web_note`: URLs publicas (Notion, Evernote, sitios educativos, documentacion tecnica)
* El sistema detecta automaticamente el proveedor y renderiza el visor adecuado.
* El progreso del alumno se registra de forma consistente independientemente del proveedor.

#### 3.1.3 Roles y Gobierno Institucional

* Sistema de **cinco roles jerarquicos**, con permisos claros y trazables:
  - super_admin
  - admin
  - instructor
  - moderador
  - alumno
* Jerarquia institucional basada en **unidades organizativas**, permitiendo control por:
  - areas
  - departamentos
  - carreras
  - especialidades
* El alcance de administracion puede limitarse explicitamente por unidad organizativa.

#### 3.1.4 Evaluaciones Academicas

* Sistema completo de evaluaciones con experiencia similar a plataformas modernas:
  - Builder de evaluaciones
  - Runner controlado por intentos
  - Temporizador opcional
* **Grading seguro exclusivamente del lado servidor**, sin exposicion de logica sensible.
* Control de intentos, aprobacion/reprobacion y bloqueo de progresion.
* Las evaluaciones gobiernan el avance academico y la habilitacion de contenido posterior.

#### 3.1.5 Gamificacion y Motivacion

* Sistema integral de gamificacion alineado al progreso real del aprendizaje:
  - XP acumulable
  - 30 niveles progresivos
  - 24 badges
  - 7 trofeos especiales
* Leaderboards configurables (globales o por unidad organizativa).
* Emision de:
  - **Certificados PDF verificables publicamente**
  - **Diplomas** asociados a rutas de aprendizaje completas

#### 3.1.6 Prerequisitos y Rutas de Aprendizaje

* Definicion de prerequisitos entre cursos, con:
  - Validacion automatica
  - Deteccion de ciclos
* Rutas de aprendizaje:
  - Secuenciales (tipo carrera o programa)
  - Paralelas (tipo especializacion)
* El sistema impide inscripcion o avance cuando no se cumplen los prerequisitos definidos.

#### 3.1.7 Tutor IA Socratico

* Integracion de un **tutor IA socratico**, con experiencia similar a un asistente educativo contextual:
  - Streaming en tiempo real (SSE)
  - Historial de conversacion por usuario
* Funciones permitidas:
  - Aclaracion conceptual
  - Generacion de quizzes de practica
  - Resumenes de lecciones
* Funciones explicitamente bloqueadas:
  - Responder evaluaciones activas
  - Alterar decisiones academicas
* **Kill-switch obligatorio** durante intentos de evaluacion activos.

#### 3.1.8 Notificaciones y Feedback

* Sistema de notificaciones en tiempo real mediante Supabase Realtime:
  - Progreso
  - Logros
  - Resultados de evaluaciones
  - Mensajes del sistema
* Indicadores visuales tipo “bell badge” similares a plataformas de e-learning modernas.

#### 3.1.9 Progressive Web App (PWA)

* Aplicacion **instalable** con experiencia similar a una app nativa:
  - Responsive en desktop, tablet y mobile
* Soporte **offline basico**, incluyendo:
  - Shell de la aplicacion
  - Catalogo de cursos
  - Metadatos de lecciones visitadas
* Sincronizacion automatica al recuperar conectividad.

#### 3.1.10 Moderacion y Verificacion Publica

* Panel de moderacion con:
  - Cola de contenido reportado (flags)
  - Revision por rol moderador
* Verificacion publica de certificados mediante endpoint:
  - `/certificates/:code`
  - Sin exposicion de informacion privada

---

### 3.2 Funcionalidades Excluidas (Diferidas a Versiones Futuras)

Las siguientes capacidades **no forman parte del alcance de la version 1.0** y se consideran explicitamente fuera de scope inicial:

* Auto-inscripcion con pago y pasarela de pagos - **v2**
* Integracion SSO / SAML institucional - **venta institucional**
* Videoconferencia integrada (Zoom / Google Meet embed) - **v2**
* Auto-grading de respuestas abiertas mediante IA - **v2**
* Foro o comunidad social entre alumnos - **v2**
* Aplicacion movil nativa - la **PWA cubre el caso inicial**
* Arquitectura multi-tenant (multiples instituciones por deployment) - **v3**

Estas exclusiones permiten mantener el foco en la calidad, seguridad y trazabilidad del nucleo educativo.

#### 3.3 Gestion de Recursos de Aprendizaje (CRUD)

El sistema incluye un **CRUD completo de recursos de aprendizaje**, configurable por instructores dentro de cada curso, modulo y leccion.

Un **recurso de aprendizaje** representa cualquier material necesario para completar una leccion, y puede corresponder a uno o mas elementos, tales como:

* Videos externos (YouTube, Vimeo, Microsoft Stream, etc.)
* Documentos (PDF, Word, Excel, PowerPoint)
* Enlaces a tutoriales externos (Microsoft, SAP, Udemy, Platzi, edX, documentacion tecnica)
* Notas web (Notion, Evernote u otras plataformas equivalentes)
* Cualquier URL publica accesible mediante navegador

Caracteristicas del sistema de recursos:

* Cada leccion puede contener **uno o multiples recursos**, en **orden secuencial configurable**.
* Los recursos pueden ser de **formatos mixtos** dentro de la misma leccion.
* El instructor puede:
  - Crear recursos
  - Editarlos
  - Reordenarlos
  - Activarlos o desactivarlos sin eliminarlos
* Los recursos se visualizan **dentro de la plataforma**, mediante visores embebidos.
* El progreso del alumno se registra a nivel de leccion, independientemente del origen del recurso.

Este modelo permite construir experiencias de aprendizaje ricas, modulares y extensibles, alineadas a plataformas LMS modernas.


#### 3.4 Configuracion Dinamica de Gamificacion y Certificacion

El sistema incluye funcionalidades administrativas para la **configuracion dinamica y mantenible** de todos los elementos de gamificacion y certificacion, evitando valores fijos o hardcodeados.

Las capacidades incluidas son:

##### 3.4.1 Configuracion de XP y Bonus

* CRUD de reglas de XP y bonus.
* Definicion de:
  - acciones que generan XP
  - valores base y bonus
  - limites diarios
* Soporte para:
  - configuracion global por defecto
  - sobrescritura por curso

##### 3.4.2 Configuracion de Niveles de Usuario

* CRUD de niveles de usuario.
* Cada nivel es configurable en:
  - nombre
  - rango de XP
  - orden jerarquico
* La plataforma incluye niveles estandar por defecto, los cuales pueden:
  - modificarse
  - renombrarse
  - ampliarse
  - reducirse

##### 3.4.3 Configuracion de Badges e Insignias

* CRUD completo de badges.
* Definicion de:
  - condiciones de otorgamiento
  - asociacion a cursos o rutas
* Posibilidad de:
  - activar/desactivar badges
  - usar reglas globales o por curso

##### 3.4.4 Configuracion de Trofeos

* CRUD de trofeos de alto nivel.
* Asociacion a:
  - rankings
  - periodos
  - logros acumulativos
  - rutas de aprendizaje
* Reglas estrictas de otorgamiento, siempre evaluadas en backend.

##### 3.4.5 Configuracion de Plantillas de Certificados y Diplomas

* CRUD de plantillas de certificados y diplomas.
* Las plantillas son configurables por roles administrativos (ej. Recursos Humanos, Desarrollo Organizacional).
* Cada plantilla define:
  - diseno
  - textos
  - firmantes
  - idioma
  - tipo de logro
* Las plantillas pueden:
  - definirse globalmente
  - sobrescribirse por unidad organizativa o programa
* La emision siempre utiliza la plantilla vigente al momento de la generacion.

---

## 4. ARQUITECTURA GENERAL

La plataforma adopta una **arquitectura desacoplada por capas**, orientada a soportar **multiples fuentes de datos intercambiables**, manteniendo un contrato unico y estable para el frontend.

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
├── Zustand (client state: sesion, UI flags, progreso offline)
├── React Hook Form + Zod (formularios y validacion)
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
│     └── Edge Functions (Deno) ← API keys secretas aqui
│           ├── ai-chat (Gemini SSE, rate limit, kill-switch)
│           ├── submit-evaluation (grading server-side)
│           ├── issue-certificate (PDF gen + verificacion)
│           ├── update-user-role (unico camino de mutacion de roles)
│           ├── check-achievements (XP, badges, trofeos)
│           └── enroll-course (prerequisitos + inscripcion)
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

* La aplicacion debe poder operar **con una unica fuente de datos activa por sesion**:
  - Supabase (modo nativo LMS)
  - APIs externas (ej. Microsoft SharePoint)
* La **fuente de datos se define antes de ingresar a la aplicacion**, mediante:
  - Variable de entorno
  - Configuracion institucional
  - Flag persistido por tenant / institucion
* El frontend **no conoce ni diferencia** la fuente de datos activa.

---

### 4.3 Capa de Adaptadores de Datos (Data Source Adapter)

Cada adaptador:

* Implementa **el mismo contrato de dominio**
* Transforma la respuesta externa a la **estructura canonica del LMS**
* Aisla diferencias de:
  - Esquema
  - Tipos de datos
  - Naming
  - Identificadores
  - Paginacion

Ejemplo conceptual:

```
CourseDTO (canonico)
├── id
├── title
├── description
├── modules[]
└── metadata
```

* `SupabaseAdapter.getCourses()` -> CourseDTO[]
* `SharePointAdapter.getCourses()` -> CourseDTO[]

El frontend **consume siempre CourseDTO**, sin excepciones.

---

### 4.4 Rol de Supabase Edge Functions

Las **Edge Functions** se reservan exclusivamente para logica **sensitiva o constitucional**:

* Grading de evaluaciones
* Emision de certificados
* Integracion con IA (Gemini)
* Mutacion de roles
* Calculo de logros

Nunca se usan para logica de presentacion ni consultas genericas.

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

## 5. STACK TECNOLOGICO OBLIGATORIO

### 5.1 Frontend - PWA

| Tecnologia                | Rol                                      |
| ------------------------- | ---------------------------------------- |
| Vite                      | Bundler y entorno de desarrollo          |
| React 18+                 | Framework de UI                          |
| TypeScript                | Lenguaje principal                       |
| shadcn/ui + Radix UI      | Componentes accesibles tipo Udemy/Platzi |
| Tailwind CSS              | Sistema de estilos                       |
| TanStack Query v5         | Server state (API Gateway)               |
| Zustand                   | Estado cliente (sesion, flags, offline)  |
| React Hook Form + Zod     | Formularios y validacion                 |
| React Router v6+          | Routing con guards                       |
| vite-plugin-pwa + Workbox | PWA y offline                            |
| i18next                   | Internacionalizacion                     |
| pnpm                      | Package manager                          |

---

### 5.2 Backend - API Gateway LMS

| Tecnologia    | Rol                         |
| ------------- | --------------------------- |
| Node.js LTS   | Runtime                     |
| Express.js    | Framework REST              |
| Zod           | Validacion de contratos API |
| Axios / Fetch | Consumo de APIs externas    |
| JWT           | Autenticacion entre capas   |
| dotenv        | Configuracion de entorno    |

---

### 5.3 Plataforma de Datos Principal

| Tecnologia              | Rol                                 |
| ----------------------- | ----------------------------------- |
| Supabase                | PostgreSQL, Auth, Realtime, Storage |
| PostgreSQL              | Modelo de datos LMS                 |
| Supabase Edge Functions | Logica sensible                     |
| @google/genai           | IA (solo Edge Functions)            |
| Resend + React Email    | Emails transaccionales              |

---

### 5.4 Integraciones Externas

| Plataforma           | Uso                                              |
| -------------------- | ------------------------------------------------ |
| Microsoft SharePoint | Fuente alternativa de cursos y contenidos        |
| Microsoft Graph API  | Acceso autenticado a base de datos en SharePoint |

### 5.5 Infraestructura

| Tecnologia             | Rol                                                 |
| ---------------------- | --------------------------------------------------- |
| **Vercel Pro**         | Hosting (Hobby prohibe uso comercial por ToS)       |
| **GitHub Actions**     | CI: lint + typecheck + test + Lighthouse en cada PR |
| **Sentry** (free tier) | Error tracking y tracing                            |

---

## 6. MODELO DE DATOS - RESUMEN EJECUTIVO

El modelo de datos canonico del LMS se define **independientemente de la fuente fisica**, y representa la estructura que **todos los adaptadores deben respetar**.

### 6.1 Modelo Canonico LMS (Supabase)

**26 tablas en orden de dependencia:**

profiles -> organizational_units -> admin_scopes -> courses -> course_instructors -> modules -> lessons -> content_sources -> enrollments -> progress_tracking -> evaluations -> evaluation_questions -> evaluation_options -> evaluation_attempts -> badges -> user_badges -> trophies -> user_trophies -> certificates -> diplomas -> learning_paths -> learning_path_courses -> course_prerequisites -> notifications -> ai_conversations -> moderation_flags

---

### 6.2 Reglas de Datos No Negociables

* RLS activo desde el primer migration
* `evaluation_options.is_correct` nunca expuesto al cliente
* Roles como claims JWT firmados
* Indices optimizados para busqueda y notificaciones
* Realtime limitado a tablas criticas

---

### 6.3 Homologacion de Datos Externos

* Las fuentes externas (SharePoint) **no imponen su esquema al sistema**
* Cada adaptador debe:
  - Mapear campos externos -> modelo canonico
  - Resolver IDs externos -> IDs internos
  - Normalizar fechas, estados y relaciones
* El frontend y las features **operan solo sobre el modelo canonico**

Este principio garantiza portabilidad, mantenibilidad y escalabilidad.

### 6.4 Evolucion del Modelo de Datos

El modelo de datos definido en esta especificacion representa el **modelo canonico base del LMS**, valido para la version 1.0.

Este modelo:
* Puede **extenderse** mediante nuevas tablas o columnas.
* Puede **optimizarse** mediante indices, vistas o RPCs adicionales.
* No puede **romper contratos existentes** consumidos por el frontend.

Cualquier modificacion al modelo debe cumplir obligatoriamente:
* Mantener compatibilidad con el modelo canonico expuesto por la API.
* Respetar RLS y reglas de seguridad existentes.
* No introducir dependencias directas del frontend a la fuente fisica de datos.

La evolucion del modelo se considera una **extension controlada**, no un rediseno.

---

## 7. ROLES DE LOS ACTORES DEL SISTEMA

El sistema define **cinco roles jerarquicos** con jerarquia numerica explicita, aplicables tanto a **instituciones educativas** como a **organizaciones publicas o privadas**.

El **rol** determina los permisos funcionales dentro de la plataforma, mientras que el **contexto del usuario** (academico o corporativo) determina el proposito del aprendizaje, sin alterar el modelo de control ni la arquitectura del sistema.

---

### 7.1 Roles Definidos

| Rol           | Nivel | Responsabilidad                                                                                             |
| ------------- | ----- | ----------------------------------------------------------------------------------------------------------- |
| `super_admin` | 5     | Configura la plataforma a nivel global: branding, planes, politicas, permisos y gestion de administradores |
| `admin`       | 4     | Administra la plataforma con alcance limitado a una o varias unidades organizativas                         |
| `instructor`  | 3     | Crea, gestiona y mantiene cursos propios (owner) y colabora en cursos asignados                             |
| `moderador`   | 3     | Revisa contenido, gestiona reportes y marca flags; no puede editar cursos                                   |
| `alumno`      | 1     | Consume contenidos, progresa academicamente, presenta evaluaciones y participa en la gamificacion           |

---

### 7.2 Consideracion Especial del Rol `alumno`

El rol `alumno` representa al **usuario final del proceso de aprendizaje**, y puede corresponder indistintamente a:

* Un **estudiante** de una institucion educativa (escuela, universidad, centro de formacion).
* Un **empleado** de una organizacion publica o privada (capacitacion, induccion, certificacion interna).
* Un **participante** de programas de formacion continua o especializada.

Independientemente del contexto:

* El modelo de progresion, evaluacion y certificacion es el mismo.
* Las reglas de prerequisitos y trazabilidad academica no se alteran.
* El sistema no diferencia permisos por “tipo de alumno”, sino por **rol y unidad organizativa**.

Esto garantiza un modelo unificado, consistente y reutilizable en escenarios educativos y corporativos.

---

### 7.3 Jerarquia y Gobierno de Roles

La jerarquia numerica define de forma inequivoca los permisos y limites de accion dentro del sistema:

* Un rol con mayor nivel **puede administrar** roles de menor nivel, nunca iguales o superiores.
* La jerarquia es utilizada por:
  - RLS en base de datos
  - Edge Functions
  - Guards de frontend

---

### 7.4 Reglas Constitucionales de Roles (No Negociables)

* Solo el rol `super_admin` puede promover usuarios al rol `admin`.
* El Edge Function `update-user-role` es el **unico camino autorizado** para modificar roles.
* Ningun usuario puede autoasignarse un rol superior al propio.
* Las reglas de promocion y degradacion se hacen cumplir mediante:
  - Edge Functions
  - Politicas RLS
  - Claims JWT firmados
* Un `admin` **nunca** puede elevar a otro usuario al rol `super_admin`.
* Cada curso tiene exactamente:
  - **un `owner`** (instructor responsable)
  - **N `collaborators`**, definidos en `course_instructors`

Cualquier violacion a estas reglas invalida la implementacion desde el punto de vista constitucional del sistema.

---

### 7.5 Principio de Neutralidad de Dominio

El sistema es **neutral respecto al dominio** (educativo o corporativo):

* No existen roles especificos para “empresa” o “escuela”.
* La diferenciacion se logra mediante:
  - unidades organizativas
  - rutas de aprendizaje
  - cursos asignados
  - politicas institucionales

Este principio permite que la plataforma opere de forma consistente como:
* LMS escolar
* LMS corporativo
* Plataforma mixta de formacion continua

### 7.6 Permisos de Configuracion Academica y Gamificacion

La configuracion de reglas academicas, gamificacion y certificacion se gobierna por rol, garantizando control institucional y flexibilidad operativa.

#### Permisos por Rol

* **super_admin**
  - Define configuraciones globales por defecto del sistema:
    - reglas de XP y bonus
    - niveles de usuario
    - catalogo de badges y trofeos
    - plantillas base de certificados y diplomas
  - Puede habilitar o restringir que configuraciones son modificables por otros roles.

* **admin**
  - Puede:
    - ajustar configuraciones por unidad organizativa
    - definir plantillas de certificados y diplomas institucionales
    - administrar reglas de gamificacion aplicables a multiples cursos
  - No puede alterar reglas constitucionales del sistema.

* **instructor**
  - Puede **sobrescribir configuraciones por curso**, cuando el sistema lo permita:
    - valores de XP
    - bonus
    - badges y trofeos asociados al curso
  - No puede crear ni modificar plantillas institucionales globales de certificados.

* **moderador**
  - No tiene permisos de configuracion academica ni de gamificacion.

* **alumno**
  - No tiene permisos de configuracion.
  - Es unicamente receptor de las reglas vigentes.

En todos los casos, las configuraciones por curso **no afectan** la configuracion global ni otros cursos.

---

## 8. INTEGRACIONES DE CONTENIDO EXTERNO

La plataforma permite integrar, visualizar y dar seguimiento a **recursos de aprendizaje externos** directamente dentro de la experiencia del LMS, manteniendo una estructura jerarquica y trazable similar a plataformas como Udemy y Platzi.

Los recursos externos forman parte **estructural del contenido academico** y no son simples enlaces de salida.

---

### 8.1 Principios Generales

* Todo recurso externo:
  - Se **visualiza dentro de la plataforma** mediante un visor embebido.
  - Esta **asociado jerarquicamente** a un curso, modulo/tema y leccion.
  - Participa en el **seguimiento de progreso** del alumno.
* El sistema **no redirige al usuario fuera de la plataforma** salvo que el proveedor lo impida explicitamente.
* Un recurso externo es tratado como **contenido educativo de primera clase**, no como un link auxiliar.

---

### 8.2 Modelo Jerarquico de Recursos

El modelo de organizacion de contenido es el siguiente:
```
Curso
 └─ Modulo / Tema
     └─ Leccion
         └─ Recurso 1
         └─ Recurso 2
         └─ Recurso N
```

* Cada **leccion** puede contener **uno o multiples recursos**.
* Los recursos:
  - Pueden ser de **formatos mixtos**.
  - Tienen un **orden secuencial configurable**.
* El avance del alumno se registra a nivel de **leccion**, considerando el consumo de los recursos asociados.

---

### 8.3 CRUD de Recursos Externos (Configuracion Academica)

El sistema incluye un **CRUD especifico para recursos externos**, accesible para instructores y administradores autorizados.

Cada recurso configurable incluye, como minimo:

* Tipo de recurso (`video`, `document`, `web_note`, `external_tutorial`, etc.)
* URL del recurso
* Proveedor detectado automaticamente
* Orden dentro de la leccion
* Estado (activo / inactivo)
* Reglas minimas de consumo (tiempo, navegacion, visualizacion)

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
- Cualquier URL educativa valida

---

### 8.4 Proveedores de Contenido Soportados

| Proveedor                                        | Tipo                      | Visualizacion   | Seguimiento |
| ------------------------------------------------ | ------------------------- | --------------- | ----------- |
| **YouTube**                                      | Video                     | IFrame embebido | API oficial |
| **Vimeo**                                        | Video                     | IFrame embebido | SDK oficial |
| **Microsoft Stream**                             | Video                     | Embed           | Heuristica  |
| **Google Drive**                                 | PDF                       | Embed           | Heuristica  |
| **Google Slides**                                | Presentaciones            | Embed           | Navegacion  |
| **OneDrive / SharePoint**                        | Word / Excel / PPTX / PDF | Embed           | Navegacion  |
| **Notion** (`notion.site`)                       | Notas web                 | Embed           | Tiempo      |
| **Evernote**                                     | Notas web                 | Embed / Viewer  | Tiempo      |
| **SAP / Microsoft Learn / Udemy / Platzi / edX** | Tutoriales                | Web embebida    | Tiempo      |

---

### 8.5 Microsoft SharePoint y Azure como Repositorios

Microsoft SharePoint y servicios de Azure pueden operar como:

#### 8.5.1 Repositorio de Recursos Educativos

* Archivos Word, Excel, PowerPoint, PDF
* Videos institucionales
* Documentacion oficial

Los recursos se integran:
* Mediante URL compartida
* Visualizados dentro del LMS
* Asociados a cursos, modulos y lecciones
* Sujetos al mismo seguimiento de progreso

#### 8.5.2 Fuente de Datos Estructurada (Modo API)

Cuando SharePoint actua como sistema fuente:

* El acceso se realiza **exclusivamente desde el backend**
* Se utiliza Microsoft Graph API
* Los datos se transforman al **modelo canonico del LMS**
* El frontend no distingue el origen de los datos

---

### 8.6 Supabase Storage - Uso Restringido

Supabase Storage se utiliza **unicamente** para:

* Avatares
* Thumbnails
* Badges y trofeos
* Certificados y diplomas PDF
* Recursos privados no publicos

**Regla no negociable:**
Videos y documentos pesados **NUNCA** se almacenan en Supabase Storage.

---

### 8.7 Principio de Neutralidad de Contenido

* El LMS es **agnostico al proveedor de contenido**.
* La sustitucion o adicion de nuevos proveedores:
  - No requiere cambios en el frontend
  - Solo requiere un nuevo adaptador backend o visor
* El contenido externo siempre se gobierna desde el **modelo academico del LMS**, no desde el proveedor.

Este enfoque garantiza escalabilidad, bajo costo y control institucional.

---

## 9. PERSISTENCIA Y SEGURIDAD DE DATOS

La plataforma adopta un modelo de **defensa en profundidad**, donde la seguridad y la integridad de los datos se garantizan en **todas las capas del sistema**: base de datos, backend, Edge Functions y frontend.

La persistencia y el acceso a los datos se rigen por principios de **minimo privilegio, trazabilidad y control institucional**.

---

### 9.1 Fuentes de Datos y Persistencia

#### 9.1.1 Plataforma de Datos Principal

* **Supabase PostgreSQL**
  - Usuarios y perfiles
  - Unidades organizativas
  - Cursos, modulos, lecciones y recursos
  - Inscripciones y progreso
  - Evaluaciones y resultados
  - Gamificacion (XP, badges, trofeos)
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

Las respuestas externas se **transforman y homologan** al modelo canonico del LMS antes de ser expuestas al cliente.

---

### 9.2 Principios de Seguridad No Negociables

1. **Row Level Security (RLS)** activo en todas las tablas desde el primer migration.
   No existe ninguna tabla sin politicas explicitas.

2. **Separacion estricta de responsabilidades**:
   - El frontend nunca ejecuta logica sensible.
   - El backend orquesta acceso y contexto.
   - Las Edge Functions ejecutan logica critica.

3. El campo `evaluation_options.is_correct`:
   - Nunca es accesible via SELECT directo al cliente
   - Solo se utiliza dentro de la Edge Function `submit-evaluation` con `service_role`

4. **Credenciales y secretos**:
   - La API key de Gemini **nunca** forma parte del bundle del navegador
   - El `service_role` de Supabase **nunca** se expone al cliente
   - Todas las credenciales sensibles residen unicamente en:
     - variables de entorno del backend
     - variables de entorno de Edge Functions
     - sin prefijo `VITE_`

5. **Control de acceso por roles**:
   - La jerarquia de roles se hace cumplir mediante:
     - RLS en base de datos
     - Edge Functions
     - Claims JWT firmados
   - El frontend **nunca** es la unica barrera de control.

---

### 9.3 Seguridad en el Backend y API Gateway

* El API Gateway:
  - Valida JWT en cada request
  - Resuelve el contexto de usuario y rol
  - Aplica control de acceso por feature
* Las rutas del backend:
  - Nunca exponen directamente esquemas fisicos de la base de datos
  - Devuelven unicamente DTOs del modelo canonico
* Todas las integraciones externas (SharePoint, Azure, etc.):
  - Se autentican y autorizan exclusivamente en el backend
  - Nunca exponen tokens al cliente

---

### 9.4 Seguridad en Edge Functions

Las **Supabase Edge Functions** son el unico lugar autorizado para ejecutar logica altamente sensible, incluyendo:

* Calificacion de evaluaciones
* Emision de certificados y diplomas
* Mutacion de roles
* Integracion con IA (Gemini)
* Calculo de logros y gamificacion

Medidas obligatorias:

* Validacion de JWT en cada invocacion
* Rate limiting por usuario y por IP
* Logs estructurados para auditoria

---

### 9.5 Control de IA y Abuso

* Rate limit estandar:
  - **60 interacciones de IA por dia por usuario**
* **Kill-switch obligatorio**:
  - La IA se desactiva automaticamente durante intentos de evaluacion activos
* Toda interaccion con IA:
  - Es trazable
  - Esta asociada a un usuario autenticado
  - Puede ser auditada

---

### 9.6 Seguridad de Recursos y Contenidos

* **Content Security Policy (CSP)** estricta en produccion:
  - Solo dominios explicitamente permitidos:
    - YouTube
    - Vimeo
    - Google Drive / Slides
    - OneDrive / SharePoint
    - Notion
* Supabase Storage:
  - Acceso privado por defecto
  - Signed URLs con TTL corto (1h)
* No existe acceso publico permanente a recursos privados.

---

### 9.7 Certificados y Verificacion Publica

* Los certificados y diplomas:
  - Se emiten exclusivamente mediante Edge Function
  - Incluyen codigo unico verificable
* La verificacion publica se realiza via:
  - RPC `verify_certificate(code)`
* La verificacion:
  - Devuelve solo informacion publica minima
  - Nunca expone registros completos ni datos sensibles
  - Esta protegida por rate limiting

---

### 9.8 Respaldo, Recuperacion y Auditoria

* **Point-In-Time Recovery (PITR)** habilitado en Supabase Pro
* Backup nocturno automatico:
  - `pg_dump`
  - Almacenado en S3 / R2
  - Encriptado
* Logs de seguridad y errores:
  - Centralizados (Sentry)
  - Con correlacion por request y usuario

La perdida de datos o la falta de trazabilidad se considera un fallo critico del sistema.

### 9.9 Persistencia y Seguridad de Configuraciones Dinamicas

Las configuraciones academicas, de gamificacion y certificacion del sistema son **entidades persistentes de primera clase**, y se gestionan mediante estructuras de datos especificas protegidas por politicas de seguridad estrictas.

Esto incluye, sin limitarse a:

* Reglas de XP y bonus
* Definiciones de niveles de usuario
* Badges e insignias
* Trofeos
* Plantillas de certificados y diplomas
* Sobrescrituras de configuracion por curso o unidad organizativa

---

### 9.9.1 Principio de Configuracion Data-Driven

* Ninguna regla de gamificacion o certificacion esta hardcodeada en el frontend.
* Todas las reglas:
  - se almacenan en base de datos
  - se versionan implicitamente mediante timestamps
  - pueden activarse o desactivarse sin eliminacion fisica
* El frontend **solo consume configuraciones ya resueltas**, nunca reglas crudas.

---

### 9.9.2 Jerarquia de Configuracion y Resolucion

El sistema aplica las configuraciones siguiendo una jerarquia estricta:

1. **Configuracion por defecto del sistema**
2. **Configuracion por unidad organizativa** (cuando aplique)
3. **Configuracion especifica del curso** (override)

---

## 10. INTELIGENCIA ARTIFICIAL (TUTOR SOCRATICO)

La Inteligencia Artificial del sistema se implementa como un **tutor socratico asistido**, estrictamente subordinado a la autoridad academica humana y a las reglas constitucionales del LMS.

La IA **no constituye el nucleo del sistema**, sino un **feature complementario** de apoyo pedagogico, disenado para mejorar la comprension, la reflexion y la autonomia del aprendizaje.

---

### 10.1 Rol Constitucional de la IA (No Negociable)

La IA cumple exclusivamente los siguientes roles:

* Feature adicional de **apoyo pedagogico**, nunca el nucleo del sistema.
* **Confirmador contextual** de conceptos ya presentes en el contenido.
* Generador de **quizzes de practica**, resumenes y material de refuerzo.
* **Tutor socratico** que guia mediante preguntas y reformulacion, nunca mediante respuestas directas.
* Herramienta de acompanamiento al aprendizaje autonomo.

La IA **no puede** bajo ninguna circunstancia:

* Actuar como evaluador academico.
* Ejecutar o modificar decisiones academicas.
* Determinar aprobacion, reprobacion o progreso.
* Ser fuente unica de verdad academica.
* Responder directa o indirectamente evaluaciones activas.

Cualquier implementacion que viole estos principios se considera invalida.

---

### 10.2 Arquitectura de Integracion de IA

* El modelo de IA utilizado es **Google Gemini 2.5 Flash**.
* Toda interaccion con IA se realiza:
  - Exclusivamente desde **Supabase Edge Functions**
  - Nunca desde el cliente
  - Nunca directamente desde el API Gateway
* Las Edge Functions:
  - Validan JWT
  - Resuelven el contexto del usuario
  - Aplican control de permisos
  - Ejecutan rate limiting
  - Registran trazabilidad

La **API key de Gemini jamas** forma parte del bundle del navegador ni del frontend.

---

### 10.3 Capacidades Permitidas

La IA puede ejecutar unicamente las siguientes capacidades explicitas:

* **Chat socratico en tiempo real**, con streaming SSE:
  - Orientado a aclarar conceptos
  - Basado en el contenido del curso y recursos asociados
* **Generacion de quizzes de practica** a partir del contenido de una leccion:
  - Uso exclusivo para autoevaluacion
  - Nunca se consideran evaluaciones formales
* **Resumen de lecciones** con glosario de terminos clave:
  - Cacheado en base de datos
  - Reutilizable para multiples usuarios
* **Gestion de contexto conversacional**:
  - Historial por usuario
  - Rolling summary para control del context window

---

### 10.4 Contexto y Fuentes Permitidas para la IA

La IA solo puede utilizar como contexto:

* Contenido del curso, modulo y leccion activos
* Recursos externos configurados en la leccion (URLs, documentos, videos)
* Historial conversacional del usuario

La IA **no tiene acceso** a:

* Respuestas correctas de evaluaciones
* Datos personales sensibles
* Informacion de otros usuarios
* Datos fuera del contexto academico activo

---

### 10.5 Control de Uso, Abuso y Evaluaciones

* **Rate limiting estandar**:
  - 60 interacciones de IA por usuario por dia
* **Kill-switch obligatorio**:
  - La IA se desactiva automaticamente durante intentos de evaluacion activos
* El estado del kill-switch:
  - Se evalua en cada llamada
  - Se hace cumplir en Edge Function
  - No puede ser sobrescrito desde el frontend

---

### 10.6 Trazabilidad y Auditoria

* Toda interaccion con IA:
  - Esta asociada a un usuario autenticado
  - Se registra con timestamp, tipo de accion y feature
  - Puede ser auditada
* El historial de conversaciones:
  - Es persistido
  - Puede ser anonimizado si la institucion lo requiere
  - Cumple principios de minimo almacenamiento necesario

---

### 10.7 Ruteo por Tarea y Estimacion de Costos

Escenario estimado:
* 100 usuarios
* 20 interacciones promedio por dia
* 30 dias

| Tarea                       | Modelo                         | Costo estimado mensual |
| --------------------------- | ------------------------------ | ---------------------- |
| Chat tutor (80%)            | `gemini-2.5-flash`             | ~$76.80                |
| Generacion de quizzes (15%) | `gemini-2.5-flash-lite`        | ~$8.10                 |
| Resumenes (5%)              | `gemini-2.5-flash` (cacheable) | ~$12.75                |
| **Total estimado**          |                                | **~$97/mes**           |

El costo puede reducirse a **~$60-80/mes** mediante:
* Batch processing
* Context caching
* Reutilizacion de resumenes

---

### 10.8 Principio Final de Uso de IA

La Inteligencia Artificial **no ensena por si misma**.
La IA **no evalua**.
La IA **no decide**.

La IA **acompana**, **sugiere** y **estimula el pensamiento critico** dentro de un marco academico gobernado por personas.

Este principio es constitucional y no admite excepciones.

---

## 11. GAMIFICACION

El sistema de gamificacion tiene como objetivo **reforzar la motivacion, la constancia y la finalizacion efectiva del aprendizaje**, sin sustituir ni distorsionar el logro academico real.

La gamificacion **no es un sistema de puntos aislado**, sino una capa transversal alineada con:
* el progreso academico
* las evaluaciones
* las rutas de aprendizaje
* la emision de certificados y diplomas

Funciona de manera uniforme tanto para:
* estudiantes de instituciones educativas
* empleados de organizaciones publicas o privadas

---

### 11.1 Principios de Gamificacion (No Negociables)

* La gamificacion **nunca sustituye** evaluaciones academicas.
* No existe obtencion de XP sin una accion academica valida.
* Todo calculo de XP, niveles, badges y trofeos se realiza **del lado servidor**.
* El frontend **no puede** otorgar ni modificar logros.
* Se aplican limites y controles para evitar “farmear” recompensas.

---

### 11.2 Sistema de Experiencia (XP)

El sistema XP recompensa acciones reales de aprendizaje:

| Accion                  | XP         | Nota                                   |
| ----------------------- | ---------- | -------------------------------------- |
| Completar leccion       | 10         | `xp_override` configurable por leccion |
| Video visto >=95%       | +5 bonus   | Deteccion de visualizacion genuina     |
| Aprobar evaluacion      | 15-40      | Escala lineal segun score              |
| Primer intento aprobado | +10 bonus  | Incentiva estudio previo               |
| Completar curso         | 100        |                                        |
| Completar learning path | 500        | Incluye diploma                        |
| **Cap diario**          | **200 XP** | Previene abuso                         |

---

### 11.3 Niveles de Usuario

* Formula de progreso: **`XP requerida = N² × 100`**
* Total de **30 niveles**, desde:
  - Aprendiz (niveles 1-4)
  - Intermedio
  - Avanzado
  - Experto
  - **Leyenda (30+)**

Cada nivel puede desbloquear:
* Beneficios visuales (badges, insignias)
* Accesos funcionales (cuando la institucion lo defina)

---

### 11.4 Badges (Insignias)

El sistema incluye **24 badges**, agrupados en categorias:

* `progress` - avance constante
* `mastery` - dominio de contenido
* `habits` - constancia y habitos
* `social` - participacion (cuando aplique)
* `special` - logros excepcionales

Los badges:
* Se otorgan automaticamente por reglas del sistema.
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
* Se calculan unicamente en backend.
* Tienen alto valor simbolico y motivacional.

---

### 11.6 Certificados y Diplomas

* Los **certificados** acreditan la finalizacion de cursos individuales.
* Los **diplomas** acreditan la finalizacion de rutas completas.

Caracteristicas:

* Emision exclusivamente via **Edge Function `issue-certificate`**
* Generacion de PDF mediante `@react-pdf/renderer`
* Formato:
  - A4 horizontal
  - Codigo QR unico
  - Enlace de verificacion publica `/certificates/:code`
* Verificacion publica mediante:
  - RPC `verify_certificate(code)`
  - Devuelve solo campos publicos minimos
* Rate limit en verificacion:
  - **20 solicitudes por minuto por IP**

---

### 11.7 Trazabilidad y Auditoria de Logros

* Cada otorgamiento de:
  - XP
  - Badge
  - Trofeo
  - Certificado
* Queda registrado con:
  - usuario
  - evento academico
  - timestamp
  - fuente del evento

Esto permite:
* Auditoria institucional
* Revision de logros
* Cumplimiento en entornos publicos y corporativos

---

### 11.8 Principio Final de Gamificacion

La gamificacion **acompana el aprendizaje**,
**no lo reemplaza**.

Un usuario progresa porque **aprende**,
no porque acumula puntos sin significado academico.

### 11.9 Configuracion Dinamica de Gamificacion (CRUD)

El sistema de gamificacion es **totalmente configurable y mantenible**, y no contiene valores fijos o hardcodeados.

Todas las reglas de gamificacion se gestionan mediante **CRUDs administrativos**, permitiendo su adaptacion a distintos contextos academicos y corporativos.

---

### 11.9.1 Configuracion de XP y Bonus

El sistema incluye un **CRUD de reglas de XP**, que permite:

* Definir acciones que generan XP.
* Configurar:
  - XP base
  - XP bonus
  - limites diarios
* Activar o desactivar reglas sin eliminarlas.

Las reglas de XP pueden definirse en dos niveles:

* **Nivel sistema (default)** - aplicable a todos los cursos.
* **Nivel curso (override)** - permite que un instructor o admin:
  - ajuste valores
  - agregue bonus especificos
  - deshabilite reglas para un curso concreto.

---

### 11.9.2 Configuracion de Niveles de Usuario

Los **niveles de usuario no son fijos**.

El sistema provee un **CRUD de niveles**, que permite:

* Crear, editar o eliminar niveles.
* Definir:
  - nombre del nivel
  - rango de XP minimo y maximo
  - orden jerarquico
* Renombrar niveles segun el contexto institucional o corporativo.

Por defecto, el sistema incluye una configuracion estandar de 30 niveles, la cual puede ser modificada total o parcialmente.

---

### 11.9.3 Configuracion de Badges e Insignias

Los badges son **entidades configurables**, gestionadas mediante CRUD, que permiten:

* Crear nuevas insignias.
* Definir condiciones de otorgamiento.
* Asociar badges a:
  - acciones
  - cursos especificos
  - rutas de aprendizaje.
* Activar o desactivar badges sin afectar el historial.

Los badges pueden:
* Usar configuracion global por defecto.
* Tener reglas personalizadas por curso.

---

### 11.9.4 Configuracion de Trofeos

Los trofeos representan logros de alto nivel y tambien son **dinamicos**:

* CRUD de trofeos disponible para administradores.
* Definicion explicita de:
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

* Diseno visual
* Logos institucionales
* Texto legal
* Firmantes
* Idioma
* Tipo de logro (curso, ruta, certificacion interna)

Las plantillas:
* Se asocian por defecto al sistema.
* Pueden sobrescribirse por:
  - unidad organizativa
  - tipo de curso
  - programa formativo.

La emision de certificados siempre se realiza via Edge Function, utilizando la plantilla vigente al momento de la emision.

---

## 12. PRERREQUISITOS Y RUTAS DE APRENDIZAJE

El sistema incorpora un mecanismo formal de **control de prerrequisitos y rutas de aprendizaje**, disenado para garantizar progresion academica ordenada, trazable y coherente, tanto en contextos educativos como corporativos.

Las reglas de prerrequisitos y rutas aplican de igual forma para:
* estudiantes de instituciones educativas
* empleados de organizaciones publicas o privadas

---

### 12.1 Prerrequisitos Academicos entre Cursos

* Los cursos pueden definir **prerrequisitos explicitos** respecto a otros cursos.
* Antes de registrar cualquier prerrequisito:
  - Se ejecuta una **deteccion de ciclos** mediante **CTE recursiva en PostgreSQL**.
  - No se permite guardar configuraciones que generen dependencias circulares.
* Los prerrequisitos gobiernan:
  - inscripcion
  - acceso al contenido
  - progresion academica

---

### 12.2 Validacion de Inscripcion

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

Esta validacion:

- Se ejecuta siempre en backend.
- Es consumida por el frontend antes de renderizar el boton “Inscribirme”.

Cuando la inscripcion esta bloqueada:

- El boton se muestra deshabilitado.
- Se presenta un icono de bloqueo.
- Se informa al usuario que cursos faltan por completar.

Este comportamiento replica la experiencia de plataformas LMS modernas tipo Udemy/Platzi, con mayor control institucional.

---

### 12.3 Rutas de Aprendizaje (Learning Paths)

Una ruta de aprendizaje representa un conjunto estructurado de cursos orientados a:
- una carrera academica
- una especializacion
- un perfil de puesto
- un programa de capacitacion corporativa

Las rutas pueden configurarse como:
- secuenciales
- paralelas

En rutas secuenciales (is_sequential = true):
- Solo se desbloquea el siguiente curso pendiente con menor position.
- El usuario no puede saltar cursos.

---

### 12.4 Progresion, Desbloqueo y Automatismos

- El sistema monitorea el estado de inscripcion del usuario.
Cuando un curso cambia a status = 'completed':
  - Se evalua el desbloqueo de:
    - cursos dependientes
    - cursos dentro de rutas secuenciales
  - El desbloqueo siempre se calcula del lado servidor.
  - El frontend solo refleja el estado resultante.

---

### 12.5 Emision Automatica de Diplomas

Cuando un usuario completa todos los cursos de una ruta de aprendizaje:
- Se dispara un trigger sobre enrollments.
- El sistema encola la emision del diploma correspondiente.

La emision del diploma:
- Se realiza via Edge Function
- Usa la plantilla vigente configurada por la institucion
- Queda registrada para auditoria

---

### 12.6 Integracion con Gamificacion y Certificacion

La finalizacion de cursos y rutas:
- Otorga XP segun las reglas vigentes
- Puede desbloquear badges o trofeos
- Dispara la emision de certificados o diplomas

Todas estas acciones:
- Se calculan en backend
- Son trazables
- No pueden ser forzadas desde el frontend

---

### 12.7 Principio de Control Academico

No existe acceso a contenido sin cumplir prerrequisitos.
No existe inscripcion forzada que viole reglas academicas.
No existe desbloqueo manual sin registro y auditoria.

Las rutas de aprendizaje representan un contrato academico explicito, y su violacion invalida la coherencia del sistema.

---

## 13. REQUISITOS NO FUNCIONALES

Los Requisitos No Funcionales (NFR) definen los **atributos de calidad, restricciones y comportamientos globales** del sistema LMS.

Estos requisitos son **arquitectonicamente significativos** y de **cumplimiento obligatorio** para todas las features y fases del proyecto.

---

### 13.1 Rendimiento

* Tiempo de carga inicial (PWA instalada):
  - LCP <= 2.5 s
* Navegacion entre vistas criticas:
  - <= 500 ms en condiciones normales
* Submit de evaluaciones:
  - <= 800 ms server-side
* Streaming SSE de IA:
  - Primer token <= 1.5 s

---

### 13.2 Escalabilidad

* Soporte minimo garantizado:
  - 100 usuarios concurrentes (v1)
* Escalado sin rediseno:
  - hasta 1,000 usuarios concurrentes
* Realtime limitado a tablas criticas
* Proveedores externos desacoplados mediante adaptadores

---

### 13.3 Disponibilidad y Resiliencia

* Objetivo de disponibilidad:
  - 99.5% mensual
* Degradacion controlada:
  - Falla IA -> LMS sigue operando
  - Falla SharePoint -> aviso + retry
  - Falla Realtime -> fallback a polling

---

### 13.4 Seguridad

* RLS obligatorio en todas las tablas
* Secrets nunca en frontend
* Grading siempre server-side
* Integraciones externas solo desde backend
* CSP estricta en produccion

---

### 13.5 Observabilidad

* Logs estructurados en:
  - backend
  - Edge Functions
* Error tracking activo desde Fase 0

---

## 14. ACCESIBILIDAD Y USABILIDAD

La plataforma debe cumplir con principios de **accesibilidad universal**, especialmente en contextos educativos y del sector publico.

---

### 14.1 Estandar

* Cumplimiento minimo:
  - WCAG 2.1 nivel AA

---

### 14.2 Interaccion

* Navegacion completa por teclado
* Roles ARIA explicitos en componentes interactivos
* Foco visible y controlado

---

### 14.3 Contenido

* Contraste minimo 4.5:1
* Soporte de subtitulos cuando el proveedor externo lo permita
* Estados de progreso anunciables por lector de pantalla

---

### 14.4 Formularios y Evaluaciones

* Errores descriptivos y accesibles
* Validaciones no dependientes del color

---

## 15. MODELO DE ERRORES Y FALLAS CONTROLADAS

El sistema define un modelo explicito de manejo de errores para garantizar **resiliencia, claridad y continuidad operativa**.

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
* Nunca silenciar errores criticos
* Todo error critico:
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

### 16.2 Integracion

* RPCs criticos
* Edge Functions sensibles
* Resolucion de reglas dinamicas

---

### 16.3 End-to-End (Playwright)

Flujos minimos obligatorios:

1. Registro -> inscripcion -> leccion
2. Evaluacion -> grading -> XP
3. Certificado emitido y verificado
4. Kill-switch IA activo
5. Offline -> sync exitoso

---

### 16.4 Validacion Continua

* Tests obligatorios en cada PR
* Bloqueo de merge si fallan

---

## 17. MATRIZ DE RIESGOS

| Riesgo              | Impacto | Mitigacion               |
| ------------------- | ------- | ------------------------ |
| Abuso de IA         | Alto    | Rate limit + kill-switch |
| Error en RLS        | Critico | Testing + revision       |
| Dependencia externa | Medio   | Adaptadores              |
| Realtime saturado   | Medio   | Canales limitados        |
| Config maliciosa    | Alto    | Auditoria + RLS          |

Los riesgos se revisan en cada cierre de fase.

---

## 18. GLOSARIO CONSTITUCIONAL

* **Recurso:** Unidad de contenido asociada a una leccion.
* **Evaluacion activa:** Intento no finalizado.
* **Override:** Configuracion que sobrescribe el default.
* **Modelo canonico:** Estructura de datos interna estandar.
* **Kill-switch IA:** Bloqueo automatico de IA por contexto academico.
* **Ruta de aprendizaje:** Secuencia estructurada de cursos.

---

## 19. ESTANDAR DE COMENTARIOS DE CODIGO

Todo codigo generado dentro del proyecto LMS **DEBE cumplir obligatoriamente** con el siguiente estandar de comentarios, cuyo objetivo es garantizar:

* claridad pedagogica
* trazabilidad tecnica
* auditabilidad de decisiones
* cumplimiento de reglas de seguridad y arquitectura

Este estandar es **constitucional** y su incumplimiento **bloquea el cierre de tickets y fases**.

---

## 19.1 Formato Obligatorio

Todo bloque de logica relevante debe incluir comentarios bilingues (EN / ES) utilizando el prefijo `LMS` y emojis semanticos.

Ejemplo obligatorio:

```ts
// 🎓LMS: Saves lesson progress with debounce to avoid excessive DB writes (EN)
// 🎓LMS: Guarda el progreso de leccion con debounce para evitar escrituras excesivas (ES)
// 🔒LMS: RLS enforces user can only update their own progress_tracking rows (EN)
// 🔒LMS: RLS garantiza que el usuario solo actualiza sus propias filas de progress_tracking (ES)
export function useProgressStore() { ... }
```

---

## 19.2 Ambito de Aplicacion (Donde es Obligatorio)

El estandar de comentarios es obligatorio en:
Lógica de negocio
Logica educativa (progreso, evaluaciones, gamificacion)
Seguridad y control de acceso
Politicas RLS
RPCs y Edge Functions
Integraciones con IA
Resolucion de reglas dinamicas (XP, niveles, prerrequisitos, rutas)

En codigo puramente estructural o trivial (ej. exports simples), el uso es recomendado pero no obligatorio.

---

## 19.3 Diccionario de Emojis y Uso Semantico

| Emoji | Uso                                    |
| ----- | -------------------------------------- |
| 🎓     | Explicacion de logica educativa        |
| ⚠️     | Advertencia o restriccion de seguridad |
| 🔒     | Logica de RLS o permisos               |
| 🤖     | Integracion con IA                     |
| 🐛     | Workaround de bug conocido             |
| 💡     | Decision de arquitectura no obvia      |

Cada emoji debe usarse solo cuando aplique, evitando ruido innecesario.

---

## 19.4 Criterio de Bloqueo

La ausencia, incorrecta aplicacion o uso enganoso del estandar de comentarios en logica critica:

invalida el ticket
bloquea el cierre de fase
requiere correccion antes de cualquier despliegue

El estandar de comentarios no es decorativo:
es parte integral del contrato tecnico y pedagogico del sistema.

La ausencia de este estandar en logica critica **bloquea el cierre de tickets**.

---

## 20. FASES SUGERIDAS DE IMPLEMENTACION (NO CONTRACTUAL)

Las fases descritas a continuacion representan una **secuencia logica sugerida** para la implementacion del sistema, derivada de las dependencias funcionales y arquitectonicas definidas en esta especificacion.

Estas fases:

* NO constituyen un plan de proyecto
* NO incluyen fechas ni duraciones comprometidas
* NO sustituyen la planeacion operativa
* SI definen el orden logico recomendado de desarrollo

La planeacion detallada (tiempos, sprints, tareas, estimaciones) debera documentarse en artefactos separados de planificacion.

---

| Fase | Nombre                                                           | Dependencias |
| ---- | ---------------------------------------------------------------- | ------------ |
| 0    | Setup del sistema (repo, CI, Supabase, Vercel, lint, auth shell) | -            |
| 1    | Autenticacion y Usuarios (email, OAuth, roles, perfiles)         | F0           |
| 2    | Nucleo Academico (cursos, modulos, lecciones, recursos, player)  | F1           |
| 3    | Inscripcion y Progresion (enrollments, prerrequisitos, rutas)    | F2           |
| 4    | Evaluaciones Academicas (builder, runner, grading seguro)        | F3           |
| 5    | Gamificacion y Certificacion (XP, niveles, badges, certificados) | F3 + F4      |
| 6    | Integracion de IA (tutor socratico, resumenes, quizzes)          | F4 + F5      |
| 7    | Notificaciones y Realtime                                        | F5           |
| 8    | PWA y Offline (install, cache, sync)                             | F2           |
| 9    | Administracion y Moderacion                                      | F7           |
| 10   | Calidad, Seguridad y Cierre                                      | F9           |

---

### Principio de Avance entre Fases

El avance entre fases requiere obligatoriamente:

* Cumplimiento de la especificacion correspondiente
* Evidencia verificable de salida
* Validacion tecnica y de seguridad
* **Aprobacion humana explicita**, conforme al Gobierno de Agentes

La omision de cualquiera de estos puntos invalida el cierre de la fase.

---

## 21. CRITERIOS DE ACEPTACION GLOBALES

Los criterios de aceptacion globales definen las **condiciones minimas obligatorias** que deben cumplirse para considerar **valida** cualquier fase, feature o release del sistema LMS.

Estos criterios son **constitucionales**, transversales a todo el proyecto y **no negociables**.
El incumplimiento de cualquiera de ellos **bloquea el cierre de fases, tickets y despliegues**.

---

### 21.1 Cumplimiento Constitucional

* Respeto total y explicito a la **Constitucion del Proyecto** (`lms-constitution.md`).
* Ante cualquier conflicto entre artefactos, **prevalece la Constitucion**.
* Ninguna implementacion puede contradecir principios constitucionales, aunque sea funcional.

---

### 21.2 Integridad Academica y Evaluaciones

* La IA **nunca responde directa ni indirectamente evaluaciones activas**.
* El **kill-switch de IA** durante evaluaciones activas debe:
  - estar implementado
  - ser verificable
  - no ser sobrescribible desde frontend.
* El **grading de evaluaciones** se ejecuta **siempre en servidor**.
* El campo `evaluation_options.is_correct`:
  - nunca se expone al cliente
  - esta protegido mediante **RLS + RPC `security definer`**.

---

### 21.3 Seguridad y Control de Acceso

* Los roles y permisos:
  - se enforzan en **Edge Functions y RLS**
  - **nunca** dependen unicamente del frontend.
* Todas las credenciales secretas:
  - residen exclusivamente en variables de entorno
  - **sin prefijo `VITE_`**
  - nunca forman parte del bundle del navegador.
* La integracion con APIs externas (ej. SharePoint, Azure):
  - ocurre solo en backend
  - nunca expone tokens al cliente.

---

### 21.4 Evidencia y Validacion de Fases

* Ninguna fase puede cerrarse sin:
  - evidencia funcional verificable
  - artefactos revisables (codigo, SQL, tests)
  - validacion tecnica y de seguridad.
* La evidencia debe ser suficiente para:
  - reproducir el comportamiento
  - auditar decisiones criticas.
* La **aprobacion humana explicita** es obligatoria para cerrar cualquier fase.

---

### 21.5 Calidad Tecnica y Experiencia de Usuario

* La PWA debe cumplir:
  - **Lighthouse Performance >= 90**
  - **Lighthouse PWA = 100**
* Estas metricas se validan:
  - en cada Pull Request
  - mediante GitHub Actions
* El incumplimiento de metricas bloquea el merge.

---

### 21.6 Testing y Cobertura

* Testing unitario:
  - Cobertura minima definida por el proyecto
  - Ejecutado con **Vitest**
* Testing End-to-End:
  - Minimo **10 flujos criticos**
  - Ejecutados con **Playwright**
* Los flujos E2E deben cubrir:
  - inscripcion
  - progreso
  - evaluaciones
  - gamificacion
  - certificados
  - bloqueo por prerrequisitos.

---

### 21.7 Observabilidad y Trazabilidad

* Los logs y trazabilidad:
  - deben estar activos desde la **Fase 0**
  - centralizados (ej. Sentry)
* Todo error critico debe:
  - ser rastreable
  - incluir contexto suficiente para diagnostico.
* La ausencia de observabilidad se considera un fallo critico.

---

### 21.8 Estandares de Codigo y Documentacion

* El estandar de comentarios `🎓LMS:`:
  - debe aplicarse en **toda logica critica**
  - es obligatorio y auditable.
* La ausencia o uso incorrecto del estandar:
  - invalida el ticket
  - bloquea el cierre de fase.

---

### 21.9 Principio Final de Aceptacion

Un feature **no se considera aceptado** solo porque “funciona”.

Para ser aceptado debe:
* cumplir la especificacion
* respetar la Constitucion
* ser seguro
* ser auditable
* estar validado por una persona responsable.

Este principio garantiza calidad, control y sostenibilidad del sistema.

---

## 22. DECLARACION FINAL

Este documento:

* Constituye un **unico archivo Markdown canonico**
* Esta **subordinado a `lms-constitution.md`** como fuente de autoridad primaria
* Es **constitucionalmente valido** para la ejecucion bajo Spec-Driven Development
* Representa fielmente el estado actual del proyecto LMS en su version 1.0

Este documento no sustituye la planeacion operativa ni la ejecucion tecnica,
pero define el **marco de verdad, limites y principios** del sistema.

**El aprendizaje es un proceso humano.
La plataforma es su andamio - no su sustituto.**

---