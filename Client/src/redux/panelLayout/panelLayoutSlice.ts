import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PanelData } from "@/components/section/PanelLayouts";
interface PanelLayoutState {
  panels: PanelData[];
  outerDirection: "vertical" | "horizontal";
}

const initialState: PanelLayoutState = {
  panels: [
    { id: "1", label: "Panel 1" },
    { id: "2", label: "Panel 2" },
    { id: "3", label: "Panel 3" },
    { id: "4", label: "Panel 4" },
  ],
  outerDirection: "vertical",
};

const panelLayoutSlice = createSlice({
  name: "panelLayout",
  initialState,
  reducers: {
    setPanels: (state, action: PayloadAction<PanelData[]>) => {
      state.panels = action.payload;
    },
    addPanel: (state, action: PayloadAction<PanelData>) => {
      state.panels.push(action.payload);
    },
    deletePanel: (state, action: PayloadAction<string>) => {
      state.panels = state.panels.filter(
        (panel) => panel.id !== action.payload
      );
    },
    setOuterDirection: (
      state,
      action: PayloadAction<PanelLayoutState["outerDirection"]>
    ) => {
      state.outerDirection = action.payload;
    },
    reorderPanels: (state, action: PayloadAction<PanelData[]>) => {
      state.panels = action.payload;
    },
    handleDragEnd: (
      state,
      action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>
    ) => {
      const { sourceIndex, destinationIndex } = action.payload;

      if (sourceIndex === destinationIndex) return;

      const [removed] = state.panels.splice(sourceIndex, 1);
      state.panels.splice(destinationIndex, 0, removed);
    },
  },
});

export const {
  setPanels,
  addPanel,
  deletePanel,
  setOuterDirection,
  reorderPanels,
  handleDragEnd,
} = panelLayoutSlice.actions;

export const panelLayoutReducer = panelLayoutSlice.reducer;
