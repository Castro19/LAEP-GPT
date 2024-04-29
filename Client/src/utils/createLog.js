export default async function createLogTitle(msg, modelType) {
  try {
    // Assuming the title is generated based on the last message or another logic
    const response = await fetch("http://localhost:4000/llms/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, modelType: modelType }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data.title;
  } catch (error) {
    console.error(error);
  }
}
