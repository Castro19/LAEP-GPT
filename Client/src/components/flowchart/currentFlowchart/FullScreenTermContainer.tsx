import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import cloneDeep from "lodash-es/cloneDeep";
import { Droppable } from "@hello-pangea/dnd";

// Types
import { FlowchartData, Term } from "@polylink/shared/types";

// Icons
import { CalendarPlus } from "lucide-react";
import { CircleCheck } from "lucide-react";

// My components
import FullScreenCourseItem from "./FullScreenCourseItem";

// UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PortalAwareDraggable from "@/components/layout/FlowchartPage/PortalAwareDraggable";

interface FullScreenTermContainerProps {
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

const FullScreenTermContainer: React.FC<FullScreenTermContainerProps> = ({
  term,
  termName,
  onCourseToggleComplete,
}) => {
  const dispatch = useAppDispatch();
  const { flowchartData } = useAppSelector((state) => state.flowchart);

  const getSummerTermIndex = () => {
    // Get current term's year index to determine summer term index
    const currentTermIndex = term.tIndex;
    const yearGroup = Math.floor((currentTermIndex - 1) / 4);
    const summerTermIndex = yearGroup * 4 + 4; // This gives us 4, 8, 12, etc.
    
    return summerTermIndex;
  }

  const summerTermIndex = getSummerTermIndex();

  const handleAddSummerTerm = () => {
    if (!flowchartData) return;

    // Check if summer term already exists
    if (flowchartData.termData.some((t) => t.tIndex === summerTermIndex)) {
      return; // Summer term already exists
    }
    
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

    const updatedFlowchartData = updateFlowchartTermData(flowchartData, updatedTerms);
    dispatch(flowchartActions.setFlowchartData(updatedFlowchartData));
  };

  // Operates like a switch state - all courses become completed/noncompleted
  const handleTermClick = () => {
    if (!flowchartData) return;
    const areAllCoursesCompleted = term.courses.every(course => course.completed);
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

    updateFlowchartTermData(flowchartData, updatedTerms);
    const updatedFlowchartData = { ...flowchartData, termData: updatedTerms };
    dispatch(flowchartActions.setFlowchartData(updatedFlowchartData));
  };

  const handleRemoveTermClick = () => {
    if (!flowchartData) return;

    const updatedTerms = [...flowchartData.termData];
    const termIndexToRemove = updatedTerms.findIndex((currentTerm) => currentTerm.tIndex === term.tIndex);
    updatedTerms.splice(termIndexToRemove, 1);

    const updatedFlowchartData = { ...flowchartData, termData: updatedTerms};
    dispatch(flowchartActions.setFlowchartData(updatedFlowchartData));
    dispatch(flowchartActions.updateFlowchart({
      flowchartId: flowchart.flowchartId,
      name: name,
      flowchartData: null,
      primaryOption: primaryOption ?? false,
    }))
  }

  return (
    <div className="flex flex-col w-full dark:bg-gray-900 shadow-md h-full">
      {/* Header - Reorganized for narrow widths */}
      <div className="p-1 flex-shrink-0">
        <div className="flex justify-center items-center text-center">
          <span className="font-medium text-sm text-foreground">
          {termName}
          </span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => handleTermClick()}
          >
            <CircleCheck />
          </Button>
          {/* Spring terms are 3, 7, 11... */}
          {term.tIndex == (summerTermIndex - 1) && (
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
      </div>
      <hr className="my-1 flex-shrink-0" />

      {/* Scrollable content area */}
      <ScrollArea className="flex-1 w-full">
        <div className="p-1">
          <Droppable droppableId={`term-${term.tIndex}`}>
            {(provided) => (
              <div
                className={`flex flex-col gap-1 min-h-[200px] ${
                  term.courses.length === 0 ? 'border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-2' : ''
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
                      <FullScreenCourseItem
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
      <div className="p-1 border-t border-slate-700 flex-shrink-0">
        <h4 className="m-0 text-xs text-center">
          Units: {term.tUnits}
          {term.courses.length ? ` (${term.courses.length} courses)` : ""}
        </h4>
      </div>
    </div>
  );
};

export default FullScreenTermContainer;
