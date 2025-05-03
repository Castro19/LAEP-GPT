import { SelectedSection } from "../selectedSection";
import { CourseTerm } from "../selectedSection";
// Calendar List
export type ScheduleListItem = {
  id: string;
  name: string;
  updatedAt: Date;
};
export type SavedSchedules = {
  userId: string;
  schedules: {
    [K in CourseTerm]: ScheduleListItem[];
  };
  primaryScheduleId: string;
};

export type ScheduleListDocument = SavedSchedules & {
  _id: string;
};

export type CustomScheduleEvent = {
  id: string;
  title: string;
  color: string;
  meetings: Array<{
    days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
    start_time: string | null;
    end_time: string | null;
  }>;
  // Generated on frontend
  isVisible?: boolean;
  isLocked?: boolean;
};

// Generated Schedule (for schedule combinations)
export type GeneratedSchedule = {
  customEvents?: CustomScheduleEvent[];
  sections: SelectedSection[];
  averageRating: number;
  id?: string;
  name?: string;
  withConflicts?: boolean;
  conflictGroups?: SelectedSection[];
};

// ScheduleResponse
export type ScheduleResponse = {
  id: string;
  name: string;
  sections: SelectedSection[];
  createdAt: Date;
  updatedAt: Date;
  term: CourseTerm;
  customEvents?: CustomScheduleEvent[];
};

// Schedule
export type Schedule = {
  id: string;
  name: string;
  sections: number[];
  createdAt: Date;
  updatedAt: Date;
  term: CourseTerm;
  customEvents?: CustomScheduleEvent[];
  isPrimary: boolean;
};

export type ScheduleDocument = Schedule & {
  _id: string;
};
