// types.ts
// types.ts
export interface Course {
  id: string | null;
  color: string;
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
