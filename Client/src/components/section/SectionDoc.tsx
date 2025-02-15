import React, { useState } from "react";
import {
  CourseInfo,
  ProfessorGroup,
  SectionDetail,
} from "@polylink/shared/types";
import { Button } from "../ui/button";
import StarRating from "./StarRating";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
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
  const [isOpen, setIsOpen] = useState(true);
  const length = course.professorGroups.reduce(
    (acc, profGroup) => acc + profGroup.sections.length,
    0
  );
  return (
    <Collapsible defaultOpen={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-xl shadow-2xl dark:border-slate-700 border-2">
        <div className="flex justify-between items-center w-full p-4 dark:bg-slate-950 rounded-xl dark:bg-opacity-70">
          {/* Left Side - "Currently Viewing" and Section Length */}
          <div className="flex items-center gap-4">
            <span className="px-3 rounded-lg bg-gray-700 text-gray-300 text-lg font-medium bg-opacity-50 hover:bg-opacity-60">
              {length} sections
            </span>
          </div>

          {/* Right Side - Collapse All Button (Collapsible Trigger) */}
          <CollapsibleTrigger asChild>
            <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-lg font-medium transition bg-opacity-50 hover:bg-opacity-60">
              {isOpen ? "Collapse All" : "Expand"}
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
                  <ProfessorGroupComponent group={group} />
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
    <Collapsible defaultOpen={false}>
      <CollapsibleTrigger asChild>
        <div className="rounded-lg rounded-b-none bg-slate-800 px-4 py-2 shadow-lg hover:shadow-indigo-500/10 transition-shadow cursor-pointer bg-opacity-80">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-gray-300">
                {group.instructor.name}
              </h3>
              {group.instructor.id !== "none" && (
                <span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://polyratings.dev/professor/${group.instructor.id}`,
                        "_blank"
                      );
                    }}
                    variant="link"
                    className="text-sm font-sm dark:text-gray-400 "
                  >
                    (View Ratings)
                  </Button>
                </span>
              )}
            </div>

            {/* Right side - added height spacer */}
            {group.instructor.id !== "none" ? (
              <StarRating group={group} />
            ) : (
              <div className="flex items-center gap-2 font-sans h-[34px]">
                <div className="flex items-center">No Ratings</div>
              </div>
            )}
          </div>

          {/* Rating details section - add hidden spacer for no-ratings */}
          {group.instructor.id !== "none" ? (
            <div className="flex justify-end items-center pr-2 ">
              <div className="text-sm text-gray-300 flex items-center">
                <strong className="text-lg text-white">
                  {group.overallRating.toFixed(1)}
                </strong>
                <span className="text-gray-400 ml-1">/ 4</span>
                <span className="ml-3 text-slate-500">
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
        <div className="flex flex-col justify-center items-between"></div>

        {pairedCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {pairedCards.map((pair, index) => (
              <React.Fragment key={index}>
                {pair.lecture && (
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg">
                    <LectureSectionCard section={pair.lecture} />
                  </div>
                )}
                {pair.lab && (
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg">
                    <LabSectionCard section={pair.lab} />
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
              <SectionCard section={section} />
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
};

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-900">
      <SectionHeader section={section} />
      <div className="border-b border-gray-300 dark:border-slate-600 my-2"></div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SectionEnrollment section={section} />
        </div>
        <div className="flex-1">
          <SectionSchedule meetings={section.meetings} />
        </div>
      </div>
    </div>
  );
};

const LectureSectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className="border border-gray-300 dark:border-slate-900 rounded-lg p-3 bg-white dark:bg-slate-900 dark:bg-opacity-30">
      <SectionHeader section={section} />
      <div className="border-b border-gray-300 dark:border-slate-600 my-2"></div>
      <SectionEnrollment section={section} />
      <div className="flex flex-row gap-2">
        <SectionSchedule meetings={section.meetings} />
      </div>
    </div>
  );
};

const LabSectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className="border border-gray-300 dark:border-slate-900 rounded-lg p-3 bg-gray-100 dark:bg-slate-900 dark:bg-opacity-30">
      <SectionHeader section={section} />
      <div className="border-b border-gray-300 dark:border-slate-600 my-2"></div>
      <SectionEnrollment section={section} />
      <div className="flex flex-row gap-2">
        <SectionSchedule meetings={section.meetings} />
      </div>
    </div>
  );
};

export default CourseCatalog;
