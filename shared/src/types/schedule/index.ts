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

// Schedule
export type Schedule = {
  id: string;
  name: string;
  sections: SelectedSection[];
  createdAt: Date;
  updatedAt: Date;
};
export type ScheduleDocument = Schedule & {
  _id: string;
};
