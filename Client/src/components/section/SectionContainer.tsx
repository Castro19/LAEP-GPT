import { useAppSelector } from "@/redux";
import { CourseCatalog } from "./SectionDoc";
import { transformSectionsToCatalog } from "@/helpers/transformSection";
import { ScrollArea } from "@/components/ui/scroll-area";

const SectionContainer = () => {
  const sections = useAppSelector((state) => state.section.sections);
  const courses = transformSectionsToCatalog(sections);

  console.log(courses);
  return (
    <div className="flex flex-col gap-4 w-full min-h-screen overflow-hidden no-scroll">
      <div className="overflow-auto flex-1 no-scroll">
        <ScrollArea className="h-full min-w-full mb-4">
          <CourseCatalog courses={courses} />
        </ScrollArea>
      </div>
    </div>
  );
};

export default SectionContainer;
