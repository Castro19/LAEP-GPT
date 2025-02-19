import { SavedSchedules } from "@/components/calendar";
import CollapsibleContentWrapper from "@/components/section/reusable/wrappers/CollapsibleContentWrapper";
import SectionsChosen from "./SectionsChosen";

// Icons
import { FaBook, FaCalendar } from "react-icons/fa";
import Preferences from "../preferences/Preferences";
import { SECTION_FILTERS_SCHEMA } from "@/components/section/courseFilters/helpers/constants";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
const SelectedSectionContainer = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4">
        <CollapsibleContentWrapper
          defaultOpen={false}
          title="Classes"
          icon={FaBook}
        >
          <SectionsChosen />
        </CollapsibleContentWrapper>
        <CollapsibleContentWrapper
          defaultOpen={false}
          title="Schedules"
          icon={FaCalendar}
        >
          <SavedSchedules />
        </CollapsibleContentWrapper>
        <CollapsibleContentWrapper title="Preferences" icon={FaCalendar}>
          <Preferences form={form} />
        </CollapsibleContentWrapper>
      </div>
    </div>
  );
};

export default SelectedSectionContainer;
