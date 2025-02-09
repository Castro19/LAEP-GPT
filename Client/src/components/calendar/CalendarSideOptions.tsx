import { Card } from "../ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const CalendarSideOptions = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col border-0 shadow-lg no-scroll max-h-[83%]">
        <div className="overflow-auto flex-1 no-scroll">
          <ScrollArea className="h-full min-w-full mb-4">
            <div className="p-4"></div>

            <div className="px-6 space-y-4 pb-4">{children}</div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default CalendarSideOptions;
