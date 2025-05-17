import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchedFlowchartObject,
  FlowchartData,
  PostFlowchartInDB,
  Term,
  Course,
} from "@polylink/shared/types";
import {
  deleteFlowchartFromDB,
  fetchAllFlowchartsFromDB,
  fetchFlowchartFromDB,
  storeFlowchartInDB,
  updateFlowchartInDB,
} from "./crudFlowchart";
// Define types
export interface FlowchartState {
  createFlowchart: boolean;
  flowchartData: FlowchartData | null;
  flowchartList: FetchedFlowchartObject[] | null;
  currentFlowchart: FetchedFlowchartObject | null;
  completedCourseIds: string[];
  isFullTimelineView: boolean;
  loading: {
    fetchFlowchartData: boolean;
    setFlowchart: boolean;
    fetchAllFlowcharts: boolean;
    updateFlowchart: boolean;
    deleteFlowchart: boolean;
  };
  error: string | null;
}

// Initial state
const initialState: FlowchartState = {
  createFlowchart: false,
  flowchartData: null,
  flowchartList: null,
  currentFlowchart: null,
  completedCourseIds: [],
  isFullTimelineView: false,
  loading: {
    fetchFlowchartData: false,
    setFlowchart: false,
    fetchAllFlowcharts: false,
    updateFlowchart: false,
    deleteFlowchart: false,
  },
  error: null,
};

// Async thunk for fetching flowchart data
export const fetchFlowchartData = createAsyncThunk(
  "flowchart/fetchFlowchartData",
  async (fileUrl: string, { rejectWithValue }) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch flowchart data.");
      }
      return await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Creates a flowchart based on the flowchart data.
 * @param flowchartData The flowchart data.
 * @returns flowchartId .
 */
