// FlowChatLayout.jsx
import React from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useAppDispatch, useAppSelector } from "@/redux";
import { Course, CourseObject, Term } from "@polylink/shared/types";
import { FlowchartData } from "@polylink/shared/types";
import { setFlowchartData } from "@/redux/flowchart/flowchartSlice";
import _ from "lodash";
import { toast } from "@/components/ui/use-toast";

const DragDropContextWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const flowchartData = useAppSelector(
    (state) => state.flowchart.flowchartData
  );
  const { catalog } = useAppSelector((state) => state.user.userData);
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // If dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (
      source.droppableId.startsWith("sidebar-") &&
      destination.droppableId.startsWith("term-")
    ) {
      // Handle dragging from sidebar to term container
      const termIndex = parseInt(destination.droppableId.split("-")[1], 10);
      const courseId = draggableId.replace("sidebar-", "");
      const courseFetched: CourseObject | null = await getCourseFromSidebar(
        catalog,
        courseId
      );
      if (!courseFetched) return;
      const course: Course = {
        id: courseFetched?.courseId || "",
        // Pick a nice beige color
        color: "#F5F5DC",
        displayName: courseFetched?.displayName || "",
        units: courseFetched?.units || "",
        desc: courseFetched?.desc || "",
      };

      if (course && flowchartData) {
        addCourseToTerm(flowchartData, termIndex, destination.index, course);
      }
    } else if (
      source.droppableId.startsWith("term-") &&
      destination.droppableId.startsWith("term-")
    ) {
      // Handle dragging between term containers
      const sourceTermIndex = parseInt(source.droppableId.split("-")[1], 10);
      const destTermIndex = parseInt(destination.droppableId.split("-")[1], 10);

      if (flowchartData) {
        moveCourseBetweenTerms(
          flowchartData,
          sourceTermIndex,
          destTermIndex,
          source.index,
          destination.index
        );
      }
    } else if (
      source.droppableId.startsWith("term-") &&
      destination.droppableId.startsWith("sidebar-")
    ) {
      // Prevent dragging from term container back to sidebar
      return;
    }
  };

  // Helper function to move course between terms
  const moveCourseBetweenTerms = (
    flowchartData: FlowchartData,
    sourceTermIndex: number,
    destTermIndex: number,
    sourceIndex: number,
    destIndex: number
  ) => {
    const newTermData = _.cloneDeep(flowchartData.termData);

    const sourceTerm = newTermData.find((t) => t.tIndex === sourceTermIndex);
    const destTerm = newTermData.find((t) => t.tIndex === destTermIndex);

    if (sourceTerm && destTerm) {
      const [movedCourse] = sourceTerm.courses.splice(sourceIndex, 1);
      destTerm.courses.splice(destIndex, 0, movedCourse);

      recalculateUnits(sourceTerm);
      recalculateUnits(destTerm);
      dispatch(setFlowchartData({ ...flowchartData, termData: newTermData }));
    }
  };

  const getCourseFromSidebar = async (
    catalogYear: string,
    courseId: string
  ): Promise<CourseObject | null> => {
    const response = await fetch(
      `http://localhost:4000/courses/course?catalogYear=${catalogYear}&courseId=${courseId}`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  };

  const addCourseToTerm = (
    flowchartData: FlowchartData,
    termIndex: number,
    index: number,
    course: Course
  ) => {
    // Check if the course already exists in any term
    if (course.id && courseExistsInFlowchart(course.id, flowchartData)) {
      toast({
        title: "Course already exists",
        description: "Course already exists in the flowchart",
        variant: "destructive",
      });
      return; // Prevent adding the duplicate course
    }

    const newTermData = _.cloneDeep(flowchartData.termData);
    const term = newTermData.find((t) => t.tIndex === termIndex);

    if (term) {
      term.courses.splice(index, 0, course);
      recalculateUnits(term);
      dispatch(setFlowchartData({ ...flowchartData, termData: newTermData }));
    }
  };

  const recalculateUnits = (term: Term) => {
    term.tUnits = term.courses
      .reduce((acc, course) => {
        const unitValue = course.customUnits || course.units;
        if (unitValue) {
          const parsedUnits = parseFloat(unitValue);
          return acc + (isNaN(parsedUnits) ? 0 : parsedUnits);
        }
        return acc;
      }, 0)
      .toString();
  };

  const courseExistsInFlowchart = (
    courseId: string,
    flowchartData: FlowchartData
  ): boolean => {
    return flowchartData.termData.some((term) =>
      term.courses.some((course) => course.id === courseId)
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>
  );
};

export default DragDropContextWrapper;
