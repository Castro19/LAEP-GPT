import { useEffect } from "react";
import { useState } from "react";

// put this above the component body
const useAutoExpand = (shouldExpand: boolean) => {
  const [isOpen, setIsOpen] = useState(false);
  // when “Edit Manually” fires, shouldExpand becomes true for conflicted rows
  useEffect(() => {
    if (shouldExpand) setIsOpen(true);
  }, [shouldExpand]);
  return [isOpen, setIsOpen] as const;
};

export default useAutoExpand;
