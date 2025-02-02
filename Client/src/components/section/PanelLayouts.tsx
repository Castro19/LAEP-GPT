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

// ─── TYPES AND HELPER COMPONENT ────────────────────────────────

export interface PanelData {
  id: string;
  label: string;
}

/**
 * Wraps the panel’s content in a context menu that provides a “Remove”
 * option. Notice that we now stop propagation on the context menu events so
 * that in nested layouts only the intended panel is deleted.
 */
const DeletablePanel: React.FC<{
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
export const OnePanelLayout: React.FC<{
  panel: PanelData;
  onDelete: (id: string) => void;
}> = ({ panel, onDelete }) => {
  return (
    <div className="h-full w-full border border-slate-500 rounded-lg">
      <DeletablePanel panel={panel} onDelete={onDelete}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">{panel.label}</span>
        </div>
      </DeletablePanel>
    </div>
  );
};

// 2. TwoPanelLayout: Two panels split (default horizontally, or vertically).
interface TwoPanelLayoutProps {
  panels: [PanelData, PanelData];
  onDelete: (id: string) => void;
  direction?: "horizontal" | "vertical";
}
export const TwoPanelLayout: React.FC<TwoPanelLayoutProps> = ({
  panels,
  onDelete,
  direction = "horizontal",
}) => {
  return (
    <ResizablePanelGroup
      direction={direction}
      className="h-full w-full rounded-lg border border-slate-500"
    >
      <ResizablePanel defaultSize={50}>
        <DeletablePanel panel={panels[0]} onDelete={onDelete}>
          <div className="flex h-full items-center justify-center p-6 border border-slate-500">
            <span className="font-semibold">{panels[0].label}</span>
          </div>
        </DeletablePanel>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <DeletablePanel panel={panels[1]} onDelete={onDelete}>
          <div className="flex h-full items-center justify-center p-6 border border-slate-500">
            <span className="font-semibold">{panels[1].label}</span>
          </div>
        </DeletablePanel>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

// 3. ThreePanelLayout:
// Vertical outer: top row is one panel; bottom row splits into two.
interface ThreePanelLayoutProps {
  panels: [PanelData, PanelData, PanelData];
  onDelete: (id: string) => void;
  outerDirection?: "vertical" | "horizontal";
}
export const ThreePanelLayout: React.FC<ThreePanelLayoutProps> = ({
  panels,
  onDelete,
  outerDirection = "vertical",
}) => {
  if (outerDirection === "vertical") {
    return (
      <ResizablePanelGroup
        direction="vertical"
        className="h-full w-full rounded-lg border border-slate-500"
      >
        {/* Top row: single full‑width panel */}
        <ResizablePanel defaultSize={50}>
          <DeletablePanel panel={panels[0]} onDelete={onDelete}>
            <div className="flex h-full items-center justify-center p-6 border border-slate-500">
              <span className="font-semibold">{panels[0].label}</span>
            </div>
          </DeletablePanel>
        </ResizablePanel>
        <ResizableHandle />
        {/* Bottom row: two panels */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[1]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[1].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[2]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[2].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  } else {
    // Horizontal outer: left column is one panel; right column splits vertically.
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full rounded-lg border border-slate-500"
      >
        <ResizablePanel defaultSize={50}>
          <DeletablePanel panel={panels[0]} onDelete={onDelete}>
            <div className="flex h-full items-center justify-center p-6 border border-slate-500">
              <span className="font-semibold">{panels[0].label}</span>
            </div>
          </DeletablePanel>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[1]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[1].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[2]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[2].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }
};

// 4. FourPanelLayout: A grid of two rows (or columns) of two panels.
interface FourPanelLayoutProps {
  panels: [PanelData, PanelData, PanelData, PanelData];
  onDelete: (id: string) => void;
  outerDirection?: "vertical" | "horizontal";
}
export const FourPanelLayout: React.FC<FourPanelLayoutProps> = ({
  panels,
  onDelete,
  outerDirection = "vertical",
}) => {
  if (outerDirection === "vertical") {
    return (
      <ResizablePanelGroup
        direction="vertical"
        className="h-full w-full rounded-lg border border-slate-500"
      >
        {/* Top row */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[0]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[0].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[1]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[1].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        {/* Bottom row */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[2]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[2].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[3]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[3].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  } else {
    // Horizontal outer: two columns with two panels per column.
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full rounded-lg border border-slate-500"
      >
        {/* Left column */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[0]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[0].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[1]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[1].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        {/* Right column */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical" className="h-full w-full">
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[2]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[2].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <DeletablePanel panel={panels[3]} onDelete={onDelete}>
                <div className="flex h-full items-center justify-center p-6 border border-slate-500">
                  <span className="font-semibold">{panels[3].label}</span>
                </div>
              </DeletablePanel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }
};
