import { SectionEssential } from "@polylink/shared/types";
import React from "react";
import BadgeSection from "@/components/classSearch/reusable/sectionInfo/BadgeSection";
import LabelSection from "@/components/classSearch/reusable/sectionInfo/LabelSection";
import { convertTo12HourFormat } from "@/components/classSearch/helpers/timeFormatter";

export const SectionEssentials: React.FC<{
  section: SectionEssential;
}> = ({ section }) => {
  // Extract and format start & end time
  const { meetings } = section;
  const startTime = meetings?.[0]?.start_time
    ? convertTo12HourFormat(meetings[0].start_time)
    : "N/A";
  const endTime = meetings?.[0]?.end_time
    ? convertTo12HourFormat(meetings[0].end_time)
    : "N/A";

  // Remove any duplicate days
  const days = meetings.map((meeting) => meeting.days).flat();
  const uniqueDays = [...new Set(days)];

  return (
    <div className="border border-slate-700 rounded-md p-2 bg-slate-800/50 transition-colors flex flex-col">
      <div className="space-y-1 flex-1">
        {/* First Row: Course Name and Class Number */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">{section.courseName}</span>
            <BadgeSection variant="selected">
              {section.classNumber}
            </BadgeSection>
          </div>
        </div>

        {/* Days - Bubble Style */}
        <div className="flex flex-row gap-2 items-center">
          <LabelSection className="text-slate-400">Days</LabelSection>
          <div className="flex flex-row gap-2">
            {uniqueDays.length > 0 ? (
              uniqueDays.map((day: string) => (
                <BadgeSection key={day} variant="selected">
                  {day}
                </BadgeSection>
              ))
            ) : (
              <BadgeSection variant="selected">N/A</BadgeSection>
            )}
          </div>
        </div>

        {/* Time */}
        <div className="flex flex-col justify-start gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex flex-row gap-2 items-center">
              <LabelSection className="text-slate-400">Time</LabelSection>
              <div className="flex flex-row gap-2 items-center">
                <BadgeSection variant="selected">{startTime}</BadgeSection>
                <span className="text-xs text-slate-400">to</span>
                <BadgeSection variant="selected">{endTime}</BadgeSection>
              </div>
            </div>
          </div>
        </div>

        {/* Instructors */}
        {section.instructors.length > 0 && (
          <div className="flex flex-row gap-2 items-center">
            <LabelSection className="text-slate-400">Instructors</LabelSection>
            <div className="flex flex-row gap-2">
              {section.instructors.map((instructor) => (
                <BadgeSection key={instructor.name} variant="selected">
                  {instructor.name}
                </BadgeSection>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
