import React from "react";
import SectionPageHeader from "./SectionPageHeader";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import { handleDragEnd } from "@/redux/panelLayout/panelLayoutSlice";
import { useAppDispatch } from "@/redux";
import MobileHeader from "../MobileHeader";
import useMobile from "@/hooks/use-mobile";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const SectionPageLayout = ({ children }: SectionPageLayoutProps) => {
  const dispatch = useAppDispatch();
  const isMobile = useMobile();
  // Handle drag end: update the order of panels and (for now)
  // assign a placeholder outerDirection value.
  const onDragEnd = (result: DropResult) => {
    dispatch(
      handleDragEnd({
        sourceIndex: result.source.index,
        destinationIndex: result.destination?.index ?? -1,
      })
    );
  };

  const onDragStart = () => {};

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {/* <SectionPageSidebar /> */}
      <div className="bg-slate-900 text-white min-h-screen flex flex-col no-scroll w-full ml-2">
        {isMobile ? (
          <>
            <MobileHeader />
            <div className="flex-1">{children}</div>
          </>
        ) : (
          <>
            <SectionPageHeader />
            <div className="flex-1">{children}</div>
          </>
        )}
      </div>
    </DragDropContext>
  );
};

export default SectionPageLayout;
