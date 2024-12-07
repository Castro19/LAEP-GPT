import { Filter } from "mongodb";

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

// MongoDB specific query interfaces
export interface CourseDocument {
  catalogYear?: string;
  courseId?: string;
  gwrCourse?: boolean;
  uscpCourse?: boolean;
  geCategories?: string[];
}

// Type for MongoDB queries
export type MongoQuery<T> = Filter<T>;
