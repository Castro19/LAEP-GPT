import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  FormSwitch,
  InstructorRatingSlider,
  TimeRange,
  UnitSlider,
} from "@/components/section";
import { SECTION_FILTERS_SCHEMA } from "@/components/section/courseFilters/helpers/constants";

const Preferences = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  return (
    <div className="my-4 px-1 space-y-8 pb-4">
      <UnitSlider form={form} min={0} max={24} showRange={false} />
      <InstructorRatingSlider form={form} showDescription={false} />
      <TimeRange form={form} />
      <FormSwitch
        form={form}
        label="Only Open Classes"
        name="openOnly"
        defaultChecked={true}
      />
      <FormSwitch
        form={form}
        label="Show Overlapping Classes"
        name="showOverlappingClasses"
      />
      <FormSwitch
        form={form}
        label="Use Current Selected Schedule"
        name="useCurrentSchedule"
      />
    </div>
  );
};

export default Preferences;
