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

export function verifyCalPolyEmail(email: string) {
  const calPolyEmailRegex = /^[A-Z0-9._%+-]+@calpoly\.edu$/i;

  if (email && email.endsWith("@calpoly.edu")) {
    if (!calPolyEmailRegex.test(email)) {
      return false;
    }
  }
  return true;
}

export async function checkUserExistsByEmail(email: string) {
  const response = await fetch("http://localhost:4000/auth/check-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  const data: { userExists: boolean } = await response.json();

  return data.userExists;
}
