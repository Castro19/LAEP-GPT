import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";
import { useAppSelector } from "@/redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TimeConflictsPopup = () => {
  const { currentSchedule } = useAppSelector((s) => s.schedule);
  const [isOpen, setIsOpen] = useState(false);

  /* re-open on a *new* schedule with conflicts ---------------- */
  useEffect(() => {
    setIsOpen(Boolean(currentSchedule?.withConflicts));
  }, [currentSchedule?.id, currentSchedule?.withConflicts]);
  /* ----------------------------------------------------------- */

  const editManually = () => {
    /* … */
    console.log("editManually");
  };
  const autoResolve = () => {
    /* … */
    console.log("autoResolve");
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="time-conflict-popup" // IMPORTANT
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <Card className="relative w-full max-w-md p-6 bg-secondary border-2 dark:border-zinc-600 border-border rounded-xl shadow-lg flex flex-col gap-4">
            {/* ✕ close button */}
            <button
              aria-label="Close"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-primary">
                <Info size={22} />
              </span>
              <div>
                <div className="dark:text-zinc-200 font-semibold text-lg leading-tight">
                  Oops! You have conflicting courses in your schedule
                </div>
                <div className="dark:text-zinc-400 text-muted-foreground text-sm mt-1">
                  Choose a different time or let our AI Auto-Resolve find the
                  best fit for you!
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={editManually}
                className="text-muted-foreground underline text-sm font-medium hover:text-primary transition-colors"
              >
                Edit Manually
              </button>
              <Button
                onClick={autoResolve}
                className="dark:bg-blue-100 dark:hover:bg-blue-200 text-primary font-semibold px-5 py-2 rounded-md shadow-sm hover:bg-muted-foreground/80 transition-colors"
              >
                Auto-Resolve
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimeConflictsPopup;
