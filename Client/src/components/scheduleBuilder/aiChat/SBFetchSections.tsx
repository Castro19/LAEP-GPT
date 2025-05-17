import { SectionEssential, SelectedSection } from "@polylink/shared/types";
import React, { useEffect, useState } from "react";
import SectionsChosen from "../buildSchedule/selectedSections/SectionsChosen";
import { useAppSelector } from "@/redux";

interface FetchSectionsProps {
  args: {
    fetch_type: "search" | "user_selected" | "curriculum";
    num_courses?: number;
    sections_per_course?: number;
    search_query?: string;
  };
  message: string;
}

const SBFetchSections: React.FC<FetchSectionsProps> = ({ args, message }) => {
  // Extract the sections array from the message
  const sectionsMatch = message.match(/Fetched sections: (\[.*\])/);
  const sections: SectionEssential[] = sectionsMatch
    ? JSON.parse(sectionsMatch[1])
    : [];
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  const [sectionsToDisplay, setSectionsToDisplay] = useState<SelectedSection[]>(
    []
  );
  useEffect(() => {
    setSectionsToDisplay(
      selectedSections.filter((section) =>
        sections.some(
          (selectedSection) =>
            selectedSection.classNumber === section.classNumber
        )
      )
    );
  }, [selectedSections, sections, message]);

  const renderFetchType = () => {
    switch (args.fetch_type) {
      case "search":
        return (
          <div className="text-slate-400">
            <span className="font-semibold">Search Query:</span>{" "}
            {args.search_query}
            <br />
            <span className="font-semibold">Results:</span> {args.num_courses}{" "}
            courses, {args.sections_per_course} sections per course
          </div>
        );
      case "curriculum":
        return (
          <div className="text-slate-400">
            <span className="font-semibold">Curriculum Fetch:</span> Next{" "}
            {args.num_courses} eligible courses
            <br />
            <span className="font-semibold">Sections:</span>{" "}
            {args.sections_per_course} per course
          </div>
        );
      case "user_selected":
        return (
          <div className="text-slate-400">
            <span className="font-semibold">User Selected Sections</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Tool Arguments */}
      <div className="bg-slate-800/50 p-2 rounded">{renderFetchType()}</div>

      {/* Sections List */}

      <SectionsChosen selectedSections={sectionsToDisplay} inChat={true} />
    </div>
  );
};

export default SBFetchSections;
