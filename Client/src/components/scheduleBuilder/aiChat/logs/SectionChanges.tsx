import { motion } from "framer-motion";
// Redux:
import { scheduleActions, useAppDispatch } from "@/redux";
// Types
import { SectionAddedOrRemoved } from "@polylink/shared/types";
// UI components:
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
} from "@/components/ui/tooltip";

// Icons
import { Undo2, Star, MinusCircle, PlusCircle } from "lucide-react";

interface SectionChangesProps {
  sections: SectionAddedOrRemoved[];
  operation: "add" | "remove";
}

const SectionChanges: React.FC<SectionChangesProps> = ({
  sections,
  operation,
}) => {
  const dispatch = useAppDispatch();
  const handleRevert = (classNumber: number) => {
    dispatch(
      scheduleActions.updateScheduleSection({
        sectionIds: [classNumber],
        action: operation === "add" ? "remove" : "add", // revert the operation (do the opposite)
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1,
      }}
      className="grid grid-cols-1 gap-2 w-full overflow-hidden"
    >
      {sections.map((section, index) => {
        const backgroundColor = section.color || "#ffffff";
        const isRemoved = operation === "remove";

        return (
          <motion.div
            key={section.classNumber}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1 + index * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >
            <div
              className={`rounded-md border w-full p-2 transition-all duration-200 ${
                isRemoved
                  ? "border-red-500 border-2"
                  : "border-green-600 border-2"
              }`}
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              <div className="flex justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    {isRemoved ? (
                      <MinusCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <PlusCircle className="h-4 w-4 text-green-500" />
                    )}
                    <span
                      className={`text-sm font-medium text-slate-900 ${isRemoved ? "line-through" : ""}`}
                    >
                      {section.courseId}
                    </span>
                    <span
                      className={`text-xs text-slate-700 ${isRemoved ? "line-through" : ""}`}
                    >
                      ({section.classNumber})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-800 ml-5">
                    <span className={isRemoved ? "line-through" : ""}>
                      {section.professor}
                    </span>
                    {section.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">
                          {section.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRevert(section.classNumber)}
                        className="h-7 w-7 text-slate-600 hover:text-slate-700 dark:text-slate-600 dark:hover:text-slate-900 dark:hover:bg-transparent"
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent
                        side="top"
                        sideOffset={5}
                        className="z-[100]"
                        avoidCollisions={true}
                      >
                        {isRemoved
                          ? "Add back to schedule"
                          : "Remove from schedule"}
                      </TooltipContent>
                    </TooltipPortal>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SectionChanges;
