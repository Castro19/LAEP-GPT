// types.ts

import { ObjectId } from "bson";

// 1-1 match #FEFD9A --> Major, #FCD09E --> Support, #DCFDD2 --> GE, #F5F5DC --> Other
type colors = "#FEFD9A" | "#FCD09E" | "#DCFDD2" | "#F5F5DC";

export type UnitCounts = {
  total: number;
  major: number; // #FEFD9A
  support: number; // #FCD09E
  ge: number; // #DCFDD2
  other: number; // #F5F5DC
};

export type Course = {
  id: string | null;
  color: colors;
  displayName?: string;
  desc?: string;
  units?: string;
  customId?: string;
  customUnits?: string;
  customDesc?: string;
  customDisplayName?: string;
  addl?: string;
  completed?: boolean; // New property
};

export type SidebarInfo = {
  [key: string]: CourseSubject[];
};
export type CourseSidebar = {
  courseId: string;
  displayName: string;
  units: string;
  desc: string;
};
export type CourseSubject = {
  subject: string;
  courses: CourseSidebar[];
};
export type CourseSearch = {
  courseId: string;
  catalog: string;
  displayName: string;
  units: string;
  desc: string;
  addl: string;
  gwrCourse: boolean;
  uscpCourse: boolean;
};

export type CourseCatalog = {
  [key: string]: CourseSearch[];
};

export type Term = {
  tIndex: number;
  tUnits: string;
  courses: Course[];
};

export type CatalogOption = {
  startingYear: string;
  catalog: string;
  major: string;
  concentration: string;
};

export type FlowchartData = {
  id: string;
  ownerId: string;
  name: string;
  programId: string[];
  startYear: string;
  unitTotal: string;
  notes: string;
  termData: Term[];
  version: number;
  hash: string;
  publishedId: string | null;
  importedId: string | null;
  lastUpdatedUTC: string;
};

// api response types
export type PostFlowchartInDB = {
  flowchartData: FlowchartData;
  name: string;
  primaryOption?: boolean;
};
export type CreateFlowchartResponse = {
  flowchartId: string;
  name: string;
  primaryOption?: boolean;
};
export type FetchFlowchartResponse = {
  flowchartData: FlowchartData;
  flowchartMeta: FetchedFlowchartObject;
};

export type FetchedFlowchartObject = {
  flowchartId: string;
  name: string;
  primaryOption?: boolean;
};

export type DeleteFlowchartResponse = {
  success: boolean;
  deletedFlowchartId: string;
  deletedPrimaryOption: boolean;
  newPrimaryFlowchartId: string | null;
};

export type FlowchartDocument = {
  _id: ObjectId;
  flowchartData: FlowchartData;
  name: string;
  primaryOption: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
