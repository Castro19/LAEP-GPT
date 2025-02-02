import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
  DeletablePanel,
  PanelData,
} from "@/components/section/sidebar/PanelLayouts";

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
export const PanelItem: React.FC<PanelItemProps> = ({
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
            {/* Inner content styling: */}
            <div className="flex h-full w-full items-center justify-center p-6 border border-slate-500">
              <span className="font-semibold">{panel.label}</span>
            </div>
          </DeletablePanel>
        </div>
      )}
    </Draggable>
  );
};
