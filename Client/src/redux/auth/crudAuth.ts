// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginUser(token: string): Promise<any> {
  // Send the token to the server
  try {
    const options = {
      method: "POST",
      credentials: "include", // Include credentials to allow cookies to be set
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    };
    const response = await fetch("http://localhost:4000/auth/login", options);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to send token to server:", error);
  }
}
