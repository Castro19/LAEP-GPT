import { UseFormReturn } from "react-hook-form";

// Components
import CourseInformation from "@/components/section/courseFilters/courseInformation/CourseInformation";
import Instructor from "@/components/section/courseFilters/instructorAndRatings/Instructor";
import Scheduling from "@/components/section/courseFilters/scheduling/Scheduling";
import QueryAI from "@/components/section/courseFilters/aiClassSearch/QueryAI";
import { SectionFiltersForm } from "@/components/section/courseFilters/SectionForm";

// Define a Zod schema for the filter form.

export function SectionFilters({
  form,
}: {
  form: UseFormReturn<SectionFiltersForm>;
}) {
  return (
    <div className="flex flex-col h-full mt-2">
      <div className="flex flex-col gap-4">
        <CourseInformation form={form} />
        {/* Border with pop up effect*/}
        <div className="border-t border-slate-600" />
        <Scheduling form={form} />
        {/* Border */}
        <div className="border-t border-slate-600" />
        <Instructor form={form} />
        {/* Border */}
        <div className="border-t border-slate-600" />
        <QueryAI />
      </div>
    </div>
  );
}

export default SectionFilters;
