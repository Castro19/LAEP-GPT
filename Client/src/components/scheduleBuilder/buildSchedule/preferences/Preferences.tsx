import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  FormSwitch,
  InstructorRatingSlider,
  // TimeRange,
  UnitSlider,
} from "@/components/classSearch";
import { SECTION_FILTERS_SCHEMA } from "@/components/classSearch/courseFilters/helpers/constants";

const Preferences = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  return (
    <div className="my-4 px-1 space-y-8 pb-4">
      <UnitSlider
        form={form}
        min={0}
        max={24}
        defaultMinValue={4}
        defaultMaxValue={16}
        showRange={false}
      />
      <InstructorRatingSlider
        form={form}
        showDescription={false}
        label="Schedule Average Rating"
      />
      {/* <TimeRange form={form} /> */}
      <FormSwitch
        form={form}
        label="Only Open Classes"
        name="openOnly"
        defaultChecked={false}
      />
      <FormSwitch
        form={form}
        label="With Time Conflicts"
        name="withTimeConflicts"
        defaultChecked={false}
      />
      {/* <FormSwitch
        form={form}
        label="Use Current Selected Schedule"
        name="useCurrentSchedule"
      /> */}
    </div>
  );
};

export default Preferences;
