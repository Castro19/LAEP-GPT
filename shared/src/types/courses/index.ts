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

/*
{"_id":{"$oid":"67aa86ee9e6faad68208faec"},"collegeName":"College of Agriculture, Food and Environmental Sciences","major":"Agricultural Business","concentration":"Not Applicable For This Major","url":"https://catalog.calpoly.edu/collegesandprograms/collegeofagriculturefoodenvironmentalsciences/agribusiness/bsagriculturalbusiness/","techElectives":[{"name":"Agribusiness General Electives","courses":["AGC314","AGC452","AGC475","NR326","NR408","NR413","WVIT343","WVIT423","WVIT450"],"notes":"Select one 4 unit AGB course at the 400 level Select from the following: Any AGB courses at the 300 or 400 levels"},{"name":"SUPPORT COURSES","courses":["BUS207","ECON222","MATH221","STAT251"],"notes":null},{"name":"Agricultural Electives","courses":["ASCI112","ASCI211","ASCI215","ASCI239","DSCI229","FSN275","PLSC120","PLSC150","PLSC230","SS120","SS130"],"notes":"Select from the following: Select from the following CAFES prefixes: AG, AGC, AGED, ASCI, BRAE, DSCI, ERSC, ESCI, FSN, NR, PLSC, RPTA, SS, or WVIT"}],"code":"22-26.10AGBBSU"}
*/

export type TechElectiveData = {
  collegeName: string;
  major: string;
  concentration: string;
  url: string;
  techElectives: TechElective[];
  code: string; // The flowchart name
};

export type TechElective = {
  name: string | null;
  courses: string[];
  notes: string | null;
};

export type TechElectiveDocument = TechElectiveData & {
  _id?: string;
};
