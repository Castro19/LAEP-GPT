import CollapsibleContentWrapper from "../section/filterForm/reusable/CollapsibleContentWrapper";
import { ScrollArea } from "../ui/scroll-area";
import SectionsChosen from "./SectionsChosen";
import { FaBook } from "react-icons/fa";
const SelectedSectionContainer = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto flex-1 no-scroll">
        <ScrollArea className="h-full min-w-full mb-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            Build Your Schedule
          </h1>
          <div className="flex flex-col gap-4">
            <CollapsibleContentWrapper title="Selected Sections" icon={FaBook}>
              <SectionsChosen />
            </CollapsibleContentWrapper>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SelectedSectionContainer;
