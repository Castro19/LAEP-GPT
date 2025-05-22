import AnimateWrapper from "@/components/classSearch/reusable/wrappers/AnimateWrapper";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/redux";
import { useEffect, useRef } from "react";

const SCROLL_AREA_ID = "build-schedule-scroll-area";
const SCROLL_VIEWPORT_ID = `${SCROLL_AREA_ID}-viewport`;

const BuildScheduleContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const scrollTrigger = useAppSelector((state) => state.layout.scrollTrigger);
  const scrollRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollTrigger && scrollRef.current) {
      // Scroll to the bottom of the scroll area
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollTrigger]);

  // Set viewport ID after mount
  useEffect(() => {
    const viewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      viewport.id = SCROLL_VIEWPORT_ID;
    }
  }, []);

  return (
    <AnimateWrapper>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <Card className="flex flex-col border-0 shadow-lg no-scroll flex-1 h-full">
          <div className="overflow-auto flex-1 no-scroll">
            <ScrollArea
              id={SCROLL_AREA_ID}
              className="h-full min-w-full mb-4"
              ref={scrollRef}
            >
              <div className="px-6 space-y-4 pb-4">{children}</div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </AnimateWrapper>
  );
};

export { SCROLL_VIEWPORT_ID };
export default BuildScheduleContainer;
