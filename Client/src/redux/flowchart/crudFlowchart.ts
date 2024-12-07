import {
  CreateFlowchartResponse,
  FetchFlowchartResponse,
  FlowchartData,
} from "@polylink/shared/types";

/**
 * Creates a flowchart based on the flowchart data.
 * @param flowchartData The flowchart data.
 * @returns The flowchart ID.
 */
export async function storeFlowchartInDB(
  flowchartData: FlowchartData,
  name: string,
  primaryOption: boolean
) {
  const response = await fetch(`http://localhost:4000/flowchart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flowchartData,
      name,
      primaryOption,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create flowchart");
  }
  const data = await response.json();
  return data as Promise<CreateFlowchartResponse>;
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

  return response.json() as Promise<{
    flowchartData: FlowchartData;
    flowchartMeta: FetchFlowchartResponse;
  }>;
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
  const data: FetchFlowchartResponse[] = await response.json();
  return data;
}

/**
 * Updates the flowchart in the database.
 * @param flowchartId The flowchart ID.
 * @param flowchartData The flowchart data.
 * @param name The flowchart name.
 * @returns void
 */
export async function updateFlowchartInDB(
  flowchartId: string,
  flowchartData: FlowchartData | null,
  name: string,
  primaryOption: boolean
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
        primaryOption: primaryOption,
      }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update flowchart");
  }
}

/**
 * Deletes the flowchart from the database.
 * @param flowchartId The flowchart ID.
 * @returns The response {success: true, deletedFlowchartId: string, deletedPrimaryOption: boolean, newPrimaryFlowchartId: string | null}
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
  return response.json() as Promise<{
    success: boolean;
    deletedFlowchartId: string;
    deletedPrimaryOption: boolean;
    newPrimaryFlowchartId: string | null;
  }>;
}
