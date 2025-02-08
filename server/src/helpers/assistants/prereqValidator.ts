/* 
Ex 1:
    prereqs: ["CSC101 CSC102", "MATH101"]
    completedCourses: ["CS101", "MATH101", "PHYS101"]
    returns true
    // Explanation: The completed courses includes (CSC101 OR CSC102) AND MATH101

Ex 2:
    prereqs: ["$SKIP$Consent of department head"]
    completedCourses: ["CS101", "PHYS101"]
    returns true
    // Explanation: The prereq is skipped because it is a consent course.

EX 3:
    prereqs: ["CSC301 CSC303", "MATH301"]
    completedCourses: ["CSC301", "MATH301", "PHYS301"]
    returns true
    // Explanation: The completed courses includes (CSC301 OR CSC303) AND MATH301

EX 4: 
    prereqs: ["CSC301 CSC303", "MATH301", "PHYS301", "$SKIP$Consent of department head"]
    completedCourses: ["CSC301", "CSC303", "MATH301"]
    returns false
    // Explanation: The completed courses do not include PHYS301, so the prereq is not met.
*/

const prereqValidator = (
  prereqs: string[],
  completedCourses: string[]
): boolean => {
  for (const prereq of prereqs) {
    const prereqCourses = prereq.split(" ");
    const completedCoursesSet = new Set(completedCourses);
    for (const course of prereqCourses) {
      if (course === "$SKIP$") {
        continue;
      }
      if (!completedCoursesSet.has(course)) {
        return false;
      }
    }
  }
  return true;
};

export default prereqValidator;
