import AnimateWrapper from "../section/AnimateWrapper";
import { Card } from "../ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/redux";

const BuildScheduleContainer = ({
  children,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const { loading } = useAppSelector((state) => state.calendar);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AnimateWrapper>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <Card className="flex flex-col border-0 shadow-lg no-scroll flex-1 h-full">
          <div className="overflow-auto flex-1 no-scroll">
            <ScrollArea className="h-full min-w-full mb-4">
              <div className="px-6 space-y-4 pb-4">{children}</div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </AnimateWrapper>
  );
};

export default BuildScheduleContainer;
