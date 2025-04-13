// FlowChatLayout.jsx
import {
  useAppDispatch,
  useAppSelector,
  flowchartActions,
  layoutActions,
} from "@/redux";
import { DragDropContext, DropResult, DragUpdate } from "@hello-pangea/dnd";
import cloneDeep from "lodash-es/cloneDeep";
import { ReactNode } from "react";

// Types
import {
  Course,
  CourseObject,
  Term,
  FlowchartData,
} from "@polylink/shared/types";

// Helper functions
import { toast } from "@/components/ui/use-toast";
import { serverUrl } from "@/helpers/getEnvironmentVars";

interface DragDropContextWrapperProps {
  children: ReactNode;
}

const DragDropContextWrapper = ({ children }: DragDropContextWrapperProps) => {
  const dispatch = useAppDispatch();
  const flowchartData = useAppSelector(
    (state) => state.flowchart.flowchartData
  );
  const { catalog } = useAppSelector(
    (state) => state.user.userData.flowchartInformation
  );

  const handleDragStart = () => {
    dispatch(layoutActions.setDragState({ isDragging: true, direction: null }));
  };

  const handleDragEnd = async (result: DropResult) => {
    dispatch(
      layoutActions.setDragState({ isDragging: false, direction: null })
    );

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
      const isGe = source.droppableId.includes("ge");

      const termIndex = parseInt(destination.droppableId.split("-")[1], 10);

      const courseId = draggableId.replace("sidebar-", "").replace("-ge", "");
      const courseFetched: CourseObject | null = await getCourseFromSidebar(
        catalog ? catalog : "2022-2026",
        courseId
      );
      if (!courseFetched) return;
      const course: Course = {
        id: courseFetched?.courseId || "",
        // Pick a nice beige color
        color: isGe ? "#DCFDD2" : "#F5F5DC",
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

  const handleDragUpdate = (update: DragUpdate) => {
    if (!update.destination) return;

    const source = update.source;
    const destination = update.destination;

    // Calculate drag direction based on source and destination
    let direction: "left" | "right" | "up" | "down" | null = null;

    if (source.droppableId === destination.droppableId) {
      // Same container
      if (source.index > destination.index) {
        direction = "up";
      } else if (source.index < destination.index) {
        direction = "down";
      }
    } else {
      // Different containers
      const sourceIndex = parseInt(source.droppableId.split("-")[1]);
      const destIndex = parseInt(destination.droppableId.split("-")[1]);

      if (sourceIndex > destIndex) {
        direction = "left";
      } else if (sourceIndex < destIndex) {
        direction = "right";
      }
    }

    dispatch(layoutActions.setDragState({ isDragging: true, direction }));
  };

  // Helper function to move course between terms
  const moveCourseBetweenTerms = (
    flowchartData: FlowchartData,
    sourceTermIndex: number,
    destTermIndex: number,
    sourceIndex: number,
    destIndex: number
  ) => {
    const newTermData: Term[] = cloneDeep(flowchartData.termData);

    const sourceTerm = newTermData.find((t) => t.tIndex === sourceTermIndex);
    const destTerm = newTermData.find((t) => t.tIndex === destTermIndex);

    if (sourceTerm && destTerm) {
      const [movedCourse] = sourceTerm.courses.splice(sourceIndex, 1);
      destTerm.courses.splice(destIndex, 0, movedCourse);

      recalculateUnits(sourceTerm);
      recalculateUnits(destTerm);
      dispatch(
        flowchartActions.setFlowchartData({
          ...flowchartData,
          termData: newTermData,
        })
      );
    }
  };

  const getCourseFromSidebar = async (
    catalogYear: string,
    courseId: string
  ): Promise<CourseObject | null> => {
    const response = await fetch(
      `${serverUrl}/courses/course?catalogYear=${catalogYear}&courseId=${courseId}`,
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

    const newTermData: Term[] = cloneDeep(flowchartData.termData);
    const term = newTermData.find((t) => t.tIndex === termIndex);

    if (term) {
      term.courses.splice(index, 0, course);
      recalculateUnits(term);
      dispatch(
        flowchartActions.setFlowchartData({
          ...flowchartData,
          termData: newTermData,
        })
      );
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
    <DragDropContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragUpdate={handleDragUpdate}
    >
      {children}
    </DragDropContext>
  );
};

export default DragDropContextWrapper;
