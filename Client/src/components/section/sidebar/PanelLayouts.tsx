/* eslint-disable no-unused-vars */
import React from "react";
import { TrashIcon } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { PanelItem } from "./PanelItem";

// ─── TYPES AND HELPER COMPONENT ────────────────────────────────

export interface PanelData {
  id: string;
  label: string;
}

/**
 * Wraps the panel's content in a context menu that provides a "Remove"
 * option. Notice that we now stop propagation on the context menu events so
 * that in nested layouts only the intended panel is deleted.
 */
export const DeletablePanel: React.FC<{
  panel: PanelData;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}> = ({ panel, onDelete, children }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        // Stop the right-click event from bubbling to parent elements.
        onContextMenu={(e) => e.stopPropagation()}
      >
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          inset
          onClick={(e) => {
            e.stopPropagation();
            onDelete(panel.id);
          }}
          className="hover:bg-red-500 w-auto"
        >
          <div className="flex items-center gap-2 dark:hover:text-red-500">
            Remove <TrashIcon className="w-4 h-4" />
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

// ─── LAYOUT COMPONENTS ──────────────────────────────────────────

// 1. OnePanelLayout: Single full‑width panel.
interface OnePanelLayoutProps {
  panel: PanelData;
  onDelete: (id: string) => void;
  /**
   * Provide an index if it's part of a Draggable list. Defaults to 0 if not set.
   */
  index?: number;
}

export const OnePanelLayout: React.FC<OnePanelLayoutProps> = ({
  panel,
  onDelete,
  index = 0,
}) => {
  return (
    <PanelItem
      panel={panel}
      index={index}
      onDelete={onDelete}
      className="h-full w-full border border-slate-500 rounded-lg"
    />
  );
};

type MultiplePanelLayoutProps = {
  panels: PanelData[];
  onDelete: (id: string) => void;
  direction?: "horizontal" | "vertical";
  startIndex: number;
};
// 2. TwoPanelLayout: Two panels split (default horizontally, or vertically).
/**
 * Renders two panels side-by-side (horizontal) or stacked (vertical).
 */
export const TwoPanelLayout: React.FC<MultiplePanelLayoutProps> = ({
  panels,
  onDelete,
  direction = "horizontal",
  startIndex,
}) => {
  return (
    <ResizablePanelGroup
      direction={direction}
      className="h-full w-full rounded-lg border border-slate-500"
    >
      {panels.map((panel, idx) => (
        <ResizablePanel defaultSize={50} key={panel.id}>
          <PanelItem
            panel={panel}
            index={startIndex + idx}
            onDelete={onDelete}
          />
        </ResizablePanel>
      ))}
    </ResizablePanelGroup>
  );
};

// 3. ThreePanelLayout:
// Vertical outer: top row is one panel; bottom row splits into two.
export const ThreePanelLayout: React.FC<MultiplePanelLayoutProps> = ({
  panels,
  onDelete,
  direction = "vertical",
  startIndex,
}) => {
  if (direction === "vertical") {
    // Vertical outer: Top panel alone; bottom row has 2 side-by-side.
    return (
      <ResizablePanelGroup
        direction="vertical"
        className="h-full w-full rounded-lg border border-slate-500"
      >
        {/* Top Panel */}
        <ResizablePanel defaultSize={50}>
          <PanelItem
            panel={panels[0]}
            index={startIndex}
            onDelete={onDelete}
            className="h-full w-full"
          />
        </ResizablePanel>

        <ResizableHandle />

        {/* Bottom Two Panels */}
        <ResizablePanel defaultSize={50}>
          <TwoPanelLayout
            panels={[panels[1], panels[2]]}
            onDelete={onDelete}
            direction="horizontal"
            startIndex={startIndex + 1}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  } else {
    // Horizontal outer: Left panel alone; right column splits vertically.
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full rounded-lg border border-slate-500"
      >
        <ResizablePanel defaultSize={50}>
          <PanelItem panel={panels[0]} index={startIndex} onDelete={onDelete} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[1]}
                index={startIndex + 1}
                onDelete={onDelete}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[2]}
                index={startIndex + 2}
                onDelete={onDelete}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }
};

// 4. FourPanelLayout: A grid of two rows (or columns) of two panels.
/**
 * A 2x2 grid, either stacked vertically first or horizontally first.
 */
export const FourPanelLayout: React.FC<MultiplePanelLayoutProps> = ({
  panels,
  onDelete,
  direction = "vertical",
  startIndex,
}) => {
  if (direction === "vertical") {
    return (
      <ResizablePanelGroup
        direction="vertical"
        className="h-full w-full rounded-lg border border-slate-500"
      >
        {/* Top row */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[0]}
                index={startIndex}
                onDelete={onDelete}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[1]}
                index={startIndex + 1}
                onDelete={onDelete}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle />

        {/* Bottom row */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[2]}
                index={startIndex + 2}
                onDelete={onDelete}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[3]}
                index={startIndex + 3}
                onDelete={onDelete}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  } else {
    // Horizontal outer: two columns, each with two stacked panels.
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full rounded-lg border border-slate-500"
      >
        {/* Left column */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[0]}
                index={startIndex}
                onDelete={onDelete}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[1]}
                index={startIndex + 1}
                onDelete={onDelete}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle />

        {/* Right column */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[2]}
                index={startIndex + 2}
                onDelete={onDelete}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50}>
              <PanelItem
                panel={panels[3]}
                index={startIndex + 3}
                onDelete={onDelete}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }
};
