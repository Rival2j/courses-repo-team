import type { Course, LearningPath } from "./types";

export const courses: Course[] = [
  {
    id: "curso-1",
    title: "Fundamentos de Gestión del Aprendizaje",
    summary:
      "Aprende a navegar el catálogo, buscar cursos y gestionar tu progreso en una experiencia educativa moderna.",
    instructor: "Dra. Camila Rojas",
    difficulty: "Intermedio",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    badge: "BESTSELLER",
    rating: 4.7,
    reviewCount: 2341,
    price: 1299,
    originalPrice: 2499,
    discountPercent: 48,
    durationHours: 12,
    lessonsCount: 24,
    language: "Español",
    category: "Desarrollo",
    level: "Intermedio",
    createdAt: 1710000000000,
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
    summary: "Construye evaluaciones confiables y aprende a proteger el flujo de acceso en entornos de formación en línea.",
    instructor: "Ing. Andrés Méndez",
    difficulty: "Avanzado",
    prerequisiteCourseIds: ["curso-1"],
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
    badge: "NUEVO",
    rating: 4.9,
    reviewCount: 1768,
    price: 1899,
    originalPrice: 2799,
    discountPercent: 32,
    durationHours: 18,
    lessonsCount: 28,
    language: "Español",
    category: "Seguridad",
    level: "Avanzado",
    createdAt: 1714000000000,
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
  {
    id: "curso-3",
    title: "Diseño de experiencias de usuario",
    summary: "Domina los fundamentos de UX con prácticas para diseñar interfaces limpias y accesibles.",
    instructor: "María López",
    difficulty: "Principiante",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviewCount: 1984,
    price: 0,
    durationHours: 8,
    lessonsCount: 14,
    language: "Español",
    category: "Diseño",
    level: "Principiante",
    createdAt: 1709000000000,
    modules: [
      {
        id: "modulo-4",
        title: "Principios de diseño UX",
        description: "Entiende cómo diseñar experiencias coherentes y usables para tus usuarios.",
        lessons: [
          {
            id: "leccion-5",
            title: "Entendiendo al usuario",
            description: "Aprende a detectar necesidades con técnicas de investigación.",
            resources: [
              {
                id: "res-5",
                title: "Guía de investigación",
                type: "document",
                source: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                description: "Documento con técnicas básicas para identificar al usuario.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "curso-4",
    title: "Marketing digital con IA",
    summary: "Aprende a usar datos y automatización para crear campañas de marketing más efectivas.",
    instructor: "Carlos Díaz",
    difficulty: "Intermedio",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    rating: 4.3,
    reviewCount: 1023,
    price: 1299,
    originalPrice: 2299,
    discountPercent: 44,
    durationHours: 20,
    lessonsCount: 32,
    language: "Inglés",
    category: "Marketing",
    level: "Intermedio",
    createdAt: 1712000000000,
    modules: [
      {
        id: "modulo-5",
        title: "Campañas inteligentes",
        description: "Despliega campañas usando datos, automatización y métricas reales.",
        lessons: [
          {
            id: "leccion-6",
            title: "Medición de resultados",
            description: "Aprende a interpretar los datos y optimizar tus estrategias.",
            resources: [
              {
                id: "res-6",
                title: "Dashboards de marketing",
                type: "document",
                source: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                description: "Plantilla para medir campañas con indicadores clave.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const learningPaths: LearningPath[] = [
  {
    id: "ruta-1",
    title: "Ruta de aprendizaje inicial",
    description:
      "Avanza desde los fundamentos del LMS hacia cursos clave de evaluación, diseño y marketing digital.",
    courseIds: ["curso-1", "curso-2", "curso-3", "curso-4"],
  },
];
