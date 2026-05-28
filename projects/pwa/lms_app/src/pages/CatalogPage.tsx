import type { Course, ProgressState } from "../types";
import { CoursesCatalog } from "../components/CourseCatalog";

interface CatalogPageProps {
  courses: Course[];
  progress: ProgressState["completedLessons"];
  enrolledCourses: string[];
}

export default function CatalogPage({ courses, progress, enrolledCourses }: CatalogPageProps) {
  return <CoursesCatalog courses={courses} progress={progress} enrolledCourses={enrolledCourses} />;
}
