import { Request } from "express";
import { UserData } from "@polylink/shared/types";

export const mockFirebaseUser = {
  uid: "test-user-id",
  email: "test@calpoly.edu",
  name: "Test User",
  email_verified: true,
};

export const mockRequest = (overrides = {}) => {
  const req = {
    body: {},
    cookies: {},
    headers: {},
    user: mockFirebaseUser,
    ...overrides,
  } as unknown as Request;

  return req;
};

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn();

export const setupFirebaseMock = () => {
  // Clear all mocks before each test
  jest.clearAllMocks();
};

export const mockUserData: UserData = {
  userId: mockFirebaseUser.uid,
  name: mockFirebaseUser.name,
  email: mockFirebaseUser.email,
  userType: "student",
  emailVerified: true,
  canShareData: false,
  availability: {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  },
  bio: "",
  year: "freshman",
  demographic: {
    gender: "",
    ethnicity: "",
  },
  interestAreas: [],
  preferredActivities: [],
  goals: [],
  flowchartInformation: {
    flowchartId: "",
    startingYear: "",
    catalog: "",
    major: "",
    concentration: "",
  },
  isIncoming: false,
};
