// Weekly Calendar Components
export { default as WeeklyCalendar } from "./weeklyCalendar/currentCalendar/WeeklyCalendar";
export { default as CalendarContainer } from "./weeklyCalendar/layout/CalendarContainer";
export { default as EmptyCalendar } from "./weeklyCalendar/layout/EmptyCalendar";
export { default as CalendarAverageRating } from "./weeklyCalendar/currentCalendar/CalendarAverageRating";
export { default as CalendarTimeSlots } from "./weeklyCalendar/currentCalendar/CalendarTimeSlots";
export { default as CalendarSectionInfo } from "./weeklyCalendar/currentCalendar/CalendarSectionInfo";
export { default as PaginationFooter } from "./weeklyCalendar/layout/PaginationFooter";

// Build Schedule Components
export { default as BuildScheduleContainer } from "./buildSchedule/layout/BuildScheduleContainer";
export { default as LeftSectionFooter } from "./buildSchedule/layout/BuildScheduleFooter";
export { default as SelectedSectionContainer } from "./buildSchedule/selectedSections/SelectedSectionContainer";
export { default as SavedSchedules } from "./buildSchedule/savedSchedules/SavedSchedules";
export { default as CalendarOptions } from "./buildSchedule/savedSchedules/CalendarOptions";

// AI Chat Components
export { default as CalendarAIChatContainer } from "./aiChat/CalendarAIChatContainer";

// Types
export type { CalendarClassSection } from "./weeklyCalendar/currentCalendar/WeeklyCalendar";
export type { Schedule } from "./helpers/buildSchedule";

// Utilities
export { generateAllScheduleCombinations } from "./helpers/buildSchedule";
