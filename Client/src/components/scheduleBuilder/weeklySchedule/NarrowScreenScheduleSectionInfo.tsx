import { useAppSelector } from "@/redux";
// My Components
import {
  SectionEnrollment,
  SectionSchedule,
} from "@/components/classSearch/currentSectionList/SectionInfo";
import { FormatPrerequisites } from "@/components/classSearch/reusable/sectionInfo/FormatPrereq";
import BadgeSection from "@/components/classSearch/reusable/sectionInfo/BadgeSection";
// UI Components
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/animated-modal";
// Helpers
import { transformToSectionDetail } from "@/helpers/transformSection";
import { X } from "lucide-react";

const instructionModeMap = {
  PA: "Synchronous",
  SM: "Sync/Async Hybrid",
  P: "In Person/Async Hybrid",
  PS: "In Person",
  AM: "In Person/Sync Hybrid",
  SA: "Asynchronous",
};

const enrollmentStatusDesc = (enrollStatus: "O" | "C" | "W") => {
  if (enrollStatus === "O") {
    return (
      <BadgeSection variant="open" className="text-sm">
        Open
      </BadgeSection>
    );
  } else if (enrollStatus === "W") {
    return (
      <BadgeSection variant="waitlist" className="text-sm">
        Waitlist
      </BadgeSection>
    );
  } else {
    return (
      <BadgeSection variant="closed" className="text-sm">
        Closed
      </BadgeSection>
    );
  }
};

const NarrowScreenScheduleSectionInfo = () => {
  const { scheduleSelectedSection, loading } = useAppSelector(
    (state) => state.classSearch
  );
  const { setOpen } = useModal();

  if (loading) return <div className="text-slate-400 p-4">Loading...</div>;
  if (!scheduleSelectedSection) return null;

  const sectionDetail = transformToSectionDetail(scheduleSelectedSection);
  const instructorRatings = scheduleSelectedSection.instructorsWithRatings?.[0];

  return (
    <div className="w-full h-full flex flex-col bg-slate-900">
      {/* Header Section - Fixed at top */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-bold text-slate-100">
              {sectionDetail.courseName}
            </h1>
            <div className="flex items-center gap-2">
              {enrollmentStatusDesc(scheduleSelectedSection.enrollmentStatus)}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-base font-medium text-slate-400">
              {scheduleSelectedSection.subject}{" "}
              {scheduleSelectedSection.catalogNumber}
            </span>
            <BadgeSection variant="content" className="text-xs">
              {scheduleSelectedSection.units} Units
            </BadgeSection>
            <BadgeSection variant="content" className="text-xs">
              {sectionDetail.classNumber}
            </BadgeSection>
            <BadgeSection variant="secondary" className="text-xs">
              {sectionDetail.component}
            </BadgeSection>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Instructor & Ratings Section */}
        <div className="space-y-2 bg-slate-800 p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-400">Instructor</h3>
          <div className="flex items-center gap-2">
            <p className="text-slate-100">
              {scheduleSelectedSection.instructors?.[0]?.name || "TBA"}
            </p>
            {instructorRatings?.id && (
              <Button
                variant="link"
                className="h-auto p-0 text-slate-400 hover:text-slate-300"
                onClick={() =>
                  window.open(
                    `https://polyratings.dev/professor/${instructorRatings.id}`,
                    "_blank"
                  )
                }
              >
                (View Ratings)
              </Button>
            )}
          </div>
          {instructorRatings && (
            <div className="mt-2 space-y-1">
              {instructorRatings.overallRating && (
                <div className="flex gap-2 text-slate-300">
                  <span className="font-medium">Overall Rating:</span>
                  <span>{instructorRatings.overallRating}/4</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meeting Times */}
        <div className="space-y-2 bg-slate-800 p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-400">Schedule</h3>
          <SectionSchedule meetings={sectionDetail.meetings} />
        </div>

        {/* Enrollment Status */}
        <div className="space-y-2 bg-slate-800 p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-400">Enrollment</h3>
          <SectionEnrollment
            section={{
              ...sectionDetail,
              instructionMode: scheduleSelectedSection.instructionMode
                .split(";")
                .map(
                  (mode: string) =>
                    instructionModeMap[
                      mode as keyof typeof instructionModeMap
                    ] || mode
                )
                .join(";"),
            }}
          />
        </div>

        {/* Course Attributes */}
        {scheduleSelectedSection.courseAttributes?.length > 0 && (
          <div className="space-y-2 bg-slate-800 p-3 rounded-lg">
            <h3 className="text-sm font-semibold text-slate-400">Attributes</h3>
            <div className="flex flex-wrap gap-2">
              {scheduleSelectedSection.courseAttributes.map((attr, index) => (
                <BadgeSection key={index} variant="content">
                  {attr}
                </BadgeSection>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {scheduleSelectedSection.prerequisites && (
          <div className="space-y-2 bg-slate-800 p-3 rounded-lg">
            <h3 className="text-sm font-semibold text-slate-400">
              Prerequisites
            </h3>
            <FormatPrerequisites
              prerequisites={scheduleSelectedSection.prerequisites}
            />
          </div>
        )}

        {/* Course Description */}
        <div className="space-y-2 bg-slate-800 p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-400">Description</h3>
          <p className="text-slate-300 text-sm">
            {scheduleSelectedSection.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NarrowScreenScheduleSectionInfo;
