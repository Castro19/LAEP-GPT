// apiHelpers.ts

export async function createAssistantOnServer(name, description, prompt) {
  try {
    const response = await fetch("http://localhost:4000/assistants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to create assistant");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}