export const postFlowchartInDB = createAsyncThunk(
  "flowchart/postFlowchartInDB",
  async (
    { flowchartData, name, primaryOption }: PostFlowchartInDB,
    { rejectWithValue }
  ) => {
    try {
      const response = await storeFlowchartInDB(
        flowchartData,
        name,
        primaryOption ?? true
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

/**
 * Fetches the flowchart from the database and sets it in the state.
 * @param flowchartId The flowchart ID.
 * @returns The flowchart data.
 */
export const setFlowchart = createAsyncThunk(
  "flowchart/fetchFlowchartFromDB",
  async (flowchartId: string, { rejectWithValue }) => {
    try {
      return await fetchFlowchartFromDB(flowchartId);
    } catch (error) {
      return rejectWithValue("Failed to fetch flowchart from DB.");
    }
  }
);

/**
 * Fetches all flowcharts from the database.
 * @returns The flowchart data { flowchartId, name }[]
 */
export const fetchAllFlowcharts = createAsyncThunk(
  "flowchart/fetchAllFlowcharts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllFlowchartsFromDB();
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch all flowcharts.");
    }
  }
);
/**
 * Updates the flowchart in the database.
 * @param flowchartId The flowchart ID.
 * @param flowchartData The flowchart data.
 * @param name The flowchart name.
 * @returns void
 */
export const updateFlowchart = createAsyncThunk(
  "flowchart/updateFlowchartInDB",
  async (
    {
      flowchartId,
      flowchartData,
      name,
      primaryOption,
    }: {
      flowchartId: string;
      flowchartData: FlowchartData | null;
      name: string;
      primaryOption: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      await updateFlowchartInDB(
        flowchartId,
        flowchartData,
        name,
        primaryOption
      );
      return { flowchartId, name, primaryOption };
    } catch (error) {
      return rejectWithValue("Failed to update flowchart in DB.");
    }
  }
);

/**
 * Deletes the flowchart from the database.
 * @param flowchartId The flowchart ID.
 * @returns void
 */
export const deleteFlowchart = createAsyncThunk(
  "flowchart/deleteFlowchart",
  async (
    {
      flowchartId,
      handleChange,
    }: {
      flowchartId: string;
      // eslint-disable-next-line no-unused-vars
      handleChange: (name: string, value: string) => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await deleteFlowchartFromDB(flowchartId);
      // If there's a new primary flowchart, update the user's flowchartId
      if (response.newPrimaryFlowchartId !== null) {
        handleChange("flowchartId", response.newPrimaryFlowchartId);
      }
      return response;
    } catch (error) {
      return rejectWithValue("Failed to delete flowchart from DB.");
    }
  }
);

// Redux slice
const flowchartSlice = createSlice({
  name: "flowchart",
  initialState,
  reducers: {
    setFlowchartData: (state, action: PayloadAction<FlowchartData | null>) => {
      state.flowchartData = action.payload;
      // Update completed courses when flowchart data changes
      if (action.payload?.termData) {
        const allCourses = action.payload.termData.flatMap(
          (term) => term.courses
        );
        state.completedCourseIds = allCourses
          .filter((course) => course.completed)
          .map((course) => course.id || course.customId || "")
          .filter(Boolean);
      }
    },
    setCurrentFlowchart: (
      state,
      action: PayloadAction<FetchedFlowchartObject | null>
    ) => {
      state.currentFlowchart = action.payload;
    },
    resetFlowchartData: (state) => {
      state.flowchartData = null;
      state.completedCourseIds = [];
    },
    setFlowchartList: (
      state,
      action: PayloadAction<FetchedFlowchartObject[]>
    ) => {
      state.flowchartList = action.payload;
    },
    toggleCourseCompletion: (
      state,
      action: PayloadAction<{ termIndex: number; courseIndex: number }>
    ) => {
      const { termIndex, courseIndex } = action.payload;
      if (!state.flowchartData) return;

      const term = state.flowchartData.termData.find(
        (t: Term) => t.tIndex === termIndex
      );
      if (!term) return;

      const course = term.courses[courseIndex];
      if (course) {
        course.completed = !course.completed;
        // Update the completedCourseIds array
        const courseId = course.id || course.customId;
        if (courseId) {
          if (course.completed) {
            if (!state.completedCourseIds.includes(courseId)) {
              state.completedCourseIds.push(courseId);
            }
          } else {
            state.completedCourseIds = state.completedCourseIds.filter(
              (id) => id !== courseId
            );
          }
        }
      }
    },
    setCreateFlowchart: (state, action: PayloadAction<boolean>) => {
      state.createFlowchart = action.payload;
    },
    setLoading: (
      state,
      action: PayloadAction<{ type: string; value: boolean }>
    ) => {
      switch (action.payload.type) {
        case "fetchFlowchartData":
          state.loading.fetchFlowchartData = action.payload.value;
          break;
        case "setFlowchart":
          state.loading.setFlowchart = action.payload.value;
          break;
        case "fetchAllFlowcharts":
          state.loading.fetchAllFlowcharts = action.payload.value;
          break;
        case "updateFlowchart":
          state.loading.updateFlowchart = action.payload.value;
          break;
        case "deleteFlowchart":
          state.loading.deleteFlowchart = action.payload.value;
          break;
        default:
          break;
      }
    },
    // Add a new action to update completed courses directly
    updateCompletedCourses: (state, action: PayloadAction<Course[]>) => {
      state.completedCourseIds = action.payload
        .filter((course) => course.completed)
        .map((course) => course.id || course.customId || "")
        .filter(Boolean);
    },
    setFullTimelineView: (state, action: PayloadAction<boolean>) => {
      state.isFullTimelineView = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // createFlowchart
      .addCase(postFlowchartInDB.pending, (state) => {
        state.loading.setFlowchart = true;
        state.error = null;
      })
      .addCase(postFlowchartInDB.fulfilled, (state, action) => {
        state.loading.setFlowchart = false;
        if (!state.flowchartList) {
          state.flowchartList = [
            {
              ...action.payload,
              updatedAt: new Date(),
            },
          ];
        } else {
          state.flowchartList.push({
            ...action.payload,
            updatedAt: new Date(),
          });
        }
        state.currentFlowchart = {
          ...action.payload,
          updatedAt: new Date(),
        };
      })
      .addCase(postFlowchartInDB.rejected, (state, action) => {
        state.loading.setFlowchart = false;
        state.error = action.payload as string;
      })
      // fetchFlowchartData
      .addCase(fetchFlowchartData.pending, (state) => {
        state.loading.fetchFlowchartData = true;
        state.error = null;
      })
      .addCase(fetchFlowchartData.fulfilled, (state, action) => {
        state.flowchartData = action.payload;
        state.loading.fetchFlowchartData = false;
      })
      .addCase(fetchFlowchartData.rejected, (state, action) => {
        state.loading.fetchFlowchartData = false;
        state.error = action.payload as string;
      })
      // setFlowchart (fetch from MongoDB)
      .addCase(setFlowchart.pending, (state) => {
        state.loading.setFlowchart = true;
        state.error = null;
      })
      .addCase(setFlowchart.fulfilled, (state, action) => {
        state.flowchartData = action.payload.flowchartData;
        state.currentFlowchart = action.payload.flowchartMeta;
        state.loading.setFlowchart = false;

        // Initialize completed courses when a new flowchart is loaded
        if (action.payload.flowchartData?.termData) {
          const allCourses = action.payload.flowchartData.termData.flatMap(
            (term) => term.courses
          );
          state.completedCourseIds = allCourses
            .filter((course) => course.completed)
            .map((course) => course.id || course.customId || "")
            .filter(Boolean);
        }
      })
      .addCase(setFlowchart.rejected, (state, action) => {
        state.loading.setFlowchart = false;
        state.error = action.payload as string;
      })
      // fetchAllFlowcharts
      .addCase(fetchAllFlowcharts.pending, (state) => {
        state.loading.fetchAllFlowcharts = true;
      })
      .addCase(fetchAllFlowcharts.fulfilled, (state, action) => {
        state.loading.fetchAllFlowcharts = false;
        state.flowchartList = action.payload as FetchedFlowchartObject[];
      })
      .addCase(fetchAllFlowcharts.rejected, (state, action) => {
        state.loading.fetchAllFlowcharts = false;
        state.error = action.payload as string;
      })
      // updateFlowchart
      .addCase(updateFlowchart.pending, (state) => {
        state.loading.updateFlowchart = true;
      })
      .addCase(updateFlowchart.fulfilled, (state, action) => {
        const { flowchartId, name, primaryOption } = action.payload;

        if (primaryOption) {
          state.currentFlowchart = {
            ...state.currentFlowchart,
            flowchartId,
            name,
            primaryOption,
            updatedAt: new Date(),
          };
        }
        if (state.flowchartList) {
          state.flowchartList = state.flowchartList
            .map((flowchart) => ({
              ...flowchart,
              name:
                flowchart.flowchartId === flowchartId ? name : flowchart.name,
              primaryOption:
                flowchart.flowchartId === flowchartId
                  ? primaryOption
                  : primaryOption
                    ? false
                    : flowchart.primaryOption,
            }))
            .sort((a, b) => {
              if (a.primaryOption !== b.primaryOption) {
                return a.primaryOption ? -1 : 1;
              }
              return a.name.localeCompare(b.name);
            });
        }
        state.loading.updateFlowchart = false;
      })
      .addCase(updateFlowchart.rejected, (state, action) => {
        state.loading.updateFlowchart = false;
        state.error = action.payload as string;
      })
      // deleteFlowchart
      .addCase(deleteFlowchart.pending, (state) => {
        state.loading.deleteFlowchart = true;
      })
      .addCase(deleteFlowchart.fulfilled, (state, action) => {
        state.loading.deleteFlowchart = false;
        const {
          deletedFlowchartId,
          deletedPrimaryOption,
          newPrimaryFlowchartId,
        } = action.payload;

        if (state.flowchartList) {
          const removedFlowchartList = state.flowchartList.filter(
            (flowchart) => flowchart.flowchartId !== deletedFlowchartId
          );
          if (deletedPrimaryOption && newPrimaryFlowchartId) {
            const newPrimaryFlowchart = removedFlowchartList?.find(
              (flowchart) => flowchart.flowchartId === newPrimaryFlowchartId
            ) as FetchedFlowchartObject;
            if (newPrimaryFlowchart) {
              newPrimaryFlowchart.primaryOption = true;
              state.currentFlowchart = newPrimaryFlowchart;
              state.flowchartList = [
                newPrimaryFlowchart,
                ...removedFlowchartList.filter(
                  (flowchart) => flowchart.flowchartId !== newPrimaryFlowchartId
                ),
              ] as FetchedFlowchartObject[];
            }
          } else {
            state.flowchartList =
              removedFlowchartList as FetchedFlowchartObject[];
          }
        }
      })
      .addCase(deleteFlowchart.rejected, (state, action) => {
        state.loading.deleteFlowchart = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFlowchartData,
  setCurrentFlowchart,
  resetFlowchartData,
  toggleCourseCompletion,
  setFlowchartList,
  setCreateFlowchart,
  setLoading,
  updateCompletedCourses,
  setFullTimelineView,
} = flowchartSlice.actions;

export const flowchartReducer = flowchartSlice.reducer;
