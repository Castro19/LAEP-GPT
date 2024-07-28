export default async function sendUserToDB(userData: {
  firebaseUserId: string;
  firstName: string;
  lastName: string;
  userType: string;
  about?: string;
}): Promise<void> {
  // Now, send a request to your backend to store additional user information
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    console.log("Body Object: ", options);
    const response = await fetch("http://localhost:4000/users/signup", options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend registration failed", errorData);
      throw new Error("Backend registration failed: " + errorData.message);
    }
    const responseData = await response.json();
    console.log("Backend Registration worked!: ", responseData);
  } catch (error) {
    console.error("Backend registration failed", error);
  }
}
