import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SECTION_FILTERS_SCHEMA } from "./constants";
import InstructorRatingFilter from "../InstructorRatingFilter";
import { z } from "zod";
import CollapsibleContentWrapper from "./reusable/CollapsibleContentWrapper";
import { FaUser } from "react-icons/fa";
import TitleLabel from "./reusable/TitleLabel";
import { Switch } from "@/components/ui/switch";
import { DeletableTags } from "./reusable/DeletableTags";
import Searchbar from "./reusable/SearchBar";
import fetchProfessors from "./api/fetchProfessors";

const Instructor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  return (
    <CollapsibleContentWrapper title="Instructors & Ratings" icon={FaUser}>
      <FormField
        control={form.control}
        // We will treat this field as the "main" field
        name="minInstructorRating"
        render={({ field }) => {
          // 1. Get the min from the field
          const minValue = parseFloat(field.value ?? "0");

          // 2. Watch the max so the component re-renders when it changes
          const maxValueString = form.watch("maxInstructorRating");
          const maxValue = parseFloat(maxValueString ?? "4");

          return (
            <FormItem>
              <div className="flex flex-col items-start justify-start gap-1">
                <TitleLabel title="Instructor Rating" />
                <FormLabel className="font-medium dark:text-gray-400 flex items-center text-sm">
                  All instructor ratings based on PolyRatings
                </FormLabel>

                <div className="flex flex-col w-full">
                  <FormControl className="flex-1 w-full ml-4">
                    <InstructorRatingFilter
                      // 3. Pass BOTH min and max to initialRange
                      initialRange={[minValue, maxValue]}
                      onRangeChange={([newMin, newMax]) => {
                        // 4. Write BOTH min and max to the form
                        field.onChange(newMin.toString());
                        form.setValue("maxInstructorRating", newMax.toString());
                      }}
                    />
                  </FormControl>
                </div>
              </div>
            </FormItem>
          );
        }}
      />
      <FormItem>
        <div className="flex items-center justify-between gap-1">
          <FormLabel className="font-medium dark:text-gray-400 flex items-center text-sm">
            Include unrated instructors
          </FormLabel>
          <FormField
            control={form.control}
            name="includeUnratedInstructors"
            render={({ field }) => {
              return (
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      form.setValue("includeUnratedInstructors", checked);
                    }}
                  />
                </FormControl>
              );
            }}
          />
        </div>
      </FormItem>
      <FormField
        control={form.control}
        name="instructors"
        render={() => (
          <FormItem>
            <TitleLabel title="Instructor" />
            <FormControl>
              <div>
                <Searchbar
                  fetchData={fetchProfessors}
                  onSelect={(instructor) => {
                    // Safely update the 'instructors' array
                    const current = form.getValues("instructors") || [];
                    // Avoid duplicates:
                    if (!current.includes(instructor)) {
                      form.setValue("instructors", [...current, instructor]);
                    }
                  }}
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
