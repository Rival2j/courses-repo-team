import type { CourseListResponse } from "../../contracts/courseContracts";
import { courses } from "../../data";

export async function fetchCourses(): Promise<CourseListResponse> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return courses;
}

export async function fetchCourseById(courseId: string) {
  const allCourses = await fetchCourses();
  return allCourses.find((course) => course.id === courseId);
}
