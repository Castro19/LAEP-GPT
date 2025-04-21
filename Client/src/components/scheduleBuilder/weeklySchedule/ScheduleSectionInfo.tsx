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
// Helpers
import { transformToSectionDetail } from "@/helpers/transformSection";

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

const ScheduleSectionInfo = () => {
  const { scheduleSelectedSection, loading } = useAppSelector(
    (state) => state.classSearch
  );

  if (loading) return <div className="text-slate-400">Loading...</div>;
  if (!scheduleSelectedSection) return null;

  const sectionDetail = transformToSectionDetail(scheduleSelectedSection);
  const instructorRatings = scheduleSelectedSection.instructorsWithRatings?.[0];

  return (
    <div className="w-full rounded-lg border border-slate-600 bg-slate-900 p-3 shadow-xl">
      {/* Header Section */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {sectionDetail.courseName}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-medium text-slate-400">
              {scheduleSelectedSection.subject}{" "}
              {scheduleSelectedSection.catalogNumber}
            </span>
            <BadgeSection variant="content" className="text-sm">
              {scheduleSelectedSection.units} Units
            </BadgeSection>
            <BadgeSection variant="content" className="text-sm">
              {sectionDetail.classNumber}
            </BadgeSection>
            <BadgeSection variant="secondary" className="text-sm">
              {sectionDetail.component}
            </BadgeSection>
          </div>
        </div>
        {enrollmentStatusDesc(scheduleSelectedSection.enrollmentStatus)}
      </div>

      {/* Course Details Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Instructor & Ratings Section */}
        <div className="space-y-2">
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
        <div className="space-y-2">
          <SectionSchedule meetings={sectionDetail.meetings} />
        </div>

        {/* Enrollment Status */}
        <div className="space-y-2">
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
          <div className="space-y-2">
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
        {scheduleSelectedSection.prerequisites && (
          <div className="space-y-2">
            <FormatPrerequisites
              prerequisites={scheduleSelectedSection.prerequisites}
            />
          </div>
        )}

        {/* Course Description */}
        {/* Take up the full width of the bottom row */}
        <div className="col-span-2 space-y-2">
          <h3 className="text-sm font-semibold text-slate-400">Description</h3>
          <p className="text-slate-300">
            {scheduleSelectedSection.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSectionInfo;
