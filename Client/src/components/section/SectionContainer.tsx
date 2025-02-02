import { useAppSelector } from "@/redux";
import { CourseCatalog } from "./SectionDoc";
import { transformSectionsToCatalog } from "@/helpers/transformSection";

const SectionContainer = () => {
  const sections = useAppSelector((state) => state.section.sections);
  const courses = transformSectionsToCatalog(sections);

  console.log(courses);
  return (
    <div className="flex flex-col gap-4">
      <CourseCatalog courses={courses} />
    </div>
  );
};

export default SectionContainer;
