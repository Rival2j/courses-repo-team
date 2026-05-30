import { courses as fallbackCourseData } from "../../data";
import type { CourseListResponse } from "../../contracts/courseContracts";
import type { Course, Module, Lesson, DbCourse, DbModule, DbLesson } from "../../types";
import { supabase } from "../../lib/supabaseClient";

function normalizeLesson(lesson: DbLesson, resourcesData: any[] = []): Lesson {
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.content,
    resources: resourcesData || [],
    blockedBy: lesson.blocked_by || [],
  };
}

function normalizeModule(module: DbModule, lessons: Lesson[]): Module {
  return {
    id: module.id,
    title: module.title,
    description: "",
    lessons,
  };
}

function normalizeCourse(course: DbCourse, modules: Module[]): Course {
  return {
    id: course.id,
    title: course.title,
    summary: course.description,
    instructor: "",
    difficulty: "Principiante",
    prerequisiteCourseIds: [],
    image: "",
    badge: undefined,
    rating: 0,
    reviewCount: 0,
    price: 0,
    originalPrice: undefined,
    discountPercent: undefined,
    durationHours: 0,
    lessonsCount: 0,
    language: "Español",
    category: "Desarrollo",
    level: "Principiante",
    createdAt: Date.parse(course.created_at),
    modules,
  };
}

/**
 * Fetch all courses from Supabase.
 * Falls back to mock data if Supabase is unavailable.
 */
export async function fetchCourses(): Promise<CourseListResponse> {
  if (!supabase) {
    console.warn("Supabase client is not initialized, using fallback mock data.");
    return fallbackCourses();
  }

  try {
    const { data: coursesData, error } = await supabase
      .from("courses")
      .select("id, slug, title, description, created_by, created_at");

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
  if (!supabase) {
    console.warn("Supabase client is not initialized, using fallback course by ID.");
    return fallbackCourses().find((course) => course.id === courseId);
  }

  try {
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("id, slug, title, description, created_by, created_at")
      .eq("id", courseId)
      .single();

    if (courseError || !courseData) {
      console.error("Error fetching course:", courseError);
      const fallback = fallbackCourses().find((course) => course.id === courseId);
      return fallback;
    }

    return reconstructCourseWithModules(courseId, courseData);
  } catch (err) {
    console.error("Error fetching course by ID:", err);
    const fallback = fallbackCourses().find((course) => course.id === courseId);
    return fallback;
  }
}

/**
 * Reconstruct full course hierarchy from modules and lessons.
 */
async function reconstructCourseWithModules(courseId: string, courseData: any) {
  if (!supabase) {
    return {
      ...courseData,
      prerequisiteCourseIds: courseData.prerequisite_course_ids || [],
      modules: courseData.modules || [],
    };
  }

  try {
    const client = supabase;

    if (!client) {
      return {
        ...courseData,
        prerequisiteCourseIds: courseData.prerequisite_course_ids || [],
        modules: courseData.modules || [],
      };
    }

    const { data: modulesData, error: modulesError } = await client
      .from("modules")
      .select("id, course_id, title, position")
      .eq("course_id", courseId);

    if (modulesError) {
      console.error("Error fetching modules:", modulesError);
      return courseData;
    }

    const modules = await Promise.all(
      (modulesData || []).map(async (module: any) => {
        const { data: lessonsData, error: lessonsError } = await client
          .from("lessons")
          .select("id, module_id, title, content, position")
          .eq("module_id", module.id);

        if (lessonsError) {
          console.error("Error fetching lessons:", lessonsError);
          return { ...module, lessons: [] };
        }

        const lessons = await Promise.all(
          (lessonsData || []).map(async (lesson: DbLesson) => {
            const { data: resourcesData, error: resourcesError } = await client
              .from("external_resources")
              .select("id, title, type, source, description")
              .eq("lesson_id", lesson.id);

            if (resourcesError) {
              console.error("Error fetching resources:", resourcesError);
              return normalizeLesson(lesson, []);
            }

            return normalizeLesson(lesson, resourcesData || []);
          })
        );

        return normalizeModule(module, lessons);
      })
    );

    return normalizeCourse(courseData, modules);
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
  return fallbackCourseData;
}
