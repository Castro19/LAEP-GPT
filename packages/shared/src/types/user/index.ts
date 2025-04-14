export type Availability = {
  [day: string]: [number, number][];
};

export type UserType = "student" | "admin";
// All information stored in the database
export type oldUserData = {
  userId: string;
  name: string;
  userType: "student" | "admin";
  email: string;
  availability: Availability;
  bio: string;
  canShareData: boolean;
  interests: string[];
  startingYear: string;
  catalog: string;
  major: string;
  concentration: string;
  year: string;
  courses: string[];
  flowchartId: string;
  emailVerified: boolean;
};

export type UserDocument = UserData & { _id: string };
export type UpdateUserData = Partial<UserData>;

export type UserData = {
  userId: string;
  name: string;
  userType: "student" | "admin";
  email: string;
  emailVerified: boolean;
  canShareData: boolean;

  availability: Availability;
  bio: string;
  year:
    | "incoming-freshman"
    | "incoming-transfer"
    | "freshman"
    | "sophomore"
    | "junior"
    | "senior"
    | "graduate"; // TODO
  demographic: {
    gender: string;
    ethnicity: string;
  };
  interestAreas: string[];
  preferredActivities: string[];
  goals: string[];
  flowchartInformation: {
    // TODO
    flowchartId: string; // id of primary flowchart
    startingYear: string;
    catalog: string;
    major: string;
    concentration: string;
  };
  isIncoming?: boolean;
};
