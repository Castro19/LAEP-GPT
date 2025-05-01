import AnimateWrapper from "@/components/classSearch/reusable/wrappers/AnimateWrapper";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/redux";
import { useEffect, useRef } from "react";

const BuildScheduleContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { fetchSchedulesLoading } = useAppSelector((state) => state.schedule);
  const scrollTrigger = useAppSelector((state) => state.layout.scrollTrigger);
  const scrollRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollTrigger && scrollRef.current) {
      // Scroll to the bottom of the scroll area
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollTrigger]);

  if (fetchSchedulesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AnimateWrapper>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <Card className="flex flex-col border-0 shadow-lg no-scroll flex-1 h-full">
          <div className="overflow-auto flex-1 no-scroll">
            <ScrollArea className="h-full min-w-full mb-4" ref={scrollRef}>
              <div className="px-6 space-y-4 pb-4">{children}</div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </AnimateWrapper>
  );
};

export default BuildScheduleContainer;
