export type Section = {
  classNumber: number; // was bsonType: "int"
  courseId: string; // was bsonType: "string"
  subject: string; // was bsonType: "string"
  catalogNumber: string; // was bsonType: "string"
  component: string; // was bsonType: "string"
  courseName: string; // was bsonType: "string"
  description: string; // was bsonType: "string"
  prerequisites: string[] | null; // was bsonType: ["array", "null"]
  units: string; // was bsonType: "string"

  enrollmentStatus: "O" | "C"; // was bsonType: "string", enum: ["O", "C"]

  enrollment: {
    waitTotal: number; // was bsonType: "int"
    waitCap: number; // was bsonType: "int"
    classCapacity: number; // was bsonType: "int"
    enrollmentTotal: number; // was bsonType: "int"
    enrollmentAvailable: number; // was bsonType: "int"
    enrollmentStatusDescription: string; // was bsonType: "string"
  };

  instructionMode: "PA" | "SM" | "P" | "PS" | "AM" | "SA";
  /**
   * Instruction modes:
   * - PA (Synchronous)
   * - SM (Sync/Async Hybrid)
   * - P (In Person/Async Hybrid)
   * - PS (In Person)
   * - AM (In Person/Sync Hybrid)
   * - SA (Asynchronous)
   */

  courseAttributes: Array<
    "GE D" | "USCP" | "GE C" | "GWR" | "GE E" | "GE B" | "GE F" | "GE A"
  >; // was bsonType: "array" of specific enum strings

  meetings: Array<{
    days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su">;
    start_time: string | null; // was bsonType: ["string", "null"]
    end_time: string | null; // was bsonType: ["string", "null"]
    location: string; // was bsonType: "string"
  }>;

  instructors: Array<{
    name: string; // was bsonType: "string"
    email: string; // was bsonType: "string"
  }>;

  instructorsWithRatings: Array<{
    name: string; // was bsonType: "string"
    id: string; // was bsonType: "string"
    courseId: string; // was bsonType: "string"
    overallRating: number; // was bsonType: ["double", "int"]
    numEvals: number; // was bsonType: "int"
    courseRating: number | null; // was bsonType: ["double", "int", "null"]
    studentDifficulties: number | null; // was bsonType: ["double", "int", "null"]
  }> | null;

  classPair: number | null; // was bsonType: ["int", "null"]
};

export type SectionDocument = Section & {
  _id: { $oid: string };
};

export type SectionsFilterParams = {
  subject?: string;
  courseId?: string;
  status?: string;
  days?: string;
  timeRange?: string;
  enrollmentStatus?: string;
  instructorRating?: string;
  units?: string;
  courseAttribute?: string;
  instructionMode?: string;
  instructor?: string;
};
