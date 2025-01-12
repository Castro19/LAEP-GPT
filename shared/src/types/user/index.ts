export type Availability = {
  [day: string]: [number, number][];
};

export type UserType = "student" | "admin";
// All information stored in the database
export type UserData = {
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

export type NewUserData = {
  userId: string;
  name: string;
  userType: "student" | "admin";
  email: string;
  emailVerified: boolean;

  availability: Availability;
  bio: string;
  year: "freshman" | "sophomore" | "junior" | "senior" | "graduate";
  demographic: {
    gender: string;
    ethnicity: string;
  };
  interestAreas: string[];
  preferredActivities: string[];

  flowchartInformation: {
    flowchartId: string; // id of primary flowchart
    startingYear: string;
    catalog: string;
    major: string;
    concentration: string;
  };
};
