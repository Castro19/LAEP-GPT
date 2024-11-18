// import fs from "fs";
// import path from "path";
// import mongodb from "mongodb";
import db from "../../connection.js";

const courseCollection = db.collection("courses");

// const catalogYears = ["2019-2020", "2020-2021", "2021-2022", "2022-2026"];

// export const addCourses = async () => {
//   try {
//     // Ensure indexes are created
//     await courseCollection.createIndexes([
//       { key: { catalogYear: 1, courseId: 1 } }, // Compound index
//       { key: { displayName: "text", desc: "text" } }, // Text index for search
//       { key: { gwrCourse: 1 } },
//       { key: { uscpCourse: 1 } },
//     ]);

//     // Log the current working directory
//     console.log("Current working directory:", process.cwd());

//     // Explicitly define the base path to the courses directory
//     const basePath =
//       "/Users/castro/Desktop/LAEP/LAEP-GPT/server/db/models/courses/courses";

//     for (const catalogYear of catalogYears) {
//       // Update the folder path to match the correct structure
//       const folderPath = path.join(basePath, catalogYear);

//       // Read courses data
//       const coursesFile = path.join(folderPath, `${catalogYear}.json`);
//       console.log(`Checking file: ${coursesFile}`);

//       if (!fs.existsSync(coursesFile)) {
//         console.error(`Courses file does not exist: ${coursesFile}`);
//         continue; // Skip to the next catalog year
//       }

//       let coursesData;
//       try {
//         coursesData = JSON.parse(fs.readFileSync(coursesFile, "utf8"));
//         console.log("Courses Data: ", coursesData);
//       } catch (error) {
//         console.error(`Error reading or parsing file: ${coursesFile}`, error);
//         continue; // Skip to the next catalog year
//       }

//       if (!Array.isArray(coursesData)) {
//         console.error(`Invalid data format in file: ${coursesFile}`);
//         continue; // Skip to the next catalog year
//       }

//       // Read GE data
//       const geFile = path.join(folderPath, `${catalogYear}-GE.json`);
//       const geData = fs.existsSync(geFile)
//         ? JSON.parse(fs.readFileSync(geFile, "utf8"))
//         : [];

//       // Read GWR data
//       const gwrFile = path.join(folderPath, `${catalogYear}-GWR.json`);
//       const gwrData = fs.existsSync(gwrFile)
//         ? JSON.parse(fs.readFileSync(gwrFile, "utf8")).map((item) =>
//             item.split("-").pop()
//           )
//         : [];

//       // Read UCSP data
//       const uscpFile = path.join(folderPath, `${catalogYear}-USCP.json`);
//       const uscpData = fs.existsSync(uscpFile)
//         ? JSON.parse(fs.readFileSync(uscpFile, "utf8")).map((item) =>
//             item.split("-").pop()
//           )
//         : [];

//       // Read prerequisites data
//       const prereqFile = path.join(folderPath, `${catalogYear}-req.json`);
//       const prereqData = fs.existsSync(prereqFile)
//         ? JSON.parse(fs.readFileSync(prereqFile, "utf8"))
//         : [];

//       // Map prerequisites to a dictionary for quick access
//       const prereqDict = {};
//       for (const prereq of prereqData) {
//         prereqDict[prereq.id] = prereq;
//       }

//       // Map GE data to a dictionary for quick access
//       const geDict = {};
//       for (const ge of geData) {
//         if (!geDict[ge.id]) {
//           geDict[ge.id] = [];
//         }
//         geDict[ge.id].push(ge);
//       }

//       // Process each course
//       const courseDocuments = coursesData.map((course) => {
//         const courseId = course.id;
//         const subject = courseId.match(/^[A-Za-z]+/)[0]; // Extract subject from courseId
//         const geEntries = geDict[courseId] || [];
//         const geCategories = [...new Set(geEntries.map((ge) => ge.category))];
//         const geSubjects = [...new Set(geEntries.map((ge) => ge.subject))];

//         return {
//           _id: new mongodb.ObjectId(),
//           id: courseId,
//           catalogYear,
//           subject,
//           catalog: course.catalog,
//           displayName: course.displayName,
//           units: course.units,
//           desc: course.desc,
//           addl: course.addl,
//           gwrCourse: gwrData.includes(courseId),
//           uscpCourse: uscpData.includes(courseId),
//           geCategories,
//           geSubjects,
//           GE: geEntries, // Keep detailed GE info if needed
//           prerequisites: prereqDict[courseId] || {
//             prerequisite: [],
//             corequisite: [],
//             recommended: [],
//             concurrent: [],
//           },
//         };
//       });

//       // Insert courses into MongoDB
//       if (courseDocuments.length > 0) {
//         await courseCollection.insertMany(courseDocuments);
//         console.log(
//           `Inserted ${courseDocuments.length} courses for catalog year ${catalogYear}`
//         );
//       } else {
//         console.log(`No courses found for catalog year ${catalogYear}`);
//       }
//     }

//     console.log("All data inserted successfully.");
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// };

export const findCourse = async (catalogYear, courseId) => {
  return await courseCollection.findOne({ catalogYear, courseId });
};

export const findCourses = async (query) => {
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
  subject,
  query,
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

export const findSubjectNames = async (query) => {
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
