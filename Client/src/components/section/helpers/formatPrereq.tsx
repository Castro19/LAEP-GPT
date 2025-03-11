import React from "react";
import BadgeSection from "./BadgeSection";
import parseAdvancedPrereqString from "./parseAdvcancedPrereqString";

export const FormatPrerequisites = (prerequisites: string[] | undefined) => {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-400">Prerequisites</h3>
      <ol className="flex flex-col gap-2 pl-4">
        {prerequisites.map((req, index) => {
          // Decide if we need advanced parse
          const needAdvanced =
            req.includes("'") || req.includes("/") || req.includes("@");

          if (!needAdvanced) {
            // fallback: original approach
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
              <li key={`prereq-${index}`} className="flex items-baseline gap-2">
                <span className="text-slate-300">•</span>
                <div className="flex flex-wrap items-center gap-2">
                  {courses.map((course, courseIndex) => (
                    <React.Fragment key={`${index}-${courseIndex}-${course}`}>
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
          } else {
            // advanced parsing
            const advancedResults = parseAdvancedPrereqString(req);
            // advancedResults is an array of OR arrays: string[][]
            // example: [ ["CSC102", "CPE102"], ["CSC103", "CPE103"] ]

            // We'll produce multiple bullet points, each bullet point is an OR-list
            return advancedResults.map((orArray, subIndex) => (
              <li
                key={`${index}-${subIndex}`}
                className="text-slate-300 text-sm"
              >
                {orArray.map((course, i) => (
                  <li
                    key={`${index}-${subIndex}-${i}`}
                    className="text-slate-300 text-sm"
                  >
                    • {course}
                  </li>
                ))}
              </li>
            ));
          }
        })}
      </ol>
    </div>
  );
};
