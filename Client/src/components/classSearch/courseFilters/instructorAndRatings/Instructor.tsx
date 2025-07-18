/**
 * @component Instructor
 * @description Handles instructor-related filtering including rating ranges, instructor search,
 * and options for including unrated instructors.
 *
 * @props
 * @prop {UseFormReturn<SectionFiltersForm>} form - React Hook Form instance for instructor filter state
 *
 * @dependencies
 * - fetchProfessors: API helper for instructor search
 * - InstructorRatingSlider: Rating range selection component
 * - Searchbar: Instructor search with autocomplete
 * - DeletableTags: Selected instructor display and removal
 *
 * @features
 * - Instructor rating range slider (min/max)
 * - Include unrated instructors toggle
 * - Instructor search with autocomplete
 * - Selected instructors with deletable tags
 * - Real-time instructor filtering
 *
 * @example
 * ```tsx
 * const form = useForm<SectionFiltersForm>();
 * <Instructor form={form} />
 * ```
 */

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

// My Components
import { SECTION_FILTERS_SCHEMA } from "@/components/classSearch/courseFilters/helpers/constants";
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";
import {
  DeletableTags,
  FormSwitch,
  InstructorRatingSlider,
  TitleLabel,
} from "@/components/classSearch";
import Searchbar from "@/components/classSearch/reusable/filter/SearchBar";
import fetchProfessors from "@/components/classSearch/courseFilters/helpers/api/fetchProfessors";

// UI Components
import { FormControl, FormField, FormItem } from "@/components/ui/form";

// Icons
import { FaUser } from "react-icons/fa";

const Instructor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  return (
    <CollapsibleContentWrapper
      title="Instructors & Ratings"
      icon={FaUser}
      defaultOpen={false}
    >
      <InstructorRatingSlider form={form} />
      <FormSwitch
        form={form}
        label="Include unrated instructors"
        name="includeUnratedInstructors"
      />
      <FormField
        control={form.control}
        name="instructors"
        render={() => (
          <FormItem>
            <TitleLabel title="Instructor" />
            <FormControl>
              <div>
                <Searchbar
                  placeholder="Search for an instructor"
                  fetchData={fetchProfessors}
                  onSelect={(instructor) => {
                    // Safely update the 'instructors' array
                    const current = form.getValues("instructors") || [];
                    // Avoid duplicates:
                    if (!current.includes(instructor)) {
                      form.setValue("instructors", [...current, instructor]);
                    }
                  }}
                  type="instructor"
                />
                <DeletableTags
                  tags={form.getValues("instructors") || []}
                  onRemove={(idToRemove) => {
                    const updated =
                      form
                        .getValues("instructors")
                        ?.filter((id: string) => id !== idToRemove) || [];
                    form.setValue("instructors", updated);
                  }}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </CollapsibleContentWrapper>
  );
};

export default Instructor;
