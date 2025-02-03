import React, { useEffect } from "react";
import {
  OnePanelLayout,
  TwoPanelLayout,
  ThreePanelLayout,
  FourPanelLayout,
} from "./PanelLayouts";
import { Droppable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addPanel, deletePanel } from "@/redux/panelLayout/panelLayoutSlice";

const ResizableSectionLayout: React.FC = () => {
  const dispatch = useDispatch();
  const panels = useSelector((state: RootState) => state.panelLayout.panels);
  const outerDirection = useSelector(
    (state: RootState) => state.panelLayout.outerDirection
  );

  const handleDelete = (id: string) => {
    dispatch(deletePanel(id));
  };

  const handleAdd = () => {
    if (panels.length >= 4) return;
    const nextNumber = panels.length + 1;
    dispatch(addPanel({ id: `${nextNumber}`, label: `Panel ${nextNumber}` }));
  };

  let layout;
  if (panels.length === 0) {
    layout = (
      <div className="flex h-full items-center justify-center text-gray-500">
        No panels remain.
      </div>
    );
  } else if (panels.length === 1) {
    layout = (
      <OnePanelLayout panel={panels[0]} onDelete={handleDelete} index={0} />
    );
  } else if (panels.length === 2) {
    layout = (
      <TwoPanelLayout
        panels={[panels[0], panels[1]]}
        onDelete={handleDelete}
        direction="horizontal"
        startIndex={0}
      />
    );
  } else if (panels.length === 3) {
    layout = (
      <ThreePanelLayout
        panels={[panels[0], panels[1], panels[2]]}
        onDelete={handleDelete}
        direction={outerDirection}
        startIndex={0}
      />
    );
  } else {
    layout = (
      <FourPanelLayout
        panels={[panels[0], panels[1], panels[2], panels[3]]}
        onDelete={handleDelete}
        direction={outerDirection}
        startIndex={0}
      />
    );
  }

  useEffect(() => {
    console.log("Panels: ", panels);
  }, [panels]);
  return (
    <div className="flex-1">
      <div className="mb-2 flex gap-2 ">
        {panels.length < 4 && (
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Panel
          </button>
        )}
      </div>
      {layout}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const draggableSectionLayout = (children: React.ReactNode) => {
  return (
    <Droppable droppableId="panels-droppable">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="h-full w-full"
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default ResizableSectionLayout;
