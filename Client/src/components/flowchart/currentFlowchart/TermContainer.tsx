// TermContainer.tsx
import React from "react";
import CourseItem from "./CourseItem";
import { Course, FlowchartData, Term } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import cloneDeep from "lodash-es/cloneDeep";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setFlowchartData } from "@/redux/flowchart/flowchartSlice";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { Draggable, Droppable } from "@hello-pangea/dnd"; // Import here
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const deviceType = useDeviceType();
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
    <div className="flex flex-col min-w-[300px] max-w-[350px] dark:bg-gray-900 shadow-md">
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
        <div
          className={`${deviceType === "desktop" ? "h-[40rem]" : "h-[60vh]"}`}
        >
          <Droppable droppableId={`term-${term.tIndex}`}>
            {(provided) => (
              <div
                className="flex-grow p-2 overflow-y-auto gap-2 flex flex-col"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {term.courses.map((course, index) => (
                  <TooltipProvider
                    key={`term-${term.tIndex}-${course.id || index}`}
                  >
                    <Tooltip>
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
                      <CourseToolTipContent course={course} />
                    </Tooltip>
                  </TooltipProvider>
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

const CourseToolTipContent = ({ course }: { course: Course }) => {
  return (
    <TooltipContent className="dark:bg-gray-800 border border-gray-700 shadow-xl">
      <div className="flex flex-col gap-3 p-3 min-w-[300px] max-w-[400px]">
        {/* Header Section */}
        <div className="space-y-1">
          <p className="text-lg font-bold text-white">
            {course.id || course.customId}
          </p>
          <p className="text-sm text-gray-300">
            {course.displayName || course.customDisplayName || course.id}
          </p>
        </div>

        <hr className="border-gray-600" />

        {/* Description Section */}
        <div
          className="text-sm leading-relaxed text-gray-200 max-h-[250px] overflow-y-auto pr-2 
          scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        >
          {course.desc || course.customDesc || "No Description"}
        </div>
      </div>
    </TooltipContent>
  );
};

export default TermContainer;
