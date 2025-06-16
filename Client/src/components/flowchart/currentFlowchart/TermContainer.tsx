// TermContainer.tsx
import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import cloneDeep from "lodash-es/cloneDeep";
import { Droppable } from "@hello-pangea/dnd";

// Types
import { FlowchartData, Term } from "@polylink/shared/types";

// Icons
import { CiCircleCheck, CiCircleRemove, CiSquarePlus } from "react-icons/ci";

// My components
import CourseItem from "./CourseItem";

// UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PortalAwareDraggable from "@/components/layout/FlowchartPage/PortalAwareDraggable";
import useDeviceType from "@/hooks/useDeviceType";

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
  const device = useDeviceType();
  const { flowchartData } = useAppSelector((state) => state.flowchart);

  const handleAddSummerTerm = () => {
    if (!flowchartData) return;

    // Get current term's year index to determine summer term index
    const currentTermIndex = term.tIndex;
    const yearGroup = Math.floor((currentTermIndex - 1) / 4);
    const summerTermIndex = yearGroup * 4 + 4; // This gives us 4, 8, 12, etc.

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

    // Insert the summer term in the correct position
    const updatedTerms = [...flowchartData.termData];
    const insertIndex = updatedTerms.findIndex((t) => t.tIndex > summerTermIndex);
    if (insertIndex === -1) {
      updatedTerms.push(newSummerTerm);
    } else {
      updatedTerms.splice(insertIndex, 0, newSummerTerm);
    }

    const updatedFlowchartData = { ...flowchartData, termData: updatedTerms };
    dispatch(flowchartActions.setFlowchartData(updatedFlowchartData));
  };

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
    <div
      className={`flex flex-col w-full dark:bg-gray-900 shadow-md ${
        device === "desktop" ? "h-[calc(100vh-12rem)]" : "h-[calc(100vh-10rem)]"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
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
          <div className="flex items-center gap-2 flex-grow">
            <h3 className="m-0 text-center flex-grow">{termName}</h3>
            {(termName.includes("Spring") || termName.includes("Winter")) && (
              <Button
                variant="ghost"
                size="sm"
                className="px-2"
                onClick={handleAddSummerTerm}
                title="Add Summer Term"
              >
                <CiSquarePlus className="w-5 h-5" />
              </Button>
            )}
          </div>
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

      {/* Scrollable content area */}
      <ScrollArea className="flex-1 min-w-full">
        <div className="h-full pb-4">
          <Droppable droppableId={`term-${term.tIndex}`}>
            {(provided) => (
              <div
                className="p-2 gap-2 flex flex-col min-h-full"
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
