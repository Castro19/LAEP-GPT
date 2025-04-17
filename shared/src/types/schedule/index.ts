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

// Generated Schedule (for schedule combinations)
export type GeneratedSchedule = {
  sections: SelectedSection[];
  averageRating: number;
  id?: string;
  name?: string;
  withConflicts?: boolean;
  conflictGroups?: SelectedSection[];
};

// Schedule
export type Schedule = {
  id: string;
  name: string;
  sections: SelectedSection[];
  createdAt: Date;
  updatedAt: Date;
  term: CourseTerm;
};
export type ScheduleDocument = Schedule & {
  _id: string;
};
