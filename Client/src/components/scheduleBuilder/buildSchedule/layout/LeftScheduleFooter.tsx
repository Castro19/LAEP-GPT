import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";

/**
 * LeftSectionFooter - Footer component for schedule builder with responsive layout
 *
 * This component provides a sticky footer with action buttons for the schedule builder.
 * It adapts its layout based on container width, switching between horizontal and
 * vertical button arrangements for optimal user experience on different screen sizes.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.formText - Text to display on the primary form submit button
 * @param {function} props.onFormSubmit - Callback function for form submission
 * @param {string} props.buttonText - Text to display on the secondary action button
 * @param {function} props.onClick - Callback function for the secondary button click
 *
 * @example
 * ```tsx
 * <LeftSectionFooter
 *   formText="Generate Schedule"
 *   onFormSubmit={() => handleGenerateSchedule()}
 *   buttonText="Save Schedule"
 *   onClick={() => handleSaveSchedule()}
 * />
 * ```
 *
 * @dependencies
 * - UI Button components
 * - React hooks for state and effects
 * - ResizeObserver API for responsive behavior
 *
 * @features
 * - Responsive layout that adapts to container width
 * - Sticky positioning at the bottom of the container
 * - Backdrop blur effect for modern UI appearance
 * - Automatic layout switching based on available space
 * - Shadow effects for visual depth
 * - Dark mode support
 *
 * @responsive
 * - Horizontal layout for wide containers (>300px)
 * - Vertical layout for narrow containers (≤300px)
 * - Automatic detection of container size changes
 * - Smooth transitions between layouts
 *
 * @styling
 * - Sticky positioning with backdrop blur
 * - Consistent button styling and spacing
 * - Border separator from main content
 * - Shadow effects for visual hierarchy
 * - Dark mode color schemes
 *
 * @layout
 * - Flexbox-based responsive layout
 * - Gap spacing between buttons
 * - Full-width button sizing
 * - Proper padding and margins
 *
 * @accessibility
 * - Proper button types and roles
 * - Keyboard navigation support
 * - Screen reader friendly text labels
 * - Focus management
 */
const LeftSectionFooter = ({
  formText,
  onFormSubmit,
  buttonText,
  onClick,
}: {
  formText: string;
  onFormSubmit: () => void;
  buttonText: string;
  onClick: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentIsNarrow, setParentIsNarrow] = useState(false);

  // Check container width on mount and resize
  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        // Use 300px as the breakpoint - adjust as needed
        setParentIsNarrow(containerRef.current.offsetWidth < 300);
      }
    };

    checkWidth();

    // Create a ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div className="border-t border-gray-200" />

      <div
        ref={containerRef}
        className={`sticky bottom-0 mx-4 bg-background/95 backdrop-blur flex gap-2 shadow-lg p-4 h-auto ${
          parentIsNarrow ? "flex-col" : "flex-row h-[20%]"
        }`}
      >
        {/* Apply Filters button */}
        <Button
          type="submit"
          className="w-full shadow-lg dark:bg-gray-100 dark:bg-opacity-90 dark:hover:bg-gray-300 dark:hover:bg-opacity-90"
          onClick={onFormSubmit}
        >
          {formText}
        </Button>
        <Button
          onClick={() => onClick()}
          variant="secondary"
          className="w-full shadow-lg dark:bg-slate-500 dark:bg-opacity-50 dark:hover:bg-slate-700 dark:hover:bg-opacity-70"
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
};

export default LeftSectionFooter;
