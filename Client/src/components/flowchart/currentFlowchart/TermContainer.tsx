// TermContainer.tsx
import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import cloneDeep from "lodash-es/cloneDeep";
import { Draggable, Droppable } from "@hello-pangea/dnd";

// Types
import { FlowchartData, Term } from "@polylink/shared/types";

// Icons
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

// My components
import CourseItem from "./CourseItem";

// UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
};

const TermContainer: React.FC<TermContainerProps> = ({
  term,
  termName,
  onCourseToggleComplete,
}) => {
  const dispatch = useAppDispatch();
  const { flowchartData } = useAppSelector((state) => state.flowchart);
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
    <div className="flex flex-col min-w-[300px] max-w-full dark:bg-gray-900 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <>
          <Button
            variant="ghost"
            className=""
            onClick={() => handleTermClick("remove")}
          >
            <CiCircleRemove className="w-6 h-6" />
          </Button>
          <h3 className="m-0 text-center flex-grow">{termName}</h3>
          <Button
            variant="ghost"
            className=""
            onClick={() => handleTermClick("add")}
          >
            <CiCircleCheck className="w-6 h-6" />
          </Button>
        </>
        <hr className="my-2" />
      </div>
      <ScrollArea className="h-full min-w-full mb-4">
        {/* Body */}
        <div className="h-[60vh]">
          <Droppable droppableId={`term-${term.tIndex}`}>
            {(provided) => (
              <div
                className="flex-grow p-2 overflow-y-auto gap-2 flex flex-col"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {term.courses.map((course, index) => (
                  <Draggable
                    key={`${course.id || index}-${term.tIndex}`}
                    draggableId={`${course.id || index}-${term.tIndex}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <CourseItem
                          termIndex={term.tIndex}
                          course={course}
                          coursePosition={index}
                          onToggleComplete={() =>
                            onCourseToggleComplete(term.tIndex, index)
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4">
        <hr className="my-2" />
        <h4 className="m-0">
          Units: {term.tUnits}
          {term.courses.length ? ` (${term.courses.length} courses)` : ""}
        </h4>
      </div>
    </div>
  );
};

export default TermContainer;
