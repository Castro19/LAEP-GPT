import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import cloneDeep from "lodash-es/cloneDeep";
import { Droppable } from "@hello-pangea/dnd";

// Types
import { FlowchartData, Term } from "@polylink/shared/types";

// Icons
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

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
};

const FullScreenTermContainer: React.FC<FullScreenTermContainerProps> = ({
  term,
  termName,
  onCourseToggleComplete,
}) => {
  const dispatch = useAppDispatch();
  const { flowchartData } = useAppSelector((state) => state.flowchart);

  // Split term name into two parts (e.g., "Fall 2025" -> ["Fall", "2025"])
  const [termSeason, termYear] = termName.split(" ");

  const handleTermClick = (action: "add" | "remove") => {
    if (!flowchartData) return;
    const updatedCourses = term.courses.map((course) => ({
      ...course,
      completed: action === "add",
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

  return (
    <div className="flex flex-col w-full dark:bg-gray-900 shadow-md h-full">
      {/* Header - Reorganized for narrow widths */}
      <div className="p-1 flex-shrink-0">
        <h3 className="m-0 text-center text-sm font-medium py-1">
          <div>{termSeason}</div>
          <div>{termYear}</div>
        </h3>
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handleTermClick("remove")}
          >
            <CiCircleRemove className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handleTermClick("add")}
          >
            <CiCircleCheck className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <hr className="my-1 flex-shrink-0" />

      {/* Scrollable content area */}
      <ScrollArea className="flex-1 w-full">
        <div className="p-1">
          <Droppable droppableId={`term-${term.tIndex}`}>
            {(provided) => (
              <div
                className="flex flex-col gap-1"
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
