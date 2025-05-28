import {
  layoutReducer,
  toggleSidebar,
  toggleDropdown,
  toggleMenu,
  setScrollTrigger,
  setInputFieldFocus,
  setDragState,
  fireExpandConflicts,
} from "./layoutSlice";
import { LayoutSliceType } from "@polylink/shared/types";

describe("layoutSlice", () => {
  // Initial state test
  it("should handle initial state", () => {
    const initialState: LayoutSliceType = {
      isSidebarVisible: true,
      isDropdownVisible: false,
      toggleMenu: false,
      scrollTrigger: false,
      inputFieldFocus: false,
      isDragging: false,
      dragDirection: null,
      expandConflictsTick: 0,
    };

    expect(layoutReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  // Test toggleSidebar action
  it("should handle toggleSidebar", () => {
    const initialState = layoutReducer(undefined, { type: "unknown" });
    const newState = layoutReducer(initialState, toggleSidebar(false));
    expect(newState.isSidebarVisible).toBe(false);
  });

  // Test toggleDropdown action
  it("should handle toggleDropdown", () => {
    const initialState = layoutReducer(undefined, { type: "unknown" });
    const newState = layoutReducer(initialState, toggleDropdown(true));
    expect(newState.isDropdownVisible).toBe(true);
  });

  // Test toggleMenu action
  it("should handle toggleMenu", () => {
    const initialState = layoutReducer(undefined, { type: "unknown" });
    const newState = layoutReducer(initialState, toggleMenu(true));
    expect(newState.toggleMenu).toBe(true);
  });

  // Test setScrollTrigger action
  it("should handle setScrollTrigger", () => {
    const initialState = layoutReducer(undefined, { type: "unknown" });
    const newState = layoutReducer(initialState, setScrollTrigger(true));
    expect(newState.scrollTrigger).toBe(true);
  });

  // Test setInputFieldFocus action
  it("should handle setInputFieldFocus", () => {
    const initialState = layoutReducer(undefined, { type: "unknown" });
    const newState = layoutReducer(initialState, setInputFieldFocus(true));
    expect(newState.inputFieldFocus).toBe(true);
  });

  // Test setDragState action
  it("should handle setDragState", () => {
    const initialState = layoutReducer(undefined, { type: "unknown" });
    const dragState = {
      isDragging: true,
      direction: "left" as const,
    };
    const newState = layoutReducer(initialState, setDragState(dragState));
    expect(newState.isDragging).toBe(true);
    expect(newState.dragDirection).toBe("left");
  });

  // Test fireExpandConflicts action
  it("should handle fireExpandConflicts", () => {
    const initialState = layoutReducer(undefined, { type: "unknown" });
    const newState = layoutReducer(initialState, fireExpandConflicts());
    expect(newState.expandConflictsTick).toBe(1);
  });

  // Test multiple actions in sequence
  it("should handle multiple actions in sequence", () => {
    let state = layoutReducer(undefined, { type: "unknown" });

    state = layoutReducer(state, toggleSidebar(false));
    expect(state.isSidebarVisible).toBe(false);

    state = layoutReducer(state, toggleDropdown(true));
    expect(state.isDropdownVisible).toBe(true);

    state = layoutReducer(
      state,
      setDragState({ isDragging: true, direction: "right" })
    );
    expect(state.isDragging).toBe(true);
    expect(state.dragDirection).toBe("right");
  });
});
