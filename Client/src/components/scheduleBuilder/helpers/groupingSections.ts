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

  // 1) Pairing loop (unchanged)
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      const A = sections[i],
        B = sections[j];
      if (arePaired(A, B)) {
        if (isOpenOnly) {
          if (A.enrollmentStatus === "O" && B.enrollmentStatus === "O") {
            validSelections.push([A, B]);
          } else if (A.enrollmentStatus === "O") {
            validSelections.push([A]);
          } else if (B.enrollmentStatus === "O") {
            validSelections.push([B]);
          } else {
            validSelections.push([A, B]);
          }
        } else {
          validSelections.push([A, B]);
        }
      }
    }
  }

  // 2) Existing standalone logic (for classPair === null)
  for (const section of sections) {
    if (section.classPair === null) {
      const isLinked = sections.some(
        (other) => other.classPair === section.classNumber
      );
      if (!isLinked && (!isOpenOnly || section.enrollmentStatus === "O")) {
        validSelections.push([section]);
      }
    }
  }

  // 3) NEW: any section whose classPair *isn’t* null but whose partner
  //    isn’t in our list, should also become a singleton
  for (const section of sections) {
    if (
      section.classPair !== null &&
      !sections.some((other) => other.classNumber === section.classPair)
    ) {
      // partner missing → treat as standalone
      if (!isOpenOnly || section.enrollmentStatus === "O") {
        validSelections.push([section]);
      }
    }
  }

  return validSelections;
}

export default getValidSelectionsForCourse;
