import { Filter } from "mongodb";
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
export interface CourseDocument {
    catalogYear?: string;
    courseId?: string;
    gwrCourse?: boolean;
    uscpCourse?: boolean;
    geCategories?: string[];
}
export type MongoQuery<T> = Filter<T>;
