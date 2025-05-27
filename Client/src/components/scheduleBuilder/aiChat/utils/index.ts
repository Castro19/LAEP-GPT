import { SCROLL } from "../constants";

/**
 * Finds the scroll area viewport element within a container
 * @param container - The container element to search within
 * @returns The scroll area viewport element or null if not found
 */
export const findScrollAreaViewport = (
  container: HTMLElement | null
): Element | null => {
  if (!container) return null;
  return container.closest(SCROLL.SCROLL_AREA_SELECTOR);
};

/**
 * Checks if the user has scrolled to the bottom of the viewport
 * @param viewport - The viewport element to check
 * @returns True if the user is at the bottom, false otherwise
 */
export const checkIfUserAtBottom = (viewport: Element): boolean => {
  if (!viewport) return true;

  const { scrollTop, scrollHeight, clientHeight } = viewport;
  return (
    Math.abs(scrollHeight - clientHeight - scrollTop) < SCROLL.BOTTOM_THRESHOLD
  );
};

/**
 * Calculates the height for the chat container based on the current height
 * @param currentHeight - The current height of the container
 * @returns The calculated height in pixels
 */
export const calculateChatContainerHeight = (currentHeight: number): string => {
  return `${currentHeight - 10 * 16}px`;
};
