import { useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
  excludeRefs: React.RefObject<HTMLElement>[] = [] // Add this parameter
) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (event: any) => {
      // DO NOTHING if the element being clicked is the target element or their children
      // Check if click is inside any of the excluded refs
      const isInsideExcludedRef = excludeRefs.some(
        (excludeRef) =>
          excludeRef.current && excludeRef.current.contains(event.target)
      );

      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        isInsideExcludedRef
      ) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback, excludeRefs]);
};
