import { useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import TermContainer from "./termContainer/TermContainer";
import { FlowchartData } from "@/types";
import { toggleCourseCompletion } from "@/redux/flowchart/flowchartSlice";
import defaultTermData from "./exampleData/flowPlaceholder";
import { Button } from "../ui/button";

const FlowChart = ({
  flowchartData,
}: {
  flowchartData?: FlowchartData | null;
}) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.userData);

  const flowchartRef = useRef<HTMLDivElement>(null);
  const startYear = useMemo(() => {
    return userData.startingYear ? parseInt(userData.startingYear, 10) : 0;
  }, [userData]);

  const termsPerYear = 3; // Fall, Winter, Spring
  const termNames = ["Fall", "Winter", "Spring"];

  // Function to compute the term name
  const getTermName = (termNumber: number) => {
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

  // Calculate total terms and years
  const termsData = flowchartData?.termData
    ? flowchartData.termData.filter((term) => term.tIndex !== -1)
    : defaultTermData;
  const totalTerms = termsData.length;
  const totalYears = Math.ceil(totalTerms / termsPerYear);

  // Function to scroll to the selected year
  const scrollToYear = (yearIndex: number) => {
    if (flowchartRef.current) {
      const termWidth = flowchartRef.current.scrollWidth / totalTerms;
      const scrollPosition = yearIndex * termsPerYear * termWidth;
      flowchartRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center gap-2 my-2">
        {[...Array(totalYears)].map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => scrollToYear(index)}
            className=" text-white cursor-pointer"
          >
            Year {index + 1}
          </Button>
        ))}
      </div>
      <div
        className="flex overflow-x-auto p-1 scroll-smooth w-full dark:bg-gray-900"
        ref={flowchartRef}
      >
        {termsData.map((term) => {
          const termName = getTermName(term.tIndex);
          return (
            <div
              className="flex-shrink-0 min-w-[250px] max-w-[250px] bg-slate-50 border-l-2 border-slate-200 text-center"
              key={term.tIndex + termName}
            >
              <TermContainer
                term={term}
                termName={termName}
                onCourseToggleComplete={onCourseToggleComplete}
              />
            </div>
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
