/**
 * PWA Adapter Routes (Backend For Frontend - BFF)
 * 
 * Implements T910-T913: PWA-specific endpoints that transform LMS API data
 * into shapes expected by the PWA frontend (pwa_reference/types.ts).
 * 
 * Routes:
 * - T910-T911: GET /pwa/courses, GET /pwa/courses/:courseId, GET /pwa/courses/:courseId/related
 * - T911: GET /pwa/users/:userId/profile
 * 
 * Field Mapping: Maps cursos.* schema to PWA Course interface with defaults
 * for fields not yet in DB (image, badge, price, language, category, level).
 */

import { Router, type Response } from "express";
import { z } from "zod";
import { getDatabaseClient } from "../lib/database";
import { authenticateRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";

const pwaRouter = Router();
const database = getDatabaseClient();

pwaRouter.use(authenticateRequest);

const courseQuerySchema = z.object({
  category: z.string().optional(),
  level: z.string().optional(),
  sort: z.enum(["created_at", "rating", "title"]).optional(),
  limit: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().positive().optional()),
});

const courseIdParamsSchema = z.object({ courseId: z.string().uuid() });
const userIdParamsSchema = z.object({ userId: z.string().uuid() });

type CourseRow = {
  id: string;
  title: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
  rating_average: number | string | null;
  rating_count: number;
  display_name: string | null;
  lessons_count?: number;
};

function normalizeRatingAverage(value: number | string | null): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Number(parsed.toFixed(1)) : 0;
}

/**
 * Map course row to PWA-expected format (T911 adapter).
 * Handles fields that don't exist in DB by providing sensible defaults.
 */
function mapCourseRowToPwa(row: CourseRow, modulesData?: any[]) {
  return {
    id: row.id,
    title: row.title,
    summary: row.description || "",
    instructor: row.display_name || "Instructor",
    difficulty: "Intermedio", // Default: no difficulty field in DB yet
    prerequisiteCourseIds: [], // T222 will populate from prerequisites table
    image: null, // No image field in DB yet
    badge: undefined, // No badge field in DB yet
    rating: normalizeRatingAverage(row.rating_average),
    reviewCount: row.rating_count || 0,
    price: null, // No price field in DB yet
    originalPrice: undefined,
    discountPercent: undefined,
    durationHours: 4, // Default placeholder
    lessonsCount: row.lessons_count || 0,
    language: "Español", // Default
    category: "Desarrollo", // Default
    level: "Intermedio", // Default
    createdAt: new Date(row.created_at).getTime(),
    modules: modulesData || [],
  };
}

function mapModuleRow(
  row: { id: string; title: string; description?: string | null },
  lessons: any[],
) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    lessons,
  };
}

function mapLessonRow(row: { id: string; title: string; content?: any }) {
  const contentText =
    typeof row.content === "string"
      ? row.content
      : typeof row.content === "object" && row.content?.body
      ? row.content.body
      : "";

  return {
    id: row.id,
    title: row.title,
    description: contentText,
    resources: [], // T912 will populate from resources
    blockedBy: [], // T912 will populate from progress/prerequisites
  };
}

