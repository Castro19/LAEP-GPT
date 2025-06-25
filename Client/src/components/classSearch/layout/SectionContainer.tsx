/**
 * @component SectionContainer
 * @description Main layout container for class search results. Manages different states (loading,
 * initial, no results, results) and renders appropriate components with pagination.
 *
 * @props
 * None - Component reads from Redux state
 *
 * @dependencies
 * - Redux: classSearch state (sections, isInitialState, loading)
 * - CourseCatalog: Results display component
 * - InitialSectionState: Welcome screen
 * - SectionLoading: Loading indicator
 * - NoSectionsFound: No results display
 * - PaginationFooter: Pagination controls
 * - ScrollArea: Scrollable content area
 *
 * @features
 * - State-based component rendering
 * - Responsive height calculation
 * - Scrollable content area
 * - Pagination integration
 * - Mobile/desktop layout adaptation
 * - Section data transformation
 *
 * @example
 * ```tsx
 * <SectionContainer />
 * ```
 */

import { useAppSelector } from "@/redux";

// My Components
import { CourseCatalog } from "@/components/classSearch/currentSectionList/SectionDoc";
import InitialSectionState from "@/components/classSearch/emptyState/InitialSectionState";
import SectionLoading from "@/components/classSearch/emptyState/SectionLoading";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import { PaginationFooter } from "@/components/classSearch/layout/PaginationFooter";
import NoSectionsFound from "@/components/classSearch/emptyState/NoSectionsFound";

// Helpers
import { transformSectionsToCatalog } from "@/helpers/transformSection";

// UI
import { ScrollArea } from "@/components/ui/scroll-area";

const SectionContainer = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const { sections, isInitialState, loading } = useAppSelector(
    (state) => state.classSearch
  );
  const courses = transformSectionsToCatalog(sections);

  return (
    <div className="flex flex-col gap-4 w-full min-h-screen overflow-hidden no-scroll">
      {loading ? (
        <>
          <SectionLoading />
        </>
      ) : (
        <div className="overflow-auto flex-1 no-scroll">
          <ScrollArea
            className={`${isNarrowScreen ? "h-[calc(100vh-12rem)]" : "h-[calc(100vh-4rem)]"}`}
          >
            {courses.length > 0 ? (
              <>
                <CourseCatalog courses={courses} />
              </>
            ) : isInitialState ? (
              <InitialSectionState />
            ) : (
              <NoSectionsFound />
            )}
          </ScrollArea>
          {courses.length > 0 ? <PaginationFooter /> : null}
        </div>
      )}
    </div>
  );
};

export default SectionContainer;
