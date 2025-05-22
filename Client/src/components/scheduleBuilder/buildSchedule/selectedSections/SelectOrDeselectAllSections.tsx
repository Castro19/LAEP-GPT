import { TooltipContent, TooltipPortal } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, Circle } from "lucide-react";
import {
  useAppSelector,
  useAppDispatch,
  sectionSelectionActions,
} from "@/redux";

const SelectOrDeselectAllSections = () => {
  const dispatch = useAppDispatch();
  const { sectionsForSchedule, selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  // Handle select all sections
  const handleSelectAll = () => {
    dispatch(sectionSelectionActions.selectAllSectionsForSchedule());
  };

  // Handle deselect all sections
  const handleDeselectAll = () => {
    dispatch(sectionSelectionActions.deselectAllSectionsForSchedule());
  };

  return (
    <>
      {/* Header with select/deselect all buttons */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-2 px-2">
        <div className="text-xs font-medium text-slate-700 dark:text-gray-200 min-w-[120px]">
          {sectionsForSchedule.length === selectedSections.length
            ? "Click to deselect all sections:"
            : "Click to select all sections:"}
        </div>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={
                    sectionsForSchedule.length === selectedSections.length
                  }
                  onPressedChange={(pressed) => {
                    if (pressed) {
                      handleSelectAll();
                    } else {
                      handleDeselectAll();
                    }
                  }}
                  className={`
                        h-7 w-7 p-0
                        ${
                          sectionsForSchedule.length === selectedSections.length
                            ? "text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                            : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        }
                        hover:bg-gray-100 dark:hover:bg-gray-800/50
                      `}
                  aria-label={
                    sectionsForSchedule.length === selectedSections.length
                      ? "Deselect all sections from schedule generation"
                      : "Select all sections for schedule generation"
                  }
                >
                  {sectionsForSchedule.length === selectedSections.length ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </Toggle>
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent
                  side="top"
                  sideOffset={5}
                  className="z-[100]"
                  avoidCollisions={true}
                >
                  Selected sections will be used to generate possible schedule
                  combinations
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};

export default SelectOrDeselectAllSections;
