import { useAppDispatch, useAppSelector } from "@/redux";
import { Meeting, SelectedSection } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { SectionSchedule } from "@/components/section/currentSectionList/sectionInfo";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { removeSelectedSectionAsync } from "@/redux/sectionSelection/sectionSelectionSlice";

const SectionsChosen = () => {
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  // Group sections by courseId and professor
  if (selectedSections.length === 0 || !Array.isArray(selectedSections)) {
    return <div>No sections chosen</div>;
  }

  const groupedSections = selectedSections.reduce(
    (acc, section) => {
      const courseKey = section.courseId;
      const professorKey = section.professors.map((p) => p.name).join(", ");

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

  return (
    <div className="grid grid-cols-1 gap-2">
      {Object.entries(groupedSections).map(([courseId, professorGroups]) => (
        <Collapsible key={courseId} className="group/collapsible">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    {courseId}
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                    {Object.values(professorGroups).flat().length} sections
                  </span>
                </div>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-3">
                {Object.entries(professorGroups).map(
                  ([professor, sections]) => (
                    <Collapsible
                      key={professor}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <div className="border-t border-gray-100 dark:border-slate-700 pt-3">
                        <CollapsibleTrigger asChild>
                          <div className="flex justify-between items-center mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 px-2 py-1 rounded">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {professor}
                            </h3>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="grid grid-cols-1 gap-1.5">
                            {sections.map((section) => (
                              <SectionCard
                                key={section.classNumber}
                                section={section}
                              />
                            ))}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  )
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </div>
  );
};

const SectionCard: React.FC<{ section: SelectedSection }> = ({ section }) => {
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(removeSelectedSectionAsync(section.classNumber));
  };

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-md p-2 bg-gray-50/50 dark:bg-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1 flex-1">
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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-xs h-7 px-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default SectionsChosen;
