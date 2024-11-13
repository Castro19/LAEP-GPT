import { CreateFlowchartResponse, FlowchartData } from "@/types";

/**
 * Creates a flowchart based on the flowchart data.
 * @param flowchartData The flowchart data.
 * @returns The flowchart ID.
 */
export async function storeFlowchartInDB(flowchartData: FlowchartData) {
  console.log("Store flowchart in DB: ", flowchartData);
  const response = await fetch("http://localhost:4000/flowchart", {
    method: "POST",
    body: JSON.stringify(flowchartData),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to create flowchart");
  }
  const data: CreateFlowchartResponse = await response.json();
  return data;
}

/**
 * Fetches the flowchart from the database.
 * @returns The flowchart data.
 */
export async function fetchFlowchartFromDB(flowchartId: string) {
  const response = await fetch(
    `http://localhost:4000/flowchart/${flowchartId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch flowchart");
  }
  const data: FlowchartData = await response.json();
  return data;
}
