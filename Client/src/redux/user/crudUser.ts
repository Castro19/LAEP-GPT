import { MyUserInfo } from "@/types";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function putUserProfile(userData: MyUserInfo): Promise<void> {
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
    await response.json();
  } catch (error) {
    console.error("Failed to update user profile:", error);
  }
}
