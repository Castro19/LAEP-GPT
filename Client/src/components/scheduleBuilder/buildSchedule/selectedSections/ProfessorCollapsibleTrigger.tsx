import React from "react";
import { SelectedSection } from "@polylink/shared/types";
import { Star } from "@/components/classSearch/reusable/sectionInfo/StarRating";
import { adjustColorBrightness } from "./utils";
import { Collapsible } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import SectionCard from "./SectionCard";

interface ProfessorCollapsibleCardProps {
  professor: string;
  rating: number;
  sections: SelectedSection[];
  professorGroups: Record<
    string,
    { rating: number; sections: SelectedSection[] }
  >;
  courseIndex: number;
  profIdx: number;
  sectionsForSchedule: SelectedSection[];
  conflictIds: Set<number>;
}

const ProfessorCollapsibleCard: React.FC<ProfessorCollapsibleCardProps> = ({
  professor,
  rating,
  sections,
  professorGroups,
  courseIndex,
  profIdx,
  sectionsForSchedule,
  conflictIds,
}) => {
  return (
    <motion.div
      key={professor}
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.15 + courseIndex * 0.03 + profIdx * 0.02,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Collapsible defaultOpen className="group/collapsible">
        <CollapsibleTrigger asChild>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer px-2 py-1 rounded transition-colors"
            style={{
              backgroundColor: "transparent",
            }}
            onMouseOver={(e) => {
              const target = e.currentTarget;
              const currentColor =
                professorGroups[Object.keys(professorGroups)[0]].sections[0]
                  .color || "#ffffff";
              const darkerColor = adjustColorBrightness(currentColor, -5);
              target.style.backgroundColor = darkerColor;
            }}
            onMouseOut={(e) => {
              const target = e.currentTarget;
              target.style.backgroundColor = "transparent";
            }}
          >
            <div className="flex justify-between w-full">
              <div className="flex justify-start">
                <h3 className="text-sm font-medium text-slate-700 dark:text-gray-800">
                  {professor
                    .split(" ")
                    .map(
                      (name) =>
                        name.charAt(0).toUpperCase() +
                        name.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </h3>
                {/* Rating here  */}
                <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md ml-2">
                  {Array.from({ length: 4 }, (_, i) => {
                    const fill = Math.max(0, Math.min(1, rating - i));
                    return (
                      <Star
                        key={i}
                        fillPercentage={fill}
                        isNarrowScreen={false}
                        strokeColor="grey"
                      />
                    );
                  })}
                </div>
              </div>
              {/* PolyRatings Icon */}
              {sections[0]?.professors[0]?.id && (
                <a
                  href={
                    sections[0].professors[0].name !==
                    sections[0].professors[0].id
                      ? `https://polyratings.dev/professor/${sections[0].professors[0].id}`
                      : `https://polyratings.dev/search/name?term=${encodeURIComponent(
                          sections[0].professors[0].name
                        )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevents collapsible from opening
                  className="mr-1 flex items-center justify-center"
                >
                  <img
                    src="/polyratings.ico"
                    alt="PolyRatings"
                    className="w-3 h-3 cursor-pointer hover:opacity-80 brightness-0 opacity-50"
                  />
                </a>
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 gap-1.5">
            {sections.map((sec, secIdx) => (
              <motion.div
                key={sec.classNumber}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay:
                    0.2 + courseIndex * 0.03 + profIdx * 0.02 + secIdx * 0.01,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <SectionCard
                  section={sec}
                  isSelected={sectionsForSchedule.some(
                    (s) => s.classNumber === sec.classNumber
                  )}
                  conflictIds={conflictIds}
                />
              </motion.div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default ProfessorCollapsibleCard;
