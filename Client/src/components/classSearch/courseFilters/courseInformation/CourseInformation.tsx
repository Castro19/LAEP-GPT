import { useEffect } from "react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { flowSelectionActions, useAppDispatch, useAppSelector } from "@/redux";

// Hooks
import { useUserData } from "@/hooks/useUserData";

// My Components
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";
import { fetchCoursesAPI } from "@/components/flowchart";
import {
  FormSwitch,
  UnitSlider,
  TitleLabel,
  DeletableTags,
} from "@/components/classSearch";

// UI Components
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import ReusableDropdown from "@/components/ui/reusable-dropdown";
import Searchbar from "@/components/classSearch/reusable/filter/SearchBar";

// Icons
import { FaBook } from "react-icons/fa";

// Constants
import {
  COURSE_ATTRIBUTES,
  SECTION_FILTERS_SCHEMA,
} from "@/components/classSearch/courseFilters/helpers/constants";
import SUBJECTS from "@/components/classSearch/courseFilters/helpers/api/subjects";
import CatalogNumberSlider from "./CatalogNumberSlider";
import TermSelector from "@/components/classSearch/TermSelector";

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
      dispatch(flowSelectionActions.resetConcentrationOptions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [major, form.watch("techElectives.major"), dispatch]);

  useEffect(() => {
    if (concentrationOptions.length > 0 && concentrationOptions[0].code) {
      const currentTechElectives = form.getValues("techElectives") || {
        major: "",
        concentration: "",
      };
      form.setValue("techElectives", {
        ...currentTechElectives,
        // Update concentration using the code from your options.
        concentration: concentrationOptions[0].code,
      });
    }
  }, [concentrationOptions, form]);

  return (
    <CollapsibleContentWrapper title="Course Information" icon={FaBook}>
      <FormField
        control={form.control}
        name="term"
        render={() => <TermSelector form={form} />}
        defaultValue="summer2025"
      />
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
                  fetchData={(inputValue) =>
                    fetchCoursesAPI("2022-2026", inputValue)
                  }
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
                  // If "none" is selected, set the value to an empty string
                  form.setValue(
                    "subject",
                    selectedValue === "none" ? "" : selectedValue
                  );
                }}
                selectedItem={field.value === "none" ? "" : field.value || ""}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <CatalogNumberSlider form={form} min={100} max={600} />
      <UnitSlider form={form} min={0} max={9} />
      <FormField
        control={form.control}
        name="courseAttributes"
        render={() => (
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
                    tags={form.getValues("courseAttributes") || []}
                    onRemove={(itemToRemove) => {
                      // Filter out the removed item
                      const updated = (
                        form.getValues("courseAttributes") || []
                      ).filter((val: string) => val !== itemToRemove);
                      form.setValue("courseAttributes", updated);
                    }}
                  />
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isCreditNoCredit"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FormSwitch
                form={form}
                label="Credit / No Credit"
                name="isCreditNoCredit"
                defaultChecked={field.value}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isTechElective"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FormSwitch
                form={form}
                label="Include only Tech Electives"
                name="isTechElective"
                defaultChecked={field.value}
              />
            </FormControl>
            {field.value && (
              <div className="flex flex-col gap-2">
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
                            // Retrieve the current techElectives values, defaulting concentration to an empty string if undefined.
                            const currentTechElectives = form.getValues(
                              "techElectives"
                            ) || { major: "", concentration: "" };
                            form.setValue("techElectives", {
                              ...currentTechElectives,
                              major: value,
                              // Ensure concentration is always a string.
                              concentration:
                                currentTechElectives.concentration ?? "",
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
                              ? (concentrationOptions.find(
                                  (option) => option.code === field.value
                                )?.concName ?? "")
                              : (concentrationOptions.find(
                                  (option) => option.code === concentration
                                )?.concName ?? "")
                          }
                          className="w-full border rounded-lg hover:border-blue-300 transition-colors dark:bg-zinc-950 dark:text-slate-200 text-sm font-medium"
                        />
                      </FormControl>
                    );
                  }}
                />
              </div>
            )}
          </FormItem>
        )}
      />
    </CollapsibleContentWrapper>
  );
};

export default CourseInformation;
