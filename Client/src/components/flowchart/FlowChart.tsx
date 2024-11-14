import { useMemo } from "react";
import { useAppDispatch } from "@/redux";
import TermContainer from "./termContainer/TermContainer";
import { FlowchartData } from "@/types";
import "./FlowChart.css";
import { toggleCourseCompletion } from "@/redux/flowchart/flowchartSlice";
import defaultTermData from "./exampleData/flowPlaceholder";

const FlowChart = ({
  flowchartData,
}: {
  flowchartData?: FlowchartData | null;
}) => {
  const dispatch = useAppDispatch();

  // Compute termData from flowchartData
  // const termData = useMemo(() => {
  //   if (!flowchartData?.termData) return [];

  //   return flowchartData.termData
  //     .filter((term) => term.tIndex !== -1)
  //     .map((term) => ({
  //       ...term,
  //       courses: term.courses.map((course) => ({
  //         ...course,
  //         completed: course.completed ?? false,
  //       })),
  //     }));
  // }, [flowchartData]);

  // Compute startYear from flowchartData
  const startYear = useMemo(() => {
    return flowchartData?.startYear ? parseInt(flowchartData.startYear, 10) : 0;
  }, [flowchartData]);

  // Compute incompleteCourses from termData
  // const incompleteCourses = useMemo(() => {
  //   return termData.flatMap((term) =>
  //     term.courses.filter((course) => !course.completed)
  //   );
  // }, [termData]);

  // Function to compute the term name
  const getTermName = (termNumber: number) => {
    const termsPerYear = 3;
    const termNames = ["Fall", "Winter", "Spring"];
    // Adjust termNumber to be 0-based for the calculation
    const adjustedTerm = termNumber - 1;
    const termIndexInYear = adjustedTerm % termsPerYear;
    const yearOffset = Math.floor(adjustedTerm / termsPerYear);

    const termName = termNames[termIndexInYear];
    let year = startYear + yearOffset;

    // Adjust the year for Winter and Spring terms
    if (termName !== "Fall") {
      year += 1;
    }

    return `${termName} ${year}`;
  };

  const onCourseToggleComplete = (termIndex: number, courseIndex: number) => {
    dispatch(toggleCourseCompletion({ termIndex, courseIndex }));
  };

  console.log("Flowchart data in FlowChart: ", typeof flowchartData);
  return (
    <div className="flowchart-container dark:bg-gray-900">
      <div className="flowchart">
        {flowchartData?.termData
          ? flowchartData.termData
              .filter((term) => term.tIndex !== -1)
              .map((term) => {
                const termName = getTermName(term.tIndex);
                return (
                  <TermContainer
                    key={term.tIndex}
                    term={term}
                    termName={termName}
                    onCourseToggleComplete={onCourseToggleComplete}
                  />
                );
              })
          : defaultTermData.map((term) => {
              const termName = getTermName(term.tIndex);
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
