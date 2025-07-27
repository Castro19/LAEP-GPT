import { useState, useEffect, useRef } from "react";
import { useAppDispatch, flowchartActions, useAppSelector } from "@/redux";
import { FlowchartData } from "@polylink/shared/types";
import { type CarouselApi } from "@/components/ui/carousel";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import useFlowchartHistory from "@/hooks/useFlowchartHistory";

// My components
import { TermContainer, defaultTermData } from "@/components/flowchart";

// UI Components
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useDeviceType from "@/hooks/useDeviceType";
import YearSelector from "./YearSelector";
import FullScreenFlowchart from "./FullScreenFlowchart";

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
  4: "Summer",
  5: "Fall",
  6: "Winter",
  7: "Spring",
  8: "Summer",
  9: "Fall",
  10: "Winter",
  11: "Spring",
  12: "Summer",
  13: "Fall",
  14: "Winter",
  15: "Spring",
  16: "Summer",
  17: "Fall",
  18: "Winter",
  19: "Spring",
  20: "Summer",
  21: "Fall",
  22: "Winter",
  23: "Spring",
  24: "Summer",
  25: "Fall",
  26: "Winter",
  27: "Spring",
  28: "Summer",
  29: "Fall",
  30: "Winter",
  31: "Spring",
  32: "Summer",
};

