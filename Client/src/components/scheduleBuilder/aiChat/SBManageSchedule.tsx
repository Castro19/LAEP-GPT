import React, { useMemo } from "react";
import { environment } from "@/helpers/getEnvironmentVars";
import SectionChanges from "./SectionChanges";

interface ManageScheduleProps {
  args: {
    operation: "readall" | "add" | "remove";
    class_nums?: number[];
    state: {
      user_id: string;
      schedule_id: string;
      term: string;
      preferences?: Record<string, unknown>;
    };
  };
  message: string;
}

const SBManageSchedule: React.FC<ManageScheduleProps> = ({ args, message }) => {
  // Function to extract course codes from the message when operation is "readall"
  const formattedCourses = useMemo(() => {
    return Array.from(
      new Set(
        message.match(/\b[A-Z]{3,4}\d{3}\b/g) || // 3 or 4 letters followed by 3 digits
          []
      )
    ).join(", ");
  }, [message]);

  const sections = useMemo(() => {
    try {
      const operation = args.operation === "add" ? "Added" : "Removed";
      const sectionsMatch = message.match(
        new RegExp(`${operation} sections: (\\[.*?\\])`)
      );

      if (!sectionsMatch) return [];

      const content = sectionsMatch[1].trim();
      return JSON.parse(content);
    } catch (error) {
      console.error("Error parsing sections:", error);
      return [];
    }
  }, [message, args.operation]);

  const renderOperation = () => {
    switch (args.operation) {
      case "add":
        return (
          <div className="text-slate-400">
            <span className="font-semibold">Added sections:</span>
            <br />
            {args.class_nums?.join(", ")}
          </div>
        );
      case "remove":
        return (
          <div className="text-slate-400">
            <span className="font-semibold">Removed sections:</span>
            <br />
            {args.class_nums?.join(", ")}
          </div>
        );
      case "readall":
        if (environment === "dev") {
          console.log(formattedCourses);
        }
        return (
          <div className="text-slate-400">
            <span className="font-semibold">
              Schedule for {args.state.term}
            </span>
            <br />
            {formattedCourses}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Tool Arguments */}
      <div className="bg-slate-800/50 p-2 rounded">{renderOperation()}</div>

      {/* Message Output */}
      {args.operation !== "readall" && (
        <div className="bg-slate-800/50 p-2 rounded">
          <SectionChanges sections={sections} operation={args.operation} />
        </div>
      )}
    </div>
  );
};

export default SBManageSchedule;
