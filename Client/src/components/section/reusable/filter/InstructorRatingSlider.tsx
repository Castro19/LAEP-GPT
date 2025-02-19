import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import TitleLabel from "./TitleLabel";
import DoubleSliderFilter from "./DoubleSliderFilter";
import { SECTION_FILTERS_SCHEMA } from "../../courseFilters/helpers/constants";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type InstructorRatingSliderProps = {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
  showDescription?: boolean;
  label?: string;
};

const InstructorRatingSlider = ({
  form,
  showDescription = true,
  label = "Instructor Rating",
}: InstructorRatingSliderProps) => {
  return (
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
              <TitleLabel title={label} />
              {showDescription && (
                <FormLabel className="font-medium dark:text-gray-400 flex items-center text-sm">
                  All instructor ratings based on PolyRatings
                </FormLabel>
              )}

              <div className="flex flex-col w-full">
                <FormControl className="flex-1 w-full ml-4">
                  <DoubleSliderFilter
                    // 3. Pass BOTH min and max to initialRange
                    initialRange={[minValue || 0, maxValue || 4]}
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
  );
};

export default InstructorRatingSlider;
