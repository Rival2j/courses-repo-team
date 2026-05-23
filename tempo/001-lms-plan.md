# PLAN TÉCNICO CANÓNICO — LMS PWA ASISTIDA POR IA

Identificador: 001-LMS-PLAN
Proyecto: DIANA Learning Management System
Iniciativa: 001-learning-app
Estado: Activo
Autoridad: Subordinado a la Constitución y a la Spec Canónica

Framework de ejecución:
Spec‑Driven Development (DIANA‑SDK + Speckit)

---

## 1. AUTORIDAD Y JERARQUÍA DOCUMENTAL


Este plan técnico canónico está subordinado, en orden de precedencia, a:

1. `lms-constitution.md`
2. Especificación Canónica LMS (este proyecto)
3. Control de Cambios `001-lms-ucc.md`
4. Ticket de Usuario `001-lms-tkt.md`

Ante cualquier conflicto:
**prevalece la Constitución del Proyecto**.

Este plan:
* NO redefine alcance funcional
* NO introduce nuevos requisitos
* SÍ define cómo implementar técnicamente lo ya aprobado

---

## 2. OBJETIVO DEL PLAN

Definir el **cómo técnico, organizativo y operativo** para implementar el LMS descrito en la especificación canónica, habilitando:

* ejecución por equipos múltiples,
* trazabilidad SDD,
* generación posterior de artefactos Speckit,
* sin violar restricciones constitucionales.

Este plan convierte la especificación en un **camino de construcción real**.

---

## 3. MODELO DE EJECUCIÓN (SDD + SPECKIT)

El modelo de ejecución sigue estrictamente Spec‑Driven Development:

1. **Spec Canónica** → fuente de verdad
2. **Plan Técnico Canónico** → este documento
3. **Spec Operativa Derivada** (Speckit):
   - User Stories
   - Acceptance Scenarios
   - Requisitos Funcionales
4. **Tasks ejecutables**
5. **Evidencia verificable**
6. **Validación humana explícita**

Speckit **NO modifica la spec canónica**.  
Solo genera derivados operativos.

---

## 4. TOPOLOGÍA DE EQUIPOS Y RESPONSABILIDADES

### 4.1 Topología

* Modelo: `multi_team`
* Equipos esperados: 3

### 4.2 Equipos

#### TEAM‑01 — Frontend & UX (Goku)
Responsabilidad:
* PWA React
* UX tipo Udemy/Platzi
* Consumo de API Gateway
* Offline, caching, visores de contenido

#### TEAM‑02 — Backend & Datos (Krilin)
Responsabilidad:
* API Gateway (Node + Express)
* Adaptadores Supabase / SharePoint
* Edge Functions
* RLS, RPCs, seguridad

#### TEAM‑03 — Calidad, Seguridad y Validación (Bulma + Vegeta)
Responsabilidad:
* Testing (Vitest, Playwright)
* Lighthouse, A11Y
* Auditoría de RLS y Edge Functions
* NFR y hardening

⚠️ Hasta que TEAM‑02 y TEAM‑03 estén formalmente asignados,
se mantiene ownership provisional con handoff obligatorio.

---

## 5. ARQUITECTURA DE IMPLEMENTACIÓN

### 5.1 Principio rector

**El frontend no conoce la fuente de datos.**  
Consume únicamente contratos canónicos expuestos por el API Gateway.

### 5.2 Capas

1. **PWA**
2. **API Gateway**
3. **Adaptadores de fuente**
4. **Plataformas de datos**

### 5.3 Implicaciones prácticas

* CRUDs dinámicos → backend primero
* Resolución de reglas → server‑side
* IA → Edge Functions
* SharePoint → solo vía adaptador

---

## 6. DESGLOSE DE IMPLEMENTACIÓN POR DOMINIOS

### 6.1 Dominio Académico

Incluye:
* Cursos, módulos, lecciones
* CRUD de recursos externos
* Tracking de progreso

Dependencias:
* Auth
* Modelo canónico
* RLS base

---

### 6.2 Dominio de Evaluaciones

Incluye:
* Builder
* Runner
* Grading server‑side
* Control de intentos

Restricciones:
* `is_correct` jamás al cliente
* Kill‑switch IA obligatorio

---

### 6.3 Dominio de Gamificación (Dinámico)

Incluye:
* CRUD de XP y bonus
* CRUD de niveles
* CRUD de badges
* CRUD de trofeos
* Overrides por curso

Todo cálculo:
✅ backend / Edge Functions

---

### 6.4 Dominio de Certificación

Incluye:
* CRUD de plantillas
* Emisión PDF
* Verificación pública
* Versionado de plantillas

---

### 6.5 Dominio de IA

Incluye:
* Tutor socrático
* Resúmenes
* Quizzes de práctica

Restricciones:
* Sin evaluaciones
* Sin decisiones académicas
* Kill‑switch activo

---

### 6.6 Dominio de Administración y Gobierno

Incluye:
* Roles
* Unidades organizativas
* Moderación
* Configuraciones globales

---

## 7. ESTRATEGIA DE FASES (DERIVADA DE LA SPEC)

Las fases siguen el orden lógico aprobado en la especificación:

0. Fundamentos (repo, CI, auth, RLS)
1. Núcleo académico
2. Progresión y prerrequisitos
3. Evaluaciones
4. Gamificación y certificación
5. IA
6. Notificaciones
7. PWA / Offline
8. Administración
9. Calidad, NFR y cierre

⚠️ Las fases **no incluyen tiempos** en este documento.

---

## 8. ESTRATEGIA DE CALIDAD Y VALIDACIÓN

Cada fase requiere:

* Evidencia funcional
* Tests asociados
* Cumplimiento NFR
* Validación humana

Sin evidencia:
❌ no hay cierre de fase

---

## 9. RIESGOS OPERATIVOS CLAVE

| Riesgo                          | Mitigación                |
| ------------------------------- | ------------------------- |
| Complejidad de CRUDes dinámicos | Backend‑first + contratos |
| Abuso de IA                     | Rate limit + kill‑switch  |
| SharePoint inconsistente        | Adaptador canónico        |
| Errores RLS                     | Testing dedicado          |

---

## 10. INTEGRACIÓN CON SPECKIT

Flujo recomendado:

1. Confirmar este plan
2. Generar spec operativa por feature
3. Ejecutar `/speckit.plan`
4. Derivar `/tasks`
5. Ejecutar con control humano

---

## 11. ENTREGABLES DERIVADOS

Este plan habilita la generación de:

* `spec-operativa/*.md`
* `tasks/*.md`
* Backlog priorizado
* Checklists de calidad

---

## 12. ESTADO DEL PLAN

✅ Regenerado contra la **especificación final**
✅ Compatible con **Speckit**
✅ No introduce nuevos requisitos
✅ Listo para ejecución controlada

Este plan **no sustituye la planeación fina**,  
pero define **cómo se construye correctamente el sistema**.