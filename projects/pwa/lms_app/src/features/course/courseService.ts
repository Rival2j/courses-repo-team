import type { CourseListResponse, CourseDetail } from "../../contracts/courseContracts";
import { supabase } from "../../lib/supabaseClient";

/**
 * Fetch all courses from Supabase.
 * Falls back to mock data if Supabase is unavailable.
 */
export async function fetchCourses(): Promise<CourseListResponse> {
  try {
    const { data: coursesData, error } = await supabase
      .from("cursos.courses")
      .select("id, title, summary, instructor, difficulty, prerequisite_course_ids");

    if (error) {
      console.error("Error fetching courses from Supabase:", error);
      return fallbackCourses();
    }

    if (!coursesData || coursesData.length === 0) {
      console.warn("No courses found in Supabase");
      return fallbackCourses();
    }

    // Reconstruct full course hierarchy with modules and lessons
    const courses = await Promise.all(
      coursesData.map((course: any) =>
        reconstructCourseWithModules(course.id, course)
      )
    );

    return courses;
  } catch (err) {
    console.error("Error fetching courses:", err);
    return fallbackCourses();
  }
}

/**
 * Fetch a course by ID with all its modules and lessons.
 */
export async function fetchCourseById(courseId: string): Promise<CourseListResponse[0] | undefined> {
  try {
    const { data: courseData, error: courseError } = await supabase
      .from("cursos.courses")
      .select("id, title, summary, instructor, difficulty, prerequisite_course_ids")
      .eq("id", courseId)
      .single();

    if (courseError || !courseData) {
      console.error("Error fetching course:", courseError);
      // Return fallback course if the requested ID matches mock data, otherwise undefined
      const fallback = fallbackCourses().find(course => course.id === courseId);
      return fallback;
    }

    return reconstructCourseWithModules(courseId, courseData);
  } catch (err) {
    console.error("Error fetching course by ID:", err);
    // Return fallback course if the requested ID matches mock data, otherwise undefined
    const fallback = fallbackCourses().find(course => course.id === courseId);
    return fallback;
  }
}

/**
 * Reconstruct full course hierarchy from modules and lessons.
 */
async function reconstructCourseWithModules(courseId: string, courseData: any) {
  try {
    const { data: modulesData, error: modulesError } = await supabase
      .from("cursos.modules")
      .select("id, title, description")
      .eq("course_id", courseId);

    if (modulesError) {
      console.error("Error fetching modules:", modulesError);
      return courseData;
    }

    const modules = await Promise.all(
      (modulesData || []).map(async (module: any) => {
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("cursos.lessons")
          .select("id, title, description, blocked_by")
          .eq("module_id", module.id);

        if (lessonsError) {
          console.error("Error fetching lessons:", lessonsError);
          return { ...module, lessons: [] };
        }

        const lessons = await Promise.all(
          (lessonsData || []).map(async (lesson: any) => {
            const { data: resourcesData, error: resourcesError } = await supabase
              .from("cursos.external_resources")
              .select("id, title, type, source, description")
              .eq("lesson_id", lesson.id);

            if (resourcesError) {
              console.error("Error fetching resources:", resourcesError);
              return { ...lesson, resources: [], blockedBy: lesson.blocked_by || [] };
            }

            return {
              ...lesson,
              blockedBy: lesson.blocked_by || [],
              resources: resourcesData || [],
            };
          })
        );

        return { ...module, lessons };
      })
    );

    return {
      ...courseData,
      prerequisiteCourseIds: courseData.prerequisite_course_ids || [],
      modules,
    };
  } catch (err) {
    console.error("Error reconstructing course:", err);
    return courseData;
  }
}

/**
 * Fallback mock data in case Supabase is unavailable.
 */
function fallbackCourses(): CourseListResponse {
  console.warn("Using fallback mock data");
  return [
    {
      id: "curso-1",
      title: "Fundamentos de Gestión del Aprendizaje",
      summary: "Explora el catálogo y las lecciones clave para trazar tu ruta educativa con progreso visible.",
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
          ],
        },
      ],
    },
  ];
}
