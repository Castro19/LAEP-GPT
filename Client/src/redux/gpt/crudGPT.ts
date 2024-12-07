import { GptType } from "@polylink/shared/types";
// Create
export async function createGPT(gptData: GptType) {
  try {
    const response = await fetch("http://localhost:4000/assistants", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gptData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error: ", error);
  }
}

// Read
export async function viewGPTs() {
  try {
    const response = await fetch("http://localhost:4000/assistants", {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function deleteGPT(id: string) {
  try {
    const response = await fetch("http://localhost:4000/assistants", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gptId: id }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    console.log("Response Data: ", responseData);
  } catch (error) {
    console.error("Error: ", error);
  }
}
