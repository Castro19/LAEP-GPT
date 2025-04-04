import { useMemo, useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import { FlowchartData } from "@polylink/shared/types";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

// My components
import { TermContainer, defaultTermData } from "@/components/flowchart";

// UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

const Flowchart = ({
  flowchartData,
}: {
  flowchartData?: FlowchartData | null;
}) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.userData);
  const isNarrowScreen = useIsNarrowScreen();
  const flowchartRef = useRef<HTMLDivElement>(null);
  const startYear = useMemo(() => {
    return userData.flowchartInformation.startingYear
      ? parseInt(userData.flowchartInformation.startingYear, 10) || 2022
      : 2022;
  }, [userData]);

  const termsPerYear = 3; // Fall, Winter, Spring
  // Skip, Fall, Winter, Spring, Fall, Winter, Spring, Fall, Winter, Spring, ...
  const getTermName = (termNumber: number) => {
    const termName = TERM_MAP[termNumber as keyof typeof TERM_MAP];

    // Calculate year offset based on term index
    // For terms 1,2: year 0 (Fall 2020, Winter 2020)
    // For term 3: year 1 (Spring 2021)
    // For terms 5,6: year 1 (Fall 2021, Winter 2021)
    // For term 7: year 2 (Spring 2022)
    // For terms 9,10: year 2 (Fall 2022, Winter 2022)
    // For term 11: year 3 (Spring 2023)
    // For terms 13,14: year 3 (Fall 2023, Winter 2023)
    // For term 15: year 4 (Spring 2024)
    const baseYearOffset = Math.floor((termNumber - 1) / 4);
    const yearOffset =
      termName === "Spring" ? baseYearOffset + 1 : baseYearOffset;
    const year = startYear + yearOffset;

    return `${termName} ${year}`;
  };

  const onCourseToggleComplete = (termIndex: number, courseIndex: number) => {
    dispatch(
      flowchartActions.toggleCourseCompletion({ termIndex, courseIndex })
    );
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

  useEffect(() => {
    const handleScroll = () => {
      if (flowchartRef.current) {
        const scrollLeft = flowchartRef.current.scrollLeft;
        const yearWidth = flowchartRef.current.scrollWidth / totalYears;
        const newSelectedYear = Math.round(scrollLeft / yearWidth);
        setSelectedYear(newSelectedYear);
      }
    };

    const refCurrent = flowchartRef.current;
    refCurrent?.addEventListener("scroll", handleScroll);

    return () => {
      refCurrent?.removeEventListener("scroll", handleScroll);
    };
  }, [totalYears]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center gap-1 dark:bg-gray-900 border-b-1 border-slate-600 p-2 ml-12">
        {[...Array(totalYears)].map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => scrollToYear(index)}
            className={`cursor-pointer ${
              selectedYear === index
                ? "dark:bg-slate-700 text-white"
                : "text-white hover:dark:bg-slate-800"
            } ${isNarrowScreen ? "text-xs size-8 px-6" : "text-lg"}`}
          >
            Year {index + 1}
          </Button>
        ))}
      </div>

      <ScrollArea ref={flowchartRef} className="dark:bg-gray-900">
        <div className="flex w-max space-x-4 py-2 px-4">
          {termsData.map((term) => {
            const termName = getTermName(term.tIndex);

            return (
              <div
                className="flex-shrink-1 min-w-[340px] max-w-[350px] bg-slate-50 text-center border-2 border-slate-500"
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
    </div>
  );
};

export default Flowchart;
