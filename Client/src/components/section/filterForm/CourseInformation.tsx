import CollapsibleContentWrapper from "./reusable/CollapsibleContentWrapper";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
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
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";
import { flowSelectionActions, useAppDispatch, useAppSelector } from "@/redux";
import { resetConcentrationOptions } from "@/redux/flowSelection/flowSelectionSlice";

const CourseInformation = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  const dispatch = useAppDispatch();
  const { userData } = useUserData();
  const { major, concentration } = userData.flowchartInformation;

  const { majorOptions, concentrationOptions } = useAppSelector(
    (state) => state.flowSelection
  );

  // Fetch major options when the techElectives checkbox is checked
  useEffect(() => {
    if (form.watch("isTechElective")) {
      dispatch(flowSelectionActions.fetchMajorOptions("2022-2026"));
    }
  }, [dispatch, form]);

  // Fetch concentration options when the techElectives checkbox is checked and a major is selected
  useEffect(() => {
    if (form.watch("isTechElective") && form.watch("techElectives.major")) {
      dispatch(
        flowSelectionActions.fetchConcentrationOptions({
          catalog: "2022-2026",
          major: form.watch("techElectives.major"),
        })
      );
    } else {
      dispatch(resetConcentrationOptions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [major, form.watch("techElectives.major"), dispatch]);

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
      <FormItem>
        <div className="flex items-center justify-between gap-1">
          <FormLabel className="font-medium dark:text-gray-400 flex items-center text-sm">
            Include only Tech Electives
          </FormLabel>
          <Switch
            checked={form.watch("isTechElective")}
            onCheckedChange={(checked) => {
              form.setValue("isTechElective", checked);
            }}
          />
        </div>
      </FormItem>
      {form.watch("isTechElective") && (
        <>
          <FormField
            control={form.control}
            name="techElectives.major"
            render={({ field }) => {
              return (
                <FormControl>
                  <ReusableDropdown
                    name="Major"
                    dropdownItems={majorOptions}
                    handleChangeItem={(_, value) => {
                      console.log("VALUE", value);
                      // Retrieve the current techElectives values, defaulting concentration to an empty string if undefined.
                      const currentTechElectives = form.getValues(
                        "techElectives"
                      ) || { major: "", concentration: "" };
                      form.setValue("techElectives", {
                        ...currentTechElectives,
                        major: value,
                        // Ensure concentration is always a string.
                        concentration: currentTechElectives.concentration ?? "",
                      });
                    }}
                    selectedItem={field.value || major || ""}
                    className="w-full border rounded-lg hover:border-blue-300 transition-colors dark:bg-zinc-950 dark:text-slate-200 text-sm font-medium"
                  />
                </FormControl>
              );
            }}
          />
          <FormField
            control={form.control}
            name="techElectives.concentration"
            render={({ field }) => {
              return (
                <FormControl>
                  <ReusableDropdown
                    name="Concentration"
                    dropdownItems={concentrationOptions.map(
                      (item) => item.concName
                    )}
                    handleChangeItem={(_, value) => {
                      console.log("VALUE", value);
                      const selectedConc = concentrationOptions.find(
                        (item) => item.concName === value
                      );
                      if (selectedConc) {
                        const currentTechElectives = form.getValues(
                          "techElectives"
                        ) || { major: "", concentration: "" };
                        form.setValue("techElectives", {
                          ...currentTechElectives,
                          // Update concentration using the code from your options.
                          concentration: selectedConc.code,
                        });
                      }
                    }}
                    /* Convert the saved concentration code to its concName label,
                       falling back on the default concentration (from your selector) if needed. */
                    selectedItem={
                      field.value
                        ? concentrationOptions.find(
                            (option) => option.code === field.value
                          )?.concName ?? ""
                        : concentrationOptions.find(
                            (option) => option.code === concentration
                          )?.concName ?? ""
                    }
                    className="w-full border rounded-lg hover:border-blue-300 transition-colors dark:bg-zinc-950 dark:text-slate-200 text-sm font-medium"
                  />
                </FormControl>
              );
            }}
          />
        </>
      )}
    </CollapsibleContentWrapper>
  );
};

export default CourseInformation;
