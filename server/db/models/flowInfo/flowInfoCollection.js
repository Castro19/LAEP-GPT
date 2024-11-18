import db from "../../connection.js";

const flowInfoCollection = db.collection("flowInfo");

// import fs from "fs";
// // Upload
// export const uploadFlowchart = async () => {
//   const flowDataFile =
//     "/Users/castro/Desktop/LAEP/LAEP-GPT/server/db/models/flowchart/cpslo-template-flow-data.json";

//   if (!fs.existsSync(flowDataFile)) {
//     console.error(`Flowchart file does not exist: ${flowDataFile}`);
//     return;
//   }

//   const flowData = JSON.parse(fs.readFileSync(flowDataFile, "utf8"));
//   const flowList = flowData.flows.filter(
//     (flow) =>
//       flow.catalog === "2022-2026" ||
//       flow.catalog === "2021-2022" ||
//       flow.catalog === "2020-2021" ||
//       flow.catalog === "2019-2020"
//   );

//   try {
//     // Create indexes for efficient querying
//     await flowInfoCollection.createIndexes([
//       { key: { catalog: 1, majorName: 1 } }, // Compound index for catalog and majorName
//     ]);

//     const result = await flowInfoCollection.insertMany(flowList);
//     return result;
//   } catch (error) {
//     throw new Error("Error inserting flowchart data: " + error.message);
//   }
// };

// Fetch majors by catalog
export const searchFlowInfo = async (query, projection) => {
  try {
    const result = await flowInfoCollection
      .find(query)
      .project({
        _id: 0,
        ...projection,
      })
      .toArray();
    return result;
  } catch (error) {
    throw new Error("Error searching flowchart info: " + error.message);
  }
};
