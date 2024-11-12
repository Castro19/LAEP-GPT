// FlowChart.tsx
import flowchartData from "./exampleData/22-26.52CSCBSU.json";
import TermContainer from "./termContainer/TermContainer";
import "./FlowChart.css";
import { useEffect, useState } from "react";
import { Term, Course } from "@/types";

const FlowChart = () => {
  const initialTermData: Term[] = flowchartData.termData
    .filter((term) => term.tIndex !== -1)
    .map((term) => ({
      ...term,
      courses: term.courses.map((course) => ({
        ...course,
        completed: false, // Initialize as false
      })),
    }));
  console.log("1st quarter", initialTermData[1]);
  const [termData, setTermData] = useState<Term[]>(initialTermData);
  const [incompleteCourses, setIncompleteCourses] = useState<Course[]>([]);
  const startYear = parseInt(flowchartData.startYear, 10);

  // Function to compute the term name
  const getTermName = (termNumber: number) => {
    const termsPerYear = 3;
    const termNames = ["Fall", "Winter", "Spring"];
    const termIndexInYear = termNumber % termsPerYear;
    const yearOffset = Math.floor(termNumber / termsPerYear);

    const termName = termNames[termIndexInYear];
    let year = startYear + yearOffset;

    // Adjust the year for Winter and Spring terms
    if (termName !== "Fall") {
      year += 1;
    }

    return `${termName} ${year}`;
  };

  const onCourseToggleComplete = (termIndex: number, courseIndex: number) => {
    setTermData((prevTermData) =>
      prevTermData.map((term) => {
        if (term.tIndex === termIndex) {
          const updatedCourses = term.courses.map((course, idx) => {
            if (idx === courseIndex) {
              return { ...course, completed: !course.completed };
            }
            return course;
          });
          return { ...term, courses: updatedCourses };
        }
        return term;
      })
    );
  };

  useEffect(() => {
    const getIncompleteCourses = (): Course[] => {
      return termData.flatMap((term) =>
        term.courses.filter((course) => !course.completed)
      );
    };
    setIncompleteCourses(getIncompleteCourses());
  }, [termData]);

  useEffect(() => {
    console.log(incompleteCourses);
  }, [incompleteCourses]);

  return (
    <div className="flowchart-container dark:bg-gray-900">
      <div className="flowchart">
        {termData.map((term, index) => {
          const termName = getTermName(index);
          return (
            <TermContainer
              key={term.tIndex}
              term={term}
              termName={termName}
              onCourseToggleComplete={onCourseToggleComplete}
            />
          );
        })}
      </div>
      <div className="flowchart-footer">
        <h4>Total Units: 180</h4>
      </div>
    </div>
  );
};

export default FlowChart;
