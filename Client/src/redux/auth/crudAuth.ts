import { UserData } from "@polylink/shared/types";

export async function loginUser(
  token: string
): Promise<{ userData: UserData; isNewUser: boolean } | null> {
  // Send the token to the server
  try {
    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      credentials: "include", // Include credentials to allow cookies to be set
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const responseData: { userData: UserData; isNewUser: boolean } =
      await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to send token to server:", error);
    return null;
  }
}
