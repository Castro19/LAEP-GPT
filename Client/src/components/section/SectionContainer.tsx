import { useAppSelector } from "@/redux";
import { CourseCatalog } from "./SectionDoc";
import { transformSectionsToCatalog } from "@/helpers/transformSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaginationFooter } from "./PaginationFooter";
import NoSectionsFound from "./NoSectionsFound";

const initialState = {
  courseIds: [],
  status: "",
  subject: "",
  days: "",
  timeRange: "07:00-20:00",
  minInstructorRating: "0",
  maxInstructorRating: "4",
  includeUnratedInstructors: true,
  units: "6",
  courseAttribute: [],
  instructionMode: "",
  instructors: [],
};

// compare object library
import isEqual from "lodash/isEqual";
import InitialSectionState from "./InitialSectionState";
const SectionContainer = () => {
  const { sections, filters } = useAppSelector((state) => state.section);
  const courses = transformSectionsToCatalog(sections);

  const isInitialState = isEqual(filters, initialState);

  return (
    <div className="flex flex-col gap-4 w-full min-h-screen overflow-hidden no-scroll pb-12">
      <div className="overflow-auto flex-1 no-scroll">
        <ScrollArea className="h-full min-w-full pb-12">
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
    </div>
  );
};

export default SectionContainer;
