import { SelectedSection } from "@polylink/shared/types";

/**
 * Returns true if the two sections are considered a valid pair.
 * That is, if one section's classPair matches the other's classNumber.
 */
function arePaired(
  sectionA: SelectedSection,
  sectionB: SelectedSection
): boolean {
  return (
    sectionA.classPair === sectionB.classNumber ||
    sectionB.classPair === sectionA.classNumber
  );
}

/**
 * Given all sections for a course (i.e. with the same courseId), return all valid selections.
 *
 * A valid selection is:
 * - A standalone section (if its classPair is null) OR
 * - A pair of sections that are linked (i.e. one's classPair matches the other's classNumber).
 */
function getValidSelectionsForCourse(
  sections: SelectedSection[],
  isOpenOnly: boolean | undefined
): SelectedSection[][] {
  const validSelections: SelectedSection[][] = [];
  const standaloneSections: SelectedSection[] = [];

  // Add standalone sections (only if classPair is null).
  sections.forEach((section) => {
    if (section.classPair === null) {
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

  // Add unpaired standalone sections
  for (const section of standaloneSections) {
    // Check if the section classNumber is the classPair of any other section.
    const isPaired = sections.some(
      (otherSection) => otherSection.classPair === section.classNumber
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
