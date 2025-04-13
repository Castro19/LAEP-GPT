/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
// Types
import { Course, CourseSidebar } from "@polylink/shared/types";
// Course Components & Fetch Helpers
import { SidebarCourse, fetchCoursesAPI } from "@/components/flowchart";
// UI Components
import { SidebarMenuSubItem, SidebarMenuSub } from "@/components/ui/sidebar";
// Env vars
import { environment } from "@/helpers/getEnvironmentVars";
import { useAppSelector } from "@/redux";
import { getCatalogYear } from "../../helpers/findCatalogYear";

// Debounce function
// eslint-disable-next-line no-unused-vars
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const CourseSearchbar = () => {
  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const catalogYear = getCatalogYear(flowchartData?.name);

  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [courses, setCourses] = useState<CourseSidebar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce input value changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputChange = useCallback(
    debounce((value) => {
      setInputValue(value);
    }, 300),
    []
  );

  // Fetch courses when inputValue changes
  useEffect(() => {
    if (!inputValue) {
      setCourses([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    const fetchCourses = async () => {
      try {
        const coursesFetched = await fetchCoursesAPI(catalogYear, inputValue);

        setCourses(coursesFetched || []);
      } catch (err) {
        if (environment === "dev") {
          console.error("Failed to fetch courses:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [inputValue, catalogYear]);

  const hasMatches = courses.length > 0;

  return (
    <Command className="w-full min-h-full">
      <CommandInput
        placeholder="Type to search for a class"
        onValueChange={(value) => handleInputChange(value)}
      />
      <CommandList>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : inputValue !== "" && !hasMatches ? (
          <CommandEmpty className="text-center">
            No class found.
            <br />
            <br />
            Search for a course without a space between the course name and the
            section number.
            <br />
            EX: UNIV401 instead of UNIV 401.
          </CommandEmpty>
        ) : (
          <CommandGroup>
            {courses.map((item, index) => {
              const course = {
                id: item.courseId,
                color: "#F5F5DC",
                units: item.units,
                displayName: item.displayName,
                desc: item.desc,
              } as Course;
              return (
                <CommandItem
                  key={index}
                  value={course.id!}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    // You might want to handle course selection here
                  }}
                >
                  <Droppable
                    key={`sidebar-${course.id}`}
                    droppableId={`sidebar-${course.id}`}
                  >
                    {(provided) => (
                      <SidebarMenuSub
                        className="w-full gap-y-1"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <Draggable
                          key={course.id}
                          draggableId={course.id!}
                          index={index}
                        >
                          {(provided) => (
                            <SidebarMenuSubItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <SidebarCourse course={course} />
                            </SidebarMenuSubItem>
                          )}
                        </Draggable>
                        {provided.placeholder}
                      </SidebarMenuSub>
                    )}
                  </Droppable>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default CourseSearchbar;
