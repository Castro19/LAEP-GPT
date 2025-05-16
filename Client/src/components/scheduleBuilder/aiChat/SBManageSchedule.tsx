import React, { useMemo } from "react";
import SectionsChosen from "../buildSchedule/selectedSections/SectionsChosen";

interface ManageScheduleProps {
  args: {
    operation: "readall" | "add" | "remove";
    class_nums?: number[];
    state: {
      user_id: string;
      schedule_id: string;
      term: string;
      preferences?: Record<string, any>;
    };
  };
  message: string;
}

const SBManageSchedule: React.FC<ManageScheduleProps> = ({ args, message }) => {
  const sections = useMemo(() => {
    const sectionsMatch = message.match(/(\[.*\])/);
    return sectionsMatch ? JSON.parse(sectionsMatch[1]) : [];
  }, [message]);

  const renderOperation = () => {
    switch (args.operation) {
      case "add":
        return (
          <div className="text-slate-400">
            <span className="font-semibold">Adding Sections:</span>
            <br />
            Class Numbers: {args.class_nums?.join(", ")}
          </div>
        );
      case "remove":
        return (
          <div className="text-slate-400">
            <span className="font-semibold">Removing Sections:</span>
            <br />
            Class Numbers: {args.class_nums?.join(", ")}
          </div>
        );
      case "readall":
        return (
          <div className="flex flex-col gap-2">
            <div className="text-slate-400">
              <span className="font-semibold">Reading Schedule</span>
              <br />
              Term: {args.state.term}
            </div>
            <SectionsChosen selectedSections={sections} inChat={true} />
          </div>
        );
      default:
        return null;
    }
  };

  // Split message into lines and format each line
  const messageLines = message.split("\n").filter((line) => line.trim());

  return (
    <div className="space-y-3">
      {/* Tool Arguments */}
      <div className="bg-slate-800/50 p-2 rounded">{renderOperation()}</div>

      {/* Message Output */}
      {args.operation !== "readall" && (
        <div className="bg-slate-800/50 p-2 rounded">
          {messageLines.map((line, index) => (
            <div key={index} className="text-slate-200">
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SBManageSchedule;
