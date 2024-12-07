export type Availability = {
    [day: string]: [number, number][];
};
export type UserType = "student" | "admin";
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
};
export type UserDataWithId = UserData & {
    _id: string;
};
export type UpdateUserData = Partial<UserData>;
