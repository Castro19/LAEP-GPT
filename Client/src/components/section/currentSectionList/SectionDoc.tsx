import React, { useState } from "react";
import {
  CourseInfo,
  ProfessorGroup,
  SectionDetail,
} from "@polylink/shared/types";
import StarRating from "../reusable/sectionInfo/StarRating";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../ui/collapsible";
import { SectionEnrollment } from "./sectionInfo";
import { SectionHeader } from "./sectionInfo";
import { SectionSchedule } from "./sectionInfo";
// -----------------------------------------------------------------------------
// Parent Container: Renders a list of courses (grouped by courseId)
// The overall page background is assumed to be bg-slate-800 in dark mode.
// -----------------------------------------------------------------------------
type CourseCatalogProps = {
  courses: CourseInfo[];
};

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ courses }) => {
  const [expandedCourses, setExpandedCourses] = useState<{
    [key: string]: boolean;
  }>(
    courses.reduce(
      (acc, course) => ({ ...acc, [course.courseId]: true }),
      {} as { [key: string]: boolean }
    )
  );

  // Calculate total sections across all courses
  const totalSections = courses.reduce(
    (acc, course) =>
      acc +
      course.professorGroups.reduce(
        (groupAcc, group) => groupAcc + group.sections.length,
        0
      ),
    0
  );

  // Collapse All / Expand All toggle
  const toggleAll = () => {
    const allCollapsed = Object.values(expandedCourses).every(
      (state) => !state
    );
    const newState = courses.reduce(
      (acc, course) => ({
        ...acc,
        [course.courseId]: allCollapsed ? true : false,
      }),
      {} as { [key: string]: boolean }
    );
    setExpandedCourses(newState);
  };

  return (
    <div className="space-y-8 p-4 bg-transparent min-h-screen">
      <div className="bg-[#1E293B] p-4 rounded-xl shadow-lg">
        {/* "Currently Viewing" Header Section */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-xl font-semibold">
              Currently Viewing
            </h2>

            {/* Courses Count */}
            <span className="px-3 py-1 rounded-full bg-slate-700 bg-opacity-50 text-gray-300 text-lg font-medium flex-wrap">
              {courses.length} {courses.length > 1 ? "Courses" : "Course"}
            </span>

            {/* Sections Count */}
            <span className="px-3 py-1 rounded-full bg-slate-700 bg-opacity-50 text-gray-300 text-lg font-medium flex-wrap">
              {totalSections} {totalSections > 1 ? "Sections" : "Section"}
            </span>
          </div>

          {/* Expand / Collapse All Button */}
          <button
            className="px-3 py-1 rounded-full bg-slate-700 bg-opacity-50 text-gray-300 text-lg font-medium hover:bg-opacity-60 transition flex-wrap"
            onClick={toggleAll}
          >
            {Object.values(expandedCourses).every((state) => !state)
              ? "Expand All"
              : "Collapse All"}
          </button>
        </div>

        {/* Render Course Sections */}
        {courses.map((course) => (
          <CourseSection
            key={course.courseId}
            course={course}
            isOpen={expandedCourses[course.courseId]}
            setIsOpen={(isOpen) =>
              setExpandedCourses((prev) => ({
                ...prev,
                [course.courseId]: isOpen,
              }))
            }
          />
        ))}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// CourseSection: Displays course-level info and professor groups.
// In light mode the section has a white background, in dark mode a slate background.
// -----------------------------------------------------------------------------

type CourseSectionProps = {
  course: CourseInfo;
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
};

const CourseSection: React.FC<CourseSectionProps> = ({
  course,
  isOpen,
  setIsOpen,
}) => {
  const length = course.professorGroups.reduce(
    (acc, profGroup) => acc + profGroup.sections.length,
    0
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      {/* Make the Entire Title Bar Clickable with Hover Effect */}
      <CollapsibleTrigger asChild>
        <div
          className={`flex justify-between items-center bg-gray-900 px-4 py-3 transition-all cursor-pointer shadow-lg
          hover:shadow-indigo-500/10 
          ${isOpen ? "rounded-t-lg" : "rounded-lg"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-full bg-slate-700 bg-opacity-20 text-gray-200 font-semibold text-xl">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {course.subject} {course.catalogNumber}
              </span>
            </span>

            <h2 className="text-xl font-medium text-white">
              {course.courseName}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-slate-700 bg-opacity-20 font-semibold text-lg text-gray-400">
              {course.units} Units
            </span>

            {/* Sections Count for This Course */}
            <span className="px-3 py-1 rounded-full bg-slate-700 bg-opacity-20 font-semibold text-lg text-gray-400">
              {length} {length > 1 ? "Sections" : "Section"}
            </span>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
        <div
          className={`bg-[#182133] p-6 shadow-md transition-all
          ${isOpen ? "rounded-b-lg" : "rounded-none"}`}
        >
          {/* Course Description */}
          <p className="text-[#C6C6C6] mb-5">{course.description}</p>

          {/* Sections List */}
          {course.professorGroups.map((group) => (
            <ProfessorGroupComponent key={group.instructor.id} group={group} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// -----------------------------------------------------------------------------
// ProfessorGroupComponent: Renders professor info and groups that professor's sections.
// Paired sections are rendered side by side; standalone sections appear in a single column.
// -----------------------------------------------------------------------------
type ProfessorGroupProps = {
  group: ProfessorGroup;
};

const ProfessorGroupComponent: React.FC<ProfessorGroupProps> = ({ group }) => {
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
    <Collapsible defaultOpen={false} className="group">
      <CollapsibleTrigger asChild>
        <div
          className="rounded-lg bg-slate-800 px-4 py-2 shadow-lg hover:shadow-indigo-500/10 transition-shadow cursor-pointer pt-5 
          group-data-[state=open]:rounded-b-none mt-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-gray-300">
                {group.instructor.name}
              </h3>
              {group.instructor.id !== "none"}
            </div>

            {/* Right side - Ratings & PolyRatings Icon */}
            <div className="flex items-center gap-6">
              {group.instructor.name !== group.instructor.id ? (
                <>
                  <a
                    href={`https://polyratings.dev/professor/${group.instructor.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevents collapsible from opening
                  >
                    <img
                      src="/polyratings.ico"
                      alt="PolyRatings"
                      className="w-5 h-5 cursor-pointer hover:opacity-80"
                    />
                  </a>
                  <StarRating group={group} />
                </>
              ) : (
                <>
                  <a
                    href={`https://polyratings.dev/search/name?term=${encodeURIComponent(
                      group.instructor.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevents collapsible from opening
                  >
                    <img
                      src="/polyratings.ico"
                      alt="PolyRatings"
                      className="w-5 h-5 cursor-pointer hover:opacity-80"
                    />
                  </a>
                  <StarRating group={group} />
                </>
              )}
            </div>
          </div>

          {/* Rating details section - add hidden spacer for no-ratings */}
          {group.instructor.id !== "none" ? (
            <div className="flex justify-end items-center pr-2">
              <div className="text-sm text-gray-300 flex items-center">
                <span className="ml-3 text-slate-500 mt-2">
                  {group.instructor.numEvals} evals
                </span>
              </div>
            </div>
          ) : (
            // Invisible spacer to match rating details height
            <div className="h-[24px] opacity-0"></div>
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {/* 🔹 Gray Box Wraps All Sections */}
        <div className="bg-slate-800 p-4 space-y-4 rounded-b-lg">
          {/* 🔹 Render Paired Sections (Lecture + Lab Side-by-Side) */}
          {pairedCards.length > 0 && (
            <div className="flex flex-col space-y-4">
              {pairedCards.map((pair, index) => (
                <div key={index} className="flex gap-4">
                  {/* Lecture Section */}
                  {pair.lecture && (
                    <div className="bg-gray-900 p-4 rounded-lg flex-1">
                      <LectureSectionCard section={pair.lecture} />
                    </div>
                  )}

                  {/* Lab Section */}
                  {pair.lab && (
                    <div className="bg-gray-900 p-4 rounded-lg flex-1">
                      <LabSectionCard section={pair.lab} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 🔹 Render Standalone Sections Inside the Same Gray Box */}
          {singleSections.length > 0 && (
            <div className="flex flex-col space-y-4">
              {singleSections.map((section) => (
                <div
                  key={section.classNumber}
                  className="bg-gray-900 p-4 rounded-lg"
                >
                  <SectionCard section={section} />
                </div>
              ))}
            </div>
          )}
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
};

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className=" rounded-lg p-3 bg-white dark:bg-gray-900">
      <SectionHeader section={section} />
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="flex-1">
          <SectionEnrollment section={section} />
        </div>
        <div className="flex-1">
          <SectionSchedule meetings={section.meetings} section={section} />
        </div>
      </div>
    </div>
  );
};

const LectureSectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className="border border-gray-300 dark:border-slate-900 rounded-lg p-3 bg-white dark:bg-gray-900 dark:bg-opacity-30">
      <SectionHeader section={section} />
      <SectionEnrollment section={section} />
      <div className="flex flex-row gap-2">
        <SectionSchedule meetings={section.meetings} section={section} />
      </div>
    </div>
  );
};

const LabSectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className="border border-gray-300 dark:border-slate-900 rounded-lg p-3 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-30">
      <SectionHeader section={section} />
      <SectionEnrollment section={section} />
      <div className="flex flex-row gap-2">
        <SectionSchedule meetings={section.meetings} section={section} />
      </div>
    </div>
  );
};

export default CourseCatalog;
