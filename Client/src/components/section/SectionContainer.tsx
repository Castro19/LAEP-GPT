import { useAppSelector } from "@/redux";
import { CourseCatalog } from "./SectionDoc";
import { transformSectionsToCatalog } from "@/helpers/transformSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaginationFooter } from "./PaginationFooter";

const SectionContainer = () => {
  const sections = useAppSelector((state) => state.section.sections);
  const courses = transformSectionsToCatalog(sections);

  return (
    <div className="flex flex-col gap-4 w-full min-h-screen overflow-hidden no-scroll pb-12">
      <div className="overflow-auto flex-1 no-scroll">
        <ScrollArea className="h-full min-w-full pb-12">
          {courses.length > 0 ? (
            <>
              <CourseCatalog courses={courses} />
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No courses found</p>
            </div>
          )}
        </ScrollArea>
        {courses.length > 0 ? <PaginationFooter /> : null}
      </div>
    </div>
  );
};

export default SectionContainer;
