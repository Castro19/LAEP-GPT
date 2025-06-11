import { environment, serverUrl } from "@/helpers/getEnvironmentVars";
import { UserData } from "@polylink/shared/types";
import {
  signInWithCustomToken,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/firebase";

export async function loginUser(
  token: string,
  secretPassphrase?: string
): Promise<{ userData: UserData; isNewUser: boolean } | null> {
  // Send the token to the server
  try {
    const response = await fetch(`${serverUrl}/auth/login`, {
      method: "POST",
      credentials: "include", // Include credentials to allow cookies to be set
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, secretPassphrase }),
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

export async function createSignupAccess(email: string, role: string) {
  try {
    const response = await fetch(`${serverUrl}/auth/create-signup-access`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: { message: string } = await response.json();
    return data.message;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to create signup access:", error);
    }
    return null;
  }
}

export async function updateUserDisplayName(
  userId: string,
  displayName: string
) {
  try {
    const response = await fetch(`${serverUrl}/auth/update-display-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, displayName }),
    });

    if (!response.ok) {
      throw new Error("Failed to update display name");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to update display name:", error);
    }
    return null;
  }
}

export async function createAccountWithExistingEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  try {
    // Call our new server endpoint to create the account
    const response = await fetch(
      `${serverUrl}/auth/create-account-with-existing-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create account");
    }

    const { customToken } = await response.json();

    // Sign in with the custom token
    const userCredential = await signInWithCustomToken(auth, customToken);
    const user = userCredential.user;

    // Update the user's profile with display name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Send verification email
    await sendEmailVerification(user);

    // Force token refresh to include the updated display name
    await user.getIdToken(true);

    // Get the refreshed token
    const token = await user.getIdToken();

    // Login with the new token
    const userResponse = await loginUser(token);
    return userResponse;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to create account with existing email:", error);
    }
    return null;
  }
}
