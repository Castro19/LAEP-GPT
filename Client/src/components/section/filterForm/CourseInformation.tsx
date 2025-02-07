import CollapsibleContentWrapper from "./reusable/CollapsibleContentWrapper";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FaBook } from "react-icons/fa";
import { COURSE_ATTRIBUTES, SECTION_FILTERS_SCHEMA } from "./constants";
import { z } from "zod";
import { DeletableTags } from "./reusable/DeletableTags";
import ReusableDropdown from "@/components/ui/reusable-dropdown";
import TitleLabel from "./reusable/TitleLabel";
import Searchbar from "./reusable/SearchBar";
import { fetchCourses } from "@/components/flowchart/helpers/fetchCourses";
import SUBJECTS from "./api/subjects";
import DoubleSliderFilter from "./reusable/DoubleSliderFilter";

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
                <Searchbar
                  placeholder="Search for a course"
                  fetchData={fetchCourses}
                  onSelect={(courseId) => {
                    // Safely update the 'courseIds' array
                    const current = form.getValues("courseIds") || [];
                    // Avoid duplicates:
                    const courseIdArray = courseId.split(" - ");
                    if (!current.includes(courseIdArray[0])) {
                      form.setValue("courseIds", [
                        ...current,
                        courseIdArray[0],
                      ]);
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
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <TitleLabel title="Subject" />
            <FormControl>
              <ReusableDropdown
                name="subject"
                className="w-full mt-2 dark:bg-zinc-950 dark:text-slate-200 text-sm font-medium"
                dropdownItems={[]}
                valueLabelDropdown={SUBJECTS.map((subject) => ({
                  value: subject.subject,
                  label: subject.description,
                }))}
                handleChangeItem={(_, selectedValue) => {
                  form.setValue("subject", selectedValue);
                }}
                selectedItem={field.value || ""}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {/* Minimum Units Slider */}
      <FormField
        control={form.control}
        name="minUnits"
        render={({ field }) => {
          // 1. Get the min from the field
          const minValue = parseFloat(field.value ?? "0");

          // 2. Watch the max so the component re-renders when it changes
          const maxValueString = form.watch("maxUnits");
          const maxValue = parseFloat(maxValueString ?? "9");

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
                  max={9}
                  step={0.5}
                  label="Units"
                />
              </FormControl>
            </FormItem>
          );
        }}
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
