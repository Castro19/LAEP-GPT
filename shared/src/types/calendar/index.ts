import { SelectedSection } from "../selectedSection";

export type Calendar = {
  id: number;
  name: string;
  sections: SelectedSection[];
  createdAt: Date;
  updatedAt: Date;
};

export type SavedCalendars = {
  userId: string;
  calendars: Calendar[];
  primaryCalendarId: number;
};

export type CalendarDocument = SavedCalendars & {
  _id: string;
};
