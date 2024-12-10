import { byPassCalPolyEmailCheck } from "../../db/models/signupAccess/signupAccessServices";

export async function verifyCalPolyEmail(email: string): Promise<boolean> {
  const calPolyEmailRegex = /^[A-Z0-9._%+-]+@calpoly\.edu$/i;

  if (email) {
    if (!calPolyEmailRegex.test(email)) {
      try {
        const byPass = await byPassCalPolyEmailCheck(email);
        if (byPass) {
          return true;
        }
      } catch (error) {
        console.error("Failed to check if email is valid:", error);
        return false;
      }
    } else {
      return true;
    }
  }
  return false;
}
