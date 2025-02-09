import React from "react";
import {
  CourseInfo,
  ProfessorGroup,
  SectionDetail,
} from "@polylink/shared/types";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import StarRating from "./StarRating";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import { createOrUpdateSelectedSectionAsync } from "@/redux/sectionSelection/sectionSelectionSlice";
import { useAppDispatch } from "@/redux";
import { toast } from "../ui/use-toast";
import { environment } from "@/helpers/getEnvironmentVars";

// -----------------------------------------------------------------------------
// Parent Container: Renders a list of courses (grouped by courseId)
// The overall page background is assumed to be bg-slate-800 in dark mode.
// -----------------------------------------------------------------------------
type CourseCatalogProps = {
  courses: CourseInfo[];
};

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ courses }) => {
  return (
    <div className="space-y-8 p-4 bg-gradient-to-br from-slate-900 to-gray-900 min-h-screen">
      {courses.map((course) => (
        <React.Fragment key={course.courseId}>
          <CourseSection key={course.courseId} course={course} />
          <div className="border-t border-gray-700 my-2" />
        </React.Fragment>
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// CourseSection: Displays course-level info and professor groups.
// In light mode the section has a white background, in dark mode a slate background.
// -----------------------------------------------------------------------------
type CourseSectionProps = {
  course: CourseInfo;
};

const CourseSection: React.FC<CourseSectionProps> = ({ course }) => {
  const length = course.professorGroups.reduce(
    (acc, profGroup) => acc + profGroup.sections.length,
    0
  );
  return (
    <Collapsible defaultOpen={true}>
      <div className="rounded-xl shadow-2xl dark:border-slate-700 border-2">
        <div className="flex justify-between items-center w-full p-4 dark:bg-slate-950 rounded-xl dark:bg-opacity-70">
          {/* Left Side - "Currently Viewing" and Section Length */}
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent dark:bg-slate-200 bg-opacity-30 rounded-full px-2">
              Currently Viewing
            </h2>
            <span className="px-3 rounded-lg bg-gray-700 text-gray-300 text-lg font-medium bg-opacity-50 hover:bg-opacity-60">
              {length} sections
            </span>
          </div>

          {/* Right Side - Collapse All Button (Collapsible Trigger) */}
          <CollapsibleTrigger asChild>
            <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-lg font-medium transition bg-opacity-50 hover:bg-opacity-60">
              Collapse All
            </button>
          </CollapsibleTrigger>
        </div>

        <section className="rounded-xl bg-slate-900 p-6">
          <header className="group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-700 bg-opacity-20 font-semibold text-xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {course.subject} {course.catalogNumber}
                </span>
                <h2 className="text-xl font-medium text-gray-100">
                  {course.courseName}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-700 bg-opacity-20 font-semibold text-lg text-gray-400">
                {course.units} Units
              </span>
            </div>
          </header>

          <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <p className="text-gray-300 my-6 px-2">{course.description}</p>
            <div className="space-y-6">
              {course.professorGroups.map((group) => (
                <React.Fragment key={group.instructor.id}>
                  <ProfessorGroupComponent
                    group={group}
                    courseId={course.courseId}
                  />
                  <div className="border-t border-gray-700 my-4" />
                </React.Fragment>
              ))}
            </div>
          </CollapsibleContent>
        </section>
      </div>
    </Collapsible>
  );
};

// -----------------------------------------------------------------------------
// ProfessorGroupComponent: Renders professor info and groups that professor's sections.
// Paired sections are rendered side by side; standalone sections appear in a single column.
// -----------------------------------------------------------------------------
type ProfessorGroupProps = {
  group: ProfessorGroup;
  courseId: string;
};

const ProfessorGroupComponent: React.FC<ProfessorGroupProps> = ({
  group,
  courseId,
}) => {
  const processed = new Set<number>();
  const pairedCards: Array<{ lecture?: SectionDetail; lab?: SectionDetail }> =
    [];
  const singleSections: SectionDetail[] = [];

  group.sections.forEach((section) => {
    if (processed.has(section.classNumber)) return;

    if (section.pairedSections && section.pairedSections.length > 0) {
      // Assume a single pairing exists for this example.
      const pairClassNum = section.pairedSections[0];
      const pairedSection = group.sections.find(
        (s) => s.classNumber === pairClassNum
      );
      if (pairedSection) {
        processed.add(section.classNumber);
        processed.add(pairedSection.classNumber);
        let lectureSection: SectionDetail | undefined;
        let labSection: SectionDetail | undefined;
        if (section.component.toLowerCase().includes("lec")) {
          lectureSection = section;
          labSection = pairedSection;
        } else if (section.component.toLowerCase().includes("lab")) {
          labSection = section;
          lectureSection = pairedSection;
        } else {
          // Fallback assignment.
          lectureSection = section;
          labSection = pairedSection;
        }
        pairedCards.push({ lecture: lectureSection, lab: labSection });
        return;
      }
    }
    processed.add(section.classNumber);
    singleSections.push(section);
  });

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger asChild>
        <div className="rounded-lg bg-slate-800 p-4 shadow-lg hover:shadow-indigo-500/10 transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {group.instructor.id !== "none" && (
                  <TooltipProvider>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `https://polyratings.dev/professor/${group.instructor.id}`,
                                "_blank"
                              );
                            }}
                            variant="link"
                            className="p-0 m-0"
                          >
                            <img
                              src={"polyratings-favicon.ico"}
                              alt="PolyRatings Favicon"
                              className="w-4 h-4"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Ratings</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                )}
              </div>
              <h3 className="text-xl font-semibold text-cyan-300">
                {group.instructor.name}
              </h3>
            </div>
            {group.instructor.id !== "none" && <StarRating group={group} />}
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {pairedCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {pairedCards.map((pair, index) => (
              <React.Fragment key={index}>
                {pair.lecture && (
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg">
                    <LectureSectionCard
                      section={pair.lecture}
                      courseId={courseId}
                    />
                  </div>
                )}
                {pair.lab && (
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg">
                    <LabSectionCard section={pair.lab} courseId={courseId} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {singleSections.map((section) => (
            <div
              key={section.classNumber}
              className="border border-gray-300 dark:border-slate-600 rounded-lg"
            >
              {section.component.toLowerCase().includes("lec") ? (
                <LectureSectionCard section={section} courseId={courseId} />
              ) : section.component.toLowerCase().includes("lab") ? (
                <LabSectionCard section={section} courseId={courseId} />
              ) : (
                <SectionCard section={section} courseId={courseId} />
              )}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// -----------------------------------------------------------------------------
// Section Cards
// Each card displays section header and schedule info, with variations for lectures and labs.
// -----------------------------------------------------------------------------
type SectionCardProps = {
  section: SectionDetail;
  courseId: string;
};

const SectionCard: React.FC<SectionCardProps> = ({ section, courseId }) => {
  return (
    <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700">
      <SectionHeader section={section} courseId={courseId} />
      <SectionEnrollment section={section} />
      <SectionSchedule section={section} />
    </div>
  );
};

const LectureSectionCard: React.FC<SectionCardProps> = ({
  section,
  courseId,
}) => {
  return (
    <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700">
      <SectionHeader section={section} courseId={courseId} />
      <div className="border-t border-gray-300 dark:border-slate-600 my-2"></div>
      <SectionEnrollment section={section} />
      <div className="border-t border-gray-300 dark:border-slate-600 my-2"></div>
      <div className="flex flex-row gap-2">
        <SectionSchedule section={section} />
      </div>
    </div>
  );
};

const LabSectionCard: React.FC<SectionCardProps> = ({ section, courseId }) => {
  return (
    <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-gray-100 dark:bg-slate-700">
      <SectionHeader section={section} courseId={courseId} />
      <div className="border-t border-gray-300 dark:border-slate-600 my-2"></div>
      <SectionEnrollment section={section} />
      <div className="border-t border-gray-300 dark:border-slate-600 my-2"></div>
      <div className="flex flex-row gap-2">
        <SectionSchedule section={section} />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// SectionHeader: Renders a badge for the component type, meeting days, and enrollment status.
// -----------------------------------------------------------------------------
type SectionHeaderProps = {
  section: SectionDetail;
  courseId: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ section, courseId }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge variant="default" className="text-xs">
          {courseId}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {section.component}
        </Badge>
        <Badge
          variant={section.enrollmentStatus === "O" ? "default" : "destructive"}
          className="text-xs"
        >
          {section.enrollmentStatus === "O" ? "Open" : "Closed"}
        </Badge>
      </div>
      <Badge variant="default" className="text-xs">
        {section.classNumber}
      </Badge>
    </div>
  );
};

// -----------------------------------------------------------------------------
// SectionEnrollment: Renders enrollment status and enrollment info.
// -----------------------------------------------------------------------------
type SectionEnrollmentProps = {
  section: SectionDetail;
};

const SectionEnrollment: React.FC<SectionEnrollmentProps> = ({ section }) => {
  return (
    <div className="flex flex-col gap-2 mt-2">
      {/* Enrollment Status */}

      <div className="flex flex-row gap-2 items-center align-items-center">
        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
          Instruction Mode:
        </h4>
        <span>{section.instructionMode}</span>
      </div>

      <div className="flex flex-row gap-2 items-center align-items-center">
        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
          Seats Available:
        </h4>
        <span>
          {section.enrollment.enrollmentAvailable} /{" "}
          {section.enrollment.enrollmentTotal}
        </span>
      </div>

      {/* Waitlist Information */}
      <div className="flex flex-row gap-2 items-center align-items-center">
        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 h-full">
          Waitlist:
        </h4>
        <span>
          {section.enrollment.waitTotal} / {section.enrollment.waitCap}
        </span>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// SectionSchedule: Renders meeting times and locations.
// -----------------------------------------------------------------------------
type SectionScheduleProps = {
  section: SectionDetail;
};

const SectionSchedule: React.FC<SectionScheduleProps> = ({ section }) => {
  const dispatch = useAppDispatch();
  const dayMap: { [key: string]: string } = {
    Mo: "Monday",
    Tu: "Tuesday",
    We: "Wednesday",
    Th: "Thursday",
    Fr: "Friday",
    Sa: "Saturday",
    Su: "Sunday",
  };

  const convertTo12HourFormat = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Handler for the Add button
  const handleAdd = async (section: SectionDetail) => {
    // Implement your add functionality here
    if (environment === "dev") {
      console.log("Add button clicked for meeting:", section);
    }
    const { payload } = await dispatch(
      createOrUpdateSelectedSectionAsync(section)
    );
    const { message } = payload as { message: string };
    if (
      message ===
      `Try adding a different section for course ${section.courseId}`
    ) {
      toast({
        title: `Section ${section.classNumber} Already Exists in schedule`,
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: `${section.courseId} Added`,
        description: message,
      });
    }
  };

  return (
    <div className="mt-2 text-sm w-full">
      {section.meetings.map((meeting, index) => (
        <div
          key={index}
          className="text-sm text-gray-600 dark:text-gray-300 mb-1"
        >
          <div>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              Days:{" "}
            </span>
            {meeting.days.map((day) => dayMap[day]).join(", ")}
          </div>
          <div>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              Start Time:{" "}
            </span>
            {meeting.start_time
              ? convertTo12HourFormat(meeting.start_time)
              : "N/A"}
          </div>
          <div>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              End Time:{" "}
            </span>
            {meeting.end_time ? convertTo12HourFormat(meeting.end_time) : "N/A"}
          </div>
          {/* Footer with Location and Add Button */}
          <div className="flex justify-between items-center mt-4 py-2 border-t border-gray-300 dark:border-slate-600">
            <div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Location:{" "}
              </span>
              {meeting.location || "N/A"}
            </div>
            <Button
              onClick={() => handleAdd(section)}
              variant="default"
              className="ml-4"
            >
              Add
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Badge Component: Simple badge that adjusts for dark mode.
// -----------------------------------------------------------------------------
type BadgeProps = {
  variant: "default" | "destructive" | "secondary";
  className?: string;
  children: React.ReactNode;
};

const Badge: React.FC<BadgeProps> = ({ variant, className, children }) => {
  const baseStyles = "px-2 py-1 rounded text-xs font-medium";
  let variantStyles = "";
  if (variant === "destructive") {
    variantStyles = "bg-red-500 text-white";
  } else if (variant === "secondary") {
    variantStyles =
      "bg-blue-200 text-blue-800 dark:bg-blue-300 dark:text-blue-900";
  } else {
    variantStyles =
      "bg-gray-200 text-gray-800 dark:bg-slate-500 dark:text-gray-100";
  }
  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};

export default CourseCatalog;
