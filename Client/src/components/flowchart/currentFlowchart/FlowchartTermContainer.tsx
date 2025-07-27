// TermContainer.tsx
import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import cloneDeep from "lodash-es/cloneDeep";
import { Droppable } from "@hello-pangea/dnd";

// Types
import { FlowchartData, Term } from "@polylink/shared/types";

// Icons
import { CircleCheck, CalendarPlus } from "lucide-react";

// My components
import CourseItem from "./CourseItem";

// UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PortalAwareDraggable from "@/components/layout/FlowchartPage/PortalAwareDraggable";
import useDeviceType from "@/hooks/useDeviceType";
import useFlowchartHistory from "@/hooks/useFlowchartHistory";

interface TermContainerProps {
  term: Term;
  termName: string;
  // eslint-disable-next-line no-unused-vars
  onCourseToggleComplete: (termIndex: number, courseIndex: number) => void;
}

const updateFlowchartTermData = (
  flowchartData: FlowchartData,
  newTermData: Term[]
) => {
  // Create a deep copy of flowchartData
  const updatedFlowchartData: FlowchartData = cloneDeep(flowchartData);

  // Update the termData property
  updatedFlowchartData.termData = newTermData;
  return updatedFlowchartData;
};

const TermContainer: React.FC<TermContainerProps> = ({
  term,
  termName,
  onCourseToggleComplete,
}) => {
  const dispatch = useAppDispatch();
  const device = useDeviceType();
  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const { saveCurrentState } = useFlowchartHistory();

  const getSummerTermIndex = () => {
    // Get current term's year index to determine summer term index
    const currentTermIndex = term.tIndex;
    const yearGroup = Math.floor((currentTermIndex - 1) / 4);
    const summerTermIndex = yearGroup * 4 + 4; // This gives us 4, 8, 12, etc.

    return summerTermIndex;
  };

  const summerTermIndex = getSummerTermIndex();

  const handleAddSummerTerm = () => {
    if (!flowchartData) return;

    // Check if summer term already exists
    if (flowchartData.termData.some((t) => t.tIndex === summerTermIndex)) {
      return; // Summer term already exists
    }

    // Save current state before making changes
    saveCurrentState();

    // Create new summer term
    const newSummerTerm: Term = {
      tIndex: summerTermIndex,
      tUnits: "0",
      courses: [],
    };

    const updatedTerms = [...flowchartData.termData];
    updatedTerms.push(newSummerTerm);
    updatedTerms.sort((a, b) => a.tIndex - b.tIndex);
    console.log(updatedTerms);

    const updatedFlowchartData = updateFlowchartTermData(
      flowchartData,
      updatedTerms
    );
    dispatch(flowchartActions.setFlowchartData(updatedFlowchartData));
  };

  // Operates like a switch state - all courses become completed/noncompleted
  const handleTermClick = () => {
    if (!flowchartData) return;

    // Save current state before making changes
    saveCurrentState();

    const areAllCoursesCompleted = term.courses.every(
      (course) => course.completed
    );
    const newCompletedState = !areAllCoursesCompleted;

    const updatedCourses = term.courses.map((course) => ({
      ...course,
      completed: newCompletedState,
    }));
    const updatedTerms = [...flowchartData.termData];

    // Function to get the correct index in updatedTerms
    const getCorrectIndex = (tIndex: number) => {
      const correctTIndex = updatedTerms.findIndex(
        (term) => term.tIndex === tIndex
      );
      return correctTIndex;
    };

    const correctIndex = getCorrectIndex(term.tIndex);

    // Check if the term already exists before updating
    if (updatedTerms[correctIndex]) {
      updatedTerms[correctIndex] = { ...term, courses: updatedCourses };
    } else {
      console.warn("Term index does not exist, possible duplicate creation.");
    }

    const updatedFlowchartData = updateFlowchartTermData(
      flowchartData,
      updatedTerms
    );
    dispatch(flowchartActions.setFlowchartData(updatedFlowchartData));
  };

  return (
    <div
      className={`flex flex-col w-full dark:bg-gray-900 shadow-md ${
        device === "desktop" ? "h-[calc(100vh-12rem)]" : "h-[calc(100vh-10rem)]"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Header */}
      <div className="flex justify-center items-center ml-6 py-2">
        <div className="inline-flex items-center gap-1">
          <span className="font-medium text-sm text-foreground">
            {termName}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => handleTermClick()}
          >
            <CircleCheck />
          </Button>
          {/* Spring terms are 3, 7, 11... */}
          {term.tIndex == summerTermIndex - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => handleAddSummerTerm()}
            >
              <CalendarPlus />
            </Button>
          )}
        </div>
        <hr className="my-2" />
      </div>

      {/* Scrollable content area */}
      <ScrollArea className="flex-1 min-w-full">
        <div className="h-full pb-4">
          <Droppable droppableId={`term-${term.tIndex}`}>
            {(provided) => (
              <div
                className={`flex flex-col gap-1 min-h-[200px] ${
                  term.courses.length === 0
                    ? "border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-2"
                    : ""
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {term.courses.map((course, index) => (
                  <PortalAwareDraggable
                    key={`${course.id || index}-${term.tIndex}`}
                    draggableId={`${course.id || index}-${term.tIndex}`}
                    index={index}
                  >
                    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars */}
                    {(_provided, _snapshot) => (
                      <CourseItem
                        termIndex={term.tIndex}
                        course={course}
                        coursePosition={index}
                        onToggleComplete={() =>
                          onCourseToggleComplete(term.tIndex, index)
                        }
                      />
                    )}
                  </PortalAwareDraggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </ScrollArea>

      {/* Fixed footer */}
      <div className="p-4 border-t border-slate-700">
        <h4 className="m-0">
          Units: {term.tUnits}
          {term.courses.length ? ` (${term.courses.length} courses)` : ""}
        </h4>
      </div>
    </div>
  );
};

export default TermContainer;
