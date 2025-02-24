import {
  sectionSelectionActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { SelectedSection } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { convertTo12HourFormat } from "@/components/section/helpers/timeFormatter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  transformSectionToSelectedSection,
  transformToSectionDetail,
} from "@/helpers/transformSection";
import StarRating from "@/components/section/reusable/sectionInfo/StarRating";

const AddSectionSidebar = () => {
  const navigate = useNavigate();

  const { sidebarSections } = useAppSelector((state) => state.sectionSelection);
  const sidebarSectionsList = sidebarSections.map((section) => {
    const sectionDetail = transformToSectionDetail(section);
    return transformSectionToSelectedSection(sectionDetail);
  });
  // Group sections by courseId and professor
  if (sidebarSectionsList.length === 0 || !Array.isArray(sidebarSectionsList)) {
    return (
      <div className="p-2 text-gray-500 dark:text-gray-400 text-sm">
        The sections you select from the{" "}
        <strong
          className="text-blue-300/80 cursor-pointer"
          onClick={() => navigate("/section")}
        >
          Class Search
        </strong>{" "}
        page will appear here
      </div>
    );
  }

  const groupedSections = sidebarSectionsList.reduce(
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
          <div className="bg-white dark:bg-slate-900 rounded-md border border-gray-200 dark:border-slate-700">
            <div className="bg-slate-800 flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors cursor-pointer rounded-md ">
              <CollapsibleTrigger asChild>
                <div className="flex-1 flex justify-start items-center">
                  <div className="flex items-center gap-3">
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                      {courseId}
                    </h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                      {Object.values(professorGroups).flat().length} sections
                    </span>
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="px-3 pb-3 ">
                {Object.entries(professorGroups)
                  .sort(([, sectionsA], [, sectionsB]) => {
                    const ratingA = sectionsA[0]?.rating || 0;
                    const ratingB = sectionsB[0]?.rating || 0;
                    return ratingB - ratingA; // Sort in descending order
                  })
                  .map(([professor, sections]) => (
                    <Collapsible key={professor} className="group/collapsible">
                      <div className=" border-gray-100 dark:border-slate-700 pt-2">
                        <CollapsibleTrigger asChild>
                          <div className="flex justify-between items-center mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 px-2 py-1 rounded">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {professor
                                .split(" ")
                                .map(
                                  (name) =>
                                    name.charAt(0).toUpperCase() +
                                    name.slice(1).toLowerCase()
                                )
                                .join(" ")}
                            </h3>
                            <div className="flex items-center gap-6">
                              {sections[0]?.professors[0]?.id && (
                                <a
                                  href={`https://polyratings.dev/professor/${sections[0].professors[0].id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <img
                                    src="/polyratings.ico"
                                    alt="PolyRatings"
                                    className="w-3 h-3 cursor-pointer hover:opacity-80"
                                  />
                                </a>
                              )}
                              {!sections[0]?.professors[0]?.id && (
                                <a
                                  href={`https://polyratings.dev/search/name?term=${encodeURIComponent(professor)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <img
                                    src="/polyratings.ico"
                                    alt="PolyRatings"
                                    className="w-3 h-3 cursor-pointer hover:opacity-80"
                                  />
                                </a>
                              )}
                              <StarRating
                                overallRating={sections[0]?.rating || 0}
                                size={12}
                              />
                            </div>
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
                  ))}
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
  const sidebarSection = useAppSelector((state) =>
    state.sectionSelection.sidebarSections.find(
      (s) => s.classNumber === section.classNumber
    )
  );

  // Handler to add a section
  const handleAdd = async () => {
    if (!sidebarSection) {
      return;
    }
    const sectionDetail = transformToSectionDetail(sidebarSection);
    const { payload } = await dispatch(
      sectionSelectionActions.createOrUpdateSelectedSectionAsync(sectionDetail)
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
    }
  };

  // Extract and format start & end time
  const { meetings } = section;
  const startTime = meetings?.[0]?.start_time
    ? convertTo12HourFormat(meetings[0].start_time)
    : "N/A";
  const endTime = meetings?.[0]?.end_time
    ? convertTo12HourFormat(meetings[0].end_time)
    : "N/A";

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-md p-2 bg-transparent transition-colors flex flex-col">
      <div className="space-y-1 flex-1">
        {/* First Row: Format as 'LAB 3500' */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {`${section.component.toUpperCase()} ${section.classNumber}`}
          </span>

          {/* Enrollment Status (Open/Closed) */}
          <span
            className={`text-xxs px-1.5 py-0.5 rounded ${
              section.enrollmentStatus === "O"
                ? "bg-[#204139] text-green-800 dark:bg-[#204139] dark:text-[#5EB752]"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {section.enrollmentStatus === "O" ? "Open" : "Closed"}
          </span>
        </div>

        {/* Days - Bubble Style */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Days</span>
          <span className="text-xs px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
            {meetings?.[0]?.days || "N/A"}
          </span>
        </div>

        {/* Time & Remove Button - On the Same Line */}
        <div className="flex justify-between items-center">
          {/* Time - Bubble Style */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Time
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                {startTime}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                to
              </span>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                {endTime}
              </span>
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAdd()}
            className=""
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddSectionSidebar;
