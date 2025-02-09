import { environment } from "@/helpers/getEnvironmentVars";
import { useAppDispatch, useAppSelector } from "@/redux";
import { sectionSelectionActions } from "@/redux";
import { useEffect } from "react";
import { Meeting, SelectedSection } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { SectionSchedule } from "../section/SectionDoc";

const SectionsChosen = () => {
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync());
  }, [dispatch]);

  // Group sections by courseId and professor
  if (selectedSections.length === 0) {
    return <div>No sections chosen</div>;
  }
  const groupedSections = selectedSections.reduce(
    (acc, section) => {
      const courseKey = section.courseId;
      const professorKey = section.professor.join(", ");

      if (!acc[courseKey]) {
        acc[courseKey] = {};
      }
      if (!acc[courseKey][professorKey]) {
        acc[courseKey][professorKey] = [];
      }
      acc[courseKey][professorKey].push(section);
      return acc;
    },
    {} as Record<string, Record<string, SelectedSection[]>>
  );

  if (environment === "dev") {
    console.log("MAPPING FROM SELECTED SECTIONS", selectedSections);
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {Object.entries(groupedSections).map(([courseId, professorGroups]) => (
        <div
          key={courseId}
          className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-2"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {courseId}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({Object.values(professorGroups).flat().length} sections)
            </span>
          </h2>

          {Object.entries(professorGroups).map(([professor, sections]) => (
            <div key={professor} className="mb-6 last:mb-0">
              <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {professor}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {sections.map((section) => (
                  <SectionCard key={section.classNumber} section={section} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const SectionCard: React.FC<{ section: SelectedSection }> = ({ section }) => {
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    console.log("REMOVING SECTION", section);
  };

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-md p-3 bg-gray-50/50 dark:bg-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {section.classNumber}
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                section.enrollmentStatus === "O"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {section.enrollmentStatus === "O" ? "Open" : "Closed"}
            </span>
          </div>
          <SectionSchedule
            meetings={section.meetings as Meeting[]}
            hideLocation={true}
          />
        </div>
        <Button variant="secondary" onClick={handleRemove} className="text-xs">
          Remove
        </Button>
      </div>
    </div>
  );
};

export default SectionsChosen;
