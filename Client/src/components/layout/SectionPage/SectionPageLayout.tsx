import React from "react";
import SectionPageSidebar from "./SectionPageSidebar";
import SectionPageHeader from "./SectionPageHeader";
import { DragDropContext, DragStart, DropResult } from "@hello-pangea/dnd";

import { handleDragEnd } from "@/redux/panelLayout/panelLayoutSlice";
import { useAppDispatch } from "@/redux";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const SectionPageLayout = ({ children }: SectionPageLayoutProps) => {
  const dispatch = useAppDispatch();
  // Handle drag end: update the order of panels and (for now)
  // assign a placeholder outerDirection value.
  const onDragEnd = (result: DropResult) => {
    console.log("Drag end", result);
    dispatch(
      handleDragEnd({
        sourceIndex: result.source.index,
        destinationIndex: result.destination?.index ?? -1,
      })
    );
  };
  const onDragStart = (start: DragStart) => {
    console.log("Drag start", start);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <SectionPageSidebar />
      <div className="bg-slate-800 text-white flex flex-col max-h-screen w-full no-scroll overflow-hidden">
        <SectionPageHeader />
        <div className="flex-1">{children}</div>
      </div>
    </DragDropContext>
  );
};

export default SectionPageLayout;
