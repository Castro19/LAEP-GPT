import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import TitleLabel from "@/components/classSearch/reusable/filter/TitleLabel";
import DoubleSliderFilter from "@/components/classSearch/reusable/filter/DoubleSliderFilter";
import { SECTION_FILTERS_SCHEMA } from "@/components/classSearch/courseFilters/helpers/constants";

type CatalogNumberSlider = {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
  min: number;
  max: number;
};

const CatalogNumberSlider = ({ form, min, max }: CatalogNumberSlider) => {
  return (
    <FormField
      control={form.control}
      name="minCatalogNumber"
      render={({ field }) => {
        // 1. Get the min from the field
        const minValue = parseFloat(field.value ?? "100") || min;

        // 2. Watch the max so the component re-renders when it changes
        const maxValueString = form.watch("maxCatalogNumber");
        const maxValue = parseFloat(maxValueString ?? "600") || max;

        return (
          <FormItem>
            <TitleLabel title="Catalog Number" />
            <FormControl className="flex-1 w-full ml-4">
              <DoubleSliderFilter
                initialRange={[minValue, maxValue]}
                onRangeChange={([newMin, newMax]) => {
                  field.onChange(newMin.toString());
                  form.setValue("maxCatalogNumber", newMax.toString());
                }}
                min={min}
                max={max}
                step={100}
                toFixed={0}
                showLabel={false}
                labelStep={100}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default CatalogNumberSlider;
