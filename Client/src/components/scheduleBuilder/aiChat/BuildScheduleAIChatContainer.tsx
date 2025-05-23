import AnimateWrapper from "@/components/classSearch/reusable/wrappers/AnimateWrapper";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/redux";
import { useEffect, useRef, forwardRef } from "react";

const BuildScheduleAIChatContainer = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  const scrollTrigger = useAppSelector((state) => state.layout.scrollTrigger);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollTrigger && scrollRef.current) {
      // Scroll to the bottom of the scroll area
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollTrigger]);

  return (
    <AnimateWrapper>
      <div className="flex flex-col h-[calc(100vh-18rem)]">
        <Card className="flex flex-col border-0 shadow-lg no-scroll flex-1 h-full">
          <div className="overflow-auto flex-1 no-scroll">
            <ScrollArea className="h-full min-w-full mb-4">
              <div ref={ref} className="px-6 space-y-4 pb-4">
                {children}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </AnimateWrapper>
  );
});

BuildScheduleAIChatContainer.displayName = "BuildScheduleAIChatContainer";

export default BuildScheduleAIChatContainer;
