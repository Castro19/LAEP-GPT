import { SavedSchedules } from "@/components/calendar";
import CollapsibleContentWrapper from "@/components/section/reusable/wrappers/CollapsibleContentWrapper";
import SectionsChosen from "./SectionsChosen";
import CalendarBuilderForm from "../preferences/CalendarBuilderForm";
// Icons
import { FaBook, FaCalendar } from "react-icons/fa";

const SelectedSectionContainer = () => {
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
          <CalendarBuilderForm />
        </CollapsibleContentWrapper>
      </div>
    </div>
  );
};

export default SelectedSectionContainer;
