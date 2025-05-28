import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/utils/test-utils";
import { toggleSidebar, toggleDropdown } from "@/redux/layout/layoutSlice";
import { useAppDispatch, useAppSelector } from "@/redux";
import { RootState } from "@/redux/store";
import { describe, test, expect } from "vitest";

// Mock component that uses layout state
const LayoutTestComponent = () => {
  const dispatch = useAppDispatch();
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );
  const isDropdownVisible = useAppSelector(
    (state) => state.layout.isDropdownVisible
  );

  return (
    <div>
      <div data-testid="sidebar-status">
        Sidebar is {isSidebarVisible ? "visible" : "hidden"}
      </div>
      <div data-testid="dropdown-status">
        Dropdown is {isDropdownVisible ? "visible" : "hidden"}
      </div>
      <button
        data-testid="toggle-sidebar"
        onClick={() => dispatch(toggleSidebar(!isSidebarVisible))}
      >
        Toggle Sidebar
      </button>
      <button
        data-testid="toggle-dropdown"
        onClick={() => dispatch(toggleDropdown(!isDropdownVisible))}
      >
        Toggle Dropdown
      </button>
    </div>
  );
};

describe("Layout Integration Tests", () => {
  test("should handle initial state correctly", () => {
    renderWithProviders(<LayoutTestComponent />);

    expect(screen.getByTestId("sidebar-status").textContent).toBe(
      "Sidebar is visible"
    );
    expect(screen.getByTestId("dropdown-status").textContent).toBe(
      "Dropdown is hidden"
    );
  });

  test("should toggle sidebar visibility", () => {
    renderWithProviders(<LayoutTestComponent />);

    // Initial state
    expect(screen.getByTestId("sidebar-status").textContent).toBe(
      "Sidebar is visible"
    );

    // Toggle sidebar
    fireEvent.click(screen.getByTestId("toggle-sidebar"));
    expect(screen.getByTestId("sidebar-status").textContent).toBe(
      "Sidebar is hidden"
    );

    // Toggle back
    fireEvent.click(screen.getByTestId("toggle-sidebar"));
    expect(screen.getByTestId("sidebar-status").textContent).toBe(
      "Sidebar is visible"
    );
  });

  test("should toggle dropdown visibility", () => {
    renderWithProviders(<LayoutTestComponent />);

    // Initial state
    expect(screen.getByTestId("dropdown-status").textContent).toBe(
      "Dropdown is hidden"
    );

    // Toggle dropdown
    fireEvent.click(screen.getByTestId("toggle-dropdown"));
    expect(screen.getByTestId("dropdown-status").textContent).toBe(
      "Dropdown is visible"
    );

    // Toggle back
    fireEvent.click(screen.getByTestId("toggle-dropdown"));
    expect(screen.getByTestId("dropdown-status").textContent).toBe(
      "Dropdown is hidden"
    );
  });

  test("should handle multiple state changes", () => {
    const { store } = renderWithProviders(<LayoutTestComponent />);

    // Initial state
    expect(screen.getByTestId("sidebar-status").textContent).toBe(
      "Sidebar is visible"
    );
    expect(screen.getByTestId("dropdown-status").textContent).toBe(
      "Dropdown is hidden"
    );

    // Toggle both
    fireEvent.click(screen.getByTestId("toggle-sidebar"));
    fireEvent.click(screen.getByTestId("toggle-dropdown"));

    // Check final state
    expect(screen.getByTestId("sidebar-status").textContent).toBe(
      "Sidebar is hidden"
    );
    expect(screen.getByTestId("dropdown-status").textContent).toBe(
      "Dropdown is visible"
    );

    // Verify Redux state
    const state = store.getState() as RootState;
    expect(state.layout.isSidebarVisible).toBe(false);
    expect(state.layout.isDropdownVisible).toBe(true);
  });
});
