import React from "react";
import BadgeSection from "./BadgeSection";

export const formatPrerequisites = (prerequisites: string[] | undefined) => {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-400">Prerequisites</h3>
      <ol className="flex flex-col gap-2 pl-4">
        {prerequisites.map((req, index) => {
          const isSkip = req.includes("$SKIP$");
          const cleanedReq = req.replace("$SKIP$", "");

          if (isSkip) {
            return (
              <li key={index} className="text-slate-300 text-sm">
                • {cleanedReq}
              </li>
            );
          }

          const courses = cleanedReq.split(" ");
          return (
            <li key={index} className="flex items-baseline gap-2">
              <span className="text-slate-300">•</span>
              <div className="flex flex-wrap items-center gap-2">
                {courses.map((course, courseIndex) => (
                  <React.Fragment key={course}>
                    <BadgeSection variant="content" className="font-mono">
                      {course}
                    </BadgeSection>
                    {courseIndex < courses.length - 1 && (
                      <span className="text-slate-400 text-xs">OR</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
