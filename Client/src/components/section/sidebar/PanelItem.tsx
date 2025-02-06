import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
  DeletablePanel,
  PanelData,
} from "@/components/section/sidebar/PanelLayouts";
import { SectionFilters } from "../filterForm/SectionFilters";
import SectionContainer from "../SectionContainer";

interface PanelItemProps {
  panel: PanelData;
  index: number;
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void;
  /**
   * Optional wrapper className for styling (e.g., borders, rounding).
   * This can vary by layout if desired.
   */
  className?: string;
}

/**
 * `PanelItem` wraps a single panel in both:
 * - A Draggable (for react-beautiful-dnd)
 * - A DeletablePanel (for context-menu deletion).
 */

const renderComponent = (panel: PanelData) => {
  const { label } = panel;

  if (label === "Filters") {
    return <SectionFilters />;
  } else if (label === "Sections") {
    return <SectionContainer />;
  } else {
    return <span className="font-semibold">{label}</span>;
  }
};

export const DraggablePanelItem: React.FC<PanelItemProps> = ({
  panel,
  index,
  onDelete,
  className = "w-full h-full",
}) => {
  return (
    <Draggable draggableId={panel.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={className}
        >
          <DeletablePanel panel={panel} onDelete={onDelete}>
            {renderComponent(panel)}
          </DeletablePanel>
        </div>
      )}
    </Draggable>
  );
};

export const PanelItem: React.FC<PanelItemProps> = ({ panel, onDelete }) => {
  return (
    <div className="border border-slate-500 rounded-lg h-full w-full">
      <DeletablePanel panel={panel} onDelete={onDelete}>
        {renderComponent(panel)}
      </DeletablePanel>
    </div>
  );
};
