import { environment, serverUrl } from "@/helpers/getEnvironmentVars";
import { UserData } from "@polylink/shared/types";

export async function loginUser(
  token: string
): Promise<{ userData: UserData; isNewUser: boolean } | null> {
  // Send the token to the server
  try {
    const response = await fetch(`${serverUrl}/auth/login`, {
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
    if (environment === "dev") {
      console.error("Failed to send token to server:", error);
    }
    return null;
  }
}

export async function verifyCalPolyEmail(email: string) {
  const calPolyEmailRegex = /^[A-Z0-9._%+-]+@calpoly\.edu$/i;

  if (email) {
    if (!calPolyEmailRegex.test(email)) {
      try {
        const byPass = await byPassCalPolyEmailCheck(email);
        if (byPass) {
          return true;
        }
      } catch (error) {
        if (environment === "dev") {
          console.error("Failed to check if email is valid:", error);
        }
        return false;
      }
    } else {
      return true;
    }
  }

  return false;
}

export async function byPassCalPolyEmailCheck(email: string) {
  const response = await fetch(
    `${serverUrl}/auth/can-bypass-calpoly-email-check`,
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
  const data: { byPass: boolean } = await response.json();
  return data.byPass;
}

export async function checkUserExistsByEmail(email: string) {
  const response = await fetch(`${serverUrl}/auth/check-email`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  const data: { userExists: boolean } = await response.json();

  return data.userExists;
}
