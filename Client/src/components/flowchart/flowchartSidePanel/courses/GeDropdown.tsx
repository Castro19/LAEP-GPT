import { useState, memo, useRef, useCallback } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useAppSelector } from "@/redux";

// Types
import { CourseObject } from "@polylink/shared/types";
import { Course } from "@polylink/shared/types/flowChart";

// Fetch Helpers
import {
  fetchGeAreasAPI,
  fetchGeCoursesAPI,
  fetchGeSubjectsAPI,
} from "@/components/flowchart/helpers/fetchCourses";
import { getCatalogYear } from "@/components/flowchart/helpers/findCatalogYear";

// My components
import { SidebarCourse } from "@/components/flowchart";
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";

// Icons and UI Components
import { BookOpen } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

// Type for the course data structure
type GeCourseData = {
  [area: string]: {
    [subject: string]: CourseObject[];
  };
};

const GeDropdown = memo(() => {
  // State management
  const [geAreas, setGeAreas] = useState<string[]>([]);
  const [geSubjects, setGeSubjects] = useState<{ [area: string]: string[] }>(
    {}
  );
  const [geCourses, setGeCourses] = useState<GeCourseData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingAreas, setLoadingAreas] = useState<Set<string>>(new Set());
  const [loadingSubjects, setLoadingSubjects] = useState<Set<string>>(
    new Set()
  );
  const { flowchartData } = useAppSelector((state) => state.flowchart);

  // Get current catalog year
  const currentCatalogYear = getCatalogYear(flowchartData?.name);

  // Ref for the GE dropdown
  const geRef = useRef<HTMLButtonElement>(null);

  // Fetch GE areas
  const fetchGeAreas = useCallback(async () => {
    try {
      setIsLoading(true);
      const areas = await fetchGeAreasAPI(currentCatalogYear);
      setGeAreas(areas);
    } catch (error) {
      console.error("Failed to fetch GE areas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentCatalogYear]);

  // Fetch GE subjects for a specific area
  const fetchGeSubjects = useCallback(
    async (area: string) => {
      try {
        // Mark this area as loading
        setLoadingAreas((prev) => {
          const newSet = new Set(prev);
          newSet.add(area);
          return newSet;
        });

        const subjects = await fetchGeSubjectsAPI(area, currentCatalogYear);
        setGeSubjects((prev) => ({
          ...prev,
          [area]: subjects,
        }));
      } catch (error) {
        console.error(`Failed to fetch GE subjects for area ${area}:`, error);
      } finally {
        // Mark this area as no longer loading
        setLoadingAreas((prev) => {
          const newSet = new Set(prev);
          newSet.delete(area);
          return newSet;
        });
      }
    },
    [currentCatalogYear]
  );

  // Fetch GE courses for a specific subject and area
  const fetchGeCourses = async (subject: string, area: string) => {
    try {
      // Mark this subject as loading
      setLoadingSubjects((prev) => {
        const newSet = new Set(prev);
        newSet.add(`${area}-${subject}`);
        return newSet;
      });

      const response = await fetchGeCoursesAPI(
        subject,
        area,
        currentCatalogYear
      );

      // Extract the courses from the response
      // The API returns a nested structure, but we need to flatten it for our UI
      const courses: CourseObject[] = [];

      // Process the nested structure to extract all courses
      Object.values(response).forEach((category) => {
        Object.values(category).forEach((subjectCourses) => {
          courses.push(...subjectCourses);
        });
      });

      // Update the state with the flattened courses
      setGeCourses((prev) => {
        const updatedCourses: GeCourseData = {
          ...prev,
          [area]: {
            ...(prev[area] || {}),
            [subject]: courses,
          },
        };
        return updatedCourses;
      });
    } catch (error) {
      console.error(
        `Failed to fetch GE courses for subject ${subject} in area ${area}:`,
        error
      );
    } finally {
      // Mark this subject as no longer loading
      setLoadingSubjects((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`${area}-${subject}`);
        return newSet;
      });
    }
  };

  // Handle GE dropdown open/close
  const handleGeOpen = (open: boolean) => {
    if (open && geAreas.length === 0) {
      fetchGeAreas();
    }
  };

  // Handle area dropdown open/close
  const handleAreaOpen = (open: boolean, area: string) => {
    if (open && !geSubjects[area]) {
      fetchGeSubjects(area);
    }
  };

  // Handle subject dropdown open/close
  const handleSubjectOpen = (open: boolean, subject: string, area: string) => {
    if (open && (!geCourses[area] || !geCourses[area][subject])) {
      fetchGeCourses(subject, area);
    }
  };

  // Check if an area is currently loading
  const isAreaLoading = (area: string) => loadingAreas.has(area);

  // Check if a subject is currently loading
  const isSubjectLoading = (area: string, subject: string) =>
    loadingSubjects.has(`${area}-${subject}`);

  const geAreaMap = (area: string) => {
    switch (area) {
      case "UPPER_DIVISION_B":
        return "Upper Division B";
      case "UPPER_DIVISION_C":
        return "Upper Division C";
      case "UPPER_DIVISION_D":
        return "Upper Division D";
      default:
        return `Area ${area}`;
    }
  };

  return (
    <div className="w-full space-y-4">
      <CollapsibleContentWrapper
        title="GE"
        icon={BookOpen}
        defaultOpen={false}
        triggerRef={geRef}
        onOpenChange={handleGeOpen}
      >
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">Loading GE areas...</div>
          ) : (
            geAreas.map((area, index) => (
              <Collapsible
                key={index}
                onOpenChange={(open) => handleAreaOpen(open, area)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between items-center p-2 dark:bg-transparent dark:text-white rounded-lg shadow-md"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{geAreaMap(area)}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="p-3 mt-2 border-gray-200 dark:border-gray-800 shadow-inner">
                    {isAreaLoading(area) ? (
                      <div className="text-center py-4">
                        Loading subjects...
                      </div>
                    ) : geSubjects[area] ? (
                      <div className="space-y-4">
                        {geSubjects[area].map((subject, subjectIndex) => (
                          <Collapsible
                            key={subjectIndex}
                            onOpenChange={(open) =>
                              handleSubjectOpen(open, subject, area)
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
                                {isSubjectLoading(area, subject) ? (
                                  <div className="text-center py-2">
                                    Loading courses...
                                  </div>
                                ) : geCourses[area] &&
                                  geCourses[area][subject] ? (
                                  <div className="grid grid-cols-1 gap-2">
                                    {geCourses[area][subject].map(
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
                                            droppableId={`sidebar-${course.courseId}-ge`}
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
                        Click to load subjects for this area
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

GeDropdown.displayName = "GeDropdown";

export default GeDropdown;
