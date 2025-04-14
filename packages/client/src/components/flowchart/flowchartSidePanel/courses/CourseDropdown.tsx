import { useState, useEffect, memo, useRef } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useAppSelector } from "@/redux";

// Types
import {
  Course,
  CourseSidebar,
  CourseSubject,
  SidebarInfo,
} from "@polylink/shared/types";

// Fetch Helpers
import {
  fetchCoursesBySubjectAPI,
  fetchSubjectNamesAPI,
} from "@/components/flowchart";
import { getCatalogYear } from "@/components/flowchart/helpers/findCatalogYear";

// My components
import { SidebarCourse, CourseSearchbar } from "@/components/flowchart";
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";

// Icons and UI Components
import {
  ChevronDown,
  PenTool, // For GWR - represents writing requirement
  Globe, // For USCP - represents cultural pluralism
  BookOpen, // Default icon
  LucideIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GeDropdown from "./GeDropdown";
import TechElectiveDropdown from "./TechElectiveDropdown";

// Course type definitions
type CourseType = "GWR" | "USCP"; // Current types
// type FutureCourseType = "TECH" | "INTEREST"; // Future types
// type AllCourseType = CourseType | FutureCourseType;

// Course type configuration
const COURSE_TYPES: Record<
  CourseType,
  {
    name: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  GWR: {
    name: "GWR",
    description: "Graduation Writing Requirement",
    icon: PenTool,
  },
  USCP: {
    name: "USCP",
    description: "United States Cultural Pluralism",
    icon: Globe,
  },
};

// Future course types configuration (commented out for now)
/*
const FUTURE_COURSE_TYPES: Record<FutureCourseType, {
  name: string;
  description: string;
  icon: LucideIcon;
}> = {
  TECH: {
    name: "Tech Electives",
    description: "Technical Elective Courses",
    icon: Cpu,
  },
  INTEREST: {
    name: "Recommended Courses",
    description: "Based on your interests",
    icon: Heart,
  },
};
*/

const CourseDropdown = memo(() => {
  // State management
  const [allClasses, setAllClasses] = useState<SidebarInfo>({});
  const [courseData, setCourseData] = useState<
    Record<CourseType, CourseSubject[]>
  >({
    GWR: [],
    USCP: [],
  });
  const { flowchartData } = useAppSelector((state) => state.flowchart);

  // Get current catalog year
  const currentCatalogYear = getCatalogYear(flowchartData?.name);

  // Refs for each course type
  const refs: Record<CourseType, React.RefObject<HTMLButtonElement>> = {
    GWR: useRef<HTMLButtonElement>(null),
    USCP: useRef<HTMLButtonElement>(null),
  };

  // API calls
  const fetchSubjects = async (type: CourseType) => {
    const subjectNamesFetched = await fetchSubjectNamesAPI(currentCatalogYear, {
      gwr: type === "GWR" ? "true" : "false",
      uscp: type === "USCP" ? "true" : "false",
      searchTerm: "",
    });

    const subjectCourses: CourseSubject[] = subjectNamesFetched.map(
      (subject) => ({
        subject,
        courses: [],
      })
    );

    setCourseData((prev) => ({
      ...prev,
      [type]: subjectCourses,
    }));
  };

  const fetchCourseBySubject = async (type: CourseType, subject: string) => {
    const currentCourses = courseData[type].find(
      (item) => item.subject === subject
    )?.courses;

    if (currentCourses && currentCourses.length > 0) {
      // Data already fetched, no need to fetch again
      return;
    }

    // Fetch data if not already fetched
    const courses = await fetchCoursesBySubjectAPI(currentCatalogYear, {
      gwr: type === "GWR" ? "true" : "false",
      uscp: type === "USCP" ? "true" : "false",
      subject,
      page: "1",
      pageSize: "10",
    });

    updateCourses(type, subject, courses);
  };

  // State update helpers
  const updateCourses = (
    type: CourseType,
    subject: string,
    newCourses: CourseSidebar[]
  ) => {
    setCourseData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.subject === subject ? { ...item, courses: newCourses } : item
      ),
    }));
  };

  // Event handlers
  const handleSubjectOpenChange = (
    open: boolean,
    type: CourseType,
    subject: string
  ) => {
    if (open) {
      fetchCourseBySubject(type, subject);
    } else {
      // Remove courses from state to free up memory
      updateCourses(type, subject, []);
    }
  };

  const handleCourseTypeOpen = (open: boolean, type: CourseType) => {
    if (open) {
      fetchSubjects(type);
    }
  };

  // Helper functions
  const getCourseTypeIcon = (type: string) => {
    const courseType = type.split(" ")[0].toUpperCase() as CourseType;
    return COURSE_TYPES[courseType]?.icon || BookOpen;
  };

  // Update allClasses when courseData changes
  useEffect(() => {
    const newAllClasses: SidebarInfo = {};

    Object.entries(courseData).forEach(([type, subjects]) => {
      const courseType = type as CourseType;
      if (COURSE_TYPES[courseType]) {
        newAllClasses[COURSE_TYPES[courseType].name] = subjects;
      }
    });

    setAllClasses(newAllClasses);
  }, [courseData]);

  return (
    <div className="w-full space-y-4">
      {Object.entries(allClasses ?? {}).map(([key, value]) => {
        const Icon = getCourseTypeIcon(key);
        const courseType = key.split(" ")[0].toUpperCase() as CourseType;
        const triggerRef = refs[courseType];

        return (
          <CollapsibleContentWrapper
            key={key}
            title={key}
            icon={Icon}
            defaultOpen={false}
            triggerRef={triggerRef}
            onOpenChange={(open) => {
              handleCourseTypeOpen(open, courseType);
            }}
          >
            <div className="space-y-3">
              {value.map((subject: CourseSubject, index: number) => (
                <Collapsible
                  key={index}
                  onOpenChange={(open) => {
                    handleSubjectOpenChange(open, courseType, subject.subject);
                  }}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between items-center p-2 dark:bg-transparent dark:text-white rounded-lg shadow-md"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{subject.subject}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Card className="p-3 mt-2 border-gray-200 dark:border-gray-800 shadow-inner">
                      <div className="grid grid-cols-1 gap-2">
                        {subject.courses.map((item, index) => {
                          const course = {
                            id: item.courseId,
                            color: "#F5F5DC",
                            units: item.units,
                            displayName: item.displayName,
                            desc: item.desc,
                          } as Course;
                          return (
                            <Droppable
                              key={`sidebar-${course.id}`}
                              droppableId={`sidebar-${course.id}`}
                            >
                              {(provided) => (
                                <div
                                  className="w-full"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  <Draggable
                                    key={course.id}
                                    draggableId={course.id!}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="w-full"
                                      >
                                        <SidebarCourse course={course} />
                                      </div>
                                    )}
                                  </Draggable>
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          );
                        })}
                      </div>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CollapsibleContentWrapper>
        );
      })}
      <GeDropdown />
      <TechElectiveDropdown />
      <CourseSearchbar />
    </div>
  );
});

CourseDropdown.displayName = "CourseDropdown";

export default CourseDropdown;
