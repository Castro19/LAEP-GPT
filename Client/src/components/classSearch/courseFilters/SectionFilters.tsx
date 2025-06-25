/**
 * @component SectionFilters
 * @description Main container that orchestrates all course filter sections. Renders CourseInformation,
 * Scheduling, Instructor, and QueryAI components with visual separators.
 *
 * @props
 * @prop {UseFormReturn<SectionFiltersForm>} form - React Hook Form instance for filter state management
 *
 * @dependencies
 * - CourseInformation: Course term, subject, catalog number, units, attributes
 * - Scheduling: Days, time range, enrollment status, instruction mode
 * - Instructor: Rating range, instructor search, unrated toggle
 * - QueryAI: OpenAI Query Class Search
 *
 * @example
 * ```tsx
 * const form = useForm<SectionFiltersForm>();
 * <SectionFilters form={form} />
 * ```
 */

import { UseFormReturn } from "react-hook-form";

// Components
import CourseInformation from "@/components/classSearch/courseFilters/courseInformation/CourseInformation";
import Instructor from "@/components/classSearch/courseFilters/instructorAndRatings/Instructor";
import Scheduling from "@/components/classSearch/courseFilters/scheduling/Scheduling";
import QueryAI from "@/components/classSearch/courseFilters/aiClassSearch/QueryAI";
import { SectionFiltersForm } from "@/components/classSearch/courseFilters/SectionForm";

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
