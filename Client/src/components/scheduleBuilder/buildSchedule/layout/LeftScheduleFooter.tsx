import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";

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
