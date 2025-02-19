import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import TitleLabel from "@/components/section/reusable/filter/TitleLabel";
import DoubleSliderFilter from "@/components/section/reusable/filter/DoubleSliderFilter";
import { SECTION_FILTERS_SCHEMA } from "@/components/section/courseFilters/helpers/constants";

type UnitSliderProps = {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
  min: number;
  max: number;
  showRange?: boolean;
};

const UnitSlider = ({ form, min, max, showRange = true }: UnitSliderProps) => {
  return (
    <FormField
      control={form.control}
      name="minUnits"
      render={({ field }) => {
        // 1. Get the min from the field
        const minValue = parseFloat(field.value ?? "0") || min;

        // 2. Watch the max so the component re-renders when it changes
        const maxValueString = form.watch("maxUnits");
        const maxValue = parseFloat(maxValueString ?? "24") || max;

        return (
          <FormItem>
            <TitleLabel title="Units" />
            <FormControl className="flex-1 w-full ml-4">
              <DoubleSliderFilter
                initialRange={[minValue, maxValue]}
                onRangeChange={([newMin, newMax]) => {
                  field.onChange(newMin.toString());
                  form.setValue("maxUnits", newMax.toString());
                }}
                max={max}
                step={0.5}
                label="Units"
                showRange={showRange}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default UnitSlider;
