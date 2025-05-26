import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Db } from "mongodb";
import { jest } from "@jest/globals";

// Load environment variables
dotenv.config();

// Mock Firebase Admin
jest.mock("firebase-admin", () => ({
  auth: () => ({
    verifyIdToken: jest.fn(),
    verifySessionCookie: jest.fn(),
    createSessionCookie: jest.fn(),
  }),
  initializeApp: jest.fn(),
}));

// Mock OpenAI client
const mockOpenAI = jest.fn().mockImplementation(() => ({
  // Add any methods you need to mock here
}));

jest.mock("openai", () => ({
  __esModule: true,
  default: mockOpenAI,
}));

// Mock langsmith wrapper
jest.mock("langsmith/wrappers", () => ({
  wrapOpenAI: jest.fn().mockImplementation((client) => client),
}));

let mongoServer: MongoMemoryServer;
let client: MongoClient;
let db: Db;

// Setup before all tests
beforeAll(async () => {
  // Create an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db("polylink");
});

// Cleanup after each test
afterEach(async () => {
  // Clear all mocks
  jest.clearAllMocks();

  // Clear all collections
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Disconnect from the in-memory database
  await client.close();

  // Stop the MongoDB server
  await mongoServer.stop();
});

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.FIREBASE_PROJECT_ID = "test-project";

// Export db for use in tests
export { db };
