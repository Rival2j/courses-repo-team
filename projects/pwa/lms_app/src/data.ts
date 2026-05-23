import type { Course } from "./types";

export const courses: Course[] = [
  {
    id: "curso-1",
    title: "Fundamentos de Gestión del Aprendizaje",
    summary:
      "Explora el catálogo y las lecciones clave para trazar tu ruta educativa con progreso visible y módulos estructurados.",
    instructor: "Dra. Camila Rojas",
    difficulty: "Intermedio",
    modules: [
      {
        id: "modulo-1",
        title: "Introducción al LMS",
        description: "Aprende la estructura de cursos, lecciones y la navegación principal.",
        lessons: [
          {
            id: "leccion-1",
            title: "Cómo usar el catálogo",
            description: "Descubre cómo encontrar cursos, filtrarlos y comprender el progreso.",
            resources: [
              {
                id: "res-1",
                title: "Video introductorio",
                type: "video",
                source: "https://www.w3schools.com/html/mov_bbb.mp4",
                description: "Video de bienvenida que muestra el catálogo y sus estados de avance.",
              },
            ],
          },
          {
            id: "leccion-2",
            title: "Navegación por módulos y lecciones",
            description: "Aprende a moverte por la estructura jerárquica de tu curso.",
            resources: [
              {
                id: "res-2",
                title: "Documento de navegación",
                type: "document",
                source: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                description: "Guía PDF con las mejores prácticas de navegación accesible.",
              },
            ],
          },
        ],
      },
      {
        id: "modulo-2",
        title: "Progreso y estado de avance",
        description: "Comprende cómo se registra tu progreso y cómo se muestran los bloqueos.",
        lessons: [
          {
            id: "leccion-3",
            title: "Seguimiento de progreso",
            description: "Visualiza cómo se refleja tu avance y qué significa cada estado.",
            blockedBy: ["leccion-2"],
            resources: [
              {
                id: "res-3",
                title: "Demo interactiva",
                type: "iframe",
                source: "https://www.example.com",
                description: "Vista embebida de ejemplo para recursos externos o demostraciones.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "curso-2",
    title: "Evaluaciones y control de acceso seguro",
    summary:
      "Explora cómo las evaluaciones controladas y la restricción de IA se presentan en el frontend.",
    instructor: "Ing. Andrés Méndez",
    difficulty: "Avanzado",
    modules: [
      {
        id: "modulo-3",
        title: "Runner de evaluaciones",
        description: "Configura y controla el estado de un intento de evaluación activo.",
        lessons: [
          {
            id: "leccion-4",
            title: "Evaluación segura",
            description: "Comprende el flujo de evaluación donde la UI protege la integridad del proceso.",
            blockedBy: ["leccion-3"],
            resources: [
              {
                id: "res-4",
                title: "Material de evaluación",
                type: "document",
                source: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                description: "Documento de referencia para el flujo de evaluación segura.",
              },
            ],
          },
        ],
      },
    ],
  },
];
