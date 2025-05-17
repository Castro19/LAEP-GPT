import { FC } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onClose: () => void;
};

const testLogs = [
  "🕑 09:01  •  user →  “Add CS-101”",
  "🕑 09:01  •  ai →  “Added CS-101 section 001”",
  "🕑 09:03  •  user →  “No Friday classes”",
  "🕑 09:03  •  ai →  “Removed conflicting sections”",
];

const ScheduleBuilderLogs: FC<Props> = ({ onClose }) => (
  <div
    className="absolute left-full top-0 ml-2   /* ← key changes */
                w-80 max-h-[80vh] bg-slate-800 text-white z-50
                shadow-xl border border-slate-700 rounded-xl flex flex-col"
  >
    {/* header */}
    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
      <span className="text-sm font-semibold">Schedule Builder Logs</span>
      <Button size="icon" variant="ghost" onClick={onClose}>
        ×
      </Button>
    </div>

    {/* log list */}
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      {testLogs.map((log, i) => (
        <p key={i} className="text-xs leading-snug text-slate-200">
          {log}
        </p>
      ))}
    </div>
  </div>
);

export default ScheduleBuilderLogs;
