import {
  CreateFlowchartResponse,
  DeleteFlowchartResponse,
  FetchedFlowchartObject,
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
): Promise<CreateFlowchartResponse> {
  const response = await fetch(`http://localhost:4000/flowcharts`, {
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
export async function fetchFlowchartFromDB(
  flowchartId: string
): Promise<FetchFlowchartResponse> {
  const response = await fetch(
    `http://localhost:4000/flowcharts/${flowchartId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch flowchart");
  }

  return response.json() as Promise<FetchFlowchartResponse>;
}

/**
 * Fetches all flowcharts from the database.
 * @returns The list of flowchart IDs and names
 */
export async function fetchAllFlowchartsFromDB(): Promise<
  FetchedFlowchartObject[]
> {
  const response = await fetch(`http://localhost:4000/flowcharts`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch all flowcharts");
  }
  const data = await response.json();
  return data as Promise<FetchedFlowchartObject[]>;
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
): Promise<void> {
  const response = await fetch(
    `http://localhost:4000/flowcharts/${flowchartId}`,
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
export async function deleteFlowchartFromDB(
  flowchartId: string
): Promise<DeleteFlowchartResponse> {
  const response = await fetch(
    `http://localhost:4000/flowcharts/${flowchartId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete flowchart");
  }
  return response.json() as Promise<DeleteFlowchartResponse>;
}
