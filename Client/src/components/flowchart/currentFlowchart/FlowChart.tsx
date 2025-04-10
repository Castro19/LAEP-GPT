import { useState, useEffect, useRef } from "react";
import { useAppDispatch, flowchartActions, useAppSelector } from "@/redux";
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

// Add custom styles for the bounce animation
const bounceStyles = `
  @keyframes subtle-pulse {
    0% { opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { opacity: 0.3; }
  }
  
  .pulse-animation {
    animation: subtle-pulse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
`;

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

  const { isDragging } = useAppSelector((state) => state.layout);
  const [api, setApi] = useState<CarouselApi>();

  // Add refs for hover timers
  const prevHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [prevBounceCount, setPrevBounceCount] = useState(0);
  const [nextBounceCount, setNextBounceCount] = useState(0);

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

  // Add functions to handle hover effects
  const handlePrevHoverStart = () => {
    if (!api) return;

    // Clear any existing timer
    if (prevHoverTimerRef.current) {
      clearTimeout(prevHoverTimerRef.current);
    }

    // Start the pulse sequence
    startPulseSequence("prev");
  };

  const handlePrevHoverEnd = () => {
    // Clear the timer and reset bounce count
    if (prevHoverTimerRef.current) {
      clearTimeout(prevHoverTimerRef.current);
      prevHoverTimerRef.current = null;
    }
    setPrevBounceCount(0);
  };

  const handleNextHoverStart = () => {
    if (!api) return;

    // Clear any existing timer
    if (nextHoverTimerRef.current) {
      clearTimeout(nextHoverTimerRef.current);
    }

    // Start the pulse sequence
    startPulseSequence("next");
  };

  const handleNextHoverEnd = () => {
    // Clear the timer and reset bounce count
    if (nextHoverTimerRef.current) {
      clearTimeout(nextHoverTimerRef.current);
      nextHoverTimerRef.current = null;
    }
    setNextBounceCount(0);
  };

  // Recursive function to handle the pulse sequence
  const startPulseSequence = (direction: "prev" | "next") => {
    if (!api) return;

    const isPrev = direction === "prev";
    const timerRef = isPrev ? prevHoverTimerRef : nextHoverTimerRef;
    const setBounceCount = isPrev ? setPrevBounceCount : setNextBounceCount;

    // Start with the first pulse
    setBounceCount(1);

    // Function to handle the next pulse in the sequence
    const handleNextPulse = (pulseNumber: number) => {
      if (pulseNumber > 3) {
        // After 3 pulses, trigger the carousel movement
        if (isPrev) {
          api.scrollPrev();
        } else {
          api.scrollNext();
        }

        // Reset bounce count
        setBounceCount(0);

        // Start the next sequence after a short delay
        timerRef.current = setTimeout(() => {
          startPulseSequence(direction);
        }, 500);

        return;
      }

      // Set the current pulse number
      setBounceCount(pulseNumber);

      // Schedule the next pulse
      timerRef.current = setTimeout(() => {
        handleNextPulse(pulseNumber + 1);
      }, 500);
    };

    // Start the sequence
    timerRef.current = setTimeout(() => {
      handleNextPulse(2);
    }, 500);
  };

  return (
    <div className="flex flex-col ml-16 mr-16">
      <style>{bounceStyles}</style>

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
            dragFree: true,
            skipSnaps: true,
            duration: 20,
            slidesToScroll: 1,
            inViewThreshold: 0.5,
            direction: isDragging ? "ltr" : undefined,
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
            <div
              className="pointer-events-auto z-10"
              onMouseEnter={handlePrevHoverStart}
              onMouseLeave={handlePrevHoverEnd}
            >
              <CarouselPrevious
                className={`h-full w-12 rounded-none opacity-30 transition-opacity duration-300 ${
                  prevBounceCount > 0 ? "pulse-animation" : ""
                }`}
              />
            </div>
            <div
              className="pointer-events-auto z-10"
              onMouseEnter={handleNextHoverStart}
              onMouseLeave={handleNextHoverEnd}
            >
              <CarouselNext
                className={`h-full w-12 rounded-none opacity-30 transition-opacity duration-300 ${
                  nextBounceCount > 0 ? "pulse-animation" : ""
                }`}
              />
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Flowchart;
