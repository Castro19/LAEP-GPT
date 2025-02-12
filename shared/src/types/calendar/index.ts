import { SelectedSection } from "../selectedSection";

// Calendar List
export type CalendarListItem = {
  id: string;
  name: string;
  updatedAt: Date;
};
export type SavedCalendars = {
  userId: string;
  calendars: CalendarListItem[];
  primaryCalendarId: string;
};

export type CalendarListDocument = SavedCalendars & {
  _id: string;
};

// Calendar
export type Calendar = {
  id: string;
  name: string;
  sections: SelectedSection[];
  createdAt: Date;
  updatedAt: Date;
};
export type CalendarDocument = Calendar & {
  _id: string;
};
