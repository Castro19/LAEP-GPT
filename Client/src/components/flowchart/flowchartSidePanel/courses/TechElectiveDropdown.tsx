import { useState, memo, useRef, useCallback } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useAppSelector } from "@/redux";

// Types
import { CourseObject } from "@polylink/shared/types";
import { Course } from "@polylink/shared/types/flowChart";

// Fetch Helpers
import {
  fetchTechElectiveInfoAPI,
  fetchTechElectiveSubjectsAPI,
  fetchTechElectiveCourseDetailsAPI,
} from "@/components/flowchart/helpers/fetchCourses";

// My components
import { SidebarCourse } from "@/components/flowchart";
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";

// Icons and UI Components
import { Cpu, ExternalLink, AlertTriangle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

// Type for the course data structure
type TechElectiveCourseData = {
  [category: string]: {
    [subject: string]: CourseObject[];
  };
};

const TechElectiveDropdown = memo(() => {
  // State management
  const [techElectiveInfo, setTechElectiveInfo] = useState<{
    major: string;
    concentration: string;
    url: string;
    categories: string[];
  }>({
    major: "",
    concentration: "",
    url: "",
    categories: [],
  });

  const [teSubjects, setTeSubjects] = useState<{
    [category: string]: string[];
  }>({});
  const [teCourses, setTeCourses] = useState<TechElectiveCourseData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(
    new Set()
  );
  const [loadingSubjects, setLoadingSubjects] = useState<Set<string>>(
    new Set()
  );
  const { flowchartData } = useAppSelector((state) => state.flowchart);

  // Ref for the Tech Elective dropdown
  const teRef = useRef<HTMLButtonElement>(null);

  // Fetch Tech Elective categories
  const fetchTechElectiveCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      if (flowchartData?.name) {
        const techElectiveInfo = await fetchTechElectiveInfoAPI(
          flowchartData.name
        );
        setTechElectiveInfo(techElectiveInfo);
      }
    } catch (error) {
      console.error("Failed to fetch tech elective categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [flowchartData?.name]);

  // Fetch Tech Elective subjects for a specific category
  const fetchTechElectiveSubjects = useCallback(
    async (category: string) => {
      try {
        // Mark this category as loading
        setLoadingCategories((prev) => {
          const newSet = new Set(prev);
          newSet.add(category);
          return newSet;
        });

        if (flowchartData?.name) {
          const subjects = await fetchTechElectiveSubjectsAPI(
            category,
            flowchartData.name
          );
          setTeSubjects((prev) => ({
            ...prev,
            [category]: subjects,
          }));
        }
      } catch (error) {
        console.error(
          `Failed to fetch tech elective subjects for category ${category}:`,
          error
        );
      } finally {
        // Mark this category as no longer loading
        setLoadingCategories((prev) => {
          const newSet = new Set(prev);
          newSet.delete(category);
          return newSet;
        });
      }
    },
    [flowchartData?.name]
  );

  // Fetch Tech Elective courses for a specific subject and category
  const fetchTechElectiveCourses = async (
    subject: string,
    category: string
  ) => {
    try {
      // Mark this subject as loading
      setLoadingSubjects((prev) => {
        const newSet = new Set(prev);
        newSet.add(`${category}-${subject}`);
        return newSet;
      });

      if (flowchartData?.name) {
        const courseDetails = await fetchTechElectiveCourseDetailsAPI(
          subject,
          category,
          flowchartData.name
        );

        // Update the state with the course details
        setTeCourses((prev) => {
          const updatedCourses: TechElectiveCourseData = {
            ...prev,
            [category]: {
              ...(prev[category] || {}),
              [subject]: courseDetails,
            },
          };
          return updatedCourses;
        });
      }
    } catch (error) {
      console.error(
        `Failed to fetch tech elective courses for subject ${subject} in category ${category}:`,
        error
      );
    } finally {
      // Mark this subject as no longer loading
      setLoadingSubjects((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`${category}-${subject}`);
        return newSet;
      });
    }
  };

  // Handle Tech Elective dropdown open/close
  const handleTeOpen = (open: boolean) => {
    if (open && techElectiveInfo.categories.length === 0) {
      fetchTechElectiveCategories();
    }
  };

  // Handle category dropdown open/close
  const handleCategoryOpen = (open: boolean, category: string) => {
    if (open && !teSubjects[category]) {
      fetchTechElectiveSubjects(category);
    }
  };

  // Handle subject dropdown open/close
  const handleSubjectOpen = (
    open: boolean,
    subject: string,
    category: string
  ) => {
    if (open && (!teCourses[category] || !teCourses[category][subject])) {
      fetchTechElectiveCourses(subject, category);
    }
  };

  // Check if a category is currently loading
  const isCategoryLoading = (category: string) =>
    loadingCategories.has(category);

  // Check if a subject is currently loading
  const isSubjectLoading = (category: string, subject: string) =>
    loadingSubjects.has(`${category}-${subject}`);

  return (
    <div className="w-full space-y-4">
      <CollapsibleContentWrapper
        title="Tech Electives"
        icon={Cpu}
        defaultOpen={false}
        triggerRef={teRef}
        onOpenChange={handleTeOpen}
      >
        <div className="space-y-3">
          {/* Tech Elective Info and Disclaimer */}
          {techElectiveInfo.major && (
            <div className="mb-3 px-2 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-md text-xs">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {techElectiveInfo.major}
                    {techElectiveInfo.concentration && (
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        ({techElectiveInfo.concentration})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 leading-tight">
                    Tech Electives are for Catalog 2022-2026
                  </span>
                </div>

                {techElectiveInfo.url && (
                  <a
                    href={techElectiveInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                  >
                    <span className="leading-tight">
                      View official catalog page
                    </span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-4">
              Loading tech elective categories...
            </div>
          ) : (
            techElectiveInfo.categories.map((category, index) => (
              <Collapsible
                key={index}
                onOpenChange={(open) => handleCategoryOpen(open, category)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between items-center p-2 dark:bg-transparent dark:text-white rounded-lg shadow-md"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{category || "Other"}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="p-3 mt-2 border-gray-200 dark:border-gray-800 shadow-inner">
                    {isCategoryLoading(category) ? (
                      <div className="text-center py-4">
                        Loading subjects...
                      </div>
                    ) : teSubjects[category] ? (
                      <div className="space-y-4">
                        {teSubjects[category].map((subject, subjectIndex) => (
                          <Collapsible
                            key={subjectIndex}
                            onOpenChange={(open) =>
                              handleSubjectOpen(open, subject, category)
                            }
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-between items-center p-2 text-sm"
                              >
                                <div className="flex items-center space-x-2">
                                  <span>{subject}</span>
                                </div>
                                <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="pl-4 py-2">
                                {isSubjectLoading(category, subject) ? (
                                  <div className="text-center py-2">
                                    Loading courses...
                                  </div>
                                ) : teCourses[category] &&
                                  teCourses[category][subject] ? (
                                  <div className="grid grid-cols-1 gap-2">
                                    {teCourses[category][subject].map(
                                      (course, courseIndex) => {
                                        const courseData: Course = {
                                          id: course.courseId,
                                          color: "#DCFDD2",
                                          units: course.units,
                                          displayName: course.displayName,
                                          desc: course.desc,
                                        };
                                        return (
                                          <Droppable
                                            key={`sidebar-${course.courseId}`}
                                            droppableId={`sidebar-${course.courseId}-te`}
                                          >
                                            {(provided) => (
                                              <div
                                                className="w-full"
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                              >
                                                <Draggable
                                                  key={course.courseId}
                                                  draggableId={course.courseId}
                                                  index={courseIndex}
                                                >
                                                  {(provided) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      className="w-full"
                                                    >
                                                      <SidebarCourse
                                                        course={courseData}
                                                      />
                                                    </div>
                                                  )}
                                                </Draggable>
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        );
                                      }
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center py-2 text-gray-500">
                                    Click to load courses
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Click to load subjects for this category
                      </div>
                    )}
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </div>
      </CollapsibleContentWrapper>
    </div>
  );
});

TechElectiveDropdown.displayName = "TechElectiveDropdown";

export default TechElectiveDropdown;
