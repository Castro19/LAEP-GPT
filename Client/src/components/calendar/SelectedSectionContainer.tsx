import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import SectionsChosen from "./SectionsChosen";

const SelectedSectionContainer = () => {
  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col border-0 shadow-lg no-scroll max-h-[83%]">
        <div className="overflow-auto flex-1 no-scroll">
          <ScrollArea className="h-full min-w-full mb-4">
            <SectionsChosen />
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default SelectedSectionContainer;
