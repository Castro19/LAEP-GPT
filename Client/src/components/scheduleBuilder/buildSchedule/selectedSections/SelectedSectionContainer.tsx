import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useAppSelector } from "@/redux";

// Components
import CollapsibleContentWrapper from "@/components/classSearch/reusable/wrappers/CollapsibleContentWrapper";
import SectionsChosen from "./SectionsChosen";
import { SavedSchedules } from "@/components/scheduleBuilder";
import Preferences from "@/components/scheduleBuilder/buildSchedule/preferences/Preferences";
import LoadingContainer from "../layout/LoadingContainer";

// Icons
import { FaBook, FaCalendar } from "react-icons/fa";

// constants
import { SECTION_FILTERS_SCHEMA } from "@/components/classSearch/courseFilters/helpers/constants";

const SelectedSectionContainer = ({
  form,
  onSwitchTab,
}: {
  form: UseFormReturn<z.infer<typeof SECTION_FILTERS_SCHEMA>>;
  onSwitchTab?: (tab: string) => void;
}) => {
  const { fetchSchedulesLoading } = useAppSelector((state) => state.schedule);
  const { fetchSelectedSectionsLoading } = useAppSelector(
    (state) => state.sectionSelection
  );
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4">
        <CollapsibleContentWrapper title="Classes" icon={FaBook}>
          {fetchSelectedSectionsLoading ? (
            <LoadingContainer />
          ) : (
            <SectionsChosen />
          )}
        </CollapsibleContentWrapper>
        <CollapsibleContentWrapper title="Schedules" icon={FaCalendar}>
          {fetchSchedulesLoading ? (
            <LoadingContainer />
          ) : (
            <SavedSchedules onSwitchTab={onSwitchTab} />
          )}
        </CollapsibleContentWrapper>
        <CollapsibleContentWrapper title="Preferences" icon={FaCalendar}>
          <Preferences form={form} />
        </CollapsibleContentWrapper>
      </div>
    </div>
  );
};

export default SelectedSectionContainer;
