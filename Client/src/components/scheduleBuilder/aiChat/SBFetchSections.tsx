import React, { useMemo } from "react";
import SectionsChosen from "../buildSchedule/selectedSections/SectionsChosen";

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
  // Extract the sections array from the message using useMemo to prevent recreation on every render
  const sections = useMemo(() => {
    const sectionsMatch = message.match(/Fetched sections: (\[.*\])/);
    return sectionsMatch ? JSON.parse(sectionsMatch[1]) : [];
  }, [message]);

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
      <SectionsChosen selectedSections={sections} inChat={true} />
    </div>
  );
};

export default SBFetchSections;
