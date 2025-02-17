import React, { useState, useEffect } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

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

// My components
import { SidebarCourse } from "@/components/flowchart";

// Icons and UI Components
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarGroup,
} from "@/components/ui/sidebar";

const CourseDropdown = React.memo(() => {
  const [allClasses, setAllClasses] = useState<SidebarInfo>({});
  const [gwrCourses, setGwrCourses] = useState<CourseSubject[]>([]);
  const [uscpCourses, setUscpFetched] = useState<CourseSubject[]>([]);

  const fetchSubjects = async (type: "GWR" | "USCP") => {
    const subjectNamesFetched = await fetchSubjectNamesAPI("2022-2026", {
      ge: "false",
      gwr: type === "GWR" ? "true" : "false",
      uscp: type === "USCP" ? "true" : "false",
      searchTerm: "",
    });
    const subjectCourses: CourseSubject[] = [];
    subjectNamesFetched.map((subject) => {
      subjectCourses.push({
        subject,
        courses: [],
      });
    });

    if (type === "GWR") {
      setGwrCourses(subjectCourses);
    } else if (type === "USCP") {
      setUscpFetched(subjectCourses);
    }
  };

  const fetchCourseBySubject = async (
    type: "GWR" | "USCP",
    subject: string
  ) => {
    const currentCourses = (type === "GWR" ? gwrCourses : uscpCourses).find(
      (item) => item.subject === subject
    )?.courses;

    if (currentCourses && currentCourses.length > 0) {
      // Data already fetched, no need to fetch again
      return;
    }

    // Fetch data if not already fetched
    const courses = await fetchCoursesBySubjectAPI("2022-2026", {
      gwr: type === "GWR" ? "true" : "false",
      uscp: type === "USCP" ? "true" : "false",
      subject,
      page: "1",
      pageSize: "10",
    });

    updateCourses(type, subject, courses);
  };

  const updateCourses = (
    type: "GWR" | "USCP",
    subject: string,
    newCourses: CourseSidebar[]
  ) => {
    const updateFunction = (prev: CourseSubject[]) => {
      return prev.map((item) =>
        item.subject === subject ? { ...item, courses: newCourses } : item
      );
    };

    if (type === "GWR") {
      setGwrCourses(updateFunction);
    } else {
      setUscpFetched(updateFunction);
    }
  };

  const handleSubjectOpenChange = (
    open: boolean,
    type: "GWR" | "USCP",
    subject: string
  ) => {
    if (open) {
      fetchCourseBySubject(type, subject);
    } else {
      // Remove courses from state to free up memory
      updateCourses(type, subject, []);
    }
  };

  useEffect(() => {
    setAllClasses({
      "GWR Courses": gwrCourses ?? [],
      "USCP Courses": uscpCourses ?? [],
    });
  }, [gwrCourses, uscpCourses]);

  return (
    <>
      <SidebarGroupLabel>Classes</SidebarGroupLabel>
      {Object.entries(allClasses ?? {}).map(([key, value]) => (
        <SidebarGroup key={key}>
          <SidebarMenu>
            <Collapsible
              className="group/collapsible"
              onOpenChange={(open) => {
                if (open) {
                  fetchSubjects(
                    key.split(" ")[0].toUpperCase() as "GWR" | "USCP"
                  );
                }
              }}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <div className="flex items-center justify-between w-full text-lg">
                      {key}
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="my-2">
                  <SidebarMenuSub>
                    {value.map((subject: CourseSubject, index: number) => (
                      <Collapsible
                        key={index}
                        onOpenChange={(open) => {
                          handleSubjectOpenChange(
                            open,
                            key.split(" ")[0].toUpperCase() as "GWR" | "USCP",
                            subject.subject
                          );
                        }}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full">
                            <div className="flex items-center justify-between w-full text-lg">
                              {subject.subject}
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="my-2">
                          {subject.courses.map((item, index) => {
                            const course = {
                              id: item.courseId,
                              // Pick a nice beige color
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
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
});

CourseDropdown.displayName = "CourseDropdown";

export default CourseDropdown;