const Flowchart = ({
  flowchartData,
}: {
  flowchartData?: FlowchartData | null;
}) => {
  const dispatch = useAppDispatch();
  const isNarrowScreen = useIsNarrowScreen();
  const device = useDeviceType();
  const { saveCurrentState } = useFlowchartHistory();

  const { isDragging } = useAppSelector((state) => state.layout);
  const { isFullTimelineView } = useAppSelector((state) => state.flowchart);
  const [api, setApi] = useState<CarouselApi>();

  // Add refs for hover timers
  const prevHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [prevBounceCount, setPrevBounceCount] = useState(0);
  const [nextBounceCount, setNextBounceCount] = useState(0);

  const startYear = flowchartData?.startYear
    ? parseInt(flowchartData.startYear, 10) || 2022
    : 2022;

  const termsPerYear = 4; // Fall, Winter, Spring, Summer

  const getTermName = (termNumber: number) => {
    const termName = TERM_MAP[termNumber as keyof typeof TERM_MAP];
    // year logic - group by academic years (Fall through Summer)
    // termNumber: 1(Fall), 2(Winter), 3(Spring), 4(Summer), 5(Fall)...
    // (termNumber - 1) gives us: 0, 1, 2, 3, 4...
    // Divided by 4 (termsPerYear) and floored gives us:
    // 0/4 = 0 (Fall, Winter, Spring, Summer of first year)
    // 4/4 = 1 (Fall of second year)
    const yearOffset = Math.floor((termNumber - 1) / termsPerYear);
    const year = startYear + yearOffset;
    // Adjust for calendar year (Winter, Spring, Summer are in the next calendar-year)
    const actualYear =
      termName === "Winter" || termName === "Spring" || termName === "Summer"
        ? year + 1
        : year;
    return `${termName} ${actualYear}`;
  };

  const onCourseToggleComplete = (termIndex: number, courseIndex: number) => {
    // Save current state before making changes
    saveCurrentState();

    // Use Redux action to toggle course completion
    dispatch(
      flowchartActions.toggleCourseCompletion({ termIndex, courseIndex })
    );
  };

  // Filter out skip terms
  const termsData = flowchartData?.termData
    ? flowchartData.termData.filter((term) => term.tIndex !== -1)
    : defaultTermData.filter((term) => term.tIndex !== -1);

  // Count how many Fall terms we have to determine number of years
  const totalYears = termsData.reduce((years, term) => {
    const termName = TERM_MAP[term.tIndex as keyof typeof TERM_MAP];
    return termName === "Fall" ? years + 1 : years;
  }, 0);

  // Add state for selected year
  const [selectedYear, setSelectedYear] = useState(0);

  const handleYearChange = (yearIndex: number) => {
    setSelectedYear(yearIndex);
    if (api) {
      // Find the index of the nth Fall term (nth = yearIndex)
      const termIndex = termsData.findIndex((term, index) => {
        const termName = TERM_MAP[term.tIndex as keyof typeof TERM_MAP];
        const fallTermsSoFar = termsData
          .slice(0, index + 1)
          .filter(
            (t) => TERM_MAP[t.tIndex as keyof typeof TERM_MAP] === "Fall"
          ).length;
        return termName === "Fall" && fallTermsSoFar === yearIndex + 1;
      });

      if (termIndex !== -1) {
        api.scrollTo(termIndex);
      }
    }
  };

  // Handle carousel initialization and scroll position
  useEffect(() => {
    if (!api || isFullTimelineView) return;

    // Set up selection change listener
    const onSelect = () => {
      const currentIndex = api.selectedScrollSnap();
      const currentTerm = termsData[currentIndex];
      if (!currentTerm) return;

      // Count how many Fall terms come before this term to determine the year
      const fallsSeen = termsData
        .slice(0, currentIndex + 1)
        .filter(
          (t) => TERM_MAP[t.tIndex as keyof typeof TERM_MAP] === "Fall"
        ).length;

      // Subtract 1 to convert to 0-based index, but never go below 0
      const yearIndex = Math.max(fallsSeen - 1, 0);

      if (yearIndex !== selectedYear) {
        setSelectedYear(yearIndex);
      }
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, selectedYear, isFullTimelineView, termsData]);

  // Hover logic for desktop only
  const handlePrevHoverStart = () => {
    if (!api) return;
    if (prevHoverTimerRef.current) clearTimeout(prevHoverTimerRef.current);
    startPulseSequence("prev");
  };

  const handlePrevHoverEnd = () => {
    if (prevHoverTimerRef.current) {
      clearTimeout(prevHoverTimerRef.current);
      prevHoverTimerRef.current = null;
    }
    setPrevBounceCount(0);
  };

  const handleNextHoverStart = () => {
    if (!api) return;
    if (nextHoverTimerRef.current) clearTimeout(nextHoverTimerRef.current);
    startPulseSequence("next");
  };

  const handleNextHoverEnd = () => {
    if (nextHoverTimerRef.current) {
      clearTimeout(nextHoverTimerRef.current);
      nextHoverTimerRef.current = null;
    }
    setNextBounceCount(0);
  };

  // Add click handlers to reset timers
  const handlePrevClick = () => {
    // Clear any existing timers
    if (prevHoverTimerRef.current) {
      clearTimeout(prevHoverTimerRef.current);
      prevHoverTimerRef.current = null;
    }
    // Reset bounce count
    setPrevBounceCount(0);
  };

  const handleNextClick = () => {
    // Clear any existing timers
    if (nextHoverTimerRef.current) {
      clearTimeout(nextHoverTimerRef.current);
      nextHoverTimerRef.current = null;
    }
    // Reset bounce count
    setNextBounceCount(0);
  };

  // Recursive function to handle the pulse sequence
  const startPulseSequence = (direction: "prev" | "next") => {
    if (!api) return;

    const isPrev = direction === "prev";
    const timerRef = isPrev ? prevHoverTimerRef : nextHoverTimerRef;
    const setBounceCount = isPrev ? setPrevBounceCount : setNextBounceCount;

    setBounceCount(1);

    const handleNextPulse = (pulseNumber: number) => {
      if (pulseNumber > 3) {
        // After 3 pulses, trigger the carousel movement
        if (isPrev) {
          api.scrollPrev();
        } else {
          api.scrollNext();
        }
        setBounceCount(0);

        // Start the next sequence after a short delay
        timerRef.current = setTimeout(() => {
          startPulseSequence(direction);
        }, 500);
        return;
      }

      setBounceCount(pulseNumber);
      timerRef.current = setTimeout(() => {
        handleNextPulse(pulseNumber + 1);
      }, 500);
    };

    timerRef.current = setTimeout(() => {
      handleNextPulse(2);
    }, 500);
  };

  return (
    <div
      // On desktop: use left/right margin. On mobile/tablet: remove them.
      className={`flex flex-col min-h-full ${
        device === "desktop" && !isFullTimelineView ? "ml-16 mr-16" : "mx-2"
      }`}
    >
      <style>{bounceStyles}</style>

      <YearSelector
        totalYears={totalYears}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        isNarrowScreen={isNarrowScreen}
      />
      {isFullTimelineView ? (
        <FullScreenFlowchart flowchartData={flowchartData} />
      ) : (
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
            <CarouselContent
              // On mobile/tablet, remove negative margins to maximize space
              className={`${
                device === "desktop" ? "-ml-2 md:-ml-4" : "mx-0"
              } flex`}
            >
              {termsData.map((term) => {
                const termName = getTermName(term.tIndex);
                return (
                  <CarouselItem
                    key={term.tIndex + termName}
                    // On mobile/tablet, each item becomes full width
                    className={`${
                      device === "desktop"
                        ? "pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 "
                        : "w-full"
                    }`}
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

            {/* Hide arrows if not desktop */}
            {(device === "desktop" || !isNarrowScreen) && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
                <div
                  className="pointer-events-auto z-10"
                  onMouseEnter={handlePrevHoverStart}
                  onMouseLeave={handlePrevHoverEnd}
                  onClick={handlePrevClick}
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
                  onClick={handleNextClick}
                >
                  <CarouselNext
                    className={`h-full w-12 rounded-none opacity-30 transition-opacity duration-300 ${
                      nextBounceCount > 0 ? "pulse-animation" : ""
                    }`}
                  />
                </div>
              </div>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default Flowchart;
