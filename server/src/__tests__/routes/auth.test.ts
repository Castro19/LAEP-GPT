// Mock Firebase Admin and DB connection before any imports
jest.mock("firebase-admin", () => ({
  auth: () => ({
    createSessionCookie: jest.fn().mockImplementation((token) => {
      if (token === "valid-token") {
        return Promise.resolve("valid-session-cookie");
      }
      return Promise.reject(new Error("Invalid token"));
    }),
    verifyIdToken: jest.fn().mockImplementation((token) => {
      if (token === "valid-token") {
        return Promise.resolve({
          uid: "test-user-id",
          email: "test@calpoly.edu",
          name: "Test User",
          email_verified: true,
        });
      }
      return Promise.reject(new Error("Invalid token"));
    }),
    verifySessionCookie: jest.fn().mockImplementation((cookie) => {
      if (cookie === "valid-session-cookie") {
        return Promise.resolve({
          uid: "test-user-id",
          email: "test@calpoly.edu",
          name: "Test User",
          email_verified: true,
        });
      }
      return Promise.reject(new Error("Invalid session"));
    }),
  }),
}));
jest.mock("../../db/connection", () => ({
  getDb: jest.fn().mockResolvedValue({
    collection: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
  }),
  connectToDb: jest.fn().mockResolvedValue(undefined),
}));

import request from "supertest";
import { app, server } from "../../index";
import {
  setupFirebaseMock,
  mockFirebaseUser,
  mockUserData,
} from "../helpers/testUtils";
import {
  getUserByFirebaseId,
  addUser,
} from "../../db/models/user/userServices";
import { getSignupAccessByEmail } from "../../db/models/signupAccess/signupAccessServices";

// Mock the user services
jest.mock("../../db/models/user/userServices", () => ({
  getUserByFirebaseId: jest.fn(),
  addUser: jest.fn(),
}));

// Mock the signup access services
jest.mock("../../db/models/signupAccess/signupAccessServices", () => ({
  getSignupAccessByEmail: jest.fn(),
  byPassCalPolyEmailCheck: jest.fn().mockResolvedValue(true),
}));

describe("Auth Routes", () => {
  beforeEach(() => {
    setupFirebaseMock();
  });

  describe("POST /auth/login", () => {
    it("should successfully login a user with valid token", async () => {
      // Mock user exists in database
      (getUserByFirebaseId as jest.Mock).mockResolvedValue(mockUserData);

      const response = await request(app)
        .post("/auth/login")
        .send({ token: "valid-token" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("userData");
      expect(response.body.userData.userId).toBe(mockFirebaseUser.uid);
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 for invalid token", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ token: "invalid-token" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid token");
    });

    it("should create new user if user does not exist", async () => {
      // Mock user does not exist in database
      (getUserByFirebaseId as jest.Mock).mockResolvedValue(null);
      (getSignupAccessByEmail as jest.Mock).mockResolvedValue("student");
      (addUser as jest.Mock).mockResolvedValue(mockUserData);

      const response = await request(app)
        .post("/auth/login")
        .send({ token: "valid-token" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("isNewUser", true);
      expect(response.body).toHaveProperty("userData");
      expect(addUser).toHaveBeenCalled();
    });
  });

  describe("GET /auth/check", () => {
    it("should return user data for valid session", async () => {
      // Mock user exists in database
      (getUserByFirebaseId as jest.Mock).mockResolvedValue(mockUserData);

      const response = await request(app)
        .get("/auth/check")
        .set("Cookie", ["session=valid-session-cookie"]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("userId", mockFirebaseUser.uid);
    });

    it("should return 401 for invalid session", async () => {
      const response = await request(app)
        .get("/auth/check")
        .set("Cookie", ["session=invalid-session-cookie"]);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Unauthorized");
    });
  });
});

// Close the server after all tests are done
afterAll((done) => {
  if (server) {
    server.close(() => {
      done();
    });
  } else {
    done();
  }
});
