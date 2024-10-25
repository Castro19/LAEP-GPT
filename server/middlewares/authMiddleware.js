import admin from "firebase-admin";

export const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies.session || "";

  try {
    // Verify the session cookie
    const decodedToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send("Unauthorized");
  }
};
