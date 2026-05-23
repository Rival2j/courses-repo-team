import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "./courseService";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    staleTime: 1000 * 60,
    retry: 1,
  });
}
