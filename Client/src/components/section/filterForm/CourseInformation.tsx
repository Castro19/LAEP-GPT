import CollapsibleContentWrapper from "./reusable/CollapsibleContentWrapper";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import SectionCourseDropdown from "../SectionCourseDropdown";
import { Slider } from "@/components/ui/slider";
import { FaBook } from "react-icons/fa";
import { COURSE_ATTRIBUTES, SECTION_FILTERS_SCHEMA } from "./constants";
import { z } from "zod";
import { DeletableTags } from "./reusable/DeletableTags";
import ReusableDropdown from "@/components/ui/reusable-dropdown";
import TitleLabel from "./reusable/TitleLabel";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CourseInformation = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  return (
    <CollapsibleContentWrapper title="Course Information" icon={FaBook}>
      <FormField
        control={form.control}
        name="courseIds"
        render={() => (
          <FormItem>
            <TitleLabel title="Course" />
            <FormControl>
              <div>
                <SectionCourseDropdown
                  onSelect={(courseId) => {
                    // Safely update the 'courseIds' array
                    const current = form.getValues("courseIds") || [];
                    // Avoid duplicates:
                    if (!current.includes(courseId)) {
                      form.setValue("courseIds", [...current, courseId]);
                    }
                  }}
                />
                <DeletableTags
                  tags={form.getValues("courseIds") || []}
                  onRemove={(idToRemove) => {
                    const updated =
                      form
                        .getValues("courseIds")
                        ?.filter((id: string) => id !== idToRemove) || [];
                    form.setValue("courseIds", updated);
                  }}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      {/* Minimum Units Slider */}
      <FormField
        control={form.control}
        name="units"
        render={({ field }) => (
          <FormItem>
            <TitleLabel title="Units" />
            <FormControl>
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm text-gray-700">
                  {field.value} Units
                </span>
                <Slider
                  value={[field.value || 0]}
                  onValueChange={(value) =>
                    form.setValue("units", value[0] as number)
                  }
                  max={6}
                  step={1}
                  className="w-full h-2 bg-gray-300 rounded-full"
                  aria-label="Minimum Units"
                />
                <div className="flex justify-between w-full text-xs text-gray-600">
                  <span>0</span>
                  <span>6</span>
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="courseAttributes"
        render={({ field }) => (
          <FormItem>
            <TitleLabel title="Course Attributes" />
            <FormControl>
              <div className="flex justify-between items-center w-full">
                {/* 
                  Whenever a user selects an item from the dropdown, 
                  add it to the existing array of courseAttributes.
                */}
                <div className="w-1/2">
                  <ReusableDropdown
                    name="courseAttributes"
                    className="w-full mt-2 dark:bg-zinc-950 dark:text-slate-200 text-sm font-medium"
                    placeholder="Select"
                    // Ensure COURSE_ATTRIBUTES is an array of strings in your constants
                    dropdownItems={COURSE_ATTRIBUTES as unknown as string[]}
                    selectedItem="" // Since we're adding items to an array, we can keep this empty
                    handleChangeItem={(_, selectedValue) => {
                      // Get current array of attributes
                      const current = form.getValues("courseAttributes") || [];

                      // Only add if not already in the list (avoid duplicates)
                      if (
                        !current.includes(
                          selectedValue as (typeof COURSE_ATTRIBUTES)[number]
                        )
                      ) {
                        form.setValue("courseAttributes", [
                          ...current,
                          selectedValue as (typeof COURSE_ATTRIBUTES)[number],
                        ]);
                      }
                    }}
                  />
                </div>
                <div className="w-1/2 ml-4">
                  {/* Display currently selected attributes as deletable tags */}
                  <DeletableTags
                    tags={field.value || []}
                    onRemove={(itemToRemove) => {
                      // Filter out the removed item
                      const updated = (field.value || []).filter(
                        (val: string) => val !== itemToRemove
                      );
                      form.setValue("courseAttributes", updated);
                    }}
                  />
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </CollapsibleContentWrapper>
  );
};

export default CourseInformation;
