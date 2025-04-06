import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Components
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";
import SectionsChosen from "./SectionsChosen";
import { SavedSchedules } from "@/components/calendar";
import Preferences from "@/components/calendar/buildSchedule/preferences/Preferences";

// Icons
import { FaBook, FaCalendar } from "react-icons/fa";

// constants
import { SECTION_FILTERS_SCHEMA } from "@/components/classSearch/courseFilters/helpers/constants";

const SelectedSectionContainer = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4">
        <CollapsibleContentWrapper title="Classes" icon={FaBook}>
          <SectionsChosen />
        </CollapsibleContentWrapper>
        <CollapsibleContentWrapper title="Schedules" icon={FaCalendar}>
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
