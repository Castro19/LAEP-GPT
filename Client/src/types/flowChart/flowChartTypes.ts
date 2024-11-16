// types.ts
export interface Course {
  id: string | null;
  color: string;
  displayName?: string;
  desc?: string;
  units?: string;
  customId?: string;
  customUnits?: string;
  customDesc?: string;
  customDisplayName?: string;
  completed?: boolean; // New property
}

export interface Term {
  tIndex: number;
  tUnits: string;
  courses: Course[];
}

export interface CatalogOption {
  startingYear: string;
  catalog: string;
  major: string;
  concentration: string;
}

export interface FlowchartData {
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
}

// api response types
export interface PostFlowchartInDB {
  flowchartData: FlowchartData;
  name: string;
  primaryOption?: boolean;
}
export interface CreateFlowchartResponse {
  flowchartId: string;
  name: string;
  primaryOption?: boolean;
}

export interface FetchAllFlowchartsResponse {
  flowchartId: string;
  name: string;
  primaryOption?: boolean;
}
[];