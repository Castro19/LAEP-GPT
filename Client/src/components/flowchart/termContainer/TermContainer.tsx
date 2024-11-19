// TermContainer.tsx
import React from "react";
import CourseItem from "../courseItem/CourseItem";
import { FlowchartData, Term } from "@/types";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setFlowchartData } from "@/redux/flowchart/flowchartSlice";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { Draggable, Droppable } from "@hello-pangea/dnd"; // Import here

interface TermContainerProps {
  term: Term;
  termName: string;
  // eslint-disable-next-line no-unused-vars
  onCourseToggleComplete: (termIndex: number, courseIndex: number) => void;
  readonly?: boolean;
}

const updateFlowchartTermData = (
  flowchartData: FlowchartData,
  newTermData: Term[]
) => {
  // Create a deep copy of flowchartData
  const updatedFlowchartData = _.cloneDeep(flowchartData);

  // Update the termData property
  updatedFlowchartData.termData = newTermData;

  // Now you can use updatedFlowchartData as needed
  console.log("Updated Flowchart Data:", updatedFlowchartData);
};

const TermContainer: React.FC<TermContainerProps> = ({
  term,
  termName,
  onCourseToggleComplete,
  readonly = false,
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
    dispatch(setFlowchartData(updatedFlowchartData));
  };
  return (
    <div className="flex flex-col flex-1 min-w-[250px] max-w-[300px] bg-gray-200 dark:bg-slate-800 shadow-md text-black dark:text-white h-full">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        {!readonly ? (
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
        ) : (
          <h3 className="m-2 text-center flex-grow">{termName}</h3>
        )}
        <hr className="my-2" />
      </div>

      {/* Body */}
      {!readonly ? (
        <Droppable droppableId={`term-${term.tIndex}`}>
          {(provided) => (
            <div
              className="flex-grow p-2 overflow-y-auto gap-3 flex flex-col"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {term.courses.map((course, index) => (
                <Draggable
                  key={`term-${term.tIndex}-${course.id || index}`}
                  draggableId={`term-${term.tIndex}-${course.id || index}`}
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
      ) : (
        <div className="flex-grow p-2 overflow-y-auto gap-3 flex flex-col">
          {term.courses.map((course, index) => (
            <CourseItem
              key={`${course.id}-${index}`}
              termIndex={term.tIndex}
              coursePosition={index}
              course={course}
              onToggleComplete={() => {}}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-2">
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
