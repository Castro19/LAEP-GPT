import { useAppSelector } from "@/redux";

// My Components
import { CourseCatalog } from "@/components/section/currentSectionList/SectionDoc";
import InitialSectionState from "@/components/section/emptyState/InitialSectionState";
import SectionLoading from "@/components/section/emptyState/SectionLoading";
import useIsMobile from "@/hooks/use-mobile";
import { PaginationFooter } from "@/components/section/layout/PaginationFooter";
import NoSectionsFound from "@/components/section/emptyState/NoSectionsFound";

// Helpers
import { transformSectionsToCatalog } from "@/helpers/transformSection";

// UI
import { ScrollArea } from "@/components/ui/scroll-area";

const SectionContainer = () => {
  const isMobile = useIsMobile();
  const { sections, isInitialState, loading } = useAppSelector(
    (state) => state.section
  );
  const courses = transformSectionsToCatalog(sections);

  return (
    <div className="flex flex-col gap-4 w-full min-h-screen overflow-hidden no-scroll">
      {loading ? (
        <SectionLoading />
      ) : (
        <div className="overflow-auto flex-1 no-scroll">
          <ScrollArea
            className={`${isMobile ? "h-[75%]" : "h-[85%]"} min-w-full pb-12`}
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
