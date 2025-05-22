import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux";
import { Info } from "lucide-react";

const TimeConflictsPopup = () => {
  const { currentSchedule } = useAppSelector((state) => state.schedule);

  const editManually = () => {
    console.log("editManually");
    console.log("currentSchedule", currentSchedule);
  };

  const autoResolve = () => {
    console.log("autoResolve");
  };

  return (
    <Card className="w-full max-w-md p-6 bg-secondary border-2 dark: dark:border-zinc-600 border-border rounded-xl shadow-lg flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 text-primary">
          <Info size={22} />
        </span>
        <div>
          <div className="dark:text-zinc-200 font-semibold text-lg leading-tight">
            Oops! You have conflicting courses in your schedule
          </div>
          <div className="dark:text-zinc-400 text-muted-foreground text-sm mt-1">
            Choose a different time or let our AI Auto-Resolve find the best fit
            for you!
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-2">
        <button
          className="text-muted-foreground underline text-sm font-medium hover:text-primary transition-colors"
          type="button"
          onClick={editManually}
        >
          Edit Manually
        </button>
        <Button
          className="dark:bg-blue-100 dark:hover:bg-blue-200 text-primary font-semibold px-5 py-2 rounded-md shadow-sm hover:bg-muted-foreground/80 transition-colors"
          onClick={autoResolve}
        >
          Auto-Resolve
        </Button>
      </div>
    </Card>
  );
};

export default TimeConflictsPopup;
