import { CourseDocument, MongoQuery } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection } from "mongodb";

let courseCollection: Collection;

const initializeCollection = () => {
  courseCollection = getDb().collection("courses");
};

export const findCourse = async (catalogYear: string, courseId: string) => {
  if (!courseCollection) initializeCollection();
  return await courseCollection.findOne({ catalogYear, courseId });
};

export const findCourses = async (query: MongoQuery<CourseDocument>) => {
  if (!courseCollection) initializeCollection();
  console.log("query: ", query);
  const result = {
    courseId: 1,
    displayName: 1,
    units: 1,
    desc: 1,
  };
  const resultLimit = 25;

  try {
    return await courseCollection
      .find(query)
      .project({ _id: 0, ...result })
      .limit(resultLimit)
      .toArray();
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const findCoursesGroupedBySubjectNames = async (
  subject: string,
  query: MongoQuery<CourseDocument>,
  page = 1,
  pageSize = 10
) => {
  try {
    // Add subjectName to the query
    query.subject = subject;

    // Calculate the starting index for pagination
    const start = (page - 1) * pageSize;

    const result = await courseCollection
      .aggregate([
        { $match: query },
        {
          $group: {
            _id: "$subject", // Group by the subject field
            courses: {
              $push: {
                courseId: "$courseId",
                displayName: "$displayName",
                units: "$units",
                desc: "$desc",
                // geCategories: "$geCategories",
                // geSubjects: "$geSubjects",
              },
            },
          },
        },
        { $sort: { _id: 1 } }, // Sort subjects alphabetically
        {
          $project: {
            courses: { $slice: ["$courses", start, pageSize] }, // Paginate courses array
          },
        },
      ])
      .toArray();

    return result;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

export const findSubjectNames = async (query: MongoQuery<CourseDocument>) => {
  try {
    const result = await courseCollection
      .aggregate([
        { $match: query },
        {
          $group: {
            _id: "$subject", // Group by the subject field
          },
        },
        { $sort: { _id: 1 } }, // Sort subjects alphabetically
      ])
      .toArray();

    return result.map((item) => item._id); // Extract _id from each object
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

export const findCourseInfo = async (courseIds: string[]) => {
  try {
    console.log("courseIds: ", courseIds);
    return await courseCollection
      .find({
        courseId: { $in: courseIds },
        catalogYear: "2022-2026",
      })
      .project({
        courseId: 1,
        displayName: 1,
        desc: 1,
        units: 1,
        _id: 0, // Exclude the _id field if not needed
      })
      .toArray(); // Convert the cursor to an array
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
