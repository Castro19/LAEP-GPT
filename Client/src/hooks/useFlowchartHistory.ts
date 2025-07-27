import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import {
  saveSnapshot,
  moveToRedo,
  moveToUndo,
} from "@/redux/flowchartHistory/flowchartHistorySlice";

const useFlowchartHistory = () => {
  const dispatch = useAppDispatch();

  // Get current flowchart data and history state
  const flowchartData = useAppSelector(
    (state) => state.flowchart.flowchartData
  );
  const undoStack = useAppSelector((state) => state.flowchartHistory.undoStack);
  const redoStack = useAppSelector((state) => state.flowchartHistory.redoStack);

  // Boolean flags for UI
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  // Save current state before making any changes
  const saveCurrentState = () => {
    if (flowchartData) {
      dispatch(saveSnapshot(flowchartData));
    }
  };

  // Undo to previous state
  const undoLastAction = () => {
    if (!canUndo || !flowchartData) return;

    // Get the state to restore from undo stack
    const stateToRestore = undoStack[undoStack.length - 1];

    // Move current state to redo stack and remove previous state from undo stack
    dispatch(moveToRedo(flowchartData));

    // Restore the previous state
    dispatch(flowchartActions.setFlowchartData(stateToRestore));
  };

  // Redo last undone action
  const redoLastAction = () => {
    if (!canRedo || !flowchartData) return;

    // Get the state to restore from redo stack
    const stateToRestore = redoStack[redoStack.length - 1];

    // Move current state to undo stack and remove state from redo stack
    dispatch(moveToUndo(flowchartData));

    // Restore the state
    dispatch(flowchartActions.setFlowchartData(stateToRestore));
  };

  return {
    saveCurrentState,
    undo: undoLastAction,
    redo: redoLastAction,
    canUndo,
    canRedo,
  };
};

export default useFlowchartHistory;
