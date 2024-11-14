import {
  CreateFlowchartResponse,
  FetchAllFlowchartsResponse,
  FlowchartData,
} from "@/types";

/**
 * Creates a flowchart based on the flowchart data.
 * @param flowchartData The flowchart data.
 * @returns The flowchart ID.
 */
export async function storeFlowchartInDB(flowchartData: FlowchartData) {
  const response = await fetch(`http://localhost:4000/flowchart`, {
    method: "POST",
    body: JSON.stringify(flowchartData),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create flowchart");
  }

  return response.json() as Promise<CreateFlowchartResponse>;
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch flowchart");
  }

  return response.json() as Promise<FlowchartData>;
}

/**
 * Fetches all flowcharts from the database.
 * @returns The list of flowchart IDs and names
 */
export async function fetchAllFlowchartsFromDB() {
  const response = await fetch(`http://localhost:4000/flowchart`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch all flowcharts");
  }
  const data: FetchAllFlowchartsResponse = await response.json();
  return data;
}

/**
 * Updates the flowchart in the database.
 * @param flowchartId The flowchart ID.
 * @param flowchartData The flowchart data.
 * @param name The flowchart name.
 * @returns The flowchart data.
 */
export async function updateFlowchartInDB(
  flowchartId: string,
  flowchartData: FlowchartData,
  name: string
) {
  const response = await fetch(
    `http://localhost:4000/flowchart/${flowchartId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flowchartData: flowchartData,
        name: name,
      }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update flowchart");
  }

  return response.json() as Promise<FlowchartData>;
}

/**
 * Deletes the flowchart from the database.
 * @param flowchartId The flowchart ID.
 * @returns void
 */
export async function deleteFlowchartFromDB(flowchartId: string) {
  const response = await fetch(
    `http://localhost:4000/flowchart/${flowchartId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete flowchart");
  }
}
