import { useAppDispatch, flowchartActions } from "@/redux";
import { FlowchartData } from "@polylink/shared/types";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import useDeviceType from "@/hooks/useDeviceType";

// My components
import { defaultTermData } from "@/components/flowchart";
import FullScreenTermContainer from "./FullScreenTermContainer";

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

interface FullScreenFlowchartProps {
  flowchartData?: FlowchartData | null;
}

const FullScreenFlowchart: React.FC<FullScreenFlowchartProps> = ({
  flowchartData,
}) => {
  const dispatch = useAppDispatch();
  const isNarrowScreen = useIsNarrowScreen();
  const device = useDeviceType();

  const startYear = flowchartData?.startYear
    ? parseInt(flowchartData.startYear, 10) || 2022
    : 2022;

  const getTermName = (termNumber: number) => {
    const termName = TERM_MAP[termNumber as keyof typeof TERM_MAP];
    // year logic
    const baseYearOffset = Math.floor((termNumber - 1) / 4);
    const yearOffset =
      termName === "Spring" || termName === "Summer" ? baseYearOffset + 1 : baseYearOffset;
    const year = startYear + yearOffset;
    return `${termName} ${year}`;
  };

  const onCourseToggleComplete = (termIndex: number, courseIndex: number) => {
    dispatch(
      flowchartActions.toggleCourseCompletion({ termIndex, courseIndex })
    );
  };

  // Filter out skip terms
  const termsData = flowchartData?.termData
    ? flowchartData.termData.filter((term) => term.tIndex !== -1)
    : defaultTermData.filter((term) => term.tIndex !== -1);

  // For very small screens, we'll use a scrollable container
  const isMobile = device === "mobile" || isNarrowScreen;

  return (
    <div className="h-[calc(100vh-4rem)]">
      {/* For mobile, use a scrollable container */}
      {isMobile ? (
        <div className="p-4 overflow-x-auto h-full">
          <div
            className="flex gap-4 h-full"
            style={{ minWidth: `${termsData.length * 150}px` }}
          >
            {termsData.map((term) => {
              const termName = getTermName(term.tIndex);
              return (
                <div
                  key={term.tIndex + termName}
                  className="w-[150px] h-full flex-shrink-0"
                >
                  <FullScreenTermContainer
                    term={term}
                    termName={termName}
                    onCourseToggleComplete={onCourseToggleComplete}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* For desktop, use a grid with columns equal to the number of terms */
        <div className="p-4 h-full">
          <div
            className="grid gap-4 h-full"
            style={{
              gridTemplateColumns: `repeat(${termsData.length}, minmax(0, 1fr))`,
            }}
          >
            {termsData.map((term) => {
              const termName = getTermName(term.tIndex);
              return (
                <FullScreenTermContainer
                  key={term.tIndex + termName}
                  term={term}
                  termName={termName}
                  onCourseToggleComplete={onCourseToggleComplete}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FullScreenFlowchart;
