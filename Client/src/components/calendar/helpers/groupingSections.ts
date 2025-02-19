import { SelectedSection } from "@polylink/shared/types";

/**
 * Returns true if the two sections are considered a valid pair.
 * That is, if one section’s classPair includes the other’s classNumber.
 */
function arePaired(
  sectionA: SelectedSection,
  sectionB: SelectedSection
): boolean {
  return (
    sectionA.classPair.includes(sectionB.classNumber) ||
    sectionB.classPair.includes(sectionA.classNumber)
  );
}

/**
 * Given all sections for a course (i.e. with the same courseId), return all valid selections.
 *
 * A valid selection is:
 * - A standalone section (if its classPair is empty) OR
 * - A pair of sections that are linked (i.e. one’s classPair includes the other’s classNumber).
 */
function getValidSelectionsForCourse(
  sections: SelectedSection[],
  isOpenOnly: boolean | undefined
): SelectedSection[][] {
  const validSelections: SelectedSection[][] = [];
  const standaloneSections: SelectedSection[] = [];
  // Add standalone sections (only if classPair is empty).
  sections.forEach((section) => {
    if (section.classPair.length === 0) {
      standaloneSections.push(section);
    }
  });

  // Add valid pairs.
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      const sectionA = sections[i];
      const sectionB = sections[j];
      if (arePaired(sectionA, sectionB)) {
        if (isOpenOnly) {
          if (
            sectionA.enrollmentStatus === "O" &&
            sectionB.enrollmentStatus === "O"
          ) {
            validSelections.push([sectionA, sectionB]);
          } else if (
            sectionA.enrollmentStatus === "O" &&
            sectionB.enrollmentStatus !== "O"
          ) {
            validSelections.push([sectionA]);
          } else if (
            sectionA.enrollmentStatus !== "O" &&
            sectionB.enrollmentStatus === "O"
          ) {
            validSelections.push([sectionB]);
          } else {
            validSelections.push([sectionA, sectionB]);
          }
        } else {
          validSelections.push([sectionA, sectionB]);
        }
      }
    }
  }
  for (const section of standaloneSections) {
    // Check if the section classNumber is in the classPair of any other section.
    const isPaired = sections.some((otherSection) =>
      otherSection.classPair.includes(section.classNumber)
    );
    if (!isPaired) {
      if (isOpenOnly) {
        if (section.enrollmentStatus === "O") {
          validSelections.push([section]);
        }
      } else {
        validSelections.push([section]);
      }
    }
  }
  return validSelections;
}

export default getValidSelectionsForCourse;
