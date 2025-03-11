import { useAppSelector } from "@/redux";
import { Button } from "../../../ui/button";
import {
  SectionEnrollment,
  SectionSchedule,
} from "../../../section/currentSectionList/sectionInfo";
import { transformToSectionDetail } from "@/helpers/transformSection";
import BadgeSection from "../../../section/helpers/BadgeSection";
import { FormatPrerequisites } from "../../../section/helpers/FormatPrereq";

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

const CalendarSectionInfo = () => {
  const { calendarSelectedSection, loading } = useAppSelector(
    (state) => state.section
  );

  if (loading) return <div className="text-slate-400">Loading...</div>;
  if (!calendarSelectedSection) return null;

  const sectionDetail = transformToSectionDetail(calendarSelectedSection);
  const instructorRatings = calendarSelectedSection.instructorsWithRatings?.[0];

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
              {calendarSelectedSection.subject}{" "}
              {calendarSelectedSection.catalogNumber}
            </span>
            <BadgeSection variant="content" className="text-sm">
              {calendarSelectedSection.units} Units
            </BadgeSection>
            <BadgeSection variant="content" className="text-sm">
              {sectionDetail.classNumber}
            </BadgeSection>
            <BadgeSection variant="secondary" className="text-sm">
              {sectionDetail.component}
            </BadgeSection>
          </div>
        </div>
        {enrollmentStatusDesc(calendarSelectedSection.enrollmentStatus)}
      </div>

      {/* Course Details Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Instructor & Ratings Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-400">Instructor</h3>
          <div className="flex items-center gap-2">
            <p className="text-slate-100">
              {calendarSelectedSection.instructors?.[0]?.name || "TBA"}
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
              instructionMode: calendarSelectedSection.instructionMode
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
        {calendarSelectedSection.courseAttributes?.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-400">Attributes</h3>
            <div className="flex flex-wrap gap-2">
              {calendarSelectedSection.courseAttributes.map((attr, index) => (
                <BadgeSection key={index} variant="content">
                  {attr}
                </BadgeSection>
              ))}
            </div>
          </div>
        )}
        {calendarSelectedSection.prerequisites && (
          <div className="space-y-2">
            <FormatPrerequisites
              prerequisites={calendarSelectedSection.prerequisites}
            />
          </div>
        )}

        {/* Course Description */}
        {/* Take up the full width of the bottom row */}
        <div className="col-span-2 space-y-2">
          <h3 className="text-sm font-semibold text-slate-400">Description</h3>
          <p className="text-slate-300">
            {calendarSelectedSection.description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex justify-end gap-4 border-t border-slate-800 pt-6">
        <Button variant="outline" className="border-slate-700 text-slate-300">
          Remove from Schedule
        </Button>
      </div>
    </div>
  );
};

export default CalendarSectionInfo;
