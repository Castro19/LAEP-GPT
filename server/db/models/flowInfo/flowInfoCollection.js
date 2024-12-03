import db from "../../connection.js";

const flowInfoCollection = db.collection("flowInfo");

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
