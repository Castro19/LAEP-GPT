/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useAppSelector } from "@/redux";
import { useUserData } from "@/hooks/useUserData";
import { Course, CourseSidebar } from "@/types";
import { fetchCoursesAPI } from "../../helpers/fetchCourses";
import { SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Draggable } from "@hello-pangea/dnd";
import { SidebarMenuSub } from "@/components/ui/sidebar";
import { Droppable } from "@hello-pangea/dnd";
import SidebarCourse from "./SidebarCourse";
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
  const { selections } = useAppSelector((state) => state.flowchart);
  const { userData } = useUserData();

  const catalogYear = selections.catalog || userData.catalog || "2022-2026";
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
        console.error("Failed to fetch courses:", err);
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
          <CommandEmpty>No class found.</CommandEmpty>
        ) : (
          <CommandGroup>
            {courses.map((item, index) => {
              const course = {
                id: item.courseId,
                color: "#ffffff",
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