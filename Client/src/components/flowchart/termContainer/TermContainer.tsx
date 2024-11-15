// TermContainer.tsx
import React from "react";
import CourseItem from "../courseItem/CourseItem";
import { Term } from "@/types";

interface TermContainerProps {
  term: Term;
  termName: string;
  // eslint-disable-next-line no-unused-vars
  onCourseToggleComplete: (termIndex: number, courseIndex: number) => void;
}

const TermContainer: React.FC<TermContainerProps> = ({
  term,
  termName,
  onCourseToggleComplete,
}) => {
  return (
    <div className="flex flex-col flex-1 min-w-[250px] max-w-[300px] bg-gray-200 dark:bg-slate-800  shadow-md text-black dark:text-white h-full">
      {/* Header */}
      <div className="p-2">
        <h3 className="m-0">{termName}</h3>
        <hr className="my-2" />
      </div>

      {/* Body */}
      <div className="flex-grow p-2 overflow-y-auto gap-3 flex flex-col">
        {term.courses.map((course, index) => (
          <CourseItem
            key={index}
            course={course}
            onToggleComplete={() => onCourseToggleComplete(term.tIndex, index)}
          />
        ))}
      </div>

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
