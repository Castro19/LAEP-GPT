import { environment } from "@/helpers/getEnvironmentVars";
import { UserData } from "@polylink/shared/types";

export async function putUserProfile(userData: UserData): Promise<void> {
  try {
    const response = await fetch(`http://localhost:4000/users/me`, {
      method: "PUT",
      credentials: "include", // Important to include credentials
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to update user profile:", error);
    }
  }
}
