import { useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import TermContainer from "./termContainer/TermContainer";
import { FlowchartData } from "@polylink/shared/types";
import { toggleCourseCompletion } from "@/redux/flowchart/flowchartSlice";
import defaultTermData from "./exampleData/flowPlaceholder";
import { Button } from "../ui/button";
import FlowchartUnitCounts from "./flowchartFooter/FlowchartUnitCounts";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const TERM_MAP = {
  "-1": "Skip",
  1: "Fall",
  2: "Winter",
  3: "Spring",
  5: "Fall",
  6: "Winter",
  7: "Spring",
  9: "Fall",
  10: "Winter",
  11: "Spring",
  13: "Fall",
  14: "Winter",
  15: "Spring",
};

const FlowChart = ({
  flowchartData,
}: {
  flowchartData?: FlowchartData | null;
}) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.userData);

  const flowchartRef = useRef<HTMLDivElement>(null);
  const startYear = useMemo(() => {
    return userData.flowchartInformation.startingYear
      ? parseInt(userData.flowchartInformation.startingYear, 10)
      : 0;
  }, [userData]);

  const termsPerYear = 3; // Fall, Winter, Spring
  // Function to compute the term name
  // Skip, Fall, Winter, Spring, Fall, Winter, Spring, Fall, Winter, Spring, ...
  const getTermName = (termNumber: number) => {
    const termName = TERM_MAP[termNumber as keyof typeof TERM_MAP];
    const yearOffset = Math.floor((termNumber - 1) / termsPerYear);
    let year = startYear + yearOffset;

    // Adjust the year for Winter and Spring terms
    if (termName === "Winter" || termName === "Spring") {
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
    : defaultTermData.filter((term) => term.tIndex !== -1);
  const totalTerms = termsData.length;
  const totalYears = Math.ceil(totalTerms / termsPerYear);

  // Add state for selected year
  const [selectedYear, setSelectedYear] = useState(0);

  // Modify the scrollToYear function to update selected year
  const scrollToYear = (yearIndex: number) => {
    setSelectedYear(yearIndex);
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
    <div className="flex flex-col mr-16">
      <div className="flex justify-center gap-2 dark:bg-gray-900 border-b-1 border-slate-600 p-2">
        {[...Array(totalYears)].map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => scrollToYear(index)}
            className={`cursor-pointer ${
              selectedYear === index
                ? "dark:bg-slate-700 text-white"
                : "text-white hover:dark:bg-slate-800"
            }`}
          >
            Year {index + 1}
          </Button>
        ))}
      </div>

      <ScrollArea ref={flowchartRef} className="dark:bg-gray-900">
        <div className="flex w-max space-x-4 p-4">
          {termsData.map((term) => {
            const termName = getTermName(term.tIndex);
            return (
              <div
                className="flex-shrink-0 min-w-[250px] max-w-[250px] bg-slate-50 text-center border-2 border-slate-500"
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
          <ScrollBar
            orientation="horizontal"
            data-state="visible"
            className="bg-white h-4"
          />
        </div>
      </ScrollArea>
      <FlowchartUnitCounts />
    </div>
  );
};

export default FlowChart;
