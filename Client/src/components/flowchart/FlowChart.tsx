import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux";
import TermContainer from "./termContainer/TermContainer";
import { FlowchartData, Term, Course } from "@/types";
import "./FlowChart.css";

const FlowChart = () => {
  const { flowchartData } = useAppSelector((state) => state.flowchart) as {
    flowchartData: FlowchartData | null;
  };
  const [termData, setTermData] = useState<Term[]>([]);
  const [incompleteCourses, setIncompleteCourses] = useState<Course[]>([]);
  const [startYear, setStartYear] = useState<number>(0);

  useEffect(() => {
    // Ensure flowchartData is available before processing
    if (flowchartData) {
      const initialTermData: Term[] = flowchartData.termData
        .filter((term) => term.tIndex !== -1)
        .map((term) => ({
          ...term,
          courses: term.courses.map((course) => ({
            ...course,
            completed: false, // Initialize as false
          })),
        }));

      setTermData(initialTermData);
      setStartYear(parseInt(flowchartData.startYear, 10));
    }
  }, [flowchartData]);

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

  // Guard clause: Return loading state if flowchartData is not available
  if (!flowchartData) {
    return <div>Loading...</div>;
  }
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
