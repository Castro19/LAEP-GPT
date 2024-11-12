// TermContainer.tsx
import React from "react";
import CourseItem from "../courseItem/CourseItem";
import { Term } from "@/types";
import "./TermContainer.css";

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
    <div className="termContainer dark:bg-slate-800 text-white">
      {/* Header */}
      <div className="termContainerHeader">
        <h3>{termName}</h3>
        <hr />
      </div>

      {/* Body */}
      <div className="termContainerBody">
        {term.courses.map((course, index) => (
          <CourseItem
            key={index}
            course={course}
            onToggleComplete={() => onCourseToggleComplete(term.tIndex, index)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="termContainerFooter">
        <hr />
        <h4>
          Units: {term.tUnits}
          {term.courses.length ? ` (${term.courses.length} courses)` : ""}
        </h4>
      </div>
    </div>
  );
};

export default TermContainer;
