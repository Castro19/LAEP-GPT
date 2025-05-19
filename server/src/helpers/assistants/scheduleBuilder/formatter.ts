import { SelectedSection } from "@polylink/shared/types";

/**
 * Combines sections that have matching classPair values, typically used for lecture-lab pairs.
 * Sections with the same classPair will be combined into a single section with all meetings.
 *
 * @param sections Array of sections to combine
 * @returns Array of combined sections
 */
function combineClassPairs(sections: SelectedSection[]): SelectedSection[] {
  // Create a map to store processed sections
  const processedSections = new Set<number>();
  const combined: SelectedSection[] = [];

  for (const section of sections) {
    // Skip if we've already processed this section
    if (processedSections.has(section.classNumber)) continue;

    // If this section has a classPair
    if (section.classPair !== null && section.classPair !== undefined) {
      // Find the paired section
      const pairedSection = sections.find(
        (s) => s.classNumber === section.classPair
      );

      if (pairedSection) {
        // Create a new combined section
        const combinedSection: SelectedSection = {
          // Common fields from the lecture section
          courseId: section.courseId,
          courseName: section.courseName,
          classNumber: section.classNumber,
          component: `${section.component}/${pairedSection.component}`,
          units: String(Number(section.units) + Number(pairedSection.units)),
          professors: section.professors,
          enrollmentStatus: section.enrollmentStatus,
          rating: section.rating,
          color: section.color,
          term: section.term,
          // Combine meetings from both sections
          meetings: [
            ...(section.meetings || []),
            ...(pairedSection.meetings || []),
          ],
          // Keep the classPair reference
          classPair: section.classPair,
        };

        combined.push(combinedSection);

        // Mark both sections as processed
        processedSections.add(section.classNumber);
        processedSections.add(pairedSection.classNumber);
      }
    } else {
      // If no classPair, just add the section as is
      combined.push(section);
      processedSections.add(section.classNumber);
    }
  }

  return combined;
}

export { combineClassPairs };
