import { CourseDocument, CourseObject } from "@polylink/shared/types";
import { MongoQuery } from "../../../types/global";
import { getDb } from "../../connection";
import { Collection } from "mongodb";
import { environment } from "../../../index";

let courseCollection: Collection<CourseDocument>;

const initializeCollection = (): void => {
  courseCollection = getDb().collection("courses");
};

export const findCourse = async (
  catalogYear: string,
  courseId: string
): Promise<CourseDocument | null> => {
  if (!courseCollection) initializeCollection();
  const course = await courseCollection.findOne({ catalogYear, courseId });
  if (!course) {
    return null;
  }
  return course as CourseDocument;
};

export const findCourses = async (
  query: MongoQuery<CourseDocument>
): Promise<CourseObject[]> => {
  if (!courseCollection) initializeCollection();

  const result = {
    courseId: 1,
    displayName: 1,
    units: 1,
    desc: 1,
  };
  const resultLimit = 25;

  try {
    const courses = await courseCollection
      .find(query)
      .project({ _id: 0, ...result })
      .limit(resultLimit)
      .toArray();
    return courses as CourseObject[];
  } catch (error) {
    if (environment === "dev") {
      console.error("An error occurred:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const findCoursesGroupedBySubjectNames = async (
  subject: string,
  query: MongoQuery<CourseDocument>,
  page = 1,
  pageSize = 10
): Promise<CourseObject[]> => {
  if (!courseCollection) initializeCollection();

  try {
    // Add subjectName to the query
    query.subject = subject;

    // Calculate the starting index for pagination
    const start = (page - 1) * pageSize;

    const result = (await courseCollection
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
      .toArray()) as { _id: string; courses: CourseObject[] }[];

    return result[0].courses;
  } catch (error) {
    if (environment === "dev") {
      console.error("An error occurred:", error);
    }
    throw error;
  }
};

export const findSubjectNames = async (
  query: MongoQuery<CourseDocument>
): Promise<string[]> => {
  if (!courseCollection) initializeCollection();

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
    if (environment === "dev") {
      console.error("An error occurred:", error);
    }
    throw error;
  }
};

export const findCourseInfo = async (
  courseIds: string[]
): Promise<CourseObject[]> => {
  if (!courseCollection) initializeCollection();

  try {
    const result = await courseCollection
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
    return result as CourseObject[];
  } catch (error) {
    if (environment === "dev") {
      console.error("An error occurred:", error);
    }
    throw error;
  }
};
