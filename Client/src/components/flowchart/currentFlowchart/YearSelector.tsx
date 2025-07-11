/**
 * @component YearSelector
 * @description Year-based navigation component for flowchart viewing. Provides tabs for
 * individual years and full timeline view.
 *
 * @props
 * @prop {number} totalYears - Total number of years in the flowchart
 * @prop {number} selectedYear - Currently selected year index
 * @prop {(year: number) => void} scrollToYear - Function to scroll to specific year
 * @prop {boolean} isNarrowScreen - Whether screen is narrow for responsive design
 *
 * @dependencies
 * - Redux: flowchartActions for full timeline view
 * - Tabs: UI tab components
 * - TabsList, TabsTrigger: Tab navigation elements
 *
 * @features
 * - Year-based tab navigation (Year 1, Year 2, etc.)
 * - Full timeline view option
 * - Responsive design for narrow screens
 * - Active state highlighting
 * - Hover effects and transitions
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <YearSelector
 *   totalYears={4}
 *   selectedYear={1}
 *   scrollToYear={handleScroll}
 *   isNarrowScreen={true}
 * />
 * ```
 */

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";

const YearSelector = ({
  totalYears,
  selectedYear,
  scrollToYear,
  isNarrowScreen,
}: {
  totalYears: number;
  selectedYear: number;
  // eslint-disable-next-line no-unused-vars
  scrollToYear: (year: number) => void;
  isNarrowScreen: boolean;
}) => {
  const dispatch = useAppDispatch();
  const isFullTimeline = useAppSelector(
    (state) => state.flowchart.isFullTimelineView
  );

  const handleChange = (value: string) => {
    if (value === "full") {
      dispatch(flowchartActions.setFullTimelineView(true));
      return;
    }

    dispatch(flowchartActions.setFullTimelineView(false));
    const yearIndex = parseInt(value);
    scrollToYear(yearIndex);
  };

  return (
    <Tabs
      value={isFullTimeline ? "full" : selectedYear.toString()}
      onValueChange={handleChange}
    >
      <TabsList className="w-full flex justify-between border-b border-slate-700/50 bg-slate-900/50 p-0 dark:bg-gray-900/50">
        {[...Array(totalYears)].map((_, index) => (
          <TabsTrigger
            key={index}
            value={index.toString()}
            className={`flex-1 rounded-none border-x border-slate-700/30 py-1.5 text-white/80 
              ${isNarrowScreen ? "text-xs px-2" : "text-sm"}
              data-[state=active]:bg-slate-800/50 data-[state=active]:text-white
              dark:data-[state=active]:bg-slate-700/50 dark:data-[state=active]:text-white
              hover:bg-slate-800/30 transition-colors duration-200
            `}
          >
            Year {index + 1}
          </TabsTrigger>
        ))}
        <TabsTrigger
          value="full"
          className={`flex-1 rounded-none border-x border-slate-700/30 py-1.5 text-white/80 
            ${isNarrowScreen ? "text-xs px-2" : "text-sm"}
            data-[state=active]:bg-slate-800/50 data-[state=active]:text-white
            dark:data-[state=active]:bg-slate-700/50 dark:data-[state=active]:text-white
            hover:bg-slate-800/30 transition-colors duration-200
          `}
        >
          Full Timeline
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default YearSelector;
