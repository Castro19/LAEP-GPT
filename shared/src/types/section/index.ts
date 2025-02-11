export type Section = {
  classNumber: number; // unique section number (e.g. 1001)
  courseId: string; // unique course identifier (e.g. "CSC357")
  subject: string; // subject abbreviation (e.g. "CSC")
  catalogNumber: string; // course number (e.g. "357")
  component: string; // component of the course (e.g. "LEC" | "LAB" | "IND")
  courseName: string; // name of the course (e.g. "Introduction to Computer Systems")
  description: string; // description of the course (e.g. "This course introduces students to the principles of computer organization and design.")
  prerequisites: string[] | null; // prerequisites for the course (e.g. ["CSC108", "CSC110"])
  units: string; // units of the course (e.g. "3", "1-4", "0", "1-6")

  enrollmentStatus: "O" | "C"; // enrollment status of the section (e.g. "O" | "C")

  enrollment: {
    waitTotal: number; // total waitlist capacity (e.g. 100)
    waitCap: number; // total waitlist capacity (e.g. 100)
    classCapacity: number; // total class capacity (e.g. 100)
    enrollmentTotal: number; // total enrollment (e.g. 100)
    enrollmentAvailable: number; // available enrollment (e.g. 100)
    enrollmentStatusDescription: string; // enrollment status description (e.g. "Open" | "Closed")
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
  >; // course attributes the section fulfills (e.g. ["GE D", "USCP"])

  meetings: Array<{
    days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
    start_time: string | null; // start time of the meeting (e.g. "10:00 AM")
    end_time: string | null; // end time of the meeting (e.g. "11:00 AM")
    location: string; // location of the meeting (e.g. "TBA")
  }>;

  instructors: Array<{
    name: string; // name of the instructor (e.g. "John Doe")
    email: string; // email of the instructor (e.g. "john.doe@illinois.edu")
  }>;

  instructorsWithRatings: Array<{
    name: string; // name of the instructor (e.g. "John Doe")
    id: string; // unique identifier for the instructor (e.g. "1234567890")
    courseId: string; // unique identifier for the course (e.g. "CSC357")
    overallRating: number; // overall rating of the instructor (e.g. 4.5)
    numEvals: number; // number of evaluations for the instructor (e.g. 100)
    courseRating: number | null; // rating of the instructor for the course (e.g. 4.5)
    studentDifficulties: number | null; // student difficulties of the instructor (e.g. 3.5)
  }> | null;
  techElectives: string[];

  classPair: number | null; // class number of the section paired with (e.g. 1002)
};

export type SectionDocument = Section & {
  _id: { $oid: string };
};

export type SectionsFilterParams = {
  subject?: string;
  courseIds?: string[];
  status?: string;
  days?: string;
  timeRange?: string;
  enrollmentStatus?: string;
  minInstructorRating?: string;
  maxInstructorRating?: string;
  minUnits?: string;
  maxUnits?: string;
  courseAttribute?: Array<
    "GE D" | "USCP" | "GE C" | "GWR" | "GE E" | "GE B" | "GE F" | "GE A"
  >;
  instructionMode?: string;
  includeUnratedInstructors?: boolean;
  instructors?: string[];
  isTechElective?: boolean;
  techElectives?: {
    major: string;
    concentration: string;
  };
};

// ------------------------------------------------------------

export type CourseInfo = {
  courseId: string;
  subject: string;
  catalogNumber: string;
  courseName: string;
  description: string;
  prerequisites: string[];
  units: string;
  courseAttributes: Array<
    "GE D" | "USCP" | "GE C" | "GWR" | "GE E" | "GE B" | "GE F" | "GE A"
  >;
  professorGroups: ProfessorGroup[]; // New subgrouping by professor
};

// New type for professor-based grouping
export type ProfessorGroup = {
  instructor: InstructorWithRatings;
  sections: SectionDetail[];
  overallRating: number;
  courseRating: number;
  componentOrder: string[];
};

// Modified SectionGroup to handle visual pairing
export type SectionGroup = {
  pairedWith: number | null;
  section: SectionDetail;
};

// Updated SectionDetail to support standalone display
export type SectionDetail = {
  courseId: string;
  courseName: string;
  classNumber: number;
  component: string;
  enrollmentStatus: "O" | "C";
  enrollment: EnrollmentInfo;
  instructionMode: string;
  meetings: Meeting[];
  instructors: Instructor[];
  instructorsWithRatings: InstructorWithRatings[] | null;
  pairedSections: number[]; // Array of class numbers this section is paired with
};

// Supporting types remain the same
export type EnrollmentInfo = {
  waitTotal: number;
  waitCap: number;
  classCapacity: number;
  enrollmentTotal: number;
  enrollmentAvailable: number;
  enrollmentStatusDescription: string;
};

export type Meeting = {
  days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
  start_time: string | null;
  end_time: string | null;
  location: string;
};

export type Instructor = {
  name: string;
  email: string;
};

export type InstructorWithRatings = {
  name: string;
  id: string;
  courseId: string;
  overallRating: number;
  numEvals: number;
  courseRating: number | null;
  studentDifficulties: number | null;
};
