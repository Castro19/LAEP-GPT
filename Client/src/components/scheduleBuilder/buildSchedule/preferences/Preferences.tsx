import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  FormSwitch,
  InstructorRatingSlider,
  // TimeRange,
  UnitSlider,
} from "@/components/classSearch";
import { SECTION_FILTERS_SCHEMA } from "@/components/classSearch/courseFilters/helpers/constants";

/**
 * Preferences - Component for managing schedule building preferences
 *
 * This component provides a form interface for configuring various preferences
 * that affect how schedules are generated, including unit limits, instructor ratings,
 * and conflict handling options.
 *
 * @component
 * @param {Object} props - Component props
 * @param {UseFormReturn} props.form - React Hook Form instance for managing form state
 *
 * @example
 * ```tsx
 * const form = useForm<SchedulePreferencesForm>({
 *   resolver: zodResolver(SCHEDULE_PREFERENCES_SCHEMA),
 *   defaultValues: preferences
 * });
 *
 * <Preferences form={form} />
 * ```
 *
 * @dependencies
 * - React Hook Form for form management
 * - Zod for schema validation
 * - Class search components for form controls
 * - SECTION_FILTERS_SCHEMA for validation rules
 *
 * @features
 * - Unit range slider (0-24 units, default 4-16)
 * - Instructor rating slider for schedule average
 * - Toggle for open classes only
 * - Toggle for including time conflicts
 * - Form validation and error handling
 * - Responsive design
 *
 * @formControls
 * - UnitSlider: Sets minimum and maximum unit limits for schedules
 * - InstructorRatingSlider: Sets target average instructor rating
 * - FormSwitch: Toggles for various filtering options
 *
 * @validation
 * - Uses SECTION_FILTERS_SCHEMA for form validation
 * - Real-time validation feedback
 * - Type-safe form handling with TypeScript
 *
 * @styling
 * - Consistent spacing and layout
 * - Dark mode support
 * - Accessible form controls
 */
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
        defaultChecked={true}
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
