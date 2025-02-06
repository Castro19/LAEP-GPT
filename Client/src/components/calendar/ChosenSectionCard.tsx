import { SelectedSection } from "@polylink/shared/types";
import SectionCardPair from "./SectionCardPair";
// If you use shadcn or a similar library for Cards, ContextMenu, etc.,
// make sure to import them from the correct locations.
// Here, placeholders are used to mimic your existing components.

export type SelectedSectionDocument = SelectedSection & {
  _id: {
    $oid: string;
  };
  userId: string;
  selectedSections: SelectedSection[];
};

type ChosenSectionCardProps = {
  selectedSections: SelectedSection[];
};

export const ChosenSectionCard: React.FC<ChosenSectionCardProps> = ({
  selectedSections,
}) => {
  // 1) Group the sections by courseId
  const groupedByCourseId = selectedSections.reduce(
    (acc, section) => {
      if (!acc[section.courseId]) {
        acc[section.courseId] = [];
      }
      acc[section.courseId].push(section);
      return acc;
    },
    {} as Record<string, SelectedSection[]>
  );

  // Helper to turn classPair array into a string so we can group them
  const getClassPairKey = (classPair: number[]) => {
    // You can adjust how you want to represent these keys
    return JSON.stringify(classPair);
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedByCourseId).map(([courseId, sections]) => {
        // 2) Within each courseId group, group by classPair
        const groupedByClassPair = sections.reduce(
          (acc, section) => {
            const pairKey = getClassPairKey(section.classPair);
            if (!acc[pairKey]) {
              acc[pairKey] = [];
            }
            acc[pairKey].push(section);
            return acc;
          },
          {} as Record<string, SelectedSection[]>
        );

        return (
          <div key={courseId} className="border border-gray-200 p-4 rounded-lg">
            {/* CourseId Header */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Course ID: <span className="text-indigo-500">{courseId}</span>
            </h2>
            {Object.entries(groupedByClassPair).map(
              ([pairKey, classPairSections]) => {
                // Convert the JSON-ified pairKey back to array to display or handle
                const pairArray = JSON.parse(pairKey) as number[];
                return (
                  <SectionCardPair
                    key={pairKey}
                    classPairSections={classPairSections}
                    pairArray={pairArray}
                  />
                );
              }
            )}
          </div>
        );
      })}
    </div>
  );
};
