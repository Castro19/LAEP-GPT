import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PanelData } from "@/components/section/sidebar/PanelLayouts";
import { environment } from "@/helpers/getEnvironmentVars";
interface PanelLayoutState {
  panels: PanelData[];
  outerDirection: "vertical" | "horizontal";
  currentChoice: "chat" | "reviews" | "filters" | "calendar";
}

const initialState: PanelLayoutState = {
  panels: [
    { id: "1", label: "Filters" },
    { id: "2", label: "Sections" },
  ],
  outerDirection: "vertical",
  currentChoice: "filters",
};

const panelLayoutSlice = createSlice({
  name: "panelLayout",
  initialState,
  reducers: {
    setCurrentChoice: (
      state,
      action: PayloadAction<PanelLayoutState["currentChoice"]>
    ) => {
      state.currentChoice = action.payload;
    },
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
      if (environment === "dev") {
        console.log("sourceIndex", sourceIndex);
        console.log("destinationIndex", destinationIndex);

        console.log("state.panels", state.panels);
      }
      const [removed] = state.panels.splice(sourceIndex, 1);
      state.panels.splice(destinationIndex, 0, removed);
    },
  },
});

export const {
  setCurrentChoice,
  setPanels,
  addPanel,
  deletePanel,
  setOuterDirection,
  reorderPanels,
  handleDragEnd,
} = panelLayoutSlice.actions;

export const panelLayoutReducer = panelLayoutSlice.reducer;
