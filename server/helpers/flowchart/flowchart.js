/* Create a Helper function that will take as input a flowchart termData
and return the following:
 - Required Courses: An array of objects that contain the courseId and courseCompletion. If courseCompleiton is false, then the object will also contain courseName and courseDescription.
 - The number of tech electives left to take
 - Whether the General Writing requirement is met
*/

const flowchartHelper = (termData) => {
  const requiredCourses = [];
  let techElectivesLeft = 0;
  const generalWritingMet = false;

  for (let term of termData) {
    for (let course of term.courses) {
      if (course.completed) {
        continue;
      }
      if (course.id) {
        requiredCourses.push(course);
      } else if (course.customId.includes("Technical Elective")) {
        techElectivesLeft++;
      }
    }
  }
  return { requiredCourses, techElectivesLeft, generalWritingMet };
};

export default flowchartHelper;
