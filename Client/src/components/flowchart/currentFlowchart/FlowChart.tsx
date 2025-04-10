import { useState, useEffect } from "react";
import { useAppDispatch, flowchartActions } from "@/redux";
import { FlowchartData } from "@polylink/shared/types";
import { type CarouselApi } from "@/components/ui/carousel";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

// My components
import { TermContainer, defaultTermData } from "@/components/flowchart";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const isNarrowScreen = useIsNarrowScreen();
  const [api, setApi] = useState<CarouselApi>();

  const startYear = flowchartData?.startYear
    ? parseInt(flowchartData.startYear, 10) || 2022
    : 2022;

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

  // Modify the scrollToYear function to use the carousel API
  const scrollToYear = (yearIndex: number) => {
    setSelectedYear(yearIndex);

    if (api) {
      // Calculate the term index to scroll to based on the year
      const termIndex = yearIndex * termsPerYear;
      api.scrollTo(termIndex);
    }
  };

  // Update the useEffect to use the carousel API
  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      const currentIndex = api.selectedScrollSnap();
      const yearIndex = Math.floor(currentIndex / termsPerYear);
      setSelectedYear(yearIndex);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, termsPerYear]);

  return (
    <div className="flex flex-col ml-16 mr-16">
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

      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            containScroll: "trimSnaps",
            dragFree: false,
            skipSnaps: false,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {termsData.map((term) => {
              const termName = getTermName(term.tIndex);

              return (
                <CarouselItem
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  key={term.tIndex + termName}
                >
                  <TermContainer
                    term={term}
                    termName={termName}
                    onCourseToggleComplete={onCourseToggleComplete}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto">
              <CarouselPrevious className="h-full w-12 rounded-none opacity-30 hover:opacity-100 transition-opacity" />
            </div>
            <div className="pointer-events-auto">
              <CarouselNext className="h-full w-12 rounded-none opacity-30 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Flowchart;
