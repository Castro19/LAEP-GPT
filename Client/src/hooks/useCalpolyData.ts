import courseData from "../calpolyData/courses.json";
import interests from "../calpolyData/interests.json";
const useCalpolyData = () => {
  const courses = courseData.map(
    (course) => `CSC${course.number}: ${course.title}`
  );

  return { courses, interests };
};

export default useCalpolyData;
