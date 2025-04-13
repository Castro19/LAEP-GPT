// Base interfaces for the raw query parameters
export interface CourseQuery {
  catalogYear?: string;
  courseId?: string;
  searchTerm?: string;
}

export interface SubjectQuery {
  catalogYear?: string;
  subject?: string;
  GE?: string;
  GWR?: string;
  USCP?: string;
  page?: number;
  pageSize?: number;
}

export type CourseObject = {
  courseId: string;
  displayName: string;
  units: string;
  desc: string;
};

export type CourseData = {
  catalogYear: string;
  courseId: string;
  subject: string;
  catalog: string; // TO-DO: Remove this duplicate field
  displayName: string;
  units: string;
  desc: string;
  addl: string;
  gwrCourse: boolean;
  uscpCourse: boolean;
  geSubjects: string[]; // TO-DO: Find out why some values are null in the array
  GE: GEObj[];
  prerequisites: PrerequisiteObj;
};

// MongoDB specific query interfaces
export type CourseDocument = CourseData & {
  _id?: string;
};

export type geData = {
  catalog: string;
  category: string;
  subject: string;
  id: string;
};

export type geDocument = geData & {
  _id?: string;
};

export type GEObj = {
  category: string;
  id: string;
  categoryId: string;
};

export type PrerequisiteObj = {
  prerequisite: string[];
  corequisite: string[];
  recommended: string[];
  concurrent: string[];
};

/**
 * Represents the formatted structure of GE courses organized by category and subject
 * First level: Categories (e.g., "UPPER_DIVISION_B", "F", "B2")
 * Second level: Subjects (e.g., "AERO", "AEPS")
 * Third level: Array of course objects for that subject
 */
export type FormattedGeCourses = Record<string, Record<string, CourseObject[]>>;