// T910-T913 adapter: Return list of courses shaped for the PWA
pwaRouter.get(
  "/pwa/courses",
  validate({ query: courseQuerySchema }),
  async (req, res) => {
    try {
      const q = req.query as z.infer<typeof courseQuerySchema>;
      const limit = Math.min(q.limit || 50, 100); // Cap at 100
      const offset = 0;

      // Base query to fetch courses with lesson count
      let query = database`
        SELECT
          c.id,
          c.slug,
          c.title,
          c.description,
          c.created_by,
          to_char(c.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
          c.rating_average,
          c.rating_count,
          p.display_name,
          COUNT(DISTINCT l.id) FILTER (WHERE l.id IS NOT NULL)::int as lessons_count
        FROM cursos.courses c
        LEFT JOIN cursos.profiles p ON p.id = c.created_by
        LEFT JOIN cursos.modules m ON m.course_id = c.id
        LEFT JOIN cursos.lessons l ON l.module_id = m.id
        GROUP BY c.id, c.slug, c.title, c.description, c.created_by, c.created_at, c.rating_average, c.rating_count, p.display_name
        ORDER BY c.created_at DESC
        LIMIT ${limit}
      `;

      const rows = (await query) as CourseRow[];

      // Hydrate each course with modules and lessons
      const courses = [];
      for (const row of rows) {
        const moduleRows = await database`
          SELECT id, title FROM cursos.modules WHERE course_id = ${row.id} ORDER BY position ASC
        `;

        const modules = [];
        for (const m of moduleRows) {
          const lessonRows = await database`
            SELECT id, title, content FROM cursos.lessons WHERE module_id = ${(m as any).id} ORDER BY position ASC
          `;
          const lessons = (lessonRows as any[]).map((l) => mapLessonRow(l));
          modules.push(mapModuleRow(m as any, lessons));
        }

        courses.push(mapCourseRowToPwa(row, modules));
      }

      res.json({ data: courses });
    } catch (error) {
      console.error("Error in /pwa/courses:", error);
      res.status(500).json({
        error: "internal_server_error",
        message: "Error interno del servidor",
      });
    }
  },
);

// T911 adapter: Related courses (simple category-based recommendation)
pwaRouter.get(
  "/pwa/courses/:courseId/related",
  validate({ params: courseIdParamsSchema }),
  async (req, res) => {
    try {
      // For now, return empty list (category field doesn't exist in DB yet)
      // Once category is added to courses table, this will filter by category
      res.json({ data: [] });
    } catch (error) {
      console.error("Error in /pwa/courses/:courseId/related:", error);
      res.status(500).json({
        error: "internal_server_error",
        message: "Error interno del servidor",
      });
    }
  },
);

// T911 adapter: Get single course with full hierarchy
pwaRouter.get(
  "/pwa/courses/:courseId",
  validate({ params: courseIdParamsSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        SELECT
          c.id,
          c.slug,
          c.title,
          c.description,
          c.created_by,
          to_char(c.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
          c.rating_average,
          c.rating_count,
          p.display_name
        FROM cursos.courses c
        LEFT JOIN cursos.profiles p ON p.id = c.created_by
        WHERE c.id = ${req.params.courseId}
        LIMIT 1
      ` as CourseRow[];

      if (rows.length === 0) {
        res.status(404).json({ error: "not_found", message: "Curso no encontrado" });
        return;
      }

      const row = rows[0];
      const moduleRows = await database`
        SELECT id, title FROM cursos.modules WHERE course_id = ${row.id} ORDER BY position ASC
      `;

      const modules = [];
      for (const m of moduleRows) {
        const lessonRows = await database`
          SELECT id, title, content FROM cursos.lessons WHERE module_id = ${(m as any).id} ORDER BY position ASC
        `;
        const lessons = (lessonRows as any[]).map((l) => mapLessonRow(l));
        modules.push(mapModuleRow(m as any, lessons));
      }

      res.json({ data: mapCourseRowToPwa(row, modules) });
    } catch (error) {
      console.error("Error in /pwa/courses/:courseId:", error);
      res.status(500).json({
        error: "internal_server_error",
        message: "Error interno del servidor",
      });
    }
  },
);

// T911 adapter: Profile endpoint for PWA
pwaRouter.get(
  "/pwa/users/:userId/profile",
  validate({ params: userIdParamsSchema }),
  async (req, res) => {
    try {
      const rows = await database`
        SELECT id, display_name, email, avatar_url, bio
        FROM cursos.profiles
        WHERE id = ${req.params.userId}
        LIMIT 1
      `;

      if (rows.length === 0) {
        res.status(404).json({
          error: "not_found",
          message: "Perfil no encontrado",
        });
        return;
      }

      res.json({ data: rows[0] });
    } catch (error) {
      console.error("Error in /pwa/users/:userId/profile:", error);
      res.status(500).json({
        error: "internal_server_error",
        message: "Error interno del servidor",
      });
    }
  },
);

export { pwaRouter };
