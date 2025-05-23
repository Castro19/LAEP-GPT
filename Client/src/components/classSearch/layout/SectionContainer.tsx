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
