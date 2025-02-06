import { ScrollArea } from "../ui/scroll-area";
import SectionsChosen from "./SectionsChosen";

const SelectedSectionContainer = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto flex-1 no-scroll">
        <ScrollArea className="h-full min-w-full mb-4 p-4">
          <h1 className="text-2xl font-bold">Selected Sections</h1>
          <div className="flex flex-col gap-4">
            <SectionsChosen />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SelectedSectionContainer;
