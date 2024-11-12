// CourseItem.tsx
import React from "react";
import { Course } from "@/types";
import "./CourseItem.css";

interface CourseItemProps {
  course: Course;
  // eslint-disable-next-line no-unused-vars
  onToggleComplete: (courseId: string | null) => void;
}

const CourseItem: React.FC<CourseItemProps> = ({
  course,
  onToggleComplete,
}) => {
  const handleClick = () => {
    onToggleComplete(course.id);
  };
  return (
    <div
      className="courseItem"
      onClick={handleClick}
      style={{
        backgroundColor: course.completed ? "#d3d3d3" : course.color, // Gray out if completed
        padding: "1rem",
        marginBottom: "0.5rem",
        borderRadius: "0.25rem",
        cursor: "pointer",
        textDecoration: course.completed ? "line-through" : "none",
      }}
    >
      <p>
        {course.customDisplayName ||
          course.id ||
          course.customId ||
          "No Course ID"}
      </p>
      {course.customUnits && <p>Units: {course.customUnits}</p>}
    </div>
  );
};

export default CourseItem;
