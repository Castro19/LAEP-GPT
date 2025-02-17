import CollapsibleContentWrapper from "@/components/section/filterForm/reusable/CollapsibleContentWrapper";
import SavedSchedules from "@/components/calendar/buildSchedule/savedSchedules/SavedSchedules";
import SectionsChosen from "@/components/calendar/buildSchedule/selectedSections/SectionsChosen";

import { FaBook, FaCalendar } from "react-icons/fa";
const SelectedSectionContainer = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4">
        <CollapsibleContentWrapper title="Selected Sections" icon={FaBook}>
          <SectionsChosen />
        </CollapsibleContentWrapper>
        <CollapsibleContentWrapper title="Saved Schedules" icon={FaCalendar}>
          <SavedSchedules />
        </CollapsibleContentWrapper>
      </div>
    </div>
  );
};

export default SelectedSectionContainer;
