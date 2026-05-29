# Tasks de Equipo
## TEAM-02 - Frontend / PWA

Identificador: 001-LMS-TASKS-TEAM-02
Proyecto: diana-learning-app
Iniciativa: 001-learning-app
Fuente canonica: ../../001-lms-tasks.md

## Autoridad

Este archivo deriva literalmente del backlog canonico global y contiene solo tareas del scope primario de TEAM-02.

## Tareas

### F0
- [x] T011 [P] [F0] [TEAM-02] Configurar workspace frontend con Vite, React, TypeScript, pnpm, Tailwind, shadcn/ui y Radix. TR: C-13, S-RF-005, P-7.
- [x] T012 [P] [F0] [TEAM-02] Integrar React Router, TanStack Query, Zustand, React Hook Form y Zod siguiendo boundaries por feature. TR: C-4, C-13, P-7.
- [x] T013 [P] [F0] [TEAM-02] Implementar App Shell PWA con estados globales `loading`, `error`, `empty` y `offline`. TR: S-RF-005, S-RNF-004, P-9.
- [x] T014 [P] [F0] [TEAM-02] Definir contratos de consumo frontend y mocks temporales desacoplados de la fuente fisica de datos. TR: C-3, S-RF-001, P-6.
- [x] T015 [P] [F0] [TEAM-02] Implementar flujo de autenticación frontend con `Login`, `Sign Up`, `Logout`, manejo de avatar genérico y estado de sesión persistente, preparado para backend/DB real. TR: S-RF-003, S-RF-005.

### F1
- [x] T111 [P] [F1] [TEAM-02] Implementar catalogo de cursos y pagina de detalle con experiencia tipo LMS moderna. TR: S-RF-001, P-8.
- [x] T112 [P] [F1] [TEAM-02] Construir navegacion jerarquica de modulos y lecciones con componentes accesibles y estados de progreso. TR: S-RF-001, S-RNF-004, P-8.
- [x] T113 [P] [F1] [TEAM-02] Implementar player de leccion con soporte para iframes, documentos y visores por tipo de recurso. TR: S-RF-001, P-8.
- [x] T114 [P] [F1] [TEAM-02] Integrar actualizacion visual de tracking, estados bloqueados y retroalimentacion de consumo de recursos. TR: S-RF-001, S-RNF-003.

### F2
- [x] T211 [P] [F2] [TEAM-02] Implementar experiencia de inscripcion, bloqueo por prerequisitos y mensajes explicativos para usuario final. TR: S-RF-003, S-RNF-004.
- [x] T212 [P] [F2] [TEAM-02] Construir vistas de rutas de aprendizaje con estados de desbloqueo, progreso y siguiente curso permitido. TR: S-RF-003.
- [x] T213 [P] [F2] [TEAM-02] Implementar grafo de dependencias de cursos como cadena dirigida con flechas y modelo de datos mapeable a relaciones de prerequisito en base de datos. TR: S-RF-003, P-8.

### F3
- [x] T311 [P] [F3] [TEAM-02] Implementar UI del runner de evaluacion con flujo controlado, temporizador opcional y restricciones de navegacion. TR: S-RF-002, S-RNF-004.
- [x] T312 [P] [F3] [TEAM-02] Implementar feedback post-evaluacion sin revelar respuestas correctas ni logica sensible. TR: C-5, S-RF-002.

### F4
- [x] T411 [P] [F4] [TEAM-02] Implementar vistas de perfil, logros, badges, leaderboards y certificados verificables. TR: S-RF-003, S-RNF-004.
- [x] T412 [P] [F4] [TEAM-02] Integrar feedback de XP, niveles, badges y trofeos sobre flujos del alumno. TR: S-RF-003.

	- AC-T411: UI muestra perfil con lista de logros y badges; leaderboard paginado; opción de descargar certificado con código verificable (hash/UUID).
	- AC-T412: XP visible en perfil, niveles calculados y mostrados; badges/trofeos con animación ligera y evento de emisión auditado.

### F5
- [x] T511 [P] [F5] [TEAM-02] Implementar interfaz de chat IA con estados de bloqueo, historial conversacional, sugerencias contextuales y experiencia visual dedicada. TR: S-RF-004, S-RNF-004.
- [x] T512 [P] [F5] [TEAM-02] Implementar feed de notificaciones funcional con bell badge, indicador rojo para no leidos y ausencia de alerta si no hay items. TR: S-RF-005, S-RNF-003.

### F6
- [ ] T611 [P] [F6] [TEAM-02] Integrar `vite-plugin-pwa`/Workbox, prompt de instalacion y placeholders offline. TR: S-RF-005, S-RNF-004.
- [ ] T612 [P] [F6] [TEAM-02] Implementar IndexedDB/background sync para acciones permitidas y restauracion del estado visual. TR: S-RF-005, P-9.

### F7
- [ ] T711 [P] [F7] [TEAM-02] Implementar UI administrativa para roles, configuraciones y moderacion de contenido. TR: S-RF-005, S-RNF-004.

### F8
- [ ] T811 [P] [F8] [TEAM-02] Corregir hallazgos de A11Y, UX, responsive y performance del frontend antes del cierre. TR: S-RNF-004, P-14.

## Estado

Backlog derivado generado para TEAM-02.
