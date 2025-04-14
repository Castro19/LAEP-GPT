/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import {
  Draggable,
  DraggableProps,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";

interface PortalAwareDraggableProps extends DraggableProps {
  children: (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => React.ReactNode;
}

const PortalAwareDraggable: React.FC<PortalAwareDraggableProps> = ({
  children,
  ...draggableProps
}) => {
  return (
    <Draggable {...draggableProps}>
      {(provided, snapshot) => {
        // The element we normally render
        const child = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={provided.draggableProps.style}
          >
            {children(provided, snapshot)}
          </div>
        );

        // If not dragging, return the element in-place
        if (!snapshot.isDragging) {
          return child;
        }

        // If actively dragging, portal it to the top-level div
        const portal = document.getElementById("draggable-portal");
        if (portal) {
          return ReactDOM.createPortal(child, portal);
        }
        return child; // Fallback if portal is missing
      }}
    </Draggable>
  );
};

export default PortalAwareDraggable;
