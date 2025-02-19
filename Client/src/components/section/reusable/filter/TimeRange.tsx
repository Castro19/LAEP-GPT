import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Components
import { TitleLabel } from "@/components/section";
import { TimeRangeSelector } from "@/components/section/courseFilters/scheduling/Scheduling";

// UI Components
import { FormItem } from "@/components/ui/form";

// Constants
import { SECTION_FILTERS_SCHEMA } from "@/components/section/courseFilters/helpers/constants";

const TimeRange = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  return (
    <FormItem>
      <TitleLabel title="Time Range" />
      <div className="flex gap-3 items-center">
        <div className="w-1/2">
          <TimeRangeSelector name="startTime" form={form} />
        </div>
        <div className="w-1/2">
          <TimeRangeSelector name="endTime" form={form} />
        </div>
      </div>
    </FormItem>
  );
};

export default TimeRange;
