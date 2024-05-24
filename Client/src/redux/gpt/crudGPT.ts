import { GptType } from "@/types";
// Create
export async function createGPT(gptData: GptType) {
  try {
    const response = await fetch("http://localhost:4000/gpts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gptData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(`Error: `);
  }
}

// Read
export async function viewGPTs(userId: string) {
  try {
    console.log("USER ID USING TO FETCH: ", userId);
    const response = await fetch(`http://localhost:4000/gpts/${userId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(`Error: `, error);
  }
}

export async function deleteGPT(id: string) {
  try {
    const response = await fetch("http://localhost:4000/gpts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gptId: id }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    console.log("Response Data: ", responseData);
  } catch (error) {
    console.log(`Error: `, error);
  }
}
