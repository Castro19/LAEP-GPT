import React, { useMemo } from "react";
import SectionChanges from "./SectionChanges";
import { type OperationArgs, OperationMessage } from "./helpers/FormattingStrs";

interface ManageScheduleProps {
  args: OperationArgs;
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
      // Handle both string and object formats
      try {
        return JSON.parse(content);
      } catch (e) {
        // If parsing fails, try to extract class numbers from the message
        const classNumbers = message.match(/\b\d{5}\b/g) || [];
        return classNumbers.map((num) => ({ classNumber: parseInt(num) }));
      }
    } catch (error) {
      console.error("Error parsing sections:", error);
      return [];
    }
  }, [message, args.operation]);

  return (
    <div className="space-y-3">
      {/* Tool Arguments */}
      <div className="bg-slate-800/50 p-2 rounded">
        <OperationMessage
          operation={args.operation}
          class_nums={args.class_nums}
          state={args.state}
          formattedCourses={formattedCourses}
        />
      </div>

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
