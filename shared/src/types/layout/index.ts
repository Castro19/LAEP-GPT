export type LayoutSliceType = {
  isSidebarVisible: boolean; // Is the sidebar visible  ?
  isDropdownVisible: boolean; // Is the mode dropdown visible (appears on header)
  toggleMenu: boolean; // Is the menu open?
  scrollTrigger: boolean; // Is the scroll trigger active?
  inputFieldFocus: boolean; // Is the input field focused?
  isDragging: boolean; // Is a drag operation in progress?
  dragDirection: "left" | "right" | "up" | "down" | null; // Direction of the drag operation
  expandConflictsTick: number; // Number of ticks to expand the conflicts
};
