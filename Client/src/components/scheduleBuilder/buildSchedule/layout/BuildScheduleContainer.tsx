import AnimateWrapper from "@/components/classSearch/reusable/wrappers/AnimateWrapper";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/redux";
import { useEffect, useRef } from "react";

const SCROLL_AREA_ID = "build-schedule-scroll-area";
const SCROLL_VIEWPORT_ID = `${SCROLL_AREA_ID}-viewport`;

/**
 * BuildScheduleContainer - Layout container for the schedule builder interface
 *
 * This component provides the main layout structure for the schedule building interface,
 * including a scrollable area with proper height management and scroll behavior.
 * It integrates with the layout system to handle scroll triggers and viewport management.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the container
 *
 * @example
 * ```tsx
 * <BuildScheduleContainer>
 *   <SelectedSectionContainer />
 *   <Preferences />
 * </BuildScheduleContainer>
 * ```
 *
 * @dependencies
 * - Redux store for layout state management
 * - AnimateWrapper for entrance animations
 * - UI components for card and scroll area
 * - React refs for scroll management
 *
 * @features
 * - Responsive height calculation (calc(100vh-12rem))
 * - Scrollable content area with proper overflow handling
 * - Automatic scroll to bottom on trigger
 * - Viewport ID management for external scroll control
 * - Card-based layout with shadow and border styling
 * - Animation wrapper integration
 *
 * @layout
 * - Flex column layout for vertical stacking
 * - Full height container with overflow management
 * - Consistent padding and spacing
 * - Dark mode support through UI components
 *
 * @scrollBehavior
 * - Monitors scrollTrigger from Redux state
 * - Automatically scrolls to bottom when triggered
 * - Maintains scroll position during content updates
 * - Provides viewport ID for external scroll control
 *
 * @constants
 * - SCROLL_AREA_ID: Unique identifier for the scroll area
 * - SCROLL_VIEWPORT_ID: Unique identifier for the scroll viewport
 */
const BuildScheduleContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const scrollTrigger = useAppSelector((state) => state.layout.scrollTrigger);
  const scrollRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollTrigger && scrollRef.current) {
      // Scroll to the bottom of the scroll area
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollTrigger]);

  // Set viewport ID after mount
  useEffect(() => {
    const viewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      viewport.id = SCROLL_VIEWPORT_ID;
    }
  }, []);

  return (
    <AnimateWrapper>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <Card className="flex flex-col border-0 shadow-lg no-scroll flex-1 h-full">
          <div className="overflow-auto flex-1 no-scroll">
            <ScrollArea
              id={SCROLL_AREA_ID}
              className="h-full min-w-full mb-4"
              ref={scrollRef}
            >
              <div className="px-6 space-y-4 pb-4">{children}</div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </AnimateWrapper>
  );
};

export { SCROLL_VIEWPORT_ID };
export default BuildScheduleContainer;
