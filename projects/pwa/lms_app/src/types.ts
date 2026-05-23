export type ResourceType = "video" | "document" | "iframe";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  source: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  blockedBy?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  summary: string;
  instructor: string;
  difficulty: string;
  modules: Module[];
}

export interface ProgressState {
  completedLessons: Record<string, boolean>;
}
